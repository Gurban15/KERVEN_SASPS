from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ("product",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "status", "total_display", "created")
    list_filter = ("status", "created")
    search_fields = ("full_name", "phone", "address")
    list_editable = ("status",)
    inlines = [OrderItemInline]

    @admin.display(description=_("Total"))
    def total_display(self, obj):
        return f"{obj.total:.0f} Lei"
