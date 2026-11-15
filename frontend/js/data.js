/* load products and categories from the API (keeps the demo data if the backend is off) */
(function () {
  var BASE = window.KERVEN_API || 'http://127.0.0.1:8000';

  function get(path) {
    var ctrl = new AbortController();
    var tmo = setTimeout(function () { ctrl.abort(); }, 1500);
    return fetch(BASE + path, { signal: ctrl.signal })
      .then(function (r) { clearTimeout(tmo); return r.ok ? r.json() : null; })
      .catch(function () { clearTimeout(tmo); return null; });
  }

  function mapProducts(list) {
    // keep the same order as products.js (pages use the position as id)
    return list.slice().sort(function (a, b) { return a.id - b.id; }).map(function (p) {
      var cat = p.category || '';
      return {
        id: p.id, ic: p.ic || 'grid', ro: p.ro, en: p.en || p.ro,
        image: p.image || null, images: p.images || [],
        price: +p.price, disc: +p.disc || 0, rate: +p.rate || 0, rev: +p.rev || 0,
        cod: 'KV' + p.id,
        crumb: cat ? [cat] : [], crumbEn: cat ? [cat] : []
      };
    });
  }

  Promise.all([get('/api/products/'), get('/api/categories/')]).then(function (res) {
    var prod = res[0], cat = res[1], changed = false;
    if (prod && prod.products && prod.products.length) {
      window.KERVEN_PRODUCTS = mapProducts(prod.products); changed = true;
    }
    if (cat && cat.categories && cat.categories.length) {
      window.KERVEN_CATEGORIES = cat.categories; changed = true;
    }
    if (changed) window.dispatchEvent(new Event('kerven:data'));
  });
})();
