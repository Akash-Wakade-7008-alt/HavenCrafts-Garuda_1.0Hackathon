 /* ---- Product Data ---- */
        const homeDecorProducts = [
            { name: 'Boho Macramé Wall Art', desc: 'Hand-knotted cotton wall hanging with natural driftwood.', price: '₹1,299', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1594060583572-e5c94e29b96c?w=400&q=75&auto=format&fit=crop' },
            { name: 'Linen Cushion Set', desc: 'Set of 2 handwoven linen cushion covers in earthy tones.', price: '₹849', badge: 'New', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=75&auto=format&fit=crop' },
            { name: 'Ceramic Planter Duo', desc: 'Minimalist matte ceramic planters for succulents & herbs.', price: '₹699', badge: '', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=75&auto=format&fit=crop' },
            { name: 'Teak Wood Shelf', desc: 'Floating solid teak shelf with brass brackets. Holds up to 8kg.', price: '₹2,499', badge: 'Premium', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop' },
            { name: 'Scented Soy Candle', desc: 'Hand-poured soy wax candle in rose & sandalwood blend.', price: '₹449', badge: 'New', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=75&auto=format&fit=crop' },
            { name: 'Rattan Lamp Shade', desc: 'Natural rattan woven pendant lampshade, boho style.', price: '₹1,799', badge: '', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75&auto=format&fit=crop' },
            { name: 'Printed Table Runner', desc: 'Hand-block printed cotton table runner — 72 inch.', price: '₹599', badge: '', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=75&auto=format&fit=crop' },
            { name: 'Gallery Wall Set', desc: '6-piece gallery wall kit with botanical art prints.', price: '₹1,149', badge: 'Trending', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=75&auto=format&fit=crop' },
        ];

        const giftingProducts = [
            { name: 'Personalized Photo Frame', desc: 'Solid wood frame engraved with a custom name or message.', price: '₹649', badge: 'Customizable', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=75&auto=format&fit=crop' },
            { name: 'Gift Hamper Box', desc: 'Curated hamper with candles, teas, and keepsakes. Reusable box.', price: '₹1,999', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=75&auto=format&fit=crop' },
            { name: 'Custom Name Mug', desc: 'Premium bone china mug with gold-lettered name print.', price: '₹399', badge: 'Customizable', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=75&auto=format&fit=crop' },
            { name: 'Personalized Notebook', desc: 'Handmade recycled-paper journal with embossed initials.', price: '₹549', badge: 'New', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=75&auto=format&fit=crop' },
            { name: 'Satin Ribbon Bouquet', desc: 'Forever-bloom dried flower bouquet tied with satin ribbon.', price: '₹899', badge: '', img: 'https://images.unsplash.com/photo-1487530811015-780f2f5dc76f?w=400&q=75&auto=format&fit=crop' },
            { name: 'Luxe Soap Set', desc: '4-piece artisan cold-process soap set with organic ingredients.', price: '₹699', badge: '', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=75&auto=format&fit=crop' },
            { name: 'Memory Shadowbox', desc: 'Deep wooden shadowbox to display photos, tickets & mementos.', price: '₹1,349', badge: 'Trending', img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=75&auto=format&fit=crop' },
            { name: 'Celebration Cookie Tin', desc: 'Hand-decorated butter cookies in a keepsake tin. 500g.', price: '₹749', badge: 'Festive', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=75&auto=format&fit=crop' },
        ];

        /* ---- Render Cards ---- */
        function buildCard(product) {
            return `
        <div class="product-card reveal">
          <div class="card-img-wrap">
            <img src="${product.img}" alt="${product.name}" loading="lazy" />
            ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
          </div>
          <div class="card-body">
            <div class="card-name">${product.name}</div>
            <div class="card-desc">${product.desc}</div>
            <div class="card-price">${product.price}</div>
            <div class="card-actions">
              <button class="btn btn-rose action-btn add-cart-btn" aria-label="Add to cart ${product.name}">Add to Cart</button>
              <button class="btn btn-ghost action-btn" aria-label="Customize ${product.name}">Customize</button>
            </div>
          </div>
        </div>
      `;
        }

        document.getElementById('homeDecorGrid').innerHTML = homeDecorProducts.map(buildCard).join('');
        document.getElementById('giftingGrid').innerHTML = giftingProducts.map(buildCard).join('');

        /* ---- Modal Logic ---- */
        const modal = document.getElementById('loginModal');

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.getElementById('closeModal').addEventListener('click', closeModal);
        document.getElementById('modalCancel').addEventListener('click', closeModal);
        document.getElementById('modalLogin').addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        /* Keyboard close */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        /* Delegate card button clicks */
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-cart-btn')) {
                e.stopPropagation();
                const card = e.target.closest('.product-card');
                const name = card.querySelector('.card-name').textContent;
                const priceStr = card.querySelector('.card-price').textContent;
                const price = parseInt(priceStr.replace(/[^0-9]/g, ''));
                const img = card.querySelector('.card-img-wrap img').src;
                
                let cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
                const existingIndex = cartItems.findIndex(i => i.name === name);
                
                if (existingIndex > -1) {
                    cartItems[existingIndex].qty = (cartItems[existingIndex].qty || 1) + 1;
                } else {
                    cartItems.push({
                        name: name,
                        price: price,
                        img: img,
                        desc: card.querySelector('.card-desc').textContent,
                        id: 'p' + Date.now(),
                        qty: 1
                    });
                }
                localStorage.setItem('hc_cart_items', JSON.stringify(cartItems));
                
                // Update badges
                const totalQty = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
                [document.getElementById('cartBadge'), document.getElementById('mobileCartBadge')].forEach(badge => {
                    if (badge) {
                        badge.textContent = totalQty;
                        badge.style.transform = 'scale(1.4)';
                        setTimeout(() => badge.style.transform = 'scale(1)', 200);
                    }
                });
                return;
            }
            if (e.target.classList.contains('action-btn')) openModal();
        });

        // init cart badge count
        document.addEventListener('DOMContentLoaded', () => {
             let cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
             const totalQty = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
             [document.getElementById('cartBadge'), document.getElementById('mobileCartBadge')].forEach(badge => {
                 if (badge) badge.textContent = totalQty;
             });
        });

        /* ---- Navbar scroll effect ---- */
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
        }, { passive: true });

        /* ---- Mobile burger ---- */
        const burger = document.getElementById('burger');
        const mobileNav = document.getElementById('mobileNav');
        burger.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
        });
        burger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileNav.classList.toggle('open');
            }
        });

        /* ---- Scroll Reveal ---- */
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        // Stagger card animations
                        const delay = entry.target.closest('.product-grid')
                            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 60
                            : 0;
                        setTimeout(() => entry.target.classList.add('visible'), delay);
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
