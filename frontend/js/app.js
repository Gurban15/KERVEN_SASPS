(function(){
  var CATS = window.KERVEN_CATEGORIES || [];
  var ICONS = window.KERVEN_ICONS || {};

  var I18N = {
    ro:{search:'Caută',ph:'Caută produse, mărci sau categorii',account:'Contul meu',fav:'Favorite',cart:'Coșul meu',products:'Produse',deals:'Reduceri',cardK:'Card KERVEN',openbox:'Resigilate',help:'Ajutor',sell:'Vinde pe KERVEN',footer:'Marketplace demo',prev:'Înapoi',next:'Înainte',picks:'Produse alese pentru tine',buy:'Adaugă în coș',more:'Vezi mai mult'},
    en:{search:'Search',ph:'Search products, brands or categories',account:'My account',fav:'Favorites',cart:'My cart',products:'Products',deals:'Deals',cardK:'KERVEN Card',openbox:'Open-box',help:'Help',sell:'Sell on KERVEN',footer:'Marketplace demo',prev:'Previous',next:'Next',picks:'Picked for you',buy:'Add to cart',more:'See more'}
  };

  var SLIDES = [
    {grad:'linear-gradient(100deg,#0B0B0F 0%,#26262E 60%,#3A3A46 100%)',img:'assets/banners/iphone.png',pillc:'#FF7A1A',pillfg:'#14194D',ro:{title:'iPhone 18 Pro',pill:'Precomandă acum',cta:'Vezi detalii'},en:{title:'iPhone 18 Pro',pill:'Preorder now',cta:'See details'}},
    {grad:'linear-gradient(100deg,#0E5B52 0%,#14897A 55%,#E3B23C 100%)',img:'assets/banners/mobila.png',pillc:'#fff',pillfg:'#0E5B52',ro:{title:'Mobilă & Decor',pill:'până la -40%',cta:'Descoperă'},en:{title:'Furniture & Decor',pill:'up to -40%',cta:'Explore'}},
    {grad:'linear-gradient(100deg,#14194D 0%,#2A318A 50%,#2563C9 100%)',img:'assets/banners/electronice.png',pillc:'#FF7A1A',pillfg:'#14194D',ro:{title:'Electronice',pill:'Super prețuri',cta:'Cumpără acum'},en:{title:'Electronics',pill:'Super prices',cta:'Shop now'}},
    {grad:'linear-gradient(100deg,#4A1D6A 0%,#B5377F 55%,#FF7A1A 100%)',img:'assets/banners/bonus.png',pillc:'#fff',pillfg:'#4A1D6A',ro:{title:'KERVEN Bonus',pill:'+5% bonus',cta:'Activează'},en:{title:'KERVEN Bonus',pill:'+5% bonus',cta:'Activate'}}
  ];

  var lang='ro', slide=0, hover=null, timer=null;

  function svg(name,size,color){
    return '<svg class="ic" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+(color||'currentColor')+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>';
  }
  function t(k){ return (I18N[lang]||I18N.ro)[k]; }

  // static icon buttons
  document.querySelectorAll('[data-icon]').forEach(function(el){
    el.insertAdjacentHTML('afterbegin', svg(el.getAttribute('data-icon'),20,'currentColor'));
  });

  function applyI18n(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent=t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){ el.placeholder=t(el.getAttribute('data-i18n-ph')); });
  }

  // sidebar
  function renderRail(){
    var rail=document.getElementById('catRail'); rail.innerHTML='';
    CATS.forEach(function(c,idx){
      var b=document.createElement('button');
      b.className='catrow'+(hover===idx?' on':'');
      b.innerHTML=svg(c.icon,19,'#14194D')+'<span>'+(lang==='ro'?c.ro:c.en)+'</span>'+svg('chevron-right',14,'#C2C6DC').replace('class="ic"','class="ic chev"');
      b.addEventListener('mouseenter',function(){ hover=idx; openMega(); });
      rail.appendChild(b);
    });
  }

  // mega
  function openMega(){
    var mega=document.getElementById('mega'); var c=CATS[hover];
    var cols=c.cols.map(function(col){
      return '<div class="grp"><h4>'+col.h+'</h4>'+col.items.map(function(i){return '<a href="category.html?c='+encodeURIComponent(i)+'">'+i+'</a>';}).join('')+'</div>';
    }).join('');
    mega.innerHTML='<h3>'+(lang==='ro'?c.ro:c.en)+'</h3><div class="cols">'+cols+'</div>';
    mega.hidden=false;
    document.querySelectorAll('.catrow').forEach(function(el,i){ el.classList.toggle('on',i===hover); });
  }
  function closeMega(){ hover=null; document.getElementById('mega').hidden=true; document.querySelectorAll('.catrow').forEach(function(el){el.classList.remove('on');}); }
  document.getElementById('home').addEventListener('mouseleave',closeMega);

  // slider
  function renderHero(){
    var hero=document.getElementById('hero');
    hero.innerHTML = SLIDES.map(function(s,n){
      var d=s[lang]; var bg='assets/banners/bg/slide'+(n+1);
      return '<div class="slide'+(n===slide?' on':'')+'">'
        + '<picture class="bg">'
        +   '<source media="(min-width:1200px)" srcset="'+bg+'-1600.jpg">'
        +   '<source media="(min-width:992px)" srcset="'+bg+'-1200.jpg">'
        +   '<source media="(min-width:768px)" srcset="'+bg+'-820.jpg">'
        +   '<img class="bgimg" src="'+bg+'-600.jpg" alt="'+d.title+'">'
        + '</picture>'
        + '<div class="txt">'
        +   '<div class="title">'+d.title+'</div>'
        +   '<div class="pill" style="background:'+s.pillc+';color:'+s.pillfg+'">'+d.pill+'</div>'
        +   '<button class="cta" style="color:'+s.pillfg+'">'+d.cta+'</button>'
        + '</div></div>';
    }).join('')
    + '<button class="arr prev" aria-label="'+t('prev')+'">'+svg('chevron-right',22,'#fff').replace('d="M9 6 L15 12 L9 18"','d="M15 6 L9 12 L15 18"')+'</button>'
    + '<button class="arr next" aria-label="'+t('next')+'">'+svg('chevron-right',22,'#fff')+'</button>'
    + '<div class="dots">'+SLIDES.map(function(s,n){return '<button class="dot'+(n===slide?' on':'')+'" aria-label="Slide '+(n+1)+'" data-go="'+n+'"></button>';}).join('')+'</div>';
    hero.querySelector('.arr.prev').addEventListener('click',function(){go(slide-1);});
    hero.querySelector('.arr.next').addEventListener('click',function(){go(slide+1);});
    hero.querySelectorAll('.dot').forEach(function(d){ d.addEventListener('click',function(){ go(+d.getAttribute('data-go')); }); });
  }
  function go(n){ slide=((n%SLIDES.length)+SLIDES.length)%SLIDES.length; renderHero(); restart(); }
  function tick(){ slide=(slide+1)%SLIDES.length; renderHero(); }
  function restart(){ if(timer)clearInterval(timer); timer=setInterval(tick,5000); }

  // ---- Product grid: "Produse alese pentru tine" ----
  var PRODUCTS = window.KERVEN_PRODUCTS || [];
  var Store = window.KervenStore;
  function stars(r){ var full=Math.round(r); return '★★★★★'.slice(0,full)+'☆☆☆☆☆'.slice(0,5-full); }
  function renderGrid(){
    var g=document.getElementById('productGrid'); if(!g) return; g.innerHTML='';
    PRODUCTS.forEach(function(p,idx){
      var neu=Math.round(p.price*(1-p.disc/100));
      var isf=Store&&Store.isFav(idx);
      var card=document.createElement('div'); card.className='card';
      card.innerHTML='<span class="badge">-'+p.disc+'%</span>'
        +'<button class="fav'+(isf?' on':'')+'" aria-label="'+t('fav')+'" data-fav="'+idx+'">'+svg('heart',20,'currentColor')+'</button>'
        +'<a class="thumb" href="product.html?id='+idx+'">'+svg(p.ic,60,'currentColor')+(window.KIMG?window.KIMG(idx,p,lang==='ro'?p.ro:p.en):'')+'</a>'
        +'<a class="name" href="product.html?id='+idx+'" style="text-decoration:none">'+(lang==='ro'?p.ro:p.en)+'</a>'
        +'<div class="rate"><span class="stars">'+stars(p.rate)+'</span><span>'+p.rate.toFixed(1)+' ('+p.rev+')</span></div>'
        +'<div class="price"><span class="new">'+neu.toLocaleString('ro-RO')+' Lei</span><span class="old">'+p.price.toLocaleString('ro-RO')+' Lei</span></div>'
        +'<button class="buy" data-add="'+idx+'">'+svg('cart',18,'#fff')+'<span>'+t('buy')+'</span></button>';
      g.appendChild(card);
    });
    g.querySelectorAll('.fav').forEach(function(b){ b.addEventListener('click',function(){ var i=+b.getAttribute('data-fav'); var on=Store?Store.toggleFav(i):false; b.classList.toggle('on',on); }); });
    g.querySelectorAll('.buy').forEach(function(b){ b.addEventListener('click',function(){ var i=+b.getAttribute('data-add'); if(window.KervenCart)window.KervenCart.add(i); }); });
  }

  // "Vezi mai mult" dropdown
  var moreBtn=document.getElementById('moreBtn'), moreMenu=document.getElementById('moreMenu');
  if(moreBtn){
    moreBtn.addEventListener('click',function(e){ e.stopPropagation(); moreMenu.classList.toggle('open'); });
    document.addEventListener('click',function(){ moreMenu.classList.remove('open'); });
  }

  // ---- Mobile drawer ----
  var drawer=document.getElementById('drawer');
  function renderDrawerRoot(){
    var body=document.getElementById('drawerBody'); body.innerHTML='';
    CATS.forEach(function(c,idx){
      var b=document.createElement('button');
      b.className='drawer-item';
      b.innerHTML=svg(c.icon,22,'#14194D')+'<span>'+(lang==='ro'?c.ro:c.en)+'</span>'+svg('chevron-right',18,'#C2C6DC').replace('class="ic"','class="ic chev"');
      b.addEventListener('click',function(){ renderDrawerSub(idx); });
      body.appendChild(b);
    });
  }
  function renderDrawerSub(idx){
    var c=CATS[idx], body=document.getElementById('drawerBody');
    var back=document.createElement('button');
    back.className='drawer-back-btn';
    back.innerHTML=svg('chevron-right',18,'#14194D').replace('d="M9 6 L15 12 L9 18"','d="M15 6 L9 12 L15 18"')+'<span>'+(lang==='ro'?'Înapoi':'Back')+'</span>';
    back.addEventListener('click',renderDrawerRoot);
    var html='<div class="drawer-sub-title">'+(lang==='ro'?c.ro:c.en)+'</div>'
      + c.cols.map(function(col){
          return '<div class="drawer-grp"><h4>'+col.h+'</h4>'+col.items.map(function(i){return '<a href="category.html?c='+encodeURIComponent(i)+'">'+i+'</a>';}).join('')+'</div>';
        }).join('');
    body.innerHTML=''; body.appendChild(back); body.insertAdjacentHTML('beforeend',html);
  }
  function openDrawer(){ renderDrawerRoot(); drawer.hidden=false; requestAnimationFrame(function(){drawer.classList.add('open');}); document.body.style.overflow='hidden'; }
  function closeDrawer(){ drawer.classList.remove('open'); document.body.style.overflow=''; setTimeout(function(){drawer.hidden=true;},250); }
  document.getElementById('burger').addEventListener('click',openDrawer);
  document.getElementById('drawerClose').addEventListener('click',closeDrawer);
  document.getElementById('drawerOverlay').addEventListener('click',closeDrawer);

  // lang toggle
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){
      lang=b.getAttribute('data-lang');
      document.querySelectorAll('.lang button').forEach(function(x){x.classList.toggle('on',x===b);});
      applyI18n(); renderRail(); renderHero(); renderGrid(); if(hover!==null) openMega();
      if(!drawer.hidden) renderDrawerRoot();
    });
  });

  document.getElementById('year').textContent=new Date().getFullYear();
  applyI18n(); renderRail(); renderHero(); renderGrid(); restart();

  // redraw when the data from the API arrives
  window.addEventListener('kerven:data',function(){
    if(window.KERVEN_PRODUCTS) PRODUCTS=window.KERVEN_PRODUCTS;
    if(window.KERVEN_CATEGORIES) CATS=window.KERVEN_CATEGORIES;
    renderRail(); renderGrid();
  });
})();
