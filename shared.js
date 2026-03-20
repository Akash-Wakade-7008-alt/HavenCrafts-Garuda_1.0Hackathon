/* =========================================
   HAVENCRAFT SHARED JAVASCRIPT
========================================= */

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

function generateDummyData(catKey, count = 64) {
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
let cartCount = parseInt(localStorage.getItem('hc_cart_count') || '0', 10);

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }
}

function addToCart() {
  cartCount++;
  localStorage.setItem('hc_cart_count', cartCount);
  updateCartBadge();
  showToast('Added to cart 🛒');
}

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
  const headerHtml = ``;

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
          <div class="detail-actions">
            <button class="btn btn-buy" id="dBuyBtn">🛒 Buy Now</button>
            <button class="btn btn-cust" id="dCustBtn">✏️ Customize</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customize Modal -->
    <div class="modal-overlay" id="custOverlay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title" id="cTitle">Customize</div>
          <button class="modal-close" onclick="closeModals()">✕</button>
        </div>
        <div class="modal-body">
          <div class="cust-group">
            <label class="cust-cb-wrap"><input type="checkbox" id="cbName"> <span class="cust-cb-label">✏️ Add Name / Text</span></label>
            <div class="cust-reveal" id="rName"><input class="form-input" id="cNameVal" placeholder="Enter name or text…"></div>
          </div>
          <div class="cust-group">
            <label class="cust-cb-wrap"><input type="checkbox" id="cbPhoto"> <span class="cust-cb-label">📷 Add Photo</span></label>
            <div class="cust-reveal" id="rPhoto"><input type="file" accept="image/*" class="form-input" style="padding:9px"></div>
          </div>
          <div class="cust-group">
            <label class="cust-cb-wrap"><input type="checkbox" id="cbColor"> <span class="cust-cb-label">🎨 Choose Color Theme</span></label>
            <div class="cust-reveal" id="rColor">
              <div class="color-picker">
                <label class="color-label"><input type="radio" name="cColor" value="Sage"><div class="color-circle" style="background:#8aad8f"></div></label>
                <label class="color-label"><input type="radio" name="cColor" value="Beige"><div class="color-circle" style="background:#f2ebe0"></div></label>
                <label class="color-label"><input type="radio" name="cColor" value="Rose"><div class="color-circle" style="background:#d4907e"></div></label>
                <label class="color-label"><input type="radio" name="cColor" value="Charcoal"><div class="color-circle" style="background:#4a4a4a"></div></label>
              </div>
            </div>
          </div>
          <div class="cust-group">
            <label class="cust-cb-wrap"><input type="checkbox" id="cbMsg"> <span class="cust-cb-label">💌 Add Special Message</span></label>
            <div class="cust-reveal" id="rMsg"><textarea class="form-textarea" id="cMsgVal" placeholder="Enter your special message…"></textarea></div>
          </div>
          <button class="save-cust-btn" id="saveCustBtn" onclick="saveCustomization()">Save Customization ✓</button>
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
  document.getElementById('custOverlay').addEventListener('click', e => { if (e.target.id === 'custOverlay') closeModals(); });

  // Customization Checkboxes
  const pairs = [['cbName', 'rName'], ['cbPhoto', 'rPhoto'], ['cbColor', 'rColor'], ['cbMsg', 'rMsg']];
  pairs.forEach(([cb, rev]) => {
    document.getElementById(cb).addEventListener('change', function () {
      document.getElementById(rev).classList.toggle('active', this.checked);
    });
  });

  document.getElementById('dBuyBtn').addEventListener('click', () => { addToCart(); closeModals(); });
  document.getElementById('dCustBtn').addEventListener('click', () => {
    closeModals();
    setTimeout(() => openCust(activeProd), 350);
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

function openCust(p) {
  if (typeof p === 'string') p = currentProducts.find(x => x.id === p); // Handle ID passage
  activeProd = p;
  document.getElementById('cTitle').textContent = `Customize: ${p.name}`;
  document.getElementById('custOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
  document.body.style.overflow = '';
}

function saveCustomization() {
  const opts = [];
  if (document.getElementById('cbName').checked) opts.push(`Name: ${document.getElementById('cNameVal').value}`);
  if (document.getElementById('cbPhoto').checked) opts.push('Photo: Attached');
  if (document.getElementById('cbColor').checked) {
    const r = document.querySelector('input[name="cColor"]:checked');
    if (r) opts.push(`Color: ${r.value}`);
  }
  if (document.getElementById('cbMsg').checked) opts.push(`Msg: ${document.getElementById('cMsgVal').value}`);

  if (!opts.length) { showToast('Please select an option'); return; }

  const data = { product: activeProd.name, options: opts.join(', '), ts: Date.now() };
  localStorage.setItem('customizationData', JSON.stringify(data));
  showToast('Customization saved ✓');
  closeModals();
}

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

  grid.innerHTML = products.map(p => `
    <div class="card" onclick="openDetail('${p.id}')">
      <div class="card-img-wrap">
        <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-price">${formatPrice(p.price)}</div>
        <div class="card-actions">
          <button class="btn btn-buy" onclick="event.stopPropagation(); addToCart()">Buy Now</button>
          <button class="btn btn-cust" onclick="event.stopPropagation(); openCust('${p.id}')">Customize</button>
        </div>
      </div>
    </div>
  `).join('');
}
