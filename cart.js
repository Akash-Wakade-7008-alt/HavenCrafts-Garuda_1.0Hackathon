/**
 * cart.js - Global Cart System
 * Include this file at the bottom of all your HTML pages.
 */

// 1. Initialize cart from localStorage
let globalCart = JSON.parse(localStorage.getItem('haven_global_cart')) || [];

// 2. Add to Cart Logic
function addToCart(id, name, price, image = '') {
    // Check if product already exists in the cart
    const existingItem = globalCart.find(item => item.id === id);

    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
        showCartToast(`Increased quantity of ${name} to ${existingItem.quantity}`);
    } else {
        // Add new item
        globalCart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
        showCartToast(`${name} added to cart!`);
    }

    // Save to localStorage and update UI
    saveCart();
}

// 3. Save and Sync Cart
function saveCart() {
    localStorage.setItem('haven_global_cart', JSON.stringify(globalCart));
    updateCartCount();
}

// 4. Get Cart Items (For Cart Page)
function getCartItems() {
    return JSON.parse(localStorage.getItem('haven_global_cart')) || [];
}

// 5. Update Navbar Cart Count
function updateCartCount() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        // Calculate total quantity across all items
        const totalItems = globalCart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;

        // Optional: add a pop animation
        badge.classList.remove('pop');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('pop');
    }
}

// 6. Cross-tab synchronization
// This ensures that if a user has 2 tabs open, adding to cart on Tab A instantly updates Tab B's icon.
window.addEventListener('storage', (e) => {
    if (e.key === 'haven_global_cart') {
        globalCart = JSON.parse(e.newValue) || [];
        updateCartCount();
    }
});

// 7. Initial UI Setup on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Attach click listeners cleanly without inline onclick if desired
    const buyNowBtns = document.querySelectorAll('.btn-buy-now');
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Read data attributes from the button
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = Number(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-img');

            addToCart(id, name, price, image);
        });
    });
});

// Optional: Simple Toast Notification
function showCartToast(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);

        // Basic toast styles applied directly for convenience
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#5e8363';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '50px';
        toast.style.zIndex = '9999';
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
    }

    toast.textContent = msg;
    toast.style.opacity = '1';

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}
