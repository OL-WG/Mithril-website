// ═══════════════════════════════════════════
// MITHRIL SPORT — script.js
// ═══════════════════════════════════════════

// ── PRODUCTS DATA (fallback) ──
let products = [
    {id:'1',name:'Олимпийская штанга',cat:'силовые',price:'0',desc:'Профессиональная олимпийская штанга 20 кг.',specs:[{l:'Вес',v:'20 кг'},{l:'Длина',v:'220 см'},{l:'Покрытие',v:'Хром'},{l:'Гарантия',v:'3 года'}],badge:'Хит',avail:'in'},
    {id:'2',name:'Беговая дорожка T-900',cat:'кардио',price:'0',desc:'Электрическая складная беговая дорожка.',specs:[{l:'Скорость',v:'1–18 км/ч'},{l:'Наклон',v:'0–12°'},{l:'Мощность',v:'2.5 л.с.'},{l:'Нагрузка',v:'до 130 кг'}],badge:'Новинка',avail:'in'},
    {id:'3',name:'Комплект гантелей',cat:'веса',price:'0',desc:'Разборные гантели 2–32 кг.',specs:[{l:'Вес',v:'2–32 кг'},{l:'Шаг',v:'2 кг'},{l:'Покрытие',v:'Резина'},{l:'В наборе',v:'16 пар'}],badge:null,avail:'in'},
    {id:'4',name:'Силовая рама Pro X1',cat:'силовые',price:'0',desc:'Многофункциональная силовая рама.',specs:[{l:'Нагрузка',v:'до 500 кг'},{l:'Высота',v:'230 см'},{l:'Материал',v:'Сталь'},{l:'Гарантия',v:'5 лет'}],badge:'Топ',avail:'order'},
    {id:'5',name:'Велотренажёр Spin',cat:'кардио',price:'0',desc:'Профессиональный велотренажёр.',specs:[{l:'Маховик',v:'20 кг'},{l:'Привод',v:'Ремень'},{l:'Нагрузка',v:'до 120 кг'},{l:'Дисплей',v:'LCD'}],badge:null,avail:'in'},
    {id:'6',name:'Гиря 24 кг',cat:'веса',price:'0',desc:'Профессиональная чугунная гиря.',specs:[{l:'Вес',v:'24 кг'},{l:'Материал',v:'Чугун'},{l:'Основание',v:'Резина'},{l:'Хват',v:'Текстура'}],badge:null,avail:'in'},
    {id:'7',name:'Скамья регулируемая',cat:'силовые',price:'0',desc:'Регулируемая скамья для жима.',specs:[{l:'Позиций',v:'7'},{l:'Нагрузка',v:'до 300 кг'},{l:'Обивка',v:'ПВХ'},{l:'Колёса',v:'Есть'}],badge:null,avail:'out'},
    {id:'8',name:'Перчатки атлетические',cat:'аксессуары',price:'0',desc:'Профессиональные перчатки для тяжёлой атлетики.',specs:[{l:'Материал',v:'Кожа'},{l:'Размеры',v:'S, M, L, XL'},{l:'Цвет',v:'Чёрный'},{l:'Застёжка',v:'Липучка'}],badge:null,avail:'in'},
    {id:'9',name:'Эллиптический тренажёр',cat:'кардио',price:'0',desc:'Эллиптический тренажёр с длиной шага 40 см.',specs:[{l:'Шаг',v:'40 см'},{l:'Уровни',v:'16'},{l:'Bluetooth',v:'Есть'},{l:'Нагрузка',v:'до 150 кг'}],badge:null,avail:'order'},
];

// ── STATE ──
let cart = {};
let favorites = new Set(JSON.parse(localStorage.getItem('mithril_favorites') || '[]'));
let compareList = [];
let currentFilter = 'all';
let activeProductId = null;
let lm = false;
let dbPromos = [];

// ── PRELOADER ──
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('done'), 2000);
});

// ── SCROLL ──
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', scrollY > 60);
    document.getElementById('backTop').classList.toggle('visible', scrollY > 400);
    const el = document.getElementById('scrollProgress');
    if (el) el.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
});

// ── PARALLAX ──
window.addEventListener('mousemove', e => {
    const p = document.getElementById('heroParallax');
    if (p) {
        const x = (e.clientX / innerWidth - .5) * 20;
        const y = (e.clientY / innerHeight - .5) * 10;
        p.style.transform = `translate(${x}px,${y}px)`;
    }
});

// ── PARTICLES ──
const canvas = document.getElementById('heroCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({length: 60}, () => ({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        s: Math.random() * 1.5 + .3, a: Math.random() * .4 + .05
    }));
    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,168,75,${p.a})`; ctx.fill();
        });
        requestAnimationFrame(draw);
    })();
}

// ── TIMER ──
function updateTimer() {
    const end = new Date(); end.setHours(23, 59, 59, 0);
    const d = end - new Date();
    const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
    document.getElementById('tH').textContent = String(h).padStart(2, '0');
    document.getElementById('tM').textContent = String(m).padStart(2, '0');
    document.getElementById('tS').textContent = String(s).padStart(2, '0');
}
updateTimer(); setInterval(updateTimer, 1000);

// ── THEME ──
function toggleTheme() {
    lm = !lm;
    document.body.classList.toggle('lm', lm);
    document.getElementById('themeBtn').textContent = lm ? '🌑' : '🌙';
}

// ── LANG ──
const LANGS = {
    ru: { buy: 'Купить', add_cart: 'В корзину', more: 'Подробнее', compare: 'Сравнить', avail_in: 'В наличии', avail_order: 'Под заказ', avail_out: 'Нет в наличии', cart_empty: 'Корзина пуста', checkout: 'Оформить заказ', order_done: 'Заказ оформлен! Мы свяжемся с вами', added: '— добавлено в корзину', fav_empty: 'Нет избранных товаров', hist_empty: 'Заказов пока нет', recs: 'С этим товаром берут', promo_ok: '✓ Промокод применён', promo_bad: 'Неверный промокод' },
    en: { buy: 'Buy', add_cart: 'Add to Cart', more: 'Details', compare: 'Compare', avail_in: 'In Stock', avail_order: 'Pre-order', avail_out: 'Out of Stock', cart_empty: 'Cart is empty', checkout: 'Checkout', order_done: 'Order placed!', added: '— added to cart', fav_empty: 'No saved items', hist_empty: 'No orders yet', recs: 'Customers also buy', promo_ok: '✓ Promo applied', promo_bad: 'Invalid promo code' },
    kz: { buy: 'Сатып алу', add_cart: 'Себетке', more: 'Толығырақ', compare: 'Салыстыру', avail_in: 'Қолда бар', avail_order: 'Тапсырыс', avail_out: 'Жоқ', cart_empty: 'Себет бос', checkout: 'Тапсырыс беру', order_done: 'Тапсырыс қабылданды!', added: '— қосылды', fav_empty: 'Таңдаулы жоқ', hist_empty: 'Тапсырыстар жоқ', recs: 'Бірге алады', promo_ok: '✓ Промокод қолданылды', promo_bad: 'Промокод қате' }
};
let currentLang = 'ru';
function t(key) { return LANGS[currentLang][key] || LANGS.ru[key] || key; }
function setLang(lang) {
    currentLang = lang;
    document.getElementById('langBtn').textContent = '🌐 ' + lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(lang)));
    document.getElementById('langDropdown').classList.remove('open');
    renderProducts(getFiltered());
}
function toggleLangMenu() { document.getElementById('langDropdown').classList.toggle('open'); }
document.addEventListener('click', e => { if (!e.target.closest('#langBtn') && !e.target.closest('#langDropdown')) document.getElementById('langDropdown').classList.remove('open'); });

// ── MOBILE MENU ──
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
    document.getElementById('burger').classList.toggle('open');
}
function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('burger').classList.remove('open');
}

// ── SCROLL REVEAL ──
const revObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ── AVAIL BADGE ──
function getAvailBadge(avail) {
    if (avail === 'in') return `<span class="avail-badge avail-in">● ${t('avail_in')}</span>`;
    if (avail === 'order') return `<span class="avail-badge avail-order">● ${t('avail_order')}</span>`;
    return `<span class="avail-badge avail-out">● ${t('avail_out')}</span>`;
}

// ── SKELETON ──
function showSkeletons() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = Array.from({length: 6}).map(() => `
        <div class="skeleton-card">
            <div class="skel skel-img"></div>
            <div style="padding:16px 20px;border-top:1px solid var(--border);">
                <div class="skel skel-line" style="width:80%;margin-left:0;"></div>
                <div class="skel skel-line short" style="margin-left:0;margin-top:6px;"></div>
            </div>
        </div>`).join('');
}

// ── RENDER PRODUCTS ──
function renderProducts(list) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (!list.length) {
        grid.innerHTML = '<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;grid-column:1/-1;">Ничего не найдено</div>';
        return;
    }
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <div class="product-img-wrap">
                ${p.img
                    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(20%);transition:filter .5s;" onmouseover="this.style.filter='grayscale(0%)'" onmouseout="this.style.filter='grayscale(20%)'">` 
                    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
                }
                ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                <button class="fav-btn ${favorites.has(p.id) ? 'active' : ''}" onclick="toggleFav('${p.id}',event)">${favorites.has(p.id) ? '♥' : '♡'}</button>
                <div class="product-overlay">
                    <button class="overlay-btn" onclick="openProductPage('${p.id}')">${t('more')}</button>
                    <button class="overlay-btn ghost" onclick="addToCompare('${p.id}',event)">${t('compare')}</button>
                </div>
            </div>
            <div class="product-info">
                <div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-cat">${p.cat}</div>
                    <div style="margin-top:6px;">${getAvailBadge(p.avail)}</div>
                </div>
                <div class="product-price">${p.price && p.price !== '0' ? '$' + p.price : '0$'}</div>
            </div>
            <div class="product-actions">
                <button class="action-btn-buy" onclick="buyNow('${p.id}')">${t('buy')}</button>
                <button class="action-btn-cart" onclick="addToCart('${p.id}')">${t('add_cart')}</button>
            </div>
        </div>`).join('');
}

function getFiltered() {
    const q = (document.getElementById('searchInput') || {}).value || '';
    return products.filter(p => (currentFilter === 'all' || p.cat === currentFilter) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));
}
function filterBy(cat, btn) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(getFiltered());
}
function searchProducts() { renderProducts(getFiltered()); }

// ── PAGE ROUTING ──
function hideAllPages() {
    ['mainPage','catalogPage','productPage','comparePage','favPage','historyPage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}
function showMain() {
    hideAllPages();
    document.getElementById('mainPage').style.display = 'block';
    history.pushState('', document.title, window.location.pathname);
    window.scrollTo({top: 0, behavior: 'smooth'});
}
function showCatalog() {
    hideAllPages();
    document.getElementById('catalogPage').style.display = 'block';
    window.location.hash = 'catalog';
    window.scrollTo({top: 0, behavior: 'smooth'});
    showSkeletons();
    setTimeout(() => renderProducts(getFiltered()), 600);
}
function showFavPage() {
    hideAllPages();
    document.getElementById('favPage').style.display = 'block';
    window.location.hash = 'favorites';
    window.scrollTo({top: 0, behavior: 'smooth'});
    renderFavPage();
}
function showHistoryPage() {
    hideAllPages();
    document.getElementById('historyPage').style.display = 'block';
    window.location.hash = 'history';
    window.scrollTo({top: 0, behavior: 'smooth'});
    renderHistory();
}
function openProductPage(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    activeProductId = id;
    document.getElementById('ppCat').textContent = p.cat;
    document.getElementById('ppName').textContent = p.name;
    document.getElementById('ppDesc').textContent = p.desc || '';
    document.getElementById('ppPrice').textContent = p.price && p.price !== '0' ? '$' + p.price : '0$';
    document.getElementById('ppAvail').innerHTML = getAvailBadge(p.avail);
    const ppImg = document.getElementById('ppImg');
    ppImg.innerHTML = p.img
        ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
        : `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    document.getElementById('ppSpecs').innerHTML = (p.specs || []).map(s => `<div class="spec-item"><div class="spec-label">${s.l}</div><div class="spec-value">${s.v}</div></div>`).join('');
    // Recommendations
    const recs = products.filter(x => x.id !== id && x.cat === p.cat).slice(0, 3);
    document.getElementById('ppRecs').innerHTML = recs.length ? `
        <div class="recs-section">
            <div class="section-label">${t('recs')}</div>
            <div class="recs-grid">${recs.map(r => `
                <div class="rec-card" onclick="openProductPage('${r.id}')">
                    <div class="rec-name">${r.name}</div>
                    <div class="rec-cat">${r.cat}</div>
                    ${getAvailBadge(r.avail)}
                    <button class="rec-btn" style="margin-top:10px;" onclick="addToCart('${r.id}');event.stopPropagation()">${t('add_cart')}</button>
                </div>`).join('')}
            </div>
        </div>` : '';
    hideAllPages();
    document.getElementById('productPage').style.display = 'block';
    window.location.hash = 'product-' + id;
    window.scrollTo({top: 0, behavior: 'smooth'});
}
function ppBuy() { if (activeProductId) { addToCart(activeProductId); openOrderForm(); } }
function ppCart() { if (activeProductId) { addToCart(activeProductId); showToast(products.find(p=>p.id===activeProductId)?.name + ' ' + t('added')); } }

// ── COMPARE ──
function addToCompare(id, e) {
    if (e) e.stopPropagation();
    if (compareList.includes(id)) { showToast('Уже в сравнении'); return; }
    if (compareList.length >= 2) { showToast('Можно сравнить только 2 товара'); return; }
    compareList.push(id);
    updateCompareBar();
    showToast('Добавлено в сравнение');
}
function updateCompareBar() {
    const bar = document.getElementById('compareBar');
    bar.classList.toggle('visible', compareList.length > 0);
    [0, 1].forEach(i => {
        const slot = document.getElementById('cSlot' + (i + 1));
        if (compareList[i]) {
            const p = products.find(x => x.id === compareList[i]);
            slot.className = 'compare-slot filled';
            slot.innerHTML = `<button class="remove-slot" onclick="removeFromCompare('${compareList[i]}')" style="position:absolute;top:2px;right:4px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;">×</button>${p ? p.name : ''}`;
        } else {
            slot.className = 'compare-slot';
            slot.textContent = 'Товар ' + (i + 1);
        }
    });
}
function removeFromCompare(id) { compareList = compareList.filter(x => x !== id); updateCompareBar(); }
function clearCompare() { compareList = []; updateCompareBar(); }
function showComparePage() {
    if (compareList.length < 2) { showToast('Добавьте 2 товара для сравнения'); return; }
    const [a, b] = compareList.map(id => products.find(x => x.id === id));
    const rows = [['Категория', a.cat, b.cat], ['Наличие', a.avail, b.avail], ...(a.specs || []).map((s, i) => [s.l, s.v, (b.specs || [])[i] ? b.specs[i].v : '—'])];
    document.getElementById('compareTableWrap').innerHTML = `
        <table class="compare-table">
            <thead><tr><th></th><th>${a.name}</th><th>${b.name}</th></tr></thead>
            <tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
        </table>`;
    hideAllPages();
    document.getElementById('comparePage').style.display = 'block';
    window.location.hash = 'compare';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// ── FAVORITES ──
function toggleFav(id, e) {
    if (e) e.stopPropagation();
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    localStorage.setItem('mithril_favorites', JSON.stringify([...favorites]));
    renderProducts(getFiltered());
    showToast(favorites.has(id) ? 'Добавлено в избранное' : 'Убрано из избранного');
}
function renderFavPage() {
    const grid = document.getElementById('favGrid');
    const favProds = products.filter(p => favorites.has(p.id));
    if (!favProds.length) { grid.innerHTML = `<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;grid-column:1/-1;">${t('fav_empty')}</div>`; return; }
    grid.innerHTML = favProds.map(p => `
        <div class="product-card">
            <div class="product-img-wrap">
                ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(20%);">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`}
                ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                <button class="fav-btn active" onclick="toggleFav('${p.id}',event)">♥</button>
                <div class="product-overlay"><button class="overlay-btn" onclick="openProductPage('${p.id}')">${t('more')}</button></div>
            </div>
            <div class="product-info">
                <div><div class="product-name">${p.name}</div><div class="product-cat">${p.cat}</div><div style="margin-top:6px;">${getAvailBadge(p.avail)}</div></div>
                <div class="product-price">${p.price && p.price !== '0' ? '$' + p.price : '0$'}</div>
            </div>
            <div class="product-actions">
                <button class="action-btn-buy" onclick="buyNow('${p.id}')">${t('buy')}</button>
                <button class="action-btn-cart" onclick="addToCart('${p.id}')">${t('add_cart')}</button>
            </div>
        </div>`).join('');
}

// ── HISTORY ──
function renderHistory() {
    const list = document.getElementById('historyList');
    const orders = JSON.parse(localStorage.getItem('mithril_orders') || '[]');
    if (!orders.length) { list.innerHTML = `<div style="padding:60px;text-align:center;color:var(--muted);font-size:13px;letter-spacing:2px;text-transform:uppercase;">${t('hist_empty')}</div>`; return; }
    list.innerHTML = [...orders].reverse().map(o => `
        <div class="order-card">
            <div class="order-card-head">
                <div><div class="order-id">#${o.id}</div><div class="order-date">${o.date}</div></div>
                <div class="order-status">✓ Оформлен</div>
            </div>
            <div class="order-items-list">${(o.items || []).map(i => `<div class="order-item-row"><span>${i.name} × ${i.qty}</span><span>0$</span></div>`).join('')}</div>
            <div class="order-total-row"><span>Итого</span><span>0$</span></div>
        </div>`).join('');
}

// ── CART ──
function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    if (cart[id]) cart[id].qty++; else cart[id] = {product: p, qty: 1};
    updateCartUI();
    playClick();
    const badge = document.getElementById('cartBadge');
    badge.classList.remove('pop');
    void badge.offsetWidth;
    badge.classList.add('pop');
    showToast(p.name + ' ' + t('added'));
}
function buyNow(id) { addToCart(id); openOrderForm(); }
function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    updateCartUI();
}
function updateCartUI() {
    const items = Object.values(cart);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cartBadge');
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
    const listEl = document.getElementById('cartItemsList');
    const footEl = document.getElementById('cartFoot');
    if (!items.length) {
        listEl.innerHTML = `<div class="cart-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>${t('cart_empty')}</div>`;
        footEl.style.display = 'none';
    } else {
        listEl.innerHTML = items.map(i => `
            <div class="cart-item">
                <div class="cart-item-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${i.product.name}</div>
                    <div class="cart-item-price">${i.product.price && i.product.price !== '0' ? '$' + i.product.price : '0$'} × ${i.qty}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty('${i.product.id}',-1)">−</button>
                        <span class="qty-num">${i.qty}</span>
                        <button class="qty-btn" onclick="changeQty('${i.product.id}',1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="changeQty('${i.product.id}',-999)">×</button>
            </div>`).join('');
        footEl.style.display = 'block';
        document.getElementById('cartTotalSum').textContent = '0$';
    }
}
function toggleCart() { document.getElementById('cartPanel').classList.toggle('open'); }

// ── ORDER FORM ──
function openOrderForm() {
    document.getElementById('orderFormBackdrop').classList.add('open');
    document.getElementById('orderFormBackdrop').style.display = 'flex';
}
function closeOrderForm() {
    document.getElementById('orderFormBackdrop').classList.remove('open');
    document.getElementById('orderFormBackdrop').style.display = 'none';
}
function applyPromo() {
    const val = document.getElementById('promoInput').value.trim().toUpperCase();
    const okEl = document.getElementById('promoOk');
    const fbPromo = dbPromos.find(p => p.code === val && (p.active === 'true' || p.active === true));
    if (fbPromo) {
        okEl.textContent = `✓ Промокод применён — скидка ${fbPromo.discount}%`;
        okEl.classList.add('show');
        showToast('Промокод применён! Скидка ' + fbPromo.discount + '%');
    } else if (['MITHRIL20','SPORT','BANZAI'].includes(val)) {
        okEl.textContent = t('promo_ok');
        okEl.classList.add('show');
        showToast('Промокод применён!');
    } else {
        okEl.classList.remove('show');
        showToast(t('promo_bad'));
    }
}
function saveOrder() {
    const orders = JSON.parse(localStorage.getItem('mithril_orders') || '[]');
    const items = Object.values(cart).map(i => ({name: i.product.name, qty: i.qty}));
    if (!items.length) return;
    orders.push({id: Date.now().toString().slice(-6), date: new Date().toLocaleDateString('ru-RU'), items});
    localStorage.setItem('mithril_orders', JSON.stringify(orders));
}
function submitOrder() {
    const firstName = (document.getElementById('fFirstName') || {}).value || '';
    const lastName = (document.getElementById('fLastName') || {}).value || '';
    const phoneCode = (document.getElementById('phoneCode') || {}).value || '+7';
    const phone = (document.getElementById('fPhone') || {}).value || '';
    const email = (document.getElementById('fEmail') || {}).value || '';
    const city = (document.getElementById('fCity') || {}).value || '';
    const street = (document.getElementById('fStreet') || {}).value || '';
    const house = (document.getElementById('fHouse') || {}).value || '';
    const apt = (document.getElementById('fApt') || {}).value || '';
    const idx = (document.getElementById('fIndex') || {}).value || '';
    const promo = (document.getElementById('promoInput') || {}).value || '—';
    const items = Object.values(cart).map(i => i.product.name + ' × ' + i.qty);
    const orderData = {
        fio: firstName + ' ' + lastName,
        phone: phoneCode + ' ' + phone,
        email,
        address: [city, street, house ? 'д.' + house : '', apt ? 'кв.' + apt : '', idx].filter(Boolean).join(', '),
        items,
        promo: promo || '—',
        total: '0$'
    };
    saveOrder();
    // Send to Telegram
    const TOKEN = '8677453235:AAHbcKqlQyRZkTMhoKZsBsRBrww1v8Xek9k';
    const CHAT_ID = '-1003538222198';
    const text = [
        '📦 НОВЫЙ ЗАКАЗ',
        '',
        '👤 Клиент: ' + orderData.fio,
        '📞 Телефон: ' + orderData.phone,
        '📧 Email: ' + orderData.email,
        '📍 Адрес: ' + orderData.address,
        '',
        '🛒 Товары:',
        ...orderData.items.map(i => '• ' + i),
        '',
        '🎟 Промокод: ' + orderData.promo,
        '💰 Итого: ' + orderData.total,
        '🕐 ' + new Date().toLocaleString('ru-RU')
    ].join('\n');
    fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text})
    }).catch(e => console.log('TG error:', e));
    cart = {};
    updateCartUI();
    closeOrderForm();
    document.getElementById('cartPanel').classList.remove('open');
    showToast(t('order_done'));
}

// ── DELIVERY ──
function calcDelivery() {
    const city = document.getElementById('dCity').value;
    const weight = parseFloat(document.getElementById('dWeight').value) || 0;
    const type = document.getElementById('dType').value;
    if (!city) { showToast('Выберите город'); return; }
    if (!weight) { showToast('Укажите вес заказа'); return; }
    const res = document.getElementById('deliveryResult');
    res.classList.add('show');
    document.getElementById('dResultPrice').textContent = type === 'pickup' ? 'Бесплатно' : '0$';
    document.getElementById('dResultInfo').textContent = type === 'pickup' ? 'Самовывоз — бесплатно' : type === 'express' ? '1–2 рабочих дня' : '3–5 рабочих дней';
}

// ── CHAT ──
function toggleChat() { document.getElementById('chatPanel').classList.toggle('open'); }
function sendChat() {
    const inp = document.getElementById('chatInput');
    const msg = inp.value.trim();
    if (!msg) return;
    const body = document.getElementById('chatBody');
    body.innerHTML += `<div class="chat-msg" style="background:var(--gold);color:#0e0e10;margin-left:20px;">${msg}</div>`;
    inp.value = '';
    setTimeout(() => { body.innerHTML += `<div class="chat-msg">Спасибо! Мы свяжемся с вами в ближайшее время 🙏</div>`; body.scrollTop = body.scrollHeight; }, 1000);
    body.scrollTop = body.scrollHeight;
}
document.addEventListener('keydown', e => { if (e.key === 'Enter' && document.activeElement === document.getElementById('chatInput')) sendChat(); });

// ── COOKIE ──
function checkCookie() {
    if (!localStorage.getItem('cookie_accepted')) {
        setTimeout(() => { const b = document.getElementById('cookieBanner'); if (b) b.classList.add('show'); }, 2500);
    }
}
function acceptCookie() { localStorage.setItem('cookie_accepted', '1'); document.getElementById('cookieBanner').classList.remove('show'); }
function declineCookie() { document.getElementById('cookieBanner').classList.remove('show'); }
checkCookie();

// ── SOUND ──
function playClick() {
    try {
        const ac = new AudioContext(), o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = 800; g.gain.value = .1;
        o.start(); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .1); o.stop(ac.currentTime + .1);
    } catch(e) {}
}

// ── TOAST ──
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ── HASH ROUTING ──
window.addEventListener('hashchange', () => {
    const hash = location.hash;
    if (hash.startsWith('#product-')) openProductPage(hash.replace('#product-', ''));
    else if (hash === '#catalog') showCatalog();
    else if (hash === '#favorites') showFavPage();
    else if (hash === '#history') showHistoryPage();
    else if (hash === '#compare') showComparePage();
    else showMain();
});

// ── INIT ──
showSkeletons();


// ── EXPORT TO WINDOW (needed for ES module onclick handlers) ──
window.showMain = showMain;
window.showCatalog = showCatalog;
window.showFavPage = showFavPage;
window.showHistoryPage = showHistoryPage;
window.showComparePage = showComparePage;
window.openProductPage = openProductPage;
window.ppBuy = ppBuy;
window.ppCart = ppCart;
window.filterBy = filterBy;
window.searchProducts = searchProducts;
window.toggleCart = toggleCart;
window.toggleChat = toggleChat;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleLangMenu = toggleLangMenu;
window.setLang = setLang;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.changeQty = changeQty;
window.toggleFav = toggleFav;
window.addToCompare = addToCompare;
window.removeFromCompare = removeFromCompare;
window.clearCompare = clearCompare;
window.openOrderForm = openOrderForm;
window.closeOrderForm = closeOrderForm;
window.applyPromo = applyPromo;
window.submitOrder = submitOrder;
window.calcDelivery = calcDelivery;
window.sendChat = sendChat;
window.acceptCookie = acceptCookie;
window.declineCookie = declineCookie;
window.renderProducts = renderProducts;
window.getFiltered = getFiltered;
window.showSkeletons = showSkeletons;

// ── FIREBASE ──
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const _db = getFirestore(initializeApp({
    apiKey: "AIzaSyCp9uHtABLNIM-4EDaqfqCwOMs1poQJumU",
    authDomain: "mithril-shop-b2b0b.firebaseapp.com",
    projectId: "mithril-shop-b2b0b",
    storageBucket: "mithril-shop-b2b0b.firebasestorage.app",
    messagingSenderId: "182146848633",
    appId: "1:182146848633:web:28ae1250a08ccd053c81a8"
}));

(async () => {
    try {
        const prodSnap = await getDocs(collection(_db, 'products'));
        if (!prodSnap.empty) {
            products = prodSnap.docs.map(d => ({id: d.id, specs: [], badge: null, avail: 'in', price: '0', ...d.data()}));
        }
        const promoSnap = await getDocs(collection(_db, 'promos'));
        if (!promoSnap.empty) dbPromos = promoSnap.docs.map(d => ({id: d.id, ...d.data()}));

        // Load banner settings
        try {
            const bannerSnap = await getDoc(doc(_db, 'settings', 'banner'));
            if (bannerSnap.exists()) {
                const b = bannerSnap.data();
                const banner = document.querySelector('.promo-banner');
                if (banner) {
                    if (b.active === false) {
                        banner.style.display = 'none';
                    } else {
                        banner.style.display = 'block';
                        if (b.color) banner.style.background = b.color;
                        if (b.text) {
                            const textEl = banner.querySelector('.promo-text');
                            if (textEl) textEl.textContent = b.text;
                        }
                        if (b.timer === false) {
                            const timerEl = banner.querySelector('#tH');
                            if (timerEl) timerEl.closest('div').style.display = 'none';
                        }
                    }
                }
            }
        } catch(e) { console.log('Banner error:', e); }

    } catch(e) {
        console.log('Firebase load error:', e);
    }
    // Render based on current hash
    const hash = location.hash;
    if (hash === '#catalog') showCatalog();
    else { showSkeletons(); setTimeout(() => renderProducts(getFiltered()), 400); }
})();
