let products = [
    {id:1,name:'Олимпийская штанга',cat:'силовые',price:0,desc:'Профессиональная олимпийская штанга 20 кг. Стальной гриф, хромированные замки. Выдерживает нагрузку до 700 кг.',specs:[{l:'Вес',v:'20 кг'},{l:'Длина',v:'220 см'},{l:'Покрытие',v:'Хром'},{l:'Гарантия',v:'3 года'}],badge:'Хит'},
    {id:2,name:'Беговая дорожка T-900',cat:'кардио',price:0,desc:'Электрическая складная беговая дорожка. Скорость до 18 км/ч, угол наклона до 12°.',specs:[{l:'Скорость',v:'1–18 км/ч'},{l:'Наклон',v:'0–12°'},{l:'Мощность',v:'2.5 л.с.'},{l:'Нагрузка',v:'до 130 кг'}],badge:'Новинка'},
    {id:3,name:'Комплект гантелей',cat:'веса',price:0,desc:'Разборные гантели 2–32 кг. Стальные пластины с хромированным грифом.',specs:[{l:'Вес',v:'2–32 кг'},{l:'Шаг',v:'2 кг'},{l:'Покрытие',v:'Резина'},{l:'В наборе',v:'16 пар'}]},
    {id:4,name:'Силовая рама Pro X1',cat:'силовые',price:0,desc:'Многофункциональная силовая рама с регулируемыми стойками.',specs:[{l:'Нагрузка',v:'до 500 кг'},{l:'Высота',v:'230 см'},{l:'Материал',v:'Сталь'},{l:'Гарантия',v:'5 лет'}],badge:'Топ'},
    {id:5,name:'Велотренажёр Spin',cat:'кардио',price:0,desc:'Профессиональный велотренажёр с маховиком 20 кг.',specs:[{l:'Маховик',v:'20 кг'},{l:'Привод',v:'Ремень'},{l:'Нагрузка',v:'до 120 кг'},{l:'Дисплей',v:'LCD'}]},
    {id:6,name:'Гиря 24 кг',cat:'веса',price:0,desc:'Профессиональная чугунная гиря с резиновым основанием.',specs:[{l:'Вес',v:'24 кг'},{l:'Материал',v:'Чугун'},{l:'Основание',v:'Резина'},{l:'Хват',v:'Текстура'}]},
    {id:7,name:'Скамья регулируемая',cat:'силовые',price:0,desc:'Регулируемая скамья для жима, 7 положений спинки, ролики для ног.',specs:[{l:'Позиций',v:'7'},{l:'Нагрузка',v:'до 300 кг'},{l:'Обивка',v:'ПВХ'},{l:'Колёса',v:'Есть'}]},
    {id:8,name:'Перчатки атлетические',cat:'аксессуары',price:0,desc:'Профессиональные перчатки для тяжёлой атлетики. Натуральная кожа.',specs:[{l:'Материал',v:'Кожа'},{l:'Размеры',v:'S, M, L, XL'},{l:'Цвет',v:'Чёрный'},{l:'Застёжка',v:'Липучка'}]},
    {id:9,name:'Эллиптический тренажёр',cat:'кардио',price:0,desc:'Эллиптический тренажёр с длиной шага 40 см. 16 уровней сопротивления.',specs:[{l:'Шаг',v:'40 см'},{l:'Уровни',v:'16'},{l:'Bluetooth',v:'Есть'},{l:'Нагрузка',v:'до 150 кг'}]},
];

let cart={}, favorites=new Set(), compareList=[], currentFilter='all', activeProductId=null, lm=false, dbPromos=[];

// PRELOADER
window.addEventListener('load',()=>{
    setTimeout(()=>{document.getElementById('preloader').classList.add('done');},2000);
});

// CURSOR
const cursor=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px';});
(function animR(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animR);})();
document.addEventListener('mouseover',e=>{if(e.target.closest('a,button')){cursor.classList.add('mag');ring.classList.add('mag');}else{cursor.classList.remove('mag');ring.classList.remove('mag');}});

// TRAILS
const trails=[];
for(let i=0;i<8;i++){const t=document.createElement('div');t.className='cursor-trail';t.style.cssText=`width:${6-i*.5}px;height:${6-i*.5}px;background:rgba(200,168,75,${.15-i*.015});`;document.body.appendChild(t);trails.push({el:t,x:0,y:0});}
(function animT(){let px=mx,py=my;trails.forEach(t=>{t.x+=(px-t.x)*.3;t.y+=(py-t.y)*.3;t.el.style.left=t.x+'px';t.el.style.top=t.y+'px';px=t.x;py=t.y;});requestAnimationFrame(animT);})();

// BACK TO TOP
window.addEventListener('scroll',()=>{
    document.getElementById('header').classList.toggle('scrolled',scrollY>60);
    document.getElementById('backTop').classList.toggle('visible',scrollY>400);
});

// PARALLAX
window.addEventListener('mousemove',e=>{const p=document.getElementById('heroParallax');if(p){const x=(e.clientX/innerWidth-.5)*20,y=(e.clientY/innerHeight-.5)*10;p.style.transform=`translate(${x}px,${y}px)`;}}); 

// PARTICLES
const canvas=document.getElementById('heroCanvas');
if(canvas){
    const ctx=canvas.getContext('2d');
    const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;};
    resize();window.addEventListener('resize',resize);
    const pts=Array.from({length:60},()=>{return{x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,s:Math.random()*1.5+.3,a:Math.random()*.4+.05}});
    (function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fillStyle=`rgba(200,168,75,${p.a})`;ctx.fill();});requestAnimationFrame(draw);})();
}

// THEME
window.toggleTheme = function(){lm=!lm;document.body.classList.toggle('lm',lm);document.getElementById('themeBtn').textContent=lm?'🌑':'🌙';}

// TIMER
function updateTimer(){const end=new Date();end.setHours(23,59,59,0);const d=end-new Date(),h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);document.getElementById('tH').textContent=String(h).padStart(2,'0');document.getElementById('tM').textContent=String(m).padStart(2,'0');document.getElementById('tS').textContent=String(s).padStart(2,'0');}
updateTimer();setInterval(updateTimer,1000);

// MOBILE MENU
window.toggleMobileMenu = function(){document.getElementById('mobileMenu').classList.toggle('open');document.getElementById('burger').classList.toggle('open');}
window.closeMobileMenu = function(){document.getElementById('mobileMenu').classList.remove('open');document.getElementById('burger').classList.remove('open');}

// SCROLL REVEAL
const revObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');},{threshold:.1}));
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

// SKELETON → PRODUCTS
function showSkeletons(){
    const grid=document.getElementById('productsGrid');
    grid.innerHTML=Array.from({length:6}).map(()=>`
        <div class="skeleton-card">
            <div class="skel skel-img"></div>
            <div style="padding:16px 20px;border-top:1px solid var(--border);">
                <div class="skel skel-line" style="width:80%;margin-left:0;"></div>
                <div class="skel skel-line short" style="margin-left:0;margin-top:6px;"></div>
            </div>
        </div>`).join('');
}

function renderProducts(list){
    const grid=document.getElementById('productsGrid');
    if(!list.length){grid.innerHTML='<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;grid-column:1/-1;">Ничего не найдено</div>';return;}
    grid.innerHTML=list.map(p=>`
        <div class="product-card">
            <div class="product-img-wrap">
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                ${p.badge?`<div class="product-badge">${p.badge}</div>`:''}
                <button class="fav-btn ${favorites.has(p.id)?'active':''}" onclick="toggleFav(${p.id},event)">${favorites.has(p.id)?'♥':'♡'}</button>
                <div class="product-overlay">
                    <button class="overlay-btn" onclick="openProductPage(${p.id})">${t('more')}</button>
                    <button class="overlay-btn" style="background:transparent;border:1px solid rgba(255,255,255,.5);color:#fff;" onclick="addToCompare(${p.id},event)">${t('compare')}</button>
                </div>
            </div>
            <div class="product-info">
                <div>
                  <div class="product-name">${p.name}</div>
                  <div class="product-cat">${p.cat}</div>
                  <div style="margin-top:6px;">${getAvailBadge(p.id)}</div>
                </div>
                <div class="product-price">${p.price ? "$"+p.price : "0$"}</div>
            </div>
            <div class="product-actions">
                <button class="action-btn-buy" onclick="buyNow(${p.id})">${t('buy')}</button>
                <button class="action-btn-cart" onclick="addToCart(${p.id})">${t('add_cart')}</button>
            </div>
        </div>`).join('');
}

function getFiltered(){const q=document.getElementById('searchInput')?document.getElementById('searchInput').value.toLowerCase():'';return products.filter(p=>(currentFilter==='all'||p.cat===currentFilter)&&(!q||p.name.toLowerCase().includes(q)));}
window.filterBy = function(cat,btn){currentFilter=cat;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');showSkeletons();setTimeout(()=>renderProducts(getFiltered()),600);}
window.searchProducts = function(){showSkeletons();setTimeout(()=>renderProducts(getFiltered()),400);}

showSkeletons(); // Firebase will load products

// HASH ROUTING — PRODUCT PAGE
window.openProductPage = function(id){
    const p=products.find(x=>x.id===id);if(!p)return;
    activeProductId=id;
    document.getElementById('ppCat').textContent=p.cat;
    document.getElementById('ppName').textContent=p.name;
    document.getElementById('ppDesc').textContent=p.desc;
    document.getElementById('ppPrice').textContent=p.price?'$'+p.price:'0$';
    document.getElementById('ppSpecs').innerHTML=p.specs.map(s=>`<div class="spec-item"><div class="spec-label">${s.l}</div><div class="spec-value">${s.v}</div></div>`).join('');
    // availability + recs
    const ppExtra=document.getElementById('ppExtra');
    if(ppExtra){ppExtra.innerHTML=`<div style="margin-bottom:16px;">${getAvailBadge(p.id)}</div>`+renderRecommendations(p.id);}
    hideAllPages();
    document.getElementById('productPage').style.display='block';
    window.location.hash='product-'+id;
    window.scrollTo({top:0,behavior:'smooth'});
}
window.showCatalog = function(){
    hideAllPages();
    document.getElementById('catalogPage').style.display='block';
    window.location.hash='catalog';
    window.scrollTo({top:0,behavior:'smooth'});
    showSkeletons();
    setTimeout(()=>renderProducts(getFiltered()),800);
}
window.showMain = function(){
    hideAllPages();
    document.getElementById('mainPage').style.display='block';
    history.pushState('',document.title,window.location.pathname);
    window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('hashchange',()=>{
    const hash=location.hash;
    if(hash.startsWith('#product-')){const id=parseInt(hash.replace('#product-',''));openProductPage(id);}
    else if(hash==='#compare')showComparePage();
    else if(hash==='#catalog')showCatalog();
    else if(hash==='#favorites')showFavPage();
    else if(hash==='#history')showHistoryPage();
    else showMain();
});
window.ppBuy = function(){if(activeProductId){addToCart(activeProductId);openOrderForm();}}
window.ppCart = function(){if(activeProductId){addToCart(activeProductId);showToast('Добавлено в корзину');}}

// COMPARE
window.addToCompare = function(id,e){
    e&&e.stopPropagation();
    if(compareList.includes(id)){showToast('Уже в сравнении');return;}
    if(compareList.length>=2){showToast('Можно сравнить только 2 товара');return;}
    compareList.push(id);
    updateCompareBar();
    showToast('Добавлено в сравнение');
}
function updateCompareBar(){
    const bar=document.getElementById('compareBar');
    bar.classList.toggle('visible',compareList.length>0);
    [0,1].forEach(i=>{
        const slot=document.getElementById('cSlot'+(i+1));
        if(compareList[i]){const p=products.find(x=>x.id===compareList[i]);slot.className='compare-slot filled';slot.innerHTML=`<button class="remove-slot" onclick="removeFromCompare(${compareList[i]})">×</button>${p.name}`;}
        else{slot.className='compare-slot';slot.innerHTML='Товар '+(i+1);}
    });
}
window.removeFromCompare = function(id){compareList=compareList.filter(x=>x!==id);updateCompareBar();}
window.clearCompare = function(){compareList=[];updateCompareBar();}
window.showComparePage = function(){
    if(compareList.length<2){showToast('Добавьте 2 товара для сравнения');return;}
    const [a,b]=compareList.map(id=>products.find(x=>x.id===id));
    const rows=[['Категория',a.cat,b.cat],...a.specs.map((s,i)=>[s.l,s.v,b.specs[i]?b.specs[i].v:'—'])];
    document.getElementById('compareTableWrap').innerHTML=`
        <table class="compare-table">
            <thead><tr><th></th><th>${a.name}</th><th>${b.name}</th></tr></thead>
            <tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
        </table>`;
    hideAllPages();
    document.getElementById('comparePage').style.display='block';
    window.location.hash='compare';
    window.scrollTo({top:0,behavior:'smooth'});
}

// FAV
window.toggleFav = function(id,e){e.stopPropagation();if(favorites.has(id))favorites.delete(id);else favorites.add(id);renderProducts(getFiltered());showToast(favorites.has(id)?'Добавлено в избранное':'Убрано из избранного');}

// CART
window.buyNow = function(id){addToCart(id);openOrderForm();}
window.addToCart = function(id){
    const p=products.find(x=>x.id===id);if(!p)return;
    if(cart[id])cart[id].qty++;else cart[id]={product:p,qty:1};
    updateCartUI();popBadge();playClick();showToast(p.name+' '+t('added'));
}
window.changeQty = function(id,delta){if(!cart[id])return;cart[id].qty+=delta;if(cart[id].qty<=0)delete cart[id];updateCartUI();}
function updateCartUI(){
    const items=Object.values(cart),count=items.reduce((s,i)=>s+i.qty,0);
    const badge=document.getElementById('cartBadge');badge.textContent=count;badge.classList.toggle('visible',count>0);
    const listEl=document.getElementById('cartItemsList'),footEl=document.getElementById('cartFoot');
    if(!items.length){listEl.innerHTML='<div class="cart-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>Корзина пуста</div>';footEl.style.display='none';}
    else{
        listEl.innerHTML=items.map(i=>`<div class="cart-item"><div class="cart-item-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div><div class="cart-item-details"><div class="cart-item-name">${i.product.name}</div><div class="cart-item-price">0$ × ${i.qty}</div><div class="qty-controls"><button class="qty-btn" onclick="changeQty(${i.product.id},-1)">−</button><span class="qty-num">${i.qty}</span><button class="qty-btn" onclick="changeQty(${i.product.id},1)">+</button></div></div><button class="remove-btn" onclick="changeQty(${i.product.id},-999)">×</button></div>`).join('');
        footEl.style.display='block';
        document.getElementById('cartTotalSum').textContent='0$';
    }
}
window.toggleCart = function(){document.getElementById('cartPanel').classList.toggle('open');}

// ORDER
window.openOrderForm = function(){document.getElementById('orderFormBackdrop').classList.add('open');}
window.closeOrderForm = function(e){if(e&&e.target!==document.getElementById('orderFormBackdrop'))return;document.getElementById('orderFormBackdrop').classList.remove('open');}
window.applyPromo = function(){
    const val=document.getElementById('promoInput').value.trim().toUpperCase();
    const ok=document.getElementById('promoOk');
    // Check Firebase promos first
    const fbPromo = dbPromos.find(p => p.code === val && (p.active==='true'||p.active===true));
    if(fbPromo){
        ok.textContent = '✓ Промокод применён — скидка '+fbPromo.discount+'%';
        ok.classList.add('show');
        showToast('Промокод применён! Скидка '+fbPromo.discount+'%');
    } else if(val==='MITHRIL20'||val==='SPORT'||val==='BANZAI'){
        ok.classList.add('show');
        showToast('Промокод применён!');
    } else {
        ok.classList.remove('show');
        showToast('Неверный промокод');
    }
}
window.submitOrder = function(){
    // Collect form data
    const inputs = document.querySelectorAll('.order-form .form-input');
    const firstName = inputs[0]?inputs[0].value.trim():'';
    const lastName = inputs[1]?inputs[1].value.trim():'';
    const phoneCode = document.getElementById('phoneCode')?document.getElementById('phoneCode').value:'';
    const phone = inputs[2]?inputs[2].value.trim():'';
    const email = inputs[3]?inputs[3].value.trim():'';
    const city = inputs[4]?inputs[4].value.trim():'';
    const street = inputs[5]?inputs[5].value.trim():'';
    const house = inputs[6]?inputs[6].value.trim():'';
    const apt = inputs[7]?inputs[7].value.trim():'';
    const index = inputs[8]?inputs[8].value.trim():'';
    const promo = document.getElementById('promoInput')?document.getElementById('promoInput').value.trim():'';

    const items = Object.values(cart).map(i=>i.product.name+' × '+i.qty);

    const orderData = {
        fio: firstName+' '+lastName,
        phone: phoneCode+' '+phone,
        email: email,
        address: city+', '+street+', д.'+house+(apt?', кв.'+apt:'')+(index?', '+index:''),
        items: items,
        promo: promo||'—',
        total: '0$'
    };

    // Save to history
    saveOrder();

    // Always send via bot API directly to group
    {
        const TOKEN = '8677453235:AAHbcKqlQyRZkTMhoKZsBsRBrww1v8Xek9k';
        const CHAT_ID = '-1003538222198';
        const text = [
            '📦 НОВЫЙ ЗАКАЗ',
            '',
            '👤 Клиент: '+orderData.fio,
            '📞 Телефон: '+orderData.phone,
            '📧 Email: '+orderData.email,
            '📍 Адрес: '+orderData.address,
            '',
            '🛒 Товары:',
            ...orderData.items.map(i=>'• '+i),
            '',
            '🎟 Промокод: '+orderData.promo,
            '💰 Итого: '+orderData.total,
            '🕐 '+new Date().toLocaleString('ru-RU')
        ].join('\n');

        fetch('https://api.telegram.org/bot'+TOKEN+'/sendMessage',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({chat_id:CHAT_ID,text:text})
        }).then(r=>r.json()).then(d=>{
            if(!d.ok)console.error('TG error:',d);
        }).catch(e=>console.error('TG fetch error:',e));
    }


    cart={};
    updateCartUI();
    document.getElementById('orderFormBackdrop').classList.remove('open');
    document.getElementById('cartPanel').classList.remove('open');
    showToast(t('order_done'));
}

// DELIVERY CALC
window.calcDelivery = function(){
    const city=document.getElementById('dCity').value,weight=parseFloat(document.getElementById('dWeight').value)||0,type=document.getElementById('dType').value;
    if(!city){showToast('Выберите город');return;}
    if(!weight){showToast('Укажите вес заказа');return;}
    const base={moscow:0,spb:0,ekb:0,nsk:0,kzn:0,almaty:0,other:0};
    const mult={standard:1,express:1.8,pickup:0};
    let price=0,days='';
    if(type==='pickup'){days='Самовывоз — бесплатно';}
    else{days=type==='express'?'1–2 рабочих дня':'3–5 рабочих дней';}
    const res=document.getElementById('deliveryResult');
    res.classList.add('show');
    document.getElementById('dResultPrice').textContent=type==='pickup'?'Бесплатно':'0$';
    document.getElementById('dResultInfo').textContent=days+(weight>50?' · Крупногабаритный груз — требуется согласование':'');
}

// SOUND
function playClick(){try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=800;g.gain.value=.1;o.start();g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.1);o.stop(ac.currentTime+.1);}catch(e){}}

// TOAST
window.showToast = function(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}

// ── LANGUAGE ──
const LANGS={
ru:{
  nav_home:'Главная',nav_catalog:'Каталог',nav_about:'О нас',nav_contacts:'Контакты',
  cart_title:'Корзина',cart_empty:'Корзина пуста',checkout:'Оформить заказ',
  buy:'Купить',add_cart:'В корзину',more:'Подробнее',compare:'Сравнить',
  avail_in:'В наличии',avail_order:'Под заказ',avail_out:'Нет в наличии',
  fav_title:'Избранные товары',fav_label:'Избранное',fav_empty:'Нет избранных товаров',
  hist_title:'История заказов',hist_label:'История',hist_empty:'Заказов пока нет',
  recs_title:'С этим товаром берут',
  chat_head:'Есть вопросы?',chat_placeholder:'Введите сообщение...',
  cookie:'Мы используем файлы cookie для улучшения работы сайта. Продолжая использование сайта, вы соглашаетесь с нашей политикой конфиденциальности.',
  cookie_accept:'Принять',cookie_decline:'Отклонить',
  promo_ok:'✓ Промокод применён — скидка 20%',promo_bad:'Неверный промокод',
  order_done:'Заказ оформлен! Мы свяжемся с вами',added:'— добавлено в корзину',
  back_catalog:'← Назад в каталог',back_home:'← На главную',
  calc_btn:'Рассчитать доставку',delivery_free:'Бесплатно',delivery_self:'Самовывоз — бесплатно',
},
en:{
  nav_home:'Home',nav_catalog:'Catalog',nav_about:'About',nav_contacts:'Contacts',
  cart_title:'Cart',cart_empty:'Cart is empty',checkout:'Checkout',
  buy:'Buy',add_cart:'Add to Cart',more:'Details',compare:'Compare',
  avail_in:'In Stock',avail_order:'Pre-order',avail_out:'Out of Stock',
  fav_title:'Wishlist',fav_label:'Wishlist',fav_empty:'No saved items',
  hist_title:'Order History',hist_label:'History',hist_empty:'No orders yet',
  recs_title:'Customers also buy',
  chat_head:'Any questions?',chat_placeholder:'Type a message...',
  cookie:'We use cookies to improve your experience. By continuing to use this site, you agree to our privacy policy.',
  cookie_accept:'Accept',cookie_decline:'Decline',
  promo_ok:'✓ Promo applied — 20% off',promo_bad:'Invalid promo code',
  order_done:'Order placed! We will contact you soon',added:'— added to cart',
  back_catalog:'← Back to catalog',back_home:'← Home',
  calc_btn:'Calculate delivery',delivery_free:'Free',delivery_self:'Pickup — free',
},
kz:{
  nav_home:'Басты бет',nav_catalog:'Каталог',nav_about:'Біз туралы',nav_contacts:'Байланыс',
  cart_title:'Себет',cart_empty:'Себет бос',checkout:'Тапсырыс беру',
  buy:'Сатып алу',add_cart:'Себетке',more:'Толығырақ',compare:'Салыстыру',
  avail_in:'Қолда бар',avail_order:'Тапсырыс бойынша',avail_out:'Жоқ',
  fav_title:'Таңдаулы тауарлар',fav_label:'Таңдаулы',fav_empty:'Таңдаулы тауар жоқ',
  hist_title:'Тапсырыс тарихы',hist_label:'Тарих',hist_empty:'Тапсырыстар жоқ',
  recs_title:'Бұл тауармен бірге алады',
  chat_head:'Сұрақтарыңыз бар ма?',chat_placeholder:'Хабарлама жазыңыз...',
  cookie:'Сайтты жақсарту үшін cookie файлдарын қолданамыз. Сайтты пайдалана отырып, сіз біздің құпиялылық саясатымызға келісесіз.',
  cookie_accept:'Қабылдау',cookie_decline:'Бас тарту',
  promo_ok:'✓ Промокод қолданылды — 20% жеңілдік',promo_bad:'Промокод қате',
  order_done:'Тапсырыс қабылданды! Жақын арада хабарласамыз',added:'— себетке қосылды',
  back_catalog:'← Каталогқа оралу',back_home:'← Басты бетке',
  calc_btn:'Жеткізуді есептеу',delivery_free:'Тегін',delivery_self:'Өзі алу — тегін',
}};
let currentLang='ru';
function t(key){return LANGS[currentLang][key]||LANGS.ru[key]||key;}
window.setLang = function(lang){
  currentLang=lang;
  document.getElementById('langBtn').textContent='🌐 '+lang.toUpperCase();
  document.querySelectorAll('.lang-option').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().includes(lang)));
  document.getElementById('langDropdown').classList.remove('open');
  applyLang();
}
function applyLang(){
  // nav
  const navLinks=document.querySelectorAll('.nav-links a');
  if(navLinks[0])navLinks[0].textContent=t('nav_home');
  if(navLinks[1])navLinks[1].textContent=t('nav_catalog');
  if(navLinks[2])navLinks[2].textContent=t('nav_about');
  if(navLinks[3])navLinks[3].textContent=t('nav_contacts');
  // cart
  document.querySelector('.cart-title') && (document.querySelector('.cart-title').textContent=t('cart_title'));
  document.querySelector('.checkout-btn') && (document.querySelector('.checkout-btn').textContent=t('checkout'));
  // chat
  const ch=document.getElementById('chatHead');if(ch)ch.textContent=t('chat_head');
  const ci=document.getElementById('chatInput');if(ci)ci.placeholder=t('chat_placeholder');
  // cookie
  const ct=document.getElementById('cookieText');if(ct)ct.textContent=t('cookie');
  const ca=document.getElementById('cookieAcceptBtn');if(ca)ca.textContent=t('cookie_accept');
  const cd=document.getElementById('cookieDeclineBtn');if(cd)cd.textContent=t('cookie_decline');
  // fav/hist labels
  const fl=document.getElementById('favLabel');if(fl)fl.textContent=t('fav_label');
  const ft=document.getElementById('favTitle');if(ft)ft.textContent=t('fav_title');
  const hl=document.getElementById('histLabel');if(hl)hl.textContent=t('hist_label');
  const ht=document.getElementById('histTitle');if(ht)ht.textContent=t('hist_title');
  // re-render if visible
  renderProducts(getFiltered());
}
window.toggleLangMenu = function(){document.getElementById('langDropdown').classList.toggle('open');}
document.addEventListener('click',e=>{if(!e.target.closest('#langBtn')&&!e.target.closest('#langDropdown'))document.getElementById('langDropdown').classList.remove('open');});

// ── PROGRESS BAR ──
window.addEventListener('scroll',()=>{
  const el=document.getElementById('scrollProgress');
  const pct=(scrollY/(document.body.scrollHeight-innerHeight))*100;
  if(el)el.style.width=pct+'%';
});

// ── COOKIE ──
function checkCookie(){if(!localStorage.getItem('cookie_accepted'))setTimeout(()=>{const b=document.getElementById('cookieBanner');if(b)b.classList.add('show');},2000);}
window.acceptCookie = function(){localStorage.setItem('cookie_accepted','1');hideCookieBanner();}
window.declineCookie = function(){hideCookieBanner();}
function hideCookieBanner(){const b=document.getElementById('cookieBanner');if(b)b.classList.remove('show');}
checkCookie();

// ── CHAT ──
window.toggleChat = function(){document.getElementById('chatPanel').classList.toggle('open');}
window.sendChat = function(){
  const inp=document.getElementById('chatInput');
  const msg=inp.value.trim();if(!msg)return;
  const body=document.getElementById('chatBody');
  body.innerHTML+=`<div class="chat-msg" style="background:var(--gold);color:#0e0e10;margin-left:20px;">${msg}</div>`;
  inp.value='';
  setTimeout(()=>{body.innerHTML+=`<div class="chat-msg">Спасибо за сообщение! Мы свяжемся с вами в ближайшее время 🙏</div>`;body.scrollTop=body.scrollHeight;},1000);
  body.scrollTop=body.scrollHeight;
}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.activeElement===document.getElementById('chatInput'))sendChat();});

// ── CART BADGE ANIMATION ──
function popBadge(){const b=document.getElementById('cartBadge');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}

// ── FAVORITES PAGE ──
window.showFavPage = function(){
  hideAllPages();
  document.getElementById('favPage').style.display='block';
  window.location.hash='favorites';
  window.scrollTo({top:0,behavior:'smooth'});
  renderFavPage();
}
window.renderFavPage = function(){
  const grid=document.getElementById('favGrid');
  const favProds=products.filter(p=>favorites.has(p.id));
  if(!favProds.length){grid.innerHTML=`<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;grid-column:1/-1;">${t('fav_empty')}</div>`;return;}
  grid.innerHTML=favProds.map(p=>`
    <div class="product-card">
      <div class="product-img-wrap">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        ${p.badge?`<div class="product-badge">${p.badge}</div>`:''}
        <button class="fav-btn active" onclick="toggleFav(${p.id},event)">♥</button>
        <div class="product-overlay">
          <button class="overlay-btn" onclick="openProductPage(${p.id})">${t('more')}</button>
        </div>
      </div>
      <div class="product-info">
        <div><div class="product-name">${p.name}</div><div class="product-cat">${p.cat}</div></div>
        <div class="product-price">${p.price ? "$"+p.price : "0$"}</div>
      </div>
      <div class="product-actions">
        <button class="action-btn-buy" onclick="buyNow(${p.id})">${t('buy')}</button>
        <button class="action-btn-cart" onclick="addToCart(${p.id})">${t('add_cart')}</button>
      </div>
    </div>`).join('');
}

// ── ORDER HISTORY ──
window.showHistoryPage = function(){
  hideAllPages();
  document.getElementById('historyPage').style.display='block';
  window.location.hash='history';
  window.scrollTo({top:0,behavior:'smooth'});
  renderHistory();
}
window.renderHistory = function(){
  const list=document.getElementById('historyList');
  const orders=JSON.parse(localStorage.getItem('mithril_orders')||'[]');
  if(!orders.length){list.innerHTML=`<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;">${t('hist_empty')}</div>`;return;}
  list.innerHTML=orders.reverse().map(o=>`
    <div class="order-card">
      <div class="order-card-head">
        <div><div class="order-id">#${o.id}</div><div class="order-date">${o.date}</div></div>
        <div class="order-status">✓ Оформлен</div>
      </div>
      <div class="order-items-list">
        ${o.items.map(i=>`<div class="order-item-row"><span>${i.name} × ${i.qty}</span><span>0$</span></div>`).join('')}
      </div>
      <div class="order-total"><span>Итого</span><span>0$</span></div>
    </div>`).join('');
}
function saveOrder(){
  const orders=JSON.parse(localStorage.getItem('mithril_orders')||'[]');
  const items=Object.values(cart).map(i=>({name:i.product.name,qty:i.qty}));
  if(!items.length)return;
  orders.push({id:Date.now().toString().slice(-6),date:new Date().toLocaleDateString('ru-RU'),items});
  localStorage.setItem('mithril_orders',JSON.stringify(orders));
}

// ── AVAILABILITY ──
const avail={1:'in',2:'in',3:'in',4:'order',5:'in',6:'in',7:'out',8:'in',9:'order'};

// ── FIREBASE ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCp9uHtABLNIM-4EDaqfqCwOMs1poQJumU",
    authDomain: "mithril-shop-b2b0b.firebaseapp.com",
    projectId: "mithril-shop-b2b0b",
    storageBucket: "mithril-shop-b2b0b.firebasestorage.app",
    messagingSenderId: "182146848633",
    appId: "1:182146848633:web:28ae1250a08ccd053c81a8"
};
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);




function getAvailBadge(id){
  const a=avail[id]||'in';
  if(a==='in')return `<span class="avail-badge avail-in">● ${t('avail_in')}</span>`;
  if(a==='order')return `<span class="avail-badge avail-order">● ${t('avail_order')}</span>`;
  return `<span class="avail-badge avail-out">● ${t('avail_out')}</span>`;
}

// ── RECOMMENDATIONS ──
function getRecommendations(id){
  const p=products.find(x=>x.id===id);if(!p)return[];
  return products.filter(x=>x.id!==id&&(x.cat===p.cat||Math.abs(x.id-p.id)<3)).slice(0,3);
}
function renderRecommendations(id){
  const recs=getRecommendations(id);if(!recs.length)return'';
  return`<div class="recs-section">
    <div class="section-label" style="margin-bottom:12px;">${t('recs_title')}</div>
    <div class="recs-grid">${recs.map(p=>`
      <div class="rec-card" onclick="openProductPage(${p.id})">
        <div class="rec-name">${p.name}</div>
        <div class="rec-cat">${p.cat}</div>
        ${getAvailBadge(p.id)}
        <button class="rec-btn" style="margin-top:10px;" onclick="addToCart(${p.id});event.stopPropagation()">${t('add_cart')}</button>
      </div>`).join('')}
    </div>
  </div>`;
}

// ── PAGE ROUTING (override) ──
window.hideAllPages = function(){
  ['mainPage','catalogPage','productPage','comparePage','favPage','historyPage'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.style.display='none';
  });
}

// ── FIREBASE LOAD ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const _fbConfig = {
    apiKey: "AIzaSyCp9uHtABLNIM-4EDaqfqCwOMs1poQJumU",
    authDomain: "mithril-shop-b2b0b.firebaseapp.com",
    projectId: "mithril-shop-b2b0b",
    storageBucket: "mithril-shop-b2b0b.firebasestorage.app",
    messagingSenderId: "182146848633",
    appId: "1:182146848633:web:28ae1250a08ccd053c81a8"
};
const _fbApp = initializeApp(_fbConfig);
const _db = getFirestore(_fbApp);

async function loadFromFirebase() {
    try {
        const prodSnap = await getDocs(collection(_db, 'products'));
        if(!prodSnap.empty) {
            products = prodSnap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    name: data.name || '',
                    cat: data.cat || 'силовые',
                    price: data.price || '0',
                    desc: data.desc || '',
                    specs: data.specs || [],
                    badge: data.badge || null,
                    avail: data.avail || 'in'
                };
            });
            products.forEach(p => { avail[p.id] = p.avail || 'in'; });
        }
        const promoSnap = await getDocs(collection(_db, 'promos'));
        if(!promoSnap.empty) {
            dbPromos = promoSnap.docs.map(d => ({id: d.id, ...d.data()}));
        }
        showSkeletons();
        setTimeout(() => renderProducts(getFiltered()), 400);
    } catch(e) {
        console.log('Firebase error:', e);
        showSkeletons();
        setTimeout(() => renderProducts(products), 400);
    }
}

// Start loading
loadFromFirebase();
