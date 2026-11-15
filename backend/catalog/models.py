from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
    # 3 levels: category > group > item
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE,
        related_name="children", verbose_name=_("Parent"),
    )
    name_ro = models.CharField(_("Name (RO)"), max_length=120)
    name_en = models.CharField(_("Name (EN)"), max_length=120, blank=True)
    slug = models.SlugField(max_length=160, blank=True)
    icon = models.CharField(
        _("Icon"), max_length=40, blank=True,
        help_text=_("Icon name (top categories only), e.g. phone, laptop, tv"),
    )
    order = models.PositiveIntegerField(_("Sort order"), default=0)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en or self.name_ro)[:160]
        super().save(*args, **kwargs)

    @property
    def level(self):
        n, p = 0, self.parent
        while p:
            n += 1
            p = p.parent
        return n

    def __str__(self):
        return f"{'— ' * self.level}{self.name_ro}"


class Product(models.Model):
    name_ro = models.CharField(_("Name (RO)"), max_length=200)
    name_en = models.CharField(_("Name (EN)"), max_length=200, blank=True)
    slug = models.SlugField(max_length=220, blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL,
        related_name="products", verbose_name=_("Category"),
    )
    icon = models.CharField(_("Icon"), max_length=40, blank=True)
    image = models.ImageField(_("Image"), upload_to="products/", blank=True, null=True)
    price = models.DecimalField(_("Price (Lei)"), max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(_("Discount (%)"), default=0)
    rating = models.DecimalField(_("Rating"), max_digits=2, decimal_places=1, default=0)
    reviews = models.PositiveIntegerField(_("Reviews"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ["-created"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en or self.name_ro)[:220]
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        return round(float(self.price) * (1 - self.discount / 100))

    def __str__(self):
        return self.name_ro


class ProductImage(models.Model):
    # extra photos for the product gallery
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images",
        verbose_name=_("Product"),
    )
    image = models.ImageField(_("Image"), upload_to="products/")
    alt = models.CharField(_("Alt text"), max_length=160, blank=True)
    order = models.PositiveIntegerField(_("Sort order"), default=0)

    class Meta:
        verbose_name = _("Product image")
        verbose_name_plural = _("Product images")
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name_ro} #{self.order}"


class Banner(models.Model):
    # homepage slider banner
    title_ro = models.CharField(_("Title (RO)"), max_length=120)
    title_en = models.CharField(_("Title (EN)"), max_length=120, blank=True)
    pill_ro = models.CharField(_("Pill (RO)"), max_length=60, blank=True)
    pill_en = models.CharField(_("Pill (EN)"), max_length=60, blank=True)
    cta_ro = models.CharField(_("Button (RO)"), max_length=60, blank=True)
    cta_en = models.CharField(_("Button (EN)"), max_length=60, blank=True)
    gradient = models.CharField(
        _("CSS gradient"), max_length=240, blank=True,
        help_text="ex: linear-gradient(100deg,#14194D 0%,#2563C9 100%)",
    )
    pill_bg = models.CharField(_("Pill color (bg)"), max_length=9, default="#FF7A1A")
    pill_fg = models.CharField(_("Pill color (text)"), max_length=9, default="#14194D")
    image = models.ImageField(_("Product image (PNG)"), upload_to="banners/", blank=True, null=True)
    link = models.CharField(_("Link"), max_length=200, blank=True)
    order = models.PositiveIntegerField(_("Sort order"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)

    class Meta:
        verbose_name = _("Banner")
        verbose_name_plural = _("Banners (slider)")
        ordering = ["order", "id"]

    def __str__(self):
        return self.title_ro
