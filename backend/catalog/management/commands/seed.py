import json
from pathlib import Path

from django.core.management.base import BaseCommand
from catalog.models import Category, Product, Banner

DATA = Path(__file__).resolve().parent.parent.parent / "seed_data.json"


class Command(BaseCommand):
    help = "Populate the database with the KERVEN categories, products and banners."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing catalog data first.")

    def handle(self, *args, **opts):
        data = json.loads(DATA.read_text(encoding="utf-8"))

        if opts["reset"]:
            Product.objects.all().delete()
            Category.objects.all().delete()
            Banner.objects.all().delete()
            self.stdout.write("Cleared existing catalog data.")

        # Categories: top -> group heading -> leaf item
        cat_by_icon = {}
        for ci, cat in enumerate(data["categories"]):
            top, _ = Category.objects.get_or_create(
                name_ro=cat["ro"], parent=None,
                defaults={"name_en": cat["en"], "icon": cat["icon"], "order": ci},
            )
            top.name_en = cat["en"]; top.icon = cat["icon"]; top.order = ci; top.save()
            cat_by_icon.setdefault(cat["icon"], top)
            for gi, col in enumerate(cat["cols"]):
                group, _ = Category.objects.get_or_create(
                    name_ro=col["h"], parent=top, defaults={"order": gi}
                )
                for ii, item in enumerate(col["items"]):
                    Category.objects.get_or_create(
                        name_ro=item, parent=group, defaults={"order": ii}
                    )
        self.stdout.write(self.style.SUCCESS(f"Categories: {Category.objects.count()}"))

        # Products
        for p in data["products"]:
            cat = cat_by_icon.get(p["ic"])
            Product.objects.get_or_create(
                name_ro=p["ro"],
                defaults=dict(
                    name_en=p["en"], icon=p["ic"], category=cat,
                    price=p["price"], discount=p["disc"], rating=p["rate"], reviews=p["rev"],
                ),
            )
        self.stdout.write(self.style.SUCCESS(f"Products: {Product.objects.count()}"))

        # Banners
        for b in data["banners"]:
            Banner.objects.get_or_create(
                title_ro=b["title_ro"],
                defaults=dict(
                    title_en=b["title_en"], pill_ro=b["pill_ro"], pill_en=b["pill_en"],
                    cta_ro=b["cta_ro"], cta_en=b["cta_en"], gradient=b["grad"],
                    pill_bg=b["pill_bg"], pill_fg=b["pill_fg"], order=b["order"],
                ),
            )
        self.stdout.write(self.style.SUCCESS(f"Banners: {Banner.objects.count()}"))
        self.stdout.write(self.style.SUCCESS("Seed complete."))
