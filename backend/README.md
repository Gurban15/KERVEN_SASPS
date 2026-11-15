# KERVEN – backend

The server part of the shop, built with Django and PostgreSQL.

## What it does
- **Admin page** (`/admin/`): add and edit products, categories, orders and banners. Available in Romanian, English and Turkmen.
- **Database**: PostgreSQL (or SQLite for a quick start).
- **API**: gives data to the shop pages
  - `/api/products/` – products with prices and photos
  - `/api/categories/` – categories
  - `/api/banners/` – homepage banners
- **Comparison experiment** (`comparison/`): the two versions of order processing and the measurements. See the main README.

## How to run (Mac / Linux)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env              # fill in the database details, or set USE_SQLITE=1
python manage.py migrate          # creates the tables
python manage.py seed             # adds demo products, categories and banners
python manage.py createsuperuser  # your admin login
python manage.py runserver
```
- Admin: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/products/

## Product photos
The original photos are in `product_photos/` (`1.jpg`, `2.jpg`, ... and `1-2.jpg` for extra photos).
To load them into the database (they are copied to `media/products/`):
```bash
python manage.py import_photos --dir product_photos --force
```

## Folders
- `kerven/` – project settings and URLs
- `catalog/` – products, categories, photos, banners, API, and the `seed` / `import_photos` commands
- `orders/` – orders
- `comparison/` – Version A (`fara_sabloane/`), Version B (`cu_sabloane/`), test orders and measurements
- `locale/` – admin translations (Romanian, Turkmen)
