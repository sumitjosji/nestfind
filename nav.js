/**
 * NestFind — nav.js
 * Shared UI components: navbar, footer, skeleton loaders, toast, animations.
 * Include AFTER auth.js on every page:
 *   <script type="module" src="auth.js"></script>
 *   <script type="module" src="nav.js"></script>
 */

/* ═══════════════════════════════════════════
   SHARED STYLES — injected once into <head>
   ═══════════════════════════════════════════ */
const _css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; background: #f0ede8; min-height: 100vh; color: #1a1a2e; }

  /* ── NAVBAR ── */
  .nf-nav {
    background: #fff;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    position: sticky;
    top: 0;
    z-index: 200;
  }
  .nf-logo { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; text-decoration: none; cursor: pointer; }
  .nf-logo span { color: #c9a84c; }
  .nf-links { display: flex; align-items: center; gap: 28px; }
  .nf-links a { text-decoration: none; font-size: 0.88rem; font-weight: 500; color: #666; transition: color 0.2s; }
  .nf-links a:hover, .nf-links a.active { color: #c9a84c; }
  .nf-btn-post {
    background: #1a1a2e; color: #fff; border: none; padding: 9px 20px;
    border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap;
  }
  .nf-btn-post:hover { background: #c9a84c; }
  .nav-avatar {
    width: 36px; height: 36px; background: #f0ede8; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; cursor: pointer; border: 2px solid #e0dbd2;
    font-weight: 700; color: #1a1a2e; flex-shrink: 0; transition: all 0.2s;
    text-decoration: none;
  }
  .nav-avatar.loggedin { background: #c9a84c; border-color: #b8923e; color: #fff; }

  /* ── HAMBURGER (mobile) ── */
  .nf-hamburger {
    display: none; flex-direction: column; justify-content: center; gap: 5px;
    width: 36px; height: 36px; background: none; border: none; cursor: pointer; padding: 4px;
  }
  .nf-hamburger span {
    display: block; height: 2px; background: #1a1a2e; border-radius: 2px;
    transition: transform 0.3s, opacity 0.3s;
  }
  .nf-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nf-hamburger.open span:nth-child(2) { opacity: 0; }
  .nf-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── MOBILE DRAWER ── */
  .nf-drawer {
    display: none;
    position: fixed;
    top: 64px; left: 0; right: 0; bottom: 0;
    background: #fff;
    z-index: 190;
    padding: 24px 24px 40px;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .nf-drawer.open { transform: translateX(0); }
  .nf-drawer a, .nf-drawer .nf-drawer-link {
    display: block; padding: 14px 0; font-size: 1.05rem; font-weight: 600;
    color: #1a1a2e; text-decoration: none; border-bottom: 1px solid #f5f2ee;
    cursor: pointer; background: none; border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left; font-family: 'Sora', sans-serif;
  }
  .nf-drawer a:hover, .nf-drawer .nf-drawer-link:hover { color: #c9a84c; }
  .nf-drawer-post {
    margin-top: 20px; width: 100%; padding: 14px; background: #1a1a2e; color: #fff;
    border: none; border-radius: 10px; font-family: 'Sora', sans-serif;
    font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .nf-drawer-post:hover { background: #c9a84c; }
  .nf-drawer-user {
    display: flex; align-items: center; gap: 12px; padding: 16px 0;
    border-bottom: 1px solid #f5f2ee; margin-bottom: 4px;
  }
  .nf-drawer-avatar {
    width: 44px; height: 44px; background: #c9a84c; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .nf-drawer-name { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; }
  .nf-drawer-email { font-size: 0.75rem; color: #aaa; margin-top: 2px; }

  /* ── FOOTER ── */
  .nf-footer {
    background: #1a1a2e;
    color: rgba(255,255,255,0.5);
    padding: 48px 40px 28px;
    margin-top: auto;
  }
  .nf-footer-grid {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
    margin-bottom: 40px;
  }
  .nf-footer-brand .nf-logo { font-size: 1.3rem; color: #fff; display: block; margin-bottom: 12px; }
  .nf-footer-brand p { font-size: 0.82rem; line-height: 1.7; color: rgba(255,255,255,0.4); max-width: 240px; }
  .nf-footer-col h5 { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
  .nf-footer-col a { display: block; font-size: 0.83rem; color: rgba(255,255,255,0.55); text-decoration: none; margin-bottom: 8px; transition: color 0.2s; cursor: pointer; }
  .nf-footer-col a:hover { color: #c9a84c; }
  .nf-footer-bottom { max-width: 1100px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .nf-footer-bottom p { font-size: 0.78rem; }
  .nf-footer-bottom span { color: #c9a84c; }
  .nf-footer-badges { display: flex; gap: 8px; }
  .nf-badge { padding: 4px 12px; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; font-size: 0.72rem; color: rgba(255,255,255,0.4); }

  /* ── SKELETON LOADER ── */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #e8e4de 25%, #f5f2ee 50%, #e8e4de 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  .skel-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
  .skel-img  { height: 160px; }
  .skel-body { padding: 16px; }
  .skel-line { height: 12px; margin-bottom: 10px; }
  .skel-line.short { width: 60%; }
  .skel-line.xshort { width: 40%; }

  /* ── TOAST ── */
  #nf-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1a1a2e; color: #fff; padding: 13px 24px; border-radius: 12px;
    font-size: 0.87rem; font-weight: 600; display: flex; align-items: center; gap: 10px;
    opacity: 0; transition: all 0.35s; pointer-events: none; white-space: nowrap;
    z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.25); max-width: 90vw;
  }
  #nf-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  #nf-toast.success { background: #1a7a3e; }
  #nf-toast.error   { background: #a32d2d; }

  /* ── PAGE ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.19s; }
  .fade-up-4 { animation-delay: 0.26s; }

  /* ── WISHLIST HEART ── */
  .wish-btn {
    position: absolute; top: 10px; right: 10px;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.9); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: transform 0.2s, background 0.2s;
    z-index: 2;
  }
  .wish-btn:hover { transform: scale(1.15); background: #fff; }
  .wish-btn.active { background: #fff0f4; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nf-nav { padding: 0 20px; }
    .nf-links { display: none; }
    .nf-hamburger { display: flex; }
    .nf-drawer { display: block; }
    .nf-footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
  }
  @media (max-width: 480px) {
    .nf-footer-grid { grid-template-columns: 1fr; }
    .nf-footer { padding: 36px 20px 24px; }
  }
`;

const _styleEl = document.createElement('style');
_styleEl.textContent = _css;
document.head.appendChild(_styleEl);

/* ═══════════════════════════════════════════
   WISHLIST (localStorage — works without login)
   ═══════════════════════════════════════════ */
export const Wishlist = {
  get()       { try { return JSON.parse(localStorage.getItem('nf_wishlist') || '[]'); } catch { return []; } },
  has(id)     { return this.get().includes(id); },
  toggle(id)  {
    let list = this.get();
    if (list.includes(id)) { list = list.filter(x => x !== id); }
    else                   { list.push(id); }
    localStorage.setItem('nf_wishlist', JSON.stringify(list));
    return list.includes(id);
  },
};

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */
let _toastTimer;
export function showToast(msg, type = '') {
  let el = document.getElementById('nf-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'nf-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className   = 'show' + (type ? ' ' + type : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = ''; }, 3200);
}

/* ═══════════════════════════════════════════
   SKELETON CARDS
   ═══════════════════════════════════════════ */
export function skeletonCards(n = 3) {
  return Array.from({ length: n }, () => `
    <div class="skel-card">
      <div class="skeleton skel-img"></div>
      <div class="skel-body">
        <div class="skeleton skel-line" style="width:75%"></div>
        <div class="skeleton skel-line short"></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;">
          <div class="skeleton skel-line xshort" style="margin:0;height:14px;width:35%"></div>
          <div class="skeleton skel-line xshort" style="margin:0;height:14px;width:25%"></div>
        </div>
      </div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */
export function renderNav(activePage = '') {
  const pages = [
    { label: 'Home', href: 'home.html', key: 'home' },
    { label: 'Buy',  href: 'buy.html',  key: 'buy'  },
    { label: 'Rent', href: 'rent.html', key: 'rent' },
    
  ];

  const linksHTML = pages.map(p =>
    `<a href="${p.href}"${p.key === activePage ? ' class="active"' : ''}>${p.label}</a>`
  ).join('');

  const nav = document.createElement('nav');
  nav.className = 'nf-nav';
  nav.innerHTML = `
    <a href="home.html" class="nf-logo">Nest<span>Find</span></a>
    <div class="nf-links">
      ${linksHTML}
      <button class="nf-btn-post" onclick="window.location.href='post-property.html'">+ Post Property</button>
      <a class="nav-avatar" id="nav-av" href="login.html">👤</a>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <a class="nav-avatar" id="nav-av-m" href="login.html" style="display:none;">👤</a>
      <button class="nf-hamburger" id="nf-burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>`;

  /* Mobile drawer */
  const drawer = document.createElement('div');
  drawer.className = 'nf-drawer';
  drawer.id = 'nf-drawer';
  drawer.innerHTML = `
    <div id="nf-drawer-user" style="display:none"></div>
    ${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
    <button class="nf-drawer-post" onclick="window.location.href='post-property.html'">+ Post Property</button>
    <button class="nf-drawer-link" id="nf-drawer-logout" style="display:none;color:#e05656;border-bottom:none;">↩ Logout</button>`;

  document.body.prepend(drawer);
  document.body.prepend(nav);

  /* Burger toggle */
  const burger = document.getElementById('nf-burger');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  /* Close drawer on link click */
  drawer.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Update avatar when auth resolves */
  NF.onReady(user => {
    ['nav-av', 'nav-av-m'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (user) {
        el.textContent = user.name.charAt(0).toUpperCase();
        el.classList.add('loggedin');
        el.href = 'profile.html';
      } else {
        el.textContent = '👤';
        el.classList.remove('loggedin');
        el.href = 'login.html';
      }
    });

    /* Show mobile avatar */
    document.getElementById('nav-av-m').style.display = 'flex';

    /* Drawer user section */
    const drawerUser = document.getElementById('nf-drawer-user');
    const drawerLogout = document.getElementById('nf-drawer-logout');
    if (user) {
      drawerUser.style.display = 'flex';
      drawerUser.className = 'nf-drawer-user';
      drawerUser.innerHTML = `
        <div class="nf-drawer-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="nf-drawer-name">${user.name}</div>
          <div class="nf-drawer-email">${user.email || user.phone || ''}</div>
        </div>`;
      drawerUser.onclick = () => window.location.href = 'profile.html';
      drawerLogout.style.display = 'block';
      drawerLogout.onclick = () => NF.logout();
    }
  });
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'nf-footer';
  footer.innerHTML = `
    <div class="nf-footer-grid">
      <div class="nf-footer-brand">
        <span class="nf-logo">Nest<span>Find</span></span>
        <p>India's trusted platform to buy, sell and rent properties. Connecting buyers and sellers across the country.</p>
      </div>
      <div class="nf-footer-col">
        <h5>Explore</h5>
        <a href="buy.html">Buy Property</a>
        <a href="rent.html">Rent Property</a>
        <a href="rent.html">PG / Hostel</a>
        <a href="sell.html">List Property</a>
      </div>
      <div class="nf-footer-col">
        <h5>Property Types</h5>
        <a href="search.html?type=Apartment">Apartments</a>
        <a href="search.html?type=Independent House">Houses</a>
        <a href="search.html?type=Villa">Villas</a>
        <a href="search.html?type=Plot">Plots</a>
        <a href="search.html?type=Commercial">Commercial</a>
      </div>
      <div class="nf-footer-col">
        <h5>Company</h5>
        <a href="#">About Us</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
    <div class="nf-footer-bottom">
      <p>© 2025 <span>NestFind</span> — All rights reserved</p>
      <div class="nf-footer-badges">
        <span class="nf-badge">🔒 Secure</span>
        <span class="nf-badge">✅ Verified Listings</span>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

/* ═══════════════════════════════════════════
   SEO META HELPER
   ═══════════════════════════════════════════ */
export function setMeta({ title, description, image } = {}) {
  document.title = title ? `${title} — NestFind` : 'NestFind — Buy, Sell & Rent Properties in India';
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) { desc = document.createElement('meta'); desc.name = 'description'; document.head.appendChild(desc); }
  desc.content = description || 'Find your dream property. Buy, sell or rent flats, apartments, villas and houses across India on NestFind.';
  /* OG tags */
  [['og:title', title || 'NestFind'], ['og:description', desc.content], ['og:image', image || ''], ['og:type', 'website']].forEach(([p, c]) => {
    let el = document.querySelector(`meta[property="${p}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', p); document.head.appendChild(el); }
    el.content = c;
  });
}

/* ═══════════════════════════════════════════
   PRICE FORMATTER (shared)
   ═══════════════════════════════════════════ */
export function fmtPrice(p) {
  if (p >= 10000000) return '₹' + (p / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  if (p >= 100000)   return '₹' + (p / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L';
  return '₹' + p.toLocaleString('en-IN');
}

/* ═══════════════════════════════════════════
   PROPERTY CARD (shared)
   ═══════════════════════════════════════════ */
export function propCardHTML(p, opts = {}) {
  const icon      = { Apartment: '🏢', Villa: '🏖️', Plot: '🏗️', Commercial: '🏬', 'PG / Hostel': '🛏️' }[p.type] || '🏠';
  const badgeCls  = { Sale: 'badge-sale', Rent: 'badge-rent', PG: 'badge-pg' }[p.listingType] || 'badge-sale';
  const badgeTxt  = { Sale: 'For Sale', Rent: 'For Rent', PG: 'PG' }[p.listingType] || p.listingType;
  const imgHTML   = p.photos?.[0]
    ? `<img src="${p.photos[0]}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />`
    : `<span style="font-size:2.8rem;">${icon}</span>`;
  const wished    = Wishlist.has(p.id);
  return `
    <div class="prop-card fade-up" onclick="window.location.href='property.html?id=${p.id}'" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;position:relative;" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 28px rgba(0,0,0,0.12)'" onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'">
      <div style="height:170px;background:linear-gradient(135deg,#1a1a2e,#2d2d4e);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
        ${imgHTML}
        <span style="position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:6px;font-size:0.72rem;font-weight:700;" class="${badgeCls}">${badgeTxt}</span>
        <button class="wish-btn${wished ? ' active' : ''}" onclick="event.stopPropagation();toggleWish(this,'${p.id}')" title="Save property">${wished ? '❤️' : '🤍'}</button>
      </div>
      <div style="padding:16px;">
        <div style="font-size:0.92rem;font-weight:700;color:#1a1a2e;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
        <div style="font-size:0.76rem;color:#aaa;margin-bottom:10px;">📍 ${[p.locality, p.city].filter(Boolean).join(', ')}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:1rem;font-weight:700;color:#c9a84c;">${fmtPrice(p.price)}</span>
          <span style="font-size:0.73rem;color:#bbb;">${p.bhk || p.type}</span>
        </div>
      </div>
    </div>`;
}

/* Wishlist toggle — exposed globally for inline onclick */
window.toggleWish = (btn, id) => {
  const isNow = Wishlist.toggle(id);
  btn.textContent = isNow ? '❤️' : '🤍';
  btn.classList.toggle('active', isNow);
  showToast(isNow ? 'Saved to wishlist ❤️' : 'Removed from wishlist', isNow ? 'success' : '');
};

/* Badge styles injected once */
const _badgeCSS = `
  .badge-sale { background:#fff8ec; color:#c9a84c; }
  .badge-rent { background:#eef8f0; color:#27a854; }
  .badge-pg   { background:#eef3ff; color:#4a6cf7; }
`;
const _bs = document.createElement('style');
_bs.textContent = _badgeCSS;
document.head.appendChild(_bs);
