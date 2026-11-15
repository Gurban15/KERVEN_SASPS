(function(){
  var ICONS = window.KERVEN_ICONS || {};
  var CATS = window.KERVEN_CATEGORIES || [];
  var PRODUCTS = window.KERVEN_PRODUCTS || [];

  var I18N = {
    ro:{search:'Caută',ph:'Caută produse, mărci sau categorii',account:'Contul meu',fav:'Favorite',cart:'Coșul meu',products:'Produse',deals:'Reduceri',cardK:'Card KERVEN',openbox:'Resigilate',help:'Ajutor',sell:'Vinde pe KERVEN',
      home:'Acasă',addToCart:'Adaugă în coș',added:'Adăugat ✓',addToFav:'Adaugă la favorite',inStock:'în stoc',soldBy:'Vândut și livrat de',deliveryEst:'Estimare livrare',freeDelivery:'Livrare gratuită',monthly:'Rate lunare de la',recommend:'recomandă produsul',reviews:'recenzii',warranty:'Garanție inclusă',warrantyInd:'Persoane fizice: 36 luni',warrantyCo:'Persoane juridice: 36 luni',notFound:'Produsul nu a fost găsit.',back:'Înapoi',cod:'Cod produs',share:'Distribuie',compare:'Compară'},
    en:{search:'Search',ph:'Search products, brands or categories',account:'My account',fav:'Favorites',cart:'My cart',products:'Products',deals:'Deals',cardK:'KERVEN Card',openbox:'Open-box',help:'Help',sell:'Sell on KERVEN',
      home:'Home',addToCart:'Add to cart',added:'Added ✓',addToFav:'Add to favorites',inStock:'in stock',soldBy:'Sold and delivered by',deliveryEst:'Delivery estimate',freeDelivery:'Free delivery',monthly:'Monthly rates from',recommend:'recommend this product',reviews:'reviews',warranty:'Warranty included',warrantyInd:'Individuals: 36 months',warrantyCo:'Companies: 36 months',notFound:'Product not found.',back:'Back',cod:'Product code',share:'Share',compare:'Compare'}
  };
  var lang='ro';
  function t(k){return (I18N[lang]||I18N.ro)[k];}
  function svg(name,size,color){return '<svg class="ic" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+(color||'currentColor')+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>';}
  function stars(r){var f=Math.round(r);return '★★★★★'.slice(0,f)+'☆☆☆☆☆'.slice(0,5-f);}
  function money(n){return n.toLocaleString('ro-RO');}

  function id(){var m=new URLSearchParams(location.search).get('id');return m===null?0:(+m);}
  var pid=id();
  function current(){return (window.KERVEN_PRODUCTS||PRODUCTS)[pid];}
  var P=current();

  document.querySelectorAll('[data-icon]').forEach(function(el){el.insertAdjacentHTML('afterbegin',svg(el.getAttribute('data-icon'),20,'currentColor'));});
  function applyI18n(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){el.textContent=t(el.getAttribute('data-i18n'));});
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){el.placeholder=t(el.getAttribute('data-i18n-ph'));});
  }

  function renderPDP(){
    var root=document.getElementById('pdp');
    if(!P){root.innerHTML='<p style="padding:40px">'+t('notFound')+' <a href="index.html">'+t('home')+'</a></p>';return;}
    var name=lang==='ro'?P.ro:P.en;
    var fin=Math.round(P.price*(1-P.disc/100));
    var crumbArr=(lang==='ro'?P.crumb:P.crumbEn)||[];
    var crumbHtml='<a href="index.html">'+t('home')+'</a>'+crumbArr.map(function(c){return ' <span class="sep">/</span> <a href="#">'+c+'</a>';}).join('');
    var shareSvg='<svg class="ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5"/></svg>';
    var cmpSvg='<svg class="ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h7M3 12h7M3 18h7M21 6h-7M21 12h-7M21 18h-7"/><circle cx="7" cy="6" r="1.4"/><circle cx="17" cy="12" r="1.4"/><circle cx="7" cy="18" r="1.4"/></svg>';
    var photos=window.KPHOTOS?window.KPHOTOS(P):[];
    var thumbs='';
    if(photos.length>1){
      photos.forEach(function(u,i){thumbs+='<button class="pdp-thumb'+(i===0?' on':'')+'" data-src="'+u+'" aria-label="'+name.replace(/"/g,'')+' '+(i+1)+'"><img src="'+u+'" alt=""></button>';});
    }
    root.innerHTML =
      '<nav class="crumb">'+crumbHtml+'</nav>'
    + '<div class="pdp-grid">'
    +   '<section class="pdp-gallery">'
    +     '<div class="pdp-main">'+svg(P.ic,120,'#C4C9E0')+(window.KIMG?window.KIMG(pid,P,name,'pdpImg'):'')+'<span class="badge">-'+P.disc+'%</span></div>'
    +     '<div class="pdp-thumbs">'+thumbs+'</div>'
    +   '</section>'
    +   '<section class="pdp-info">'
    +     '<div class="pdp-head"><h1>'+name+'</h1>'
    +       '<div class="pdp-meta"><span class="pdp-cod">'+t('cod')+': <b>'+(P.cod||'—')+'</b></span>'
    +         '<div class="pdp-actions"><button class="pdp-act">'+shareSvg+'<span>'+t('share')+'</span></button>'
    +         '<button class="pdp-act">'+cmpSvg+'<span>'+t('compare')+'</span></button></div>'
    +       '</div>'
    +     '</div>'
    +     '<div class="pdp-rate"><span class="stars">'+stars(P.rate)+'</span> <b>'+P.rate.toFixed(2)+'</b> <span class="muted">('+P.rev+' '+t('reviews')+')</span></div>'
    +     '<div class="pdp-reco">'+svg('help',18,'#1FA97A')+'<span><b>97%</b> '+t('recommend')+'</span></div>'
    +     '<div class="pdp-delivery">'
    +       '<div class="pdp-deliv-head">'+svg('delivery',22,'#14194D')+'<span>'+t('deliveryEst')+'</span></div>'
    +       '<div class="pdp-free">'+t('freeDelivery')+'</div>'
    +     '</div>'
    +     '<ul class="pdp-warranty"><li>'+svg('help',16,'#1FA97A')+' <b>'+t('warranty')+'</b></li><li class="sub">'+t('warrantyInd')+'</li><li class="sub">'+t('warrantyCo')+'</li></ul>'
    +   '</section>'
    +   '<aside class="pdp-buy">'
    +     '<div class="pdp-price">'+money(fin)+'<sup>99</sup> Lei</div>'
    +     '<div class="pdp-oldrow"><span class="old">'+money(P.price)+' Lei</span> <span class="save">-'+P.disc+'%</span></div>'
    +     '<div class="pdp-rate2">'+t('monthly')+' <b>'+Math.round(fin/24)+' Lei</b></div>'
    +     '<div class="pdp-stock">'+svg('help',16,'#1FA97A')+' '+t('inStock')+'</div>'
    +     '<div class="pdp-seller">'+t('soldBy')+' <b>KERVEN</b></div>'
    +     '<button class="pdp-add" id="pdpAdd">'+svg('cart',20,'#fff')+'<span>'+t('addToCart')+'</span></button>'
    +     '<button class="pdp-fav'+(window.KervenStore&&window.KervenStore.isFav(pid)?' on':'')+'" id="pdpFav">'+svg('heart',20,'currentColor')+'<span>'+t('addToFav')+'</span></button>'
    +   '</aside>'
    + '</div>';
    document.querySelectorAll('.pdp-thumb').forEach(function(b){b.addEventListener('click',function(){
      document.querySelectorAll('.pdp-thumb').forEach(function(x){x.classList.remove('on');});b.classList.add('on');
      var main=document.getElementById('pdpImg'); if(main&&b.dataset.src) main.src=b.dataset.src;
    });});
    var add=document.getElementById('pdpAdd');
    add.addEventListener('click',function(){
      if(window.KervenStore) window.KervenStore.addToCart(pid);
      add.classList.add('ok');add.querySelector('span').textContent=t('added');
      setTimeout(function(){add.classList.remove('ok');add.querySelector('span').textContent=t('addToCart');},1200);
      if(window.KervenCart) setTimeout(function(){window.KervenCart.open();},250);
    });
    var fav=document.getElementById('pdpFav');
    fav.addEventListener('click',function(){var on=window.KervenStore?window.KervenStore.toggleFav(pid):false;fav.classList.toggle('on',on);});
    document.title='KERVEN — '+name;
  }

  // drawer
  var drawer=document.getElementById('drawer');
  function drawerRoot(){var body=document.getElementById('drawerBody');body.innerHTML='';CATS.forEach(function(c,idx){var b=document.createElement('button');b.className='drawer-item';b.innerHTML=svg(c.icon,22,'#14194D')+'<span>'+(lang==='ro'?c.ro:c.en)+'</span>'+svg('chevron-right',18,'#C2C6DC').replace('class="ic"','class="ic chev"');b.addEventListener('click',function(){drawerSub(idx);});body.appendChild(b);});}
  function drawerSub(idx){var c=CATS[idx],body=document.getElementById('drawerBody');var back=document.createElement('button');back.className='drawer-back-btn';back.innerHTML=svg('chevron-right',18,'#14194D').replace('d="M9 6 L15 12 L9 18"','d="M15 6 L9 12 L15 18"')+'<span>'+t('back')+'</span>';back.addEventListener('click',drawerRoot);var html='<div class="drawer-sub-title">'+(lang==='ro'?c.ro:c.en)+'</div>'+c.cols.map(function(col){return '<div class="drawer-grp"><h4>'+col.h+'</h4>'+col.items.map(function(i){return '<a href="#">'+i+'</a>';}).join('')+'</div>';}).join('');body.innerHTML='';body.appendChild(back);body.insertAdjacentHTML('beforeend',html);}
  document.getElementById('burger').addEventListener('click',function(){drawerRoot();drawer.hidden=false;requestAnimationFrame(function(){drawer.classList.add('open');});document.body.style.overflow='hidden';});
  function closeDrawer(){drawer.classList.remove('open');document.body.style.overflow='';setTimeout(function(){drawer.hidden=true;},250);}
  document.getElementById('drawerClose').addEventListener('click',closeDrawer);
  document.getElementById('drawerOverlay').addEventListener('click',closeDrawer);

  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){lang=b.getAttribute('data-lang');document.querySelectorAll('.lang button').forEach(function(x){x.classList.toggle('on',x===b);});applyI18n();renderPDP();if(!drawer.hidden)drawerRoot();});});

  document.getElementById('year').textContent=new Date().getFullYear();
  applyI18n(); renderPDP();

  // redraw when the data from the API arrives
  window.addEventListener('kerven:data',function(){P=current();renderPDP();});
})();
