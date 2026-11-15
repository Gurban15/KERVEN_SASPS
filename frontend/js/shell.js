/* shared header for the listing pages */
(function () {
  var ICONS = window.KERVEN_ICONS || {};
  var CATS = window.KERVEN_CATEGORIES || [];
  function svg(n, s, c) {
    return '<svg class="ic" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' +
      (c || 'currentColor') + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>';
  }
  var L = { ro: { ph: 'Caută produse, mărci sau categorii', account: 'Contul meu', fav: 'Favorite', cart: 'Coșul meu', products: 'Produse', deals: 'Reduceri', help: 'Ajutor', sell: 'Vinde pe KERVEN', back: 'Înapoi' },
            en: { ph: 'Search products, brands or categories', account: 'My account', fav: 'Favorites', cart: 'My cart', products: 'Products', deals: 'Deals', help: 'Help', sell: 'Sell on KERVEN', back: 'Back' } };
  var lang = localStorage.getItem('kerven_lang') === 'en' ? 'en' : 'ro';
  document.documentElement.lang = lang;
  function t(k) { return (L[lang] || L.ro)[k]; }

  var host = document.getElementById('appHeader');
  if (host) {
    host.innerHTML =
      '<header class="hdr"><div class="wrap hdr-in">' +
      '<button class="burger" id="burger" aria-label="Meniu">' + svg('menu', 22, '#14194D') + '</button>' +
      '<a class="logo" href="index.html" aria-label="KERVEN"><img src="assets/logo.svg" alt="KERVEN"></a>' +
      '<form class="search" role="search"><input id="q" type="search" autocomplete="off" placeholder="' + t('ph') + '">' +
      '<button type="submit" class="search-btn" aria-label="Caută">' + svg('search', 20, '#14194D') + '</button></form>' +
      '<nav class="user-nav">' +
      '<button class="topbtn" id="accBtn">' + svg('account', 20) + '<span id="accName">' + t('account') + '</span>' + svg('chevron-down', 16) + '</button>' +
      '<button class="topbtn" id="favBtn">' + svg('heart', 20) + '<span>' + t('fav') + '</span></button>' +
      '<button class="topbtn" id="cartBtn">' + svg('cart', 20) + '<span>' + t('cart') + '</span></button>' +
      '<div class="lang" role="group"><button data-lang="ro"' + (lang === 'ro' ? ' class="on"' : '') + '>RO</button>' +
      '<button data-lang="en"' + (lang === 'en' ? ' class="on"' : '') + '>EN</button></div>' +
      '</nav></div></header>' +
      '<div class="catbar"><div class="wrap catbar-in">' +
      '<button class="produse" id="burger2">' + svg('menu', 18) + '<span>' + t('products') + '</span></button>' +
      '<a class="catlink" href="search.html">' + svg('tag', 18) + '<span>' + t('deals') + '</span></a>' +
      '<span class="spacer"></span>' +
      '<a class="catlink" href="#">' + svg('help', 18) + '<span>' + t('help') + '</span></a>' +
      '<button class="sell"><span>' + t('sell') + '</span></button>' +
      '</div></div>';
  }

  /* drawer */
  var dw = document.createElement('div');
  dw.innerHTML =
    '<div class="drawer" id="drawer" hidden><div class="drawer-back" id="drawerOverlay"></div>' +
    '<nav class="drawer-panel" aria-label="Categorii"><div class="drawer-head">' +
    '<button id="drawerClose" aria-label="Închide">' + svg('close', 22, '#14194D') + '</button>' +
    '<img src="assets/logo.svg" class="drawer-logo" alt="KERVEN"></div>' +
    '<div class="drawer-body" id="drawerBody"></div></nav></div>';
  document.body.appendChild(dw);
  var drawer = document.getElementById('drawer');
  function droot() {
    var b = document.getElementById('drawerBody'); b.innerHTML = '';
    CATS.forEach(function (c, i) {
      var el = document.createElement('button'); el.className = 'drawer-item';
      el.innerHTML = svg(c.icon, 22, '#14194D') + '<span>' + (lang === 'ro' ? c.ro : c.en) + '</span>' + svg('chevron-right', 18, '#C2C6DC');
      el.onclick = function () { dsub(i); }; b.appendChild(el);
    });
  }
  function dsub(i) {
    var c = CATS[i], b = document.getElementById('drawerBody');
    var back = document.createElement('button'); back.className = 'drawer-back-btn';
    back.innerHTML = svg('chevron-right', 18, '#14194D').replace('d="M9 6 L15 12 L9 18"', 'd="M15 6 L9 12 L15 18"') + '<span>' + t('back') + '</span>';
    back.onclick = droot;
    var html = '<div class="drawer-sub-title">' + (lang === 'ro' ? c.ro : c.en) + '</div>' +
      c.cols.map(function (col) { return '<div class="drawer-grp"><h4>' + col.h + '</h4>' + col.items.map(function (x) { return '<a href="category.html?c=' + encodeURIComponent(x) + '">' + x + '</a>'; }).join('') + '</div>'; }).join('');
    b.innerHTML = ''; b.appendChild(back); b.insertAdjacentHTML('beforeend', html);
  }
  function openD() { droot(); drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add('open'); }); document.body.style.overflow = 'hidden'; }
  function closeD() { drawer.classList.remove('open'); document.body.style.overflow = ''; setTimeout(function () { drawer.hidden = true; }, 250); }
  var bg = document.getElementById('burger'); if (bg) bg.onclick = openD;
  var bg2 = document.getElementById('burger2'); if (bg2) bg2.onclick = openD;
  document.getElementById('drawerClose').onclick = closeD;
  document.getElementById('drawerOverlay').onclick = closeD;

  /* lang toggle */
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.onclick = function () {
      lang = b.getAttribute('data-lang'); localStorage.setItem('kerven_lang', lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new Event('kerven:lang'));
      location.reload();
    };
  });

  window.KShell = { lang: function () { return lang; }, svg: svg };
})();
