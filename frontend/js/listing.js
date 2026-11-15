/* search, category and favourites pages */
(function () {
  var P = window.KERVEN_PRODUCTS || [], S = window.KervenStore, ICONS = window.KERVEN_ICONS || {};
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'ro'; }
  function svg(n, s, c) { return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>'; }
  function stars(r) { var f = Math.round(r); return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f); }
  function money(n) { return Math.round(n).toLocaleString('ro-RO'); }
  var T = { ro: { buy: 'Adaugă în coș', results: 'Rezultate pentru', nores: 'Niciun produs găsit', favempty: 'Nu ai produse favorite încă', all: 'Toate produsele' },
            en: { buy: 'Add to cart', results: 'Results for', nores: 'No products found', favempty: 'No favorites yet', all: 'All products' } };
  function t(k) { return (T[lang()] || T.ro)[k]; }

  function cardHtml(i) {
    var p = P[i], neu = Math.round(p.price * (1 - p.disc / 100)), isf = S && S.isFav(i);
    return '<div class="card"><span class="badge">-' + p.disc + '%</span>' +
      '<button class="fav' + (isf ? ' on' : '') + '" data-fav="' + i + '">' + svg('heart', 20, 'currentColor') + '</button>' +
      '<a class="thumb" href="product.html?id=' + i + '">' + svg(p.ic, 60, 'currentColor') + (window.KIMG ? window.KIMG(i, p, lang() === 'ro' ? p.ro : p.en) : '') + '</a>' +
      '<a class="name" href="product.html?id=' + i + '" style="text-decoration:none">' + (lang() === 'ro' ? p.ro : p.en) + '</a>' +
      '<div class="rate"><span class="stars">' + stars(p.rate) + '</span><span>' + p.rate.toFixed(1) + ' (' + p.rev + ')</span></div>' +
      '<div class="price"><span class="new">' + money(neu) + ' Lei</span><span class="old">' + money(p.price) + ' Lei</span></div>' +
      '<button class="buy" data-add="' + i + '">' + svg('cart', 18, '#fff') + '<span>' + t('buy') + '</span></button></div>';
  }

  function render(idxs, titleText, emptyText) {
    var grid = document.getElementById('grid'), ttl = document.getElementById('listTitle'), cnt = document.getElementById('listCount');
    if (ttl) ttl.textContent = titleText;
    if (cnt) cnt.textContent = idxs.length ? (idxs.length + (lang() === 'ro' ? ' produse' : ' products')) : '';
    if (!idxs.length) { grid.innerHTML = '<div class="list-empty">' + svg('cart', 48, '#C4C9E0') + '<p>' + (emptyText || t('nores')) + '</p><a href="index.html">' + t('all') + '</a></div>'; return; }
    grid.innerHTML = idxs.map(cardHtml).join('');
    grid.querySelectorAll('.fav').forEach(function (b) { b.onclick = function () { var on = S.toggleFav(+b.dataset.fav); b.classList.toggle('on', on); }; });
    grid.querySelectorAll('.buy').forEach(function (b) { b.onclick = function () { if (window.KervenCart) window.KervenCart.add(+b.dataset.add); }; });
  }

  function allIdx() { return P.map(function (_, i) { return i; }); }

  function run() {
    P = window.KERVEN_PRODUCTS || P;
    var page = document.body.getAttribute('data-page');
    var qs = new URLSearchParams(location.search);
    if (page === 'search') {
      var q = (qs.get('q') || '').trim(), ql = q.toLowerCase();
      var inp = document.getElementById('q'); if (inp) inp.value = q;
      var idxs = allIdx().filter(function (i) { return ((P[i].ro || '') + ' ' + (P[i].en || '')).toLowerCase().indexOf(ql) >= 0; });
      render(q ? idxs : allIdx(), (q ? t('results') + ' “' + q + '”' : t('all')));
    } else if (page === 'category') {
      var c = (qs.get('c') || '').trim(), cl = c.toLowerCase();
      var m = allIdx().filter(function (i) {
        var cr = (P[i].crumb || []).concat(P[i].crumbEn || []).join(' ').toLowerCase();
        return cr.indexOf(cl) >= 0 || (P[i].ro + ' ' + P[i].en).toLowerCase().indexOf(cl) >= 0;
      });
      if (!m.length) m = allIdx();
      render(m, c || t('all'));
    } else if (page === 'favorite') {
      var f = S.favIds().filter(function (i) { return P[i]; });
      render(f, t('ro') === undefined ? 'Favorite' : (lang() === 'ro' ? 'Favorite' : 'Favorites'), t('favempty'));
    }
  }

  window.addEventListener('kerven:data', run);
  if (S) S.onChange(function () { if (document.body.getAttribute('data-page') === 'favorite') run(); });
  run();
})();
