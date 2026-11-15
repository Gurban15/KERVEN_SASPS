/* cart drawer, badges, account menu, search */
(function () {
  var S = window.KervenStore;
  if (!S) return;
  var ICONS = window.KERVEN_ICONS || {};
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'ro'; }
  function svg(n, s, c) {
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' +
      (c || 'currentColor') + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>';
  }
  function money(n) { return Math.round(n).toLocaleString('ro-RO'); }
  function fin(p) { return Math.round(p.price * (1 - p.disc / 100)); }
  function thumb(it) {
    var src = window.KPHOTO ? window.KPHOTO(it.id, it.p) : null;
    return src ? '<img src="' + src + '" alt="">' : svg(it.p.ic, 34, '#9AA0C0');
  }

  var T = {
    ro: { cart: 'Coșul meu', empty: 'Coșul este gol', total: 'Total', checkout: 'Finalizează comanda', remove: 'Elimină', cont: 'Continuă cumpărăturile', login: 'Autentificare', logout: 'Ieși din cont', hi: 'Bună', myfav: 'Favoritele mele', myorders: 'Comenzile mele', name: 'Numele tău' },
    en: { cart: 'My cart', empty: 'Your cart is empty', total: 'Total', checkout: 'Checkout', remove: 'Remove', cont: 'Continue shopping', login: 'Sign in', logout: 'Sign out', hi: 'Hi', myfav: 'My favorites', myorders: 'My orders', name: 'Your name' }
  };
  function t(k) { return (T[lang()] || T.ro)[k]; }

  // drawer
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="cart-ov" id="cartOv" hidden></div>' +
    '<aside class="cart-dr" id="cartDr" hidden aria-label="Coș">' +
    '  <header class="cart-hd"><span id="cartTtl"></span>' +
    '    <button class="cart-x" id="cartX" aria-label="X">' + svg('close', 22, '#14194D') + '</button></header>' +
    '  <div class="cart-body" id="cartBody"></div>' +
    '  <footer class="cart-ft" id="cartFt"></footer>' +
    '</aside>';
  document.body.appendChild(wrap);

  var ov = document.getElementById('cartOv'), dr = document.getElementById('cartDr');
  function open() { render(); ov.hidden = false; dr.hidden = false; requestAnimationFrame(function () { dr.classList.add('on'); ov.classList.add('on'); }); document.body.style.overflow = 'hidden'; }
  function close() { dr.classList.remove('on'); ov.classList.remove('on'); document.body.style.overflow = ''; setTimeout(function () { dr.hidden = true; ov.hidden = true; }, 250); }
  ov.addEventListener('click', close);
  document.getElementById('cartX').addEventListener('click', close);

  function render() {
    document.getElementById('cartTtl').textContent = t('cart');
    var items = S.cartItems(), body = document.getElementById('cartBody'), ft = document.getElementById('cartFt');
    if (!items.length) {
      body.innerHTML = '<div class="cart-empty">' + svg('cart', 46, '#C4C9E0') + '<p>' + t('empty') + '</p>' +
        '<a class="cart-cont" href="index.html">' + t('cont') + '</a></div>';
      ft.innerHTML = ''; return;
    }
    var total = 0;
    body.innerHTML = items.map(function (it) {
      var line = fin(it.p) * it.qty; total += line;
      var nm = lang() === 'ro' ? it.p.ro : it.p.en;
      return '<div class="cart-row" data-id="' + it.id + '">' +
        '<a class="cart-th" href="product.html?id=' + it.id + '">' + thumb(it) + '</a>' +
        '<div class="cart-mid"><a class="cart-nm" href="product.html?id=' + it.id + '">' + nm + '</a>' +
        '<div class="cart-pr">' + money(fin(it.p)) + ' Lei</div>' +
        '<div class="qty"><button class="qd" data-id="' + it.id + '">−</button><span>' + it.qty + '</span>' +
        '<button class="qi" data-id="' + it.id + '">+</button>' +
        '<button class="cart-rm" data-id="' + it.id + '">' + t('remove') + '</button></div></div>' +
        '<div class="cart-lt">' + money(line) + ' Lei</div></div>';
    }).join('');
    ft.innerHTML = '<div class="cart-total"><span>' + t('total') + '</span><b>' + money(total) + ' Lei</b></div>' +
      '<a class="cart-go" href="checkout.html">' + t('checkout') + '</a>';
    body.querySelectorAll('.qi').forEach(function (b) { b.onclick = function () { var id = b.dataset.id; S.setQty(id, (S.cart()[id] || 0) + 1); }; });
    body.querySelectorAll('.qd').forEach(function (b) { b.onclick = function () { var id = b.dataset.id; S.setQty(id, (S.cart()[id] || 0) - 1); }; });
    body.querySelectorAll('.cart-rm').forEach(function (b) { b.onclick = function () { S.removeFromCart(b.dataset.id); }; });
  }

  // header badges and buttons
  function badge(btn, n) {
    if (!btn) return;
    var b = btn.querySelector('.hb');
    if (!b) { b = document.createElement('span'); b.className = 'hb'; btn.appendChild(b); }
    b.textContent = n; b.hidden = !n;
  }
  function sync() {
    badge(document.getElementById('cartBtn'), S.cartCount());
    badge(document.getElementById('favBtn'), S.favCount());
    if (!dr.hidden) render();
    var acc = document.getElementById('accName');
    if (acc) { var u = S.user(); acc.textContent = u ? (t('hi') + ', ' + u.name) : (document.querySelector('#accBtn span') ? acc.textContent : ''); }
  }
  S.onChange(sync);

  var cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', function (e) { e.preventDefault(); open(); });
  var favBtn = document.getElementById('favBtn');
  if (favBtn) favBtn.addEventListener('click', function (e) { e.preventDefault(); location.href = 'favorite.html'; });

  /* account dropdown */
  var accBtn = document.getElementById('accBtn');
  if (accBtn) {
    var menu = document.createElement('div');
    menu.className = 'acc-menu'; menu.hidden = true;
    accBtn.parentNode.style.position = 'relative';
    accBtn.parentNode.appendChild(menu);
    function fillMenu() {
      var u = S.user();
      menu.innerHTML = (u ? '<div class="acc-hi">' + t('hi') + ', <b>' + u.name + '</b></div>' : '') +
        '<a href="favorite.html">' + t('myfav') + '</a>' +
        '<a href="checkout.html">' + t('cart') + '</a>' +
        (u ? '<button id="accOut">' + t('logout') + '</button>'
           : '<button id="accIn">' + t('login') + '</button>');
      var inb = menu.querySelector('#accIn'); if (inb) inb.onclick = function () { var n = prompt(t('name')); if (n) { S.login(n.trim()); fillMenu(); } };
      var outb = menu.querySelector('#accOut'); if (outb) outb.onclick = function () { S.logout(); fillMenu(); };
    }
    accBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fillMenu(); menu.hidden = !menu.hidden; });
    document.addEventListener('click', function () { menu.hidden = true; });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  /* search -> search.html */
  var sf = document.querySelector('form.search');
  if (sf) sf.addEventListener('submit', function (e) { e.preventDefault(); var q = (document.getElementById('q') || {}).value || ''; location.href = 'search.html?q=' + encodeURIComponent(q.trim()); });

  /* expose */
  window.KervenCart = { open: open, add: function (id) { S.addToCart(id); open(); } };
  window.addEventListener('kerven:data', sync);
  sync();
})();
