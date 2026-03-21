 let cartItems = [];

        function loadCart() {
            cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
            renderCart();
            updateSummary();
            
            // Pop the badge animation
            const badge = document.querySelector('.global-cart-badge');
            if(badge) {
                badge.style.transform = 'scale(1.4)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            }
        }

        function saveCart() {
            localStorage.setItem('hc_cart_items', JSON.stringify(cartItems));
            updateSummary();
            if (typeof syncCartBadge === 'function') syncCartBadge();
        }

        function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}`; }

        function renderCart() {
            const container = document.getElementById('cartItemsContainer');
            const summaryPanel = document.getElementById('cartSummaryPanel');
            
            if (cartItems.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <a href="home.html" class="btn-primary" style="display:inline-block;">Continue Shopping</a>
                    </div>
                `;
                summaryPanel.style.display = 'none';
                return;
            }

            summaryPanel.style.display = 'block';
            container.innerHTML = cartItems.map((item, index) => {
                const qty = item.qty || 1;
                const custText = item.customization || '';
                const custHtml = custText ? `<div class="item-cust">✨ ${custText}</div>` : '';
                const custImgHtml = item.customizationImage
                    ? `<div style="margin-bottom:10px"><img src="${item.customizationImage}" alt="Customization preview" style="max-width:80px;max-height:60px;border-radius:8px;border:1px solid #e8e0d5;object-fit:cover;"/></div>`
                    : '';
                return `
                    <div class="cart-item">
                        <button class="remove-btn" title="Remove Item" onclick="removeItem(${index})">✕</button>
                        <img src="${item.img}" alt="${item.name}" class="item-img" />
                        <div class="item-details">
                            <div>
                                <h3 class="item-name">${item.name}</h3>
                                <p class="item-desc">${item.desc || 'Beautiful carefully crafted product.'}</p>
                                ${custHtml}
                                ${custImgHtml}
                                <button class="btn-outline" style="padding:5px 14px;font-size:0.8rem;border-color:#e8e0d5;margin-bottom:12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;border-radius:50px;background:none;color:#5a5a5a;transition:all 0.2s;" onmouseover="this.style.borderColor='#8aad8f';this.style.color='#5e8363'" onmouseout="this.style.borderColor='#e8e0d5';this.style.color='#5a5a5a'" onclick="editCartItemCust(${index})">✏️ Edit Customization</button>
                            </div>
                            <div class="item-bottom">
                                <span class="item-price">${formatPrice(item.price)}</span>
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="changeQty(${index}, -1)" aria-label="Decrease quantity">−</button>
                                    <span class="qty-val">${qty}</span>
                                    <button class="qty-btn" onclick="changeQty(${index}, 1)" aria-label="Increase quantity">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function changeQty(index, delta) {
            let currentQty = cartItems[index].qty || 1;
            let newQty = currentQty + delta;
            
            if (newQty < 1) newQty = 1;
            
            if (currentQty !== newQty) {
                cartItems[index].qty = newQty;
                saveCart();
                renderCart();
            } else if (delta < 0) {
                showToast("Quantity cannot be less than 1. Use the remove button '✕' to delete.");
            }
        }

        function removeItem(index) {
            cartItems.splice(index, 1);
            saveCart();
            renderCart();
            showToast("Item removed from cart 🗑️");
        }

        function updateSummary() {
            const totalQty = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
            const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
            
            document.getElementById('summaryCount').textContent = totalQty;
            document.getElementById('summarySubtotal').textContent = formatPrice(totalPrice);
            document.getElementById('summaryTotal').textContent = formatPrice(totalPrice);
        }

        function proceedToCheckout() {
            if (cartItems.length === 0) {
                showToast("Your cart is empty.");
                return;
            }
            
            // Redirect to the new payment flow
            window.location.href = 'payment.html';
        }

        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(t.tid);
            t.tid = setTimeout(() => t.classList.remove('show'), 2800);
        }

        // Initialize display
        document.addEventListener('DOMContentLoaded', loadCart);

        // Optional cross-tab syncing specifically for the cart page UI
        window.addEventListener('storage', (e) => {
            if (e.key === 'hc_cart_items') {
                loadCart(); // Dynamically re-render the entire cart block if changed elsewhere!
            }
        });

        /* ─── Edit Customization from Cart ─── */
        function editCartItemCust(index) {
            const item = cartItems[index];
            if (!item) return;
            if (typeof HC_Cust !== 'undefined') {
                // Use the item's productId if available, otherwise fallback to name
                const productId = item.id || item.name;
                HC_Cust.open(productId, item.name);
            } else {
                showToast('Customization service not available');
            }
        }

        // Re-render cart when HC_Cust saves customization (updates hc_cart_items)
        document.addEventListener('DOMContentLoaded', loadCart);

        window.addEventListener('storage', (e) => {
            if (e.key === 'hc_cart_items' || e.key === 'hc_customizations') {
                loadCart();
            }
        });