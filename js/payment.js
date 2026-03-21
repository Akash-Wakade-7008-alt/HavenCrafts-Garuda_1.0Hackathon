 const cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
        
        // ─── UTILS ───
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(t.tid);
            t.tid = setTimeout(() => t.classList.remove('show'), 2800);
        }

        function formatPrice(num) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
        }

        // ─── INITIALIZE ───
        function initCheckout() {
            if (cartItems.length === 0) {
                document.getElementById('mainContainer').innerHTML = `
                    <div class="checkout-panel empty-cart-state" style="grid-column: 1 / -1;">
                        <h2>Your cart is empty</h2>
                        <p style="margin: 16px 0; color: var(--mid)">You cannot proceed to checkout with an empty cart.</p>
                        <a href="home.html" class="btn-checkout" style="display: inline-flex; width: auto; padding: 12px 32px; text-decoration: none;">Continue Shopping</a>
                    </div>
                `;
                return;
            }

            renderSummary();
            loadDraftForm();
            
            // Focus first field
            setTimeout(() => document.getElementById('fullName').focus(), 100);

            // Handle Payment Option Selection styling
            document.querySelectorAll('.payment-option input').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
                    e.target.closest('.payment-option').classList.add('selected');
                });
            });

            // Save form data on input
            document.querySelectorAll('#checkoutForm input').forEach(input => {
                input.addEventListener('input', () => {
                    input.parentElement.classList.remove('has-error');
                    saveDraftForm();
                });
            });

            document.getElementById('placeOrderBtn').addEventListener('click', handleCheckout);
        }

        // ─── RENDER SUMMARY ───
        function renderSummary() {
            const container = document.getElementById('summaryItems');
            let subtotal = 0;

            container.innerHTML = cartItems.map(item => {
                const itemTotal = Number(item.price) * (item.qty || 1);
                subtotal += itemTotal;
                
                const customText = item.customization ? `<div class="item-cust">Customized: ${item.customization}</div>` : '';
                const imgSrc = item.customizationImage || item.img;

                return `
                    <div class="summary-item">
                        <img src="${imgSrc}" class="item-img" alt="${item.name}">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price-qty">Qty: ${item.qty || 1} × ${formatPrice(item.price)}</div>
                            ${customText}
                        </div>
                        <div class="item-total-price">${formatPrice(itemTotal)}</div>
                    </div>
                `;
            }).join('');

            document.getElementById('subtotalAmount').textContent = formatPrice(subtotal);
            document.getElementById('totalAmount').textContent = formatPrice(subtotal);
            document.getElementById('placeOrderBtn').querySelector('.btn-text').textContent = `Place Order • ${formatPrice(subtotal)}`;
        }

        // ─── FORM PERSISTENCE ───
        const fields = ['fullName', 'phone', 'email', 'address1', 'address2', 'city', 'state', 'pincode'];

        function saveDraftForm() {
            const data = {};
            fields.forEach(f => {
                data[f] = document.getElementById(f).value.trim();
            });
            localStorage.setItem('hc_draft_shipping', JSON.stringify(data));
        }

        function loadDraftForm() {
            try {
                const data = JSON.parse(localStorage.getItem('hc_draft_shipping'));
                if (data) {
                    fields.forEach(f => {
                        if (data[f]) document.getElementById(f).value = data[f];
                    });
                }
            } catch (e) {}
        }

        // ─── VALIDATION & CHECKOUT LOGIC ───
        function validateForm() {
            let isValid = true;
            
            const check = (id, condition) => {
                const input = document.getElementById(id);
                if (condition) {
                    input.parentElement.classList.remove('has-error');
                } else {
                    input.parentElement.classList.add('has-error');
                    isValid = false;
                }
            };

            const data = {};
            fields.forEach(f => data[f] = document.getElementById(f).value.trim());

            check('fullName', data.fullName.length >= 2);
            check('phone', /^[0-9]{10}$/.test(data.phone));
            check('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email));
            check('address1', data.address1.length > 5);
            check('city', data.city.length > 2);
            check('state', data.state.length > 2);
            check('pincode', /^[0-9]{6}$/.test(data.pincode));

            return isValid ? data : null;
        }

        function handleCheckout() {
            const formData = validateForm();
            if (!formData) {
                showToast('Please correct the highlighted fields.');
                return;
            }

            const btn = document.getElementById('placeOrderBtn');
            btn.classList.add('loading');
            btn.disabled = true;

            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);

            const orderDetail = {
                orderId: 'ORD-' + Date.now().toString().slice(-6),
                items: cartItems,
                deliveryDetails: formData,
                totalAmount: subtotal,
                paymentMethod: paymentMethod,
                orderDate: new Date().toISOString()
            };

            // Simulate network processing
            setTimeout(() => {
                // Save Order
                localStorage.setItem('hc_current_order', JSON.stringify(orderDetail));
                
                // Save to history
                let history = JSON.parse(localStorage.getItem('hc_order_history') || '[]');
                history.push(orderDetail);
                localStorage.setItem('hc_order_history', JSON.stringify(history));

                // Clear Cart
                localStorage.removeItem('hc_cart_items');

                window.location.href = 'success.html';
            }, 1200);
        }

        document.addEventListener('DOMContentLoaded', initCheckout);