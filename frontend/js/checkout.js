/* checkout page */
(function () {
  var P = window.KERVEN_PRODUCTS || [], S = window.KervenStore, ICONS = window.KERVEN_ICONS || {};
  function lang() { return document.documentElement.lang === 'en' ? 'en' : 'ro'; }
  function svg(n, s, c) { return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>'; }
  function money(n) { return Math.round(n).toLocaleString('ro-RO'); }
  function fin(p) { return Math.round(p.price * (1 - p.disc / 100)); }
  var T = {
    ro: { title: 'Finalizează comanda', empty: 'Coșul este gol.', shop: 'Mergi la cumpărături', sum: 'Sumarul comenzii', sub: 'Subtotal', deliv: 'Transport', free: 'Gratuit', total: 'Total', pay: 'Plasează comanda', ok: 'Comandă plasată cu succes!', okmsg: 'Mulțumim! Comanda ta a fost înregistrată.', name: 'Nume complet', phone: 'Telefon', addr: 'Adresă', method: 'Metodă de plată', card: 'Card bancar', ramburs: 'Ramburs la livrare', kcard: 'Card KERVEN', back: 'Înapoi la magazin' },
    en: { title: 'Checkout', empty: 'Your cart is empty.', shop: 'Go shopping', sum: 'Order summary', sub: 'Subtotal', deliv: 'Delivery', free: 'Free', total: 'Total', pay: 'Place order', ok: 'Order placed successfully!', okmsg: 'Thank you! Your order has been registered.', name: 'Full name', phone: 'Phone', addr: 'Address', method: 'Payment method', card: 'Bank card', ramburs: 'Cash on delivery', kcard: 'KERVEN Card', back: 'Back to shop' }
  };
  function t(k) { return (T[lang()] || T.ro)[k]; }

  var root = document.getElementById('checkout');
  function render() {
    var items = S.cartItems();
    if (!items.length) {
      root.innerHTML = '<div class="list-empty">' + svg('cart', 48, '#C4C9E0') + '<p>' + t('empty') + '</p><a href="index.html">' + t('shop') + '</a></div>';
      return;
    }
    var sub = 0;
    var rows = items.map(function (it) {
      var lt = fin(it.p) * it.qty; sub += lt;
      var src = window.KPHOTO ? window.KPHOTO(it.id, it.p) : null;
      return '<div class="co-row"><span class="co-th">' + (src ? '<img src="' + src + '" alt="">' : svg(it.p.ic, 28, '#9AA0C0')) + '</span>' +
        '<span class="co-nm">' + (lang() === 'ro' ? it.p.ro : it.p.en) + ' <em>×' + it.qty + '</em></span>' +
        '<span class="co-lt">' + money(lt) + ' Lei</span></div>';
    }).join('');
    var transport = sub >= 200 ? 0 : 15;
    var total = sub + transport;
    root.innerHTML =
      '<h1 class="co-title">' + t('title') + '</h1>' +
      '<div class="co-grid">' +
      '<form class="co-form" id="coForm">' +
      '<label>' + t('name') + '<input name="name" required></label>' +
      '<label>' + t('phone') + '<input name="phone" required></label>' +
      '<label>' + t('addr') + '<textarea name="addr" rows="2" required></textarea></label>' +
      '<fieldset class="co-pay"><legend>' + t('method') + '</legend>' +
      '<label class="co-opt"><input type="radio" name="pay" value="card" checked> ' + t('card') + '</label>' +
      '<label class="co-opt"><input type="radio" name="pay" value="ramburs"> ' + t('ramburs') + '</label>' +
      '<label class="co-opt"><input type="radio" name="pay" value="kerven_card"> ' + t('kcard') + '</label>' +
      '</fieldset>' +
      '<button type="submit" class="co-pay-btn">' + t('pay') + ' · ' + money(total) + ' Lei</button>' +
      '</form>' +
      '<aside class="co-sum"><h3>' + t('sum') + '</h3>' + rows +
      '<div class="co-line"><span>' + t('sub') + '</span><span>' + money(sub) + ' Lei</span></div>' +
      '<div class="co-line"><span>' + t('deliv') + '</span><span>' + (transport ? money(transport) + ' Lei' : t('free')) + '</span></div>' +
      '<div class="co-line co-tot"><span>' + t('total') + '</span><b>' + money(total) + ' Lei</b></div>' +
      '</aside></div>';

    document.getElementById('coForm').addEventListener('submit', function (e) {
      e.preventDefault();
      // demo only: the order is not sent to the backend yet
      S.clearCart();
      root.innerHTML = '<div class="co-done">' + svg('help', 54, '#1FA97A') + '<h2>' + t('ok') + '</h2><p>' + t('okmsg') + '</p><a href="index.html">' + t('back') + '</a></div>';
    });
  }
  render();
  window.addEventListener('kerven:data', function () {
    var f = document.getElementById('coForm'), typed = false;
    if (f) f.querySelectorAll('input[name]:not([type=radio]),textarea').forEach(function (el) { if (el.value) typed = true; });
    if (!typed) render();
  });
})();
