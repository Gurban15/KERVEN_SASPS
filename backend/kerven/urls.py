from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from catalog import api

from django.utils.translation import gettext_lazy as _

admin.site.site_header = "KERVEN admin"
admin.site.site_title = "KERVEN admin"
admin.site.index_title = _("Administration")

urlpatterns = [
    path("i18n/", include("django.conf.urls.i18n")),  # language switcher
    path("admin/", admin.site.urls),
    path("api/categories/", api.categories),
    path("api/products/", api.products),
    path("api/banners/", api.banners),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
