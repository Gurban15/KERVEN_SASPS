"""Builds the ro and tk translation files for the admin."""
import os
import polib

# msgid (English source) -> (Romanian, Turkmen)
T = {
    "Parent": ("Părinte", "Ýokarky kategoriýa"),
    "Name (RO)": ("Nume (RO)", "Ady (RO)"),
    "Name (EN)": ("Nume (EN)", "Ady (EN)"),
    "Icon": ("Pictogramă", "Ikonka"),
    "Icon name (top categories only), e.g. phone, laptop, tv": (
        "Nume pictogramă (doar categorii principale), ex: phone, laptop, tv",
        "Ikonka ady (diňe esasy kategoriýalar), mysal: phone, laptop, tv",
    ),
    "Sort order": ("Ordine", "Tertip"),
    "Category": ("Categorie", "Kategoriýa"),
    "Categories": ("Categorii", "Kategoriýalar"),
    "Image": ("Imagine", "Surat"),
    "Price (Lei)": ("Preț (Lei)", "Baha (Lei)"),
    "Discount (%)": ("Reducere (%)", "Arzanladyş (%)"),
    "Rating": ("Notă", "Reýting"),
    "Reviews": ("Recenzii", "Synlar"),
    "Active": ("Activ", "Işjeň"),
    "Product": ("Produs", "Haryt"),
    "Products": ("Produse", "Harytlar"),
    "Final price": ("Preț final", "Soňky baha"),
    "Title (RO)": ("Titlu (RO)", "Sözbaşy (RO)"),
    "Title (EN)": ("Titlu (EN)", "Sözbaşy (EN)"),
    "Pill (RO)": ("Etichetă (RO)", "Bellik (RO)"),
    "Pill (EN)": ("Etichetă (EN)", "Bellik (EN)"),
    "Button (RO)": ("Buton (RO)", "Düwme (RO)"),
    "Button (EN)": ("Buton (EN)", "Düwme (EN)"),
    "CSS gradient": ("Gradient CSS", "CSS gradient"),
    "Pill color (bg)": ("Culoare etichetă (fundal)", "Bellik reňki (fon)"),
    "Pill color (text)": ("Culoare etichetă (text)", "Bellik reňki (tekst)"),
    "Product image (PNG)": ("Imagine produs (PNG)", "Önüm suraty (PNG)"),
    "Link": ("Link", "Salgy"),
    "Banner": ("Banner", "Banner"),
    "Banners (slider)": ("Bannere (slider)", "Bannerler (slider)"),
    "New": ("Nouă", "Täze"),
    "Paid": ("Plătită", "Tölenen"),
    "Shipped": ("Expediată", "Ugradyldy"),
    "Delivered": ("Livrată", "Gowşuryldy"),
    "Cancelled": ("Anulată", "Ýatyryldy"),
    "Customer name": ("Nume client", "Müşderi ady"),
    "Phone": ("Telefon", "Telefon"),
    "Address": ("Adresă", "Salgy"),
    "Status": ("Stare", "Ýagdaý"),
    "Order": ("Comandă", "Sargyt"),
    "Orders": ("Comenzi", "Sargytlar"),
    "Name": ("Nume", "Ady"),
    "Price": ("Preț", "Baha"),
    "Quantity": ("Cantitate", "Mukdar"),
    "Order item": ("Produs comandă", "Sargyt elementi"),
    "Order items": ("Produse comandă", "Sargyt elementleri"),
    "Total": ("Total", "Jemi"),
    "Catalog": ("Catalog", "Katalog"),
    "Romanian": ("Română", "Rumynça"),
    "English": ("Engleză", "Iňlisçe"),
    "Turkmen": ("Turkmenă", "Türkmençe"),
    "Administration": ("Administrare", "Dolandyryş"),
    # common admin strings missing in Turkmen
    "Welcome,": ("Bun venit,", "Hoş geldiňiz,"),
    "View site": ("Vizualizare site", "Sahypany görmek"),
    "Change password": ("Schimbă parola", "Paroly üýtgetmek"),
    "Log out": ("Deconectează-te", "Çykmak"),
    "Recent actions": ("Acțiuni recente", "Soňky hereketler"),
    "My actions": ("Acțiunile mele", "Meniň hereketlerim"),
    "None available": ("Niciuna", "Hiç biri"),
    "Add": ("Adaugă", "Goşmak"),
    "Save": ("Salvează", "Ýatda saklamak"),
    "Delete": ("Șterge", "Pozmak"),
    "Home": ("Acasă", "Baş sahypa"),
    "Search": ("Caută", "Gözleg"),
    "Filter": ("Filtru", "Süzgüç"),
    "Action:": ("Acțiune:", "Hereket:"),
    "Go": ("Start", "Git"),
}

LANGS = {"ro": 0, "tk": 1}
BASE = os.path.dirname(os.path.abspath(__file__))

for lang, idx in LANGS.items():
    d = os.path.join(BASE, "locale", lang, "LC_MESSAGES")
    os.makedirs(d, exist_ok=True)
    po = polib.POFile()
    po.metadata = {
        "Project-Id-Version": "KERVEN",
        "Language": lang,
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
    }
    for msgid, pair in T.items():
        po.append(polib.POEntry(msgid=msgid, msgstr=pair[idx]))
    po.save(os.path.join(d, "django.po"))
    po.save_as_mofile(os.path.join(d, "django.mo"))
    print(f"wrote {lang}: {len(T)} strings")
