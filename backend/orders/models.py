from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from catalog.models import Product


class Order(models.Model):
    STATUS = [
        ("new", _("New")),
        ("paid", _("Paid")),
        ("shipped", _("Shipped")),
        ("delivered", _("Delivered")),
        ("cancelled", _("Cancelled")),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="orders",
    )
    full_name = models.CharField(_("Customer name"), max_length=160, blank=True)
    phone = models.CharField(_("Phone"), max_length=40, blank=True)
    address = models.TextField(_("Address"), blank=True)
    status = models.CharField(_("Status"), max_length=20, choices=STATUS, default="new")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")
        ordering = ["-created"]

    @property
    def total(self):
        return sum(i.line_total for i in self.items.all())

    def __str__(self):
        return f"#{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL, verbose_name=_("Product"))
    name = models.CharField(_("Name"), max_length=200, blank=True)
    price = models.DecimalField(_("Price"), max_digits=10, decimal_places=2, default=0)
    qty = models.PositiveIntegerField(_("Quantity"), default=1)

    class Meta:
        verbose_name = _("Order item")
        verbose_name_plural = _("Order items")

    @property
    def line_total(self):
        return float(self.price) * self.qty

    def save(self, *args, **kwargs):
        if self.product and not self.name:
            self.name = self.product.name_ro
            self.price = self.product.final_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} x{self.qty}"
