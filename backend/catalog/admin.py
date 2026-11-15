from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import Category, Product, ProductImage, Banner


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("indented_name", "name_en", "icon", "parent", "order")
    list_editable = ("order",)
    list_filter = ("parent",)
    search_fields = ("name_ro", "name_en")
    autocomplete_fields = ("parent",)

    @admin.display(description=_("Category"))
    def indented_name(self, obj):
        return format_html("{}{}", "    " * obj.level, obj.name_ro)


class ProductImageInline(admin.TabularInline):
    # extra photos on the product page
    model = ProductImage
    extra = 3
    fields = ("preview", "image", "alt", "order")
    readonly_fields = ("preview",)

    @admin.display(description=_("Preview"))
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:48px;border-radius:6px">', obj.image.url)
        return "—"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ("thumb", "name_ro", "category", "price", "discount", "final_price_display", "rating", "is_active")
    list_display_links = ("name_ro",)
    list_editable = ("price", "discount", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("name_ro", "name_en")
    autocomplete_fields = ("category",)
    readonly_fields = ("preview",)

    @admin.display(description="")
    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:36px;border-radius:6px">', obj.image.url)
        return "—"

    @admin.display(description=_("Image"))
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:160px;border-radius:10px">', obj.image.url)
        return "—"

    @admin.display(description=_("Final price"))
    def final_price_display(self, obj):
        return f"{obj.final_price} Lei"


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("order", "swatch", "title_ro", "pill_ro", "is_active")
    list_display_links = ("title_ro",)
    list_editable = ("order", "is_active")
    search_fields = ("title_ro", "title_en")

    @admin.display(description="")
    def swatch(self, obj):
        return format_html('<span style="display:inline-block;width:46px;height:22px;border-radius:5px;background:{}"></span>', obj.gradient or "#14194D")
