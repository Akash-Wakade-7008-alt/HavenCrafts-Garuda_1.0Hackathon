// Redirect if already logged in
        if (typeof redirectIfLoggedIn === 'function') redirectIfLoggedIn();

        /* =============================================
           SHOW / HIDE PASSWORD
        ============================================= */
        const pwInput = document.getElementById('password');
        const pwToggle = document.getElementById('pwToggle');

        pwToggle.addEventListener('click', () => {
            const showing = pwInput.type === 'text';
            pwInput.type = showing ? 'password' : 'text';
            pwToggle.textContent = showing ? '👁' : '🙈';
            pwToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
        });

        /* =============================================
           VALIDATION HELPERS
        ============================================= */
        function showError(inputId, errorId, message) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            input.classList.add('error');
            error.textContent = message ? `⚠ ${message}` : error.textContent;
            error.classList.add('visible');
            return false;
        }

        function clearError(inputId, errorId) {
            document.getElementById(inputId).classList.remove('error');
            document.getElementById(errorId).classList.remove('visible');
        }

        function isValidEmail(val) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
        }

        // Live validation — clear error as user types
        document.getElementById('email').addEventListener('input', () => clearError('email', 'emailError'));
        document.getElementById('password').addEventListener('input', () => clearError('password', 'passwordError'));

        /* =============================================
           FORM SUBMIT
        ============================================= */
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const emailVal = document.getElementById('email').value;
            const pwVal = document.getElementById('password').value;

            // Validate email
            if (!emailVal.trim()) {
                showError('email', 'emailError', 'Email address is required.');
                valid = false;
            } else if (!isValidEmail(emailVal)) {
                showError('email', 'emailError', 'Please enter a valid email address.');
                valid = false;
            } else {
                clearError('email', 'emailError');
            }

            // Validate password
            if (!pwVal.trim()) {
                showError('password', 'passwordError', 'Password cannot be empty.');
                valid = false;
            } else {
                clearError('password', 'passwordError');
            }

            // valid is false if one field fails
            if (!valid) return;

            // Simulate loading → success
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;

            setTimeout(() => {
                loginBtn.classList.remove('loading');

                // Realistic Simulation
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const foundUser = users.find(u => u.email === emailVal && u.password === pwVal);

                let name = foundUser ? foundUser.name : emailVal.split('@')[0];

                // Store CurrentSession
                setAuthUser({ name, email: emailVal, isLoggedIn: true });
                authToast('Welcome, ' + name + '!');

                loginBtn.classList.add('success');
                loginBtn.querySelector('.btn-text').textContent = '✓ Logged In';

                // Navigation Check
                localStorage.removeItem('redirectAfterLogin');
                setTimeout(() => window.location.href = 'home.html', 800);
            }, 800);
        });

        /* =============================================
           TOAST
        ============================================= */
        function showToast(msg, isError = false) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.toggle('error-toast', isError);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3500);
        }

        /* =============================================
           FORGOT PASSWORD MODAL
        ============================================= */
        const forgotModal = document.getElementById('forgotModal');
        const forgotBox = document.getElementById('forgotBox');

        document.getElementById('forgotLink').addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.style.opacity = '1';
            forgotModal.style.pointerEvents = 'all';
            forgotBox.style.transform = 'scale(1) translateY(0)';
        });

        function closeForgot() {
            forgotModal.style.opacity = '0';
            forgotModal.style.pointerEvents = 'none';
            forgotBox.style.transform = 'scale(0.94) translateY(16px)';
        }

        forgotModal.addEventListener('click', (e) => {
            if (e.target === forgotModal) closeForgot();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeForgot();
        });

        function sendReset() {
            const val = document.getElementById('forgotEmail').value.trim();
            if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                showToast('⚠ Please enter a valid email.', true);
                return;
            }
            closeForgot();
            showToast('📧 Password reset link sent (demo)', false);
        }