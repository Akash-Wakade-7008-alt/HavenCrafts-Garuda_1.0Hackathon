 /* ---- Product Data ---- */
        const homeDecorProducts = [
            {name: 'Antique Human Face', desc: 'Antique Human Face Showpiece For Home Décor Items, Gift Items, Bedroom', price: '₹449', badge: 'New', img: 'https://classyartz.com/cdn/shop/files/AntiqueHumanFaceShowpieceForHomeDecorItems_GiftItems_Bedroom_LivingRoom_OfficeDecorativeShowpiece_5.jpg?v=1687335305' },
            { name: 'Home decor Budha', desc: 'Home Décor-Buddha (H-34.3CM)', price: '₹1,299', badge: 'Bestseller', img: 'https://momentz.in/cdn/shop/files/MZH23828-201N.png?v=1755064585&width=2048' },
            { name: 'Macrame Wall Hanging Decor', desc: 'Macrame Wall Hanging Decor, Home Decor, Wall Shelves, Wall Hangings for Home Decoration, Wall Decor, Room Decor Items for Bedroom, Aesthetic Room Decor', price: '₹849', badge: 'New', img: 'https://www.homesake.in/cdn/shop/files/IH0E062.jpg?v=1755861768' },
            { name: 'JaipurCrafts Premium Iron Decorative', desc: 'JaipurCrafts Premium Iron Decorative 3 Leaf Design Showpiece For Home decor - table decoration items', price: '₹699', badge: '', img: 'https://www.jaipurcraftonline.com/cdn/shop/files/71iKVrCKakL._SL1500.jpg' },
            { name: 'Set of 2 Iron Lantern ', desc: 'Set of 2 Iron Lantern and Candle Tealight Holder for Home Decor Items With 50 Warm White LEDs ', price: '₹2,499', badge: 'Premium', img: 'https://www.homesake.in/cdn/shop/files/IH0E085_theme.jpg?v=1753004009&width=1946' },
            { name: 'Home decor watch', desc: 'Natural rattan woven pendant lampshade, boho style.', price: '₹1,799', badge: '', img: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/DECEMBER/10/I1N0awsH_3cab9d08b7eb4ae298495ffd2b19a992.jpg' },
            { name: 'Printed Table Runner', desc: 'Hand-block printed cotton table runner — 72 inch.', price: '₹599', badge: '', img: 'https://images.woodenstreet.de/image/cache/data%2Fhome-decors%2Fwall-decors%2Fwall-hangings%2Firon-gold-and-copper-with-led-wall-hanging%2Fupdated%2FBE-1-750x650.jpg' },
            { name: 'Gallery Wall Set', desc: '6-piece gallery wall kit with botanical art prints.', price: '₹1,149', badge: 'Trending', img: 'https://www.craftsnchisel.com/cdn/shop/products/brass-musician-decorative-with-stonework-set-of-5-table-decor-indian-home-decor-crafts-n-chisel-1_1000x.jpg?v=1671240664' },
            { name: 'Vintage Floor Rug', desc: 'Handwoven Persian-style vintage area rug in muted tones.', price: '₹3,499', badge: 'Trending', img: 'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=400&q=75&auto=format&fit=crop' },
            { name: 'Abstract Ceramic Vase', desc: 'Modern sculptural vase with a textured matte finish.', price: '₹899', badge: 'New', img: 'https://buildingandinteriors.com/wp-content/uploads/2022/05/2022-05-13-38_1.webp' },
            { name: 'Woven Storage Basket', desc: 'Eco-friendly seagrass storage basket for throws and magazines.', price: '₹1,199', badge: '', img: 'https://ikiru.in/cdn/shop/files/37RhMt7DDAVq71nRkgEhJmfthYjj8slpen-V5g7LGLs.jpg?v=1756805933&width=1500' },
            { name: 'Brass Sunset Mirror', desc: 'Minimalist round wall mirror with brushed brass frame.', price: '₹1,999', badge: 'Premium', img: 'https://cdn.moolwan.com/374445b4-2197-43c6-a0b3-6bc588b62774.jpg' }
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
            { name: 'Artisan Tea Box', desc: 'Wooden selection box featuring 6 loose-leaf organic tea blends.', price: '₹1,499', badge: 'Festive', img: 'https://images.unsplash.com/photo-1576092762791-dd9e22204481?w=400&q=75&auto=format&fit=crop' },
            { name: 'Monogram Leather Wallet', desc: 'Full-grain leather wallet with custom gold-foil monogramming.', price: '₹1,299', badge: 'Customizable', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=75&auto=format&fit=crop' },
            { name: 'Crystal Glass Set', desc: 'Set of 4 etched crystal tumblers for whiskey or cocktails.', price: '₹2,199', badge: 'Premium', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=75&auto=format&fit=crop' },
            { name: 'Curated Succulent Garden', desc: 'Three beautiful assorted succulents in modern ceramic pots.', price: '₹849', badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=75&auto=format&fit=crop' }
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
              <button class="btn btn-primary action-btn add-cart-btn" aria-label="Buy Now ${product.name}">Buy Now</button>
              <button class="btn btn-ghost action-btn" aria-label="Customize ${product.name}">Customize</button>
            </div>
          </div>
        </div>
      `;
        }

        const decorRowHTML = `<div class="product-grid" style="margin-bottom: 32px;">${homeDecorProducts.map(buildCard).join('')}</div>`;
        document.getElementById('homeDecorGrid').outerHTML = decorRowHTML + decorRowHTML + decorRowHTML;

        const giftingRowHTML = `<div class="product-grid" style="margin-bottom: 32px;">${giftingProducts.map(buildCard).join('')}</div>`;
        document.getElementById('giftingGrid').outerHTML = giftingRowHTML + giftingRowHTML + giftingRowHTML;

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
                openModal();
                return;
            }
            if (e.target.classList.contains('action-btn')) {
                e.stopPropagation();
                openModal();
            }
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

        /* ---- Explicit Auth Redirections ---- */
        const lgBtn = document.getElementById('loginBtn');
        const mbgLgBtn = document.getElementById('mobileLoginBtn');
        const suBtn = document.getElementById('signupBtn');
        const mbgSuBtn = document.getElementById('mobileSignupBtn');
        
        [lgBtn, mbgLgBtn].forEach(btn => {
            if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'pages/login.html'; });
        });
        
        [suBtn, mbgSuBtn].forEach(btn => {
            if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'pages/signup.html'; });
        });

