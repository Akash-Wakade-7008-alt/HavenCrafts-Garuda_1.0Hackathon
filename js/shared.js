/* =========================================
   HAVENCRAFT SHARED JAVASCRIPT
========================================= */

// Load dependencies
if (!document.querySelector('script[src="auth.js"]')) {
  document.write('<script src="auth.js"><\/script>');
}
if (!document.querySelector('script[src="customization.js"]')) {
  document.write('<script src="customization.js"><\/script>');
}

// 1. Data Generation
const CATEGORY_DATA = {
  wooden: { title: 'Wooden & Handmade Arts', parent: 'Decor', imgs: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=75', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75'] },
  textile: { title: 'Textile & Fabric Decor', parent: 'Decor', imgs: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=75', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=75'] },
  accessories: { title: 'Decorative Accessories', parent: 'Decor', imgs: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=75', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=75'] },
  resin: { title: 'Resin Arts', parent: 'Gifts', imgs: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=75', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=75'] },
  lippen: { title: 'Lippen Arts', parent: 'Gifts', imgs: ['https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=75', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=75'] },
  embroidery: { title: 'Embroidery', parent: 'Gifts', imgs: ['https://images.unsplash.com/photo-1487530811015-780f2f5dc76f?w=400&q=75', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=75'] },
  ring: { title: 'Ring Platters', parent: 'Gifts', imgs: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=75', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=75'] }
};

let currentProducts = [];

function generateDummyData(catKey, count = 100) {
  const data = CATEGORY_DATA[catKey];
  if (!data) return [];
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: `${catKey}-${i}`,
      name: `${data.title} Variant ${i}`,
      price: Math.floor(Math.random() * 2000) + 499,
      img: data.imgs[i % data.imgs.length],
      desc: `A beautifully crafted item perfect for your home or as a gift. Enjoy premium quality.`,
      pop: Math.random() // For "popular" sorting
    });
  }
  return items;
}

// 2. Format Currency
const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

// 3. Cart Management
let cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
let cartCount = cartItems.length;

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }
}

function addToCart(p = null) {
  if (!protectAction()) return;
  let prod = p;
  if (typeof p === 'string') prod = currentProducts.find(x => x.id === p) || activeProd;
  if (!prod) prod = activeProd;
  if (!prod) return;

  // Read customization from new hc_customizations store
  let custStr = null;
  let custImg = null;
  if (typeof HC_Cust !== 'undefined') {
    const cData = HC_Cust.load(prod.id);
    if (cData && cData.isCustomized) {
      custStr = cData.name + (cData.description ? ` — ${cData.description}` : '');
      custImg = cData.image;
    }
  }

  const existingIndex = cartItems.findIndex(i => i.id === prod.id && i.customization === custStr);
  if (existingIndex > -1) {
    cartItems[existingIndex].qty = (cartItems[existingIndex].qty || 1) + 1;
  } else {
    cartItems.push({
      name: prod.name,
      price: prod.price,
      img: prod.img,
      desc: prod.desc || 'Beautiful carefully crafted product.',
      customization: custStr,
      customizationImage: custImg,
      id: prod.id || ('p' + Date.now()),
      qty: 1
    });
  }

  cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  localStorage.setItem('hc_cart_items', JSON.stringify(cartItems));
  updateCartBadge();
  showToast('Added to cart 🛒');
}

// buyNow removed — cart-based flow only

// 4. Toast
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast.tid);
  toast.tid = setTimeout(() => toast.classList.remove('show'), 2800);
}

// 5. Global UI Injection (Header, Footer, Modals)
function injectGlobalUI() {
  // HEADER
  const headerHtml = `
    <div class="fixed-cart-ui" style="position: fixed; top: 24px; right: 28px; z-index: 1000;">
      <a href="cart.html" style="text-decoration: none; position: relative; display: flex; align-items: center; justify-content: center; background: #fff; width: 48px; height: 48px; border-radius: 50%; box-shadow: 0 6px 16px rgba(0,0,0,0.08); border: 1px solid var(--border, #e8e0d5); transition: transform 0.2s ease;">
        <span style="font-size: 1.4rem;">🛒</span>
        <span id="cartBadge" style="position: absolute; top: -4px; right: -4px; background: var(--rose, #d4907e); color: #fff; font-size: 0.75rem; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">0</span>
      </a>
    </div>
  `;

  // FOOTER
  const footerHtml = `
    <footer id="footer">
      <div class="footer-grid">
        <div>
          <span class="footer-logo">HavenCraft</span>
          <p class="footer-tagline">Craft your space, your way. Premium, customised decor & gifting.</p>
          <div class="socials">
            <a href="#" class="soc-icon">📸</a>
            <a href="#" class="soc-icon">📌</a>
            <a href="#" class="soc-icon">👥</a>
            <a href="#" class="soc-icon">🐦</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Navigate</h4>
          <ul><li><a href="home.html">Home</a></li><li><a href="home.html#decor">Decor</a></li><li><a href="home.html#gifts">Gifts</a></li></ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul><li><a href="#">Track Order</a></li><li><a href="#">FAQ</a></li><li><a href="#">Contact Us</a></li></ul>
        </div>
        <div class="footer-col">
          <h4>Newsletter</h4>
          <p style="font-size:0.85rem;color:rgba(255,255,255,.5);margin-bottom:8px">Get updates on new arrivals & offers.</p>
          <form class="newsletter" onsubmit="event.preventDefault(); showToast('Subscribed successfully! 🎉')">
            <input type="email" class="nl-input" placeholder="Your email address" required>
            <button type="submit" class="nl-btn">→</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 HavenCraft. All rights reserved.</p>
        <p>Made with ❤️</p>
      </div>
    </footer>
  `;

  // MODALS
  const modalsHtml = `
    <!-- Detail Modal -->
    <div class="modal-overlay" id="detailOverlay">
      <div class="modal" id="detailModal">
        <div class="modal-header">
          <div class="modal-title" id="dTitle">Product</div>
          <button class="modal-close" onclick="closeModals()">✕</button>
        </div>
        <div class="modal-body">
          <img class="detail-img" id="dImg" src="" alt=""/>
          <div class="detail-price" id="dPrice"></div>
          <div class="detail-desc" id="dDesc"></div>
          <div class="detail-actions" style="display:flex;flex-direction:column;gap:12px;">
            <button class="btn btn-buy" id="dAddCartBtn" style="background:linear-gradient(135deg,var(--sage),var(--saged));color:#fff;">🛒 Add to Cart</button>
            <button class="btn btn-cust" id="dCustBtn">✏️ Customize</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Back to Top -->
    <button class="btt-btn" id="bttBtn" aria-label="Back to top">↑</button>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHtml);
  document.body.insertAdjacentHTML('beforeend', footerHtml + modalsHtml);

  setupModals();
  setupBTT();
}

// 6. UI Setup
let activeProd = null;

function setupModals() {
  document.getElementById('detailOverlay').addEventListener('click', e => { if (e.target.id === 'detailOverlay') closeModals(); });

  document.getElementById('dAddCartBtn').addEventListener('click', () => { addToCart(activeProd); closeModals(); });
  document.getElementById('dCustBtn').addEventListener('click', () => {
    closeModals();
    if (activeProd) setTimeout(() => HC_Cust.open(activeProd.id, activeProd.name), 200);
  });
}

function openDetail(id) {
  const p = currentProducts.find(x => x.id === id);
  if (!p) return;
  activeProd = p;
  document.getElementById('dTitle').textContent = p.name;
  document.getElementById('dImg').src = p.img;
  document.getElementById('dPrice').textContent = formatPrice(p.price);
  document.getElementById('dDesc').textContent = p.desc;
  document.getElementById('detailOverlay').classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// openCust delegates to HC_Cust — supports category pages
function openCust(p, cartItemIndex = null) {
  if (!protectAction()) return;
  if (typeof p === 'string') p = currentProducts.find(x => x.id === p) || activeProd;
  activeProd = p;
  if (typeof HC_Cust !== 'undefined') {
    HC_Cust.open(p.id, p.name);
  } else {
    showToast('Customization not available on this page');
  }
}

// saveCustomization is now handled by HC_Cust internally
function saveCustomization() {}

function setupBTT() {
  const btt = document.getElementById('bttBtn');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 7. Page Initializer
function initCategoryPage(catKey) {
  injectGlobalUI();
  updateCartBadge();

  const meta = CATEGORY_DATA[catKey];
  document.getElementById('bcParent').textContent = meta.parent;
  document.getElementById('bcCurrent').textContent = meta.title;
  document.getElementById('pageTitle').textContent = meta.title;

  currentProducts = generateDummyData(catKey, 64); // ~8 rows of 8
  renderGrid(currentProducts);

  // Sort Logic
  document.getElementById('sortSelect').addEventListener('change', e => {
    let arr = [...currentProducts];
    if (e.target.value === 'low') arr.sort((a, b) => a.price - b.price);
    else if (e.target.value === 'high') arr.sort((a, b) => b.price - a.price);
    renderGrid(arr);
  });

  // Filter Logic
  document.getElementById('filterSelect').addEventListener('change', e => {
    let arr = [...currentProducts];
    if (e.target.value === 'popular') arr.sort((a, b) => b.pop - a.pop);
    renderGrid(arr);
  });

  // Search Logic (Basic UI)
  document.getElementById('searchInput').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const arr = currentProducts.filter(p => p.name.toLowerCase().includes(q));
    renderGrid(arr);
  });
}

function renderGrid(products) {
  const grid = document.getElementById('productGrid');
  document.getElementById('resCount').textContent = `Showing ${products.length} results`;

  if (products.length === 0) {
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--light)">No products found matching your criteria.</div>`;
    return;
  }

  // Chunk products into rows of 10 for horizontal scrolling
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    chunks.push(products.slice(i, i + chunkSize));
  }

  grid.innerHTML = chunks.map((chunk, idx) => {
    const rowTitle = `Collection ${idx + 1}`;
    const cardsHtml = chunk.map(p => {
      const cust = (typeof HC_Cust !== 'undefined') ? HC_Cust.load(p.id) : null;
      const isCustomized = cust && cust.isCustomized;
      const custBtnLabel = isCustomized ? '✏️ Edit' : '✏️ Customize';
      const badge = isCustomized ? `<span class="hc-cust-badge">Customized ✅</span>` : '';
      return `
      <div class="card" data-product-id="${p.id}" onclick="openDetail('${p.id}')">
        <div class="card-img-wrap" style="position:relative">
          ${badge}
          <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
        </div>
        <div class="card-body">
          <div class="card-name">${p.name}</div>
          <div class="card-price">${formatPrice(p.price)}</div>
          <div class="card-actions">
            <button class="btn btn-buy" onclick="event.stopPropagation(); addToCart('${p.id}')">🛒 Add to Cart</button>
            <button class="btn btn-cust cust-btn" onclick="event.stopPropagation(); openCust('${p.id}')">${custBtnLabel}</button>
          </div>
        </div>
      </div>`;
    }).join('');

    return `
      <div class="category-row-container">
        <h3 class="row-title">${rowTitle}</h3>
        <div class="h-scroll">
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join('');
}
