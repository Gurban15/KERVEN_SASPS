# KERVEN – shop pages

The part of the shop the customer sees. Plain HTML, CSS and JavaScript, nothing to install or build.

## How to run
Start the backend first (see `backend/README.md`), then in a second terminal:
```bash
cd frontend
python3 -m http.server 5500
```
Open http://localhost:5500

The pages first show built-in demo products, then load the real products, prices and photos from the backend API.

## Pages
- `index.html` – home page
- `category.html` – products of one category
- `product.html` – one product, with photo gallery
- `search.html` – search results
- `favorite.html` – saved favourites
- `checkout.html` – order form

## Main files
- `css/styles.css` – all the styling (brand colours at the top)
- `js/data.js` – loads data from the backend API
- `js/products.js`, `js/categories.js` – built-in demo data
- `js/store.js` – cart and favourites (saved in the browser)
- `js/cart.js` – the cart panel
- `js/product.js`, `js/listing.js`, `js/checkout.js` – logic for each page
- `js/app.js` – home page, language switch (RO / EN), menu
