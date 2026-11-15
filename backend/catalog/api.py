from django.http import JsonResponse

from .models import Category, Product, Banner


def _abs(request, f):
    return request.build_absolute_uri(f.url) if f else None


def categories(request):
    # category tree for the menu
    tops = Category.objects.filter(parent__isnull=True).prefetch_related("children__children")
    data = []
    for top in tops:
        cols = []
        for group in top.children.all():
            cols.append({
                "h": group.name_ro,
                "h_en": group.name_en,
                "items": [c.name_ro for c in group.children.all()],
            })
        data.append({"icon": top.icon, "ro": top.name_ro, "en": top.name_en, "cols": cols})
    return JsonResponse({"categories": data})


def products(request):
    qs = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")
    data = [{
        "id": p.id,
        "ro": p.name_ro,
        "en": p.name_en,
        "ic": p.icon,
        "image": _abs(request, p.image),
        "images": [_abs(request, im.image) for im in p.images.all()],
        "price": float(p.price),
        "final_price": p.final_price,
        "disc": p.discount,
        "rate": float(p.rating),
        "rev": p.reviews,
        "category": p.category.name_ro if p.category else None,
    } for p in qs]
    return JsonResponse({"products": data})


def banners(request):
    qs = Banner.objects.filter(is_active=True)
    data = [{
        "title_ro": b.title_ro, "title_en": b.title_en,
        "pill_ro": b.pill_ro, "pill_en": b.pill_en,
        "cta_ro": b.cta_ro, "cta_en": b.cta_en,
        "gradient": b.gradient, "pill_bg": b.pill_bg, "pill_fg": b.pill_fg,
        "image": _abs(request, b.image), "link": b.link,
    } for b in qs]
    return JsonResponse({"banners": data})
