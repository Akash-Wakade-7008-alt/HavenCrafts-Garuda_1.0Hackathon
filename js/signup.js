 // Redirect if already logged in
        if (typeof redirectIfLoggedIn === 'function') redirectIfLoggedIn();

        /* =============================================
           SHOW / HIDE PASSWORD TOGGLES
        ============================================= */
        function setupEyeToggle(inputId, toggleId) {
            const input = document.getElementById(inputId);
            const toggle = document.getElementById(toggleId);
            toggle.addEventListener('click', () => {
                const showing = input.type === 'text';
                input.type = showing ? 'password' : 'text';
                toggle.textContent = showing ? '👁' : '🙈';
                toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
            });
        }
        setupEyeToggle('password', 'pwToggle');
        setupEyeToggle('confirmPassword', 'cpwToggle');

        /* =============================================
           PASSWORD STRENGTH METER
        ============================================= */
        const strengthColors = ['', '#e74c3c', '#e67e22', '#f1c40f', '#5e8363'];
        const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong 💪'];

        function calcStrength(pw) {
            let score = 0;
            if (pw.length >= 6) score++;
            if (pw.length >= 10) score++;
            if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
            if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
            return score;
        }

        document.getElementById('password').addEventListener('input', () => {
            const val = document.getElementById('password').value;
            const score = val.length ? calcStrength(val) : 0;
            for (let i = 1; i <= 4; i++) {
                const seg = document.getElementById(`seg${i}`);
                seg.style.background = i <= score ? strengthColors[score] : 'var(--border)';
            }
            const lbl = document.getElementById('strengthLabel');
            lbl.textContent = val.length ? strengthLabels[score] : '';
            lbl.style.color = score ? strengthColors[score] : 'var(--text-light)';
            clearError('password', 'passwordError');
        });

        document.getElementById('confirmPassword').addEventListener('input', () => clearError('confirmPassword', 'confirmError'));

        /* =============================================
           VALIDATION HELPERS
        ============================================= */
        function showError(inputId, errorId, message) {
            document.getElementById(inputId).classList.add('error');
            const el = document.getElementById(errorId);
            if (message) el.innerHTML = `⚠ ${message}`;
            el.classList.add('visible');
        }
        function clearError(inputId, errorId) {
            document.getElementById(inputId).classList.remove('error');
            document.getElementById(errorId).classList.remove('visible');
        }
        function isValidEmail(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
        }

        document.getElementById('fullName').addEventListener('input', () => clearError('fullName', 'nameError'));
        document.getElementById('email').addEventListener('input', () => clearError('email', 'emailError'));

        /* =============================================
           FORM SUBMIT
        ============================================= */
        const signupForm = document.getElementById('signupForm');
        const signupBtn = document.getElementById('signupBtn');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const pw = document.getElementById('password').value;
            const cpw = document.getElementById('confirmPassword').value;

            // Name
            if (!name) {
                showError('fullName', 'nameError', 'Full name is required.');
                valid = false;
            } else {
                clearError('fullName', 'nameError');
            }

            // Email
            if (!email) {
                showError('email', 'emailError', 'Email address is required.');
                valid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'emailError', 'Please enter a valid email address.');
                valid = false;
            } else {
                clearError('email', 'emailError');
            }

            // Password
            if (!pw) {
                showError('password', 'passwordError', 'Password is required.');
                valid = false;
            } else if (pw.length < 6) {
                showError('password', 'passwordError', 'Password must be at least 6 characters.');
                valid = false;
            } else {
                clearError('password', 'passwordError');
            }

            // Confirm password
            if (!cpw) {
                showError('confirmPassword', 'confirmError', 'Please confirm your password.');
                valid = false;
            } else if (pw !== cpw) {
                showError('confirmPassword', 'confirmError', 'Passwords do not match.');
                valid = false;
            } else {
                clearError('confirmPassword', 'confirmError');
            }

            if (!valid) return;

            // Simulate loading → success
            signupBtn.classList.add('loading');
            signupBtn.disabled = true;

            setTimeout(() => {
                signupBtn.classList.remove('loading');

                // Realistic Simulation
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                if (users.find(u => u.email === email)) {
                    showError('email', 'emailError', 'Email is already registered.');
                    signupBtn.disabled = false;
                    return;
                }

                users.push({ name, email, password: pw });
                localStorage.setItem('registeredUsers', JSON.stringify(users));

                // Store CurrentSession
                setAuthUser({ name, email, isLoggedIn: true });
                authToast('Welcome to HavenCraft, ' + name + '!');

                signupBtn.classList.add('success');
                signupBtn.querySelector('.btn-text').textContent = '✓ Account created!';

                // Smart Navigation Check
                const redirect = localStorage.getItem('redirectAfterLogin') || 'home.html';
                localStorage.removeItem('redirectAfterLogin');

                setTimeout(() => window.location.href = redirect, 1000);
            }, 1400);
        });

        /* =============================================
           TOAST
        ============================================= */
        function showToast(msg, isError = false) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.toggle('error-toast', isError);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3800);
        }