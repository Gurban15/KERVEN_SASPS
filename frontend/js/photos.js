/* product photos from the database */
(function () {
  window.KPHOTO = function (idx, p) {
    if (p && p.image) return p.image;
    if (p && p.images && p.images.length) return p.images[0];
    return null;
  };

  window.KPHOTOS = function (p) {
    var out = [];
    if (p && p.image) out.push(p.image);
    if (p && p.images) p.images.forEach(function (u) { if (out.indexOf(u) < 0) out.push(u); });
    return out;
  };

  window.KIMG = function (idx, p, alt, id) {
    var src = window.KPHOTO(idx, p);
    if (!src) return '';
    return '<img class="pimg"' + (id ? ' id="' + id + '"' : '') + ' src="' + src + '" alt="' +
      (alt || '').replace(/"/g, '') + '" loading="lazy" onerror="this.remove()">';
  };
})();
