/**
 * HavenCraft - Authentication & Session Management
 * Included globally across all pages.
 */

function getAuthUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setAuthUser(userObj) {
    localStorage.setItem('currentUser', JSON.stringify(userObj));
}

function removeAuthUser() {
    localStorage.removeItem('currentUser');
}

// Ensure unique toast functionality if not present from other scripts
function authToast(msg, isError = false) {
    if (typeof window.showToast === 'function') {
        window.showToast(msg);
        return;
    }
    let t = document.getElementById('authToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'authToast';
        t.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(70px);
      background: ${isError ? '#e57373' : 'var(--saged, #5e8363)'}; color: #fff; padding: 12px 24px;
      border-radius: 50px; font-size: .88rem; font-weight: 500; z-index: 10000;
      transition: all 0.3s; opacity: 0; pointer-events: none; font-family: sans-serif;
    `;
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = isError ? '#e57373' : 'var(--saged, #5e8363)';
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.opacity = '1';
    clearTimeout(t._tid);
    t._tid = setTimeout(() => {
        t.style.transform = 'translateX(-50%) translateY(70px)';
        t.style.opacity = '0';
    }, 2800);
}

// 1. Route Protection for highly sensitive pages (e.g. payment.html)
function protectRoute() {
    const user = getAuthUser();
    if (!user) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 2. Action Protection for Click events (Buy Now, Cart, Customize)
function protectAction(e) {
    const user = getAuthUser();
    if (!user) {
        if (e) e.stopPropagation();
        authToast('Please login first to continue', true);
        localStorage.setItem('redirectAfterLogin', window.location.href);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

// 3. Keep Logged-in users off Login/Signup
function redirectIfLoggedIn() {
    if (getAuthUser()) {
        window.location.href = 'home.html';
    }
}

// 4. Update Header DOM Dynamically
function updateAuthUI() {
    const user = getAuthUser();

    // Update Shared.js nav list (categories) or home.html nav list
    const navLists = document.querySelectorAll('.nav, .nav-links');

    navLists.forEach(ul => {
        // Standardize: Remove existing Login/Signup/User nodes injected previously
        [...ul.querySelectorAll('.auth-node')].forEach(n => n.remove());

        if (user) {
            // Logged IN
            const liUser = document.createElement('li');
            liUser.className = 'auth-node';
            liUser.innerHTML = `<span style="color:var(--saged);font-weight:600;font-size:0.95rem;">Hi, ${user.name.split(' ')[0]}</span>`;

            const liOut = document.createElement('li');
            liOut.className = 'auth-node';
            liOut.innerHTML = `<a href="#" onclick="handleLogout(event)">Logout</a>`;

            ul.appendChild(liUser);
            ul.appendChild(liOut);
        } else {
            // Logged OUT
            const liIn = document.createElement('li');
            liIn.className = 'auth-node';
            liIn.innerHTML = `<a href="login.html">Login</a>`;

            const liUp = document.createElement('li');
            liUp.className = 'auth-node';
            liUp.innerHTML = `<a href="signup.html" style="background:var(--sage);color:#fff;padding:6px 14px;border-radius:20px;">Sign Up</a>`;

            ul.appendChild(liIn);
            ul.appendChild(liUp);
        }
    });

    // Apply auto-fill logic if on payment.html
    if (user && window.location.pathname.includes('payment.html')) {
        const fName = document.getElementById('fName');
        const fEmail = document.getElementById('fEmail');
        // Only autofill if they are empty
        if (fName && !fName.value) fName.value = user.name;
        if (fEmail && !fEmail.value) fEmail.value = user.email;
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    removeAuthUser();
    authToast('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// Sync Cart Badge dynamically
function syncCartBadge() {
    let cartItems = JSON.parse(localStorage.getItem('hc_cart_items') || '[]');
    const totalQty = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.querySelectorAll('.global-cart-badge, #cartBadge, #mobileCartBadge').forEach(badge => {
        badge.textContent = totalQty;
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'hc_cart_items') syncCartBadge();
});

// Listen globally
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    syncCartBadge();
});
