/* cart and favourites in localStorage */
window.KervenStore = (function () {
  var CART = 'kerven_cart', FAV = 'kerven_favs', USER = 'kerven_user';
  var listeners = [];

  function read(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); emit(); }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

  return {
    onChange: function (f) { listeners.push(f); },

    // cart
    cart: function () { return read(CART); },
    cartCount: function () { var c = read(CART), n = 0; for (var k in c) n += c[k]; return n; },
    cartItems: function () {
      var c = read(CART), P = window.KERVEN_PRODUCTS || [], out = [];
      for (var id in c) { if (P[id]) out.push({ id: +id, qty: c[id], p: P[id] }); }
      return out;
    },
    addToCart: function (id, q) { q = q || 1; var c = read(CART); c[id] = (c[id] || 0) + q; write(CART, c); },
    setQty: function (id, q) { var c = read(CART); if (q <= 0) delete c[id]; else c[id] = q; write(CART, c); },
    removeFromCart: function (id) { var c = read(CART); delete c[id]; write(CART, c); },
    clearCart: function () { write(CART, {}); },

    // favourites
    favs: function () { return read(FAV); },
    favCount: function () { return Object.keys(read(FAV)).length; },
    favIds: function () { return Object.keys(read(FAV)).map(Number); },
    isFav: function (id) { return !!read(FAV)[id]; },
    toggleFav: function (id) { var f = read(FAV); if (f[id]) delete f[id]; else f[id] = true; write(FAV, f); return !!f[id]; },

    // user (demo)
    user: function () { var u = read(USER); return u && u.name ? u : null; },
    login: function (name) { write(USER, { name: name }); },
    logout: function () { localStorage.removeItem(USER); emit(); }
  };
})();
