"""Adds photos to the products.

    python manage.py import_photos                         # download photos
    python manage.py import_photos --dir product_photos --force    # use our own photos (1.jpg, 1-2.jpg ...)
"""
import io
import subprocess
import tempfile
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageOps

from catalog.models import Product, ProductImage

SIZE = 1000


def find_file(folder, stem):
    for ext in ("jpg", "jpeg", "png", "webp", "JPG", "PNG"):
        f = Path(folder) / f"{stem}.{ext}"
        if f.exists():
            return f
    return None

# product name -> Unsplash photo ids
PHOTOS = [
    ("Telefon mobil 128GB 5G", ["699H4PEEEe0", "H4OdSlgzFig"]),
    ('Laptop 15.6" 16GB RAM', ["nPhl2x4fk2s", "GCFuprAvC6A"]),
    ("Televizor 4K UHD 139cm", ["VdahehdMfl0", "QiF_y3JXgh0"]),
    ("Casti wireless over-ear", ["TpDhqQCWY0s", "eBy5Ycgkyok"]),
    ("Masina de spalat 8kg", ["HPiqJ1uVnW8", "nUL_PP69IPA"]),
    ("Espressor automat cafea", ["9v3nL6pAxjw", "SlmAbDleLL4"]),
    ("Consola gaming 1TB", ["caNzzoxls8Q"]),
    ("Aer conditionat 12000 BTU", ["udc7-Aw6I_o", "O5rKeO1xuMA"]),
    ("Aparat de tuns & barba", ["1QJQBPWOXwQ", "m4Pd_e-4zKs"]),
    ("Set jucarii educative", ["RcxR1aLw8X0", "GQ327RPuxhI"]),
    ("Masina de gaurit 18V", ["MXeDE_yCdHQ"]),
    ("Set anvelope iarna 205/55", ["KEaZffWNhyM"]),
    ("Trotineta electrica", ["oHXUj_IDVHQ", "9ZXMS6_8Hek"]),
    ("Cafea boabe 1kg", ["MHM_al3KqIQ", "b75BTzDab9U"]),
    ("Aspirator vertical fara fir", ["D971boKoaC8", "yy-msv5-LFo"]),
    ('Tableta 11" 128GB', ["bXrZREqmWXE", "wN-pi6d7l7k"]),
    ("Soundbar 2.1 cu subwoofer", ["BXKF-rHHbT4", "NqgO49DTCGY"]),
    ('Monitor 27" QHD 165Hz', ["2OQk5NcY0_M", "9W3XZElkyEI"]),
    ("Frigider No Frost 340L", ["VXpecFNeSzc", "HiQxzJy1e8w"]),
    ("Smartwatch AMOLED GPS", ["O43D6CYzxqM", "qSw5XKtUyus"]),
]


def download(photo_id):
    url = f"https://unsplash.com/photos/{photo_id}/download?force=true"
    with tempfile.NamedTemporaryFile(suffix=".jpg") as tmp:
        result = subprocess.run(
            ["curl", "-sSL", "--fail", "--max-time", "60", "-o", tmp.name, url],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(result.stderr.strip() or "download failed")
        return Path(tmp.name).read_bytes()


def to_square_jpeg(raw, keep_whole=False):
    # square 1000x1000 JPEG; keep_whole pads with white instead of cropping
    img = Image.open(io.BytesIO(raw))
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        white = Image.new("RGBA", img.size, (255, 255, 255, 255))
        white.alpha_composite(img)
        img = white
    img = img.convert("RGB")
    if keep_whole:
        img = ImageOps.pad(img, (SIZE, SIZE), Image.LANCZOS, color=(255, 255, 255))
    else:
        img = ImageOps.fit(img, (SIZE, SIZE), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, "JPEG", quality=85, optimize=True)
    return out.getvalue()


class Command(BaseCommand):
    help = "Attach a photo to each demo product (free Unsplash photos, or your own folder)."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Replace photos that already exist.")
        parser.add_argument("--dir", help="Folder with your own photos named 1.jpg, 2.jpg ... in seed order.")

    def handle(self, *args, **opts):
        done, skipped, failed, credits = 0, 0, [], []
        for number, (name, ids) in enumerate(PHOTOS, start=1):
            product = Product.objects.filter(name_ro=name).first()
            if not product:
                failed.append(f"{name}: product not in the database (run: python manage.py seed)")
                continue
            if product.image and not opts["force"]:
                skipped += 1
                continue

            raw, source = None, None
            if opts["dir"]:
                found = find_file(opts["dir"], f"{number}")
                if not found:
                    continue
                raw, source = found.read_bytes(), str(found)
            else:
                for pid in ids:
                    try:
                        raw, source = download(pid), f"https://unsplash.com/photos/{pid}"
                        break
                    except Exception:
                        pass
            if raw is None:
                failed.append(f"{name}: no photo found")
                continue

            own = bool(opts["dir"])
            try:
                jpeg = to_square_jpeg(raw, keep_whole=own)
            except Exception as err:
                failed.append(f"{name}: not a readable image ({err})")
                continue

            if product.image:
                product.image.delete(save=False)
            product.image.save(f"product-{product.id}.jpg", ContentFile(jpeg), save=True)
            credits.append(f"{name}: {source}")
            done += 1
            self.stdout.write(f"  [{number:2}] {name}  ({len(raw) // 1024} KB -> {len(jpeg) // 1024} KB)")

            # extra gallery photos: 1-2.jpg, 1-3.jpg ...
            if own:
                extras = [f for k in range(2, 10) if (f := find_file(opts["dir"], f"{number}-{k}"))]
                if extras:
                    for old in product.images.all():
                        old.image.delete(save=False)
                        old.delete()
                    for order, f in enumerate(extras, start=1):
                        extra = ProductImage(product=product, order=order, alt=name)
                        extra.image.save(f"product-{product.id}-{order + 1}.jpg",
                                         ContentFile(to_square_jpeg(f.read_bytes(), keep_whole=True)), save=True)
                    self.stdout.write(f"       + {len(extras)} gallery photo(s)")

        if credits:
            folder = Path(settings.MEDIA_ROOT) / "products"
            folder.mkdir(parents=True, exist_ok=True)
            with open(folder / "CREDITS.txt", "a", encoding="utf-8") as fh:
                fh.write("\n".join(credits) + "\n")

        self.stdout.write(self.style.SUCCESS(f"Photos added: {done}, already had a photo: {skipped}"))
        for line in failed:
            self.stdout.write(self.style.WARNING("  " + line))
