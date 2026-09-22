document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-in-out'
        });
    }

    // 2. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Mobile Menu Management
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    const closeMenu = () => {
        if (navLinks) navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        document.body.style.overflow = ''; 
    };

    const toggleMenu = () => {
        const isActive = navLinks && navLinks.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            if(navLinks) navLinks.classList.add('active');
            if(navActions) navActions.classList.add('active');
            if(toggleBtn) {
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
            document.body.style.overflow = 'hidden'; 
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    const allLinks = document.querySelectorAll('.nav-links a, .nav-actions a');
    allLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (navbar && !navbar.contains(e.target)) {
                closeMenu();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // 4. Back-to-Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    
    if (!document.querySelector('.dashboard-layout-mega')) {
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Active Navigation State Detection
    const currentPath = window.location.pathname.split('/').pop();
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    navAnchors.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.style.color = 'var(--accent)';
            link.style.fontWeight = '700';
            link.style.position = 'relative';
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.bottom = '-4px';
            dot.style.left = '50%';
            dot.style.transform = 'translateX(-50%)';
            dot.style.width = '20px';
            dot.style.height = '3px';
            dot.style.backgroundColor = 'var(--accent)';
            dot.style.borderRadius = '2px';
            link.appendChild(dot);
        }
    });

    // 6. INLINE JAVASCRIPT VALIDATION (NO POPUPS)
    function showError(inputElement, message) {
        const errorSpan = document.getElementById(inputElement.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    function clearError(inputElement) {
        const errorSpan = document.getElementById(inputElement.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    document.addEventListener('input', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            clearError(e.target);
        }
    });

    document.addEventListener('submit', (e) => {
        const form = e.target;
        e.preventDefault(); 

        let isValid = true;
        let firstInvalidInput = null;

        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            clearError(field);
            const val = field.value.trim();

            if (field.getAttribute('data-custom-required') === 'true') {
                if ((field.type === 'checkbox' && !field.checked) || (field.type !== 'checkbox' && val === '')) {
                    showError(field, 'Please enter valid data');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }

            if (field.type === 'email' && val !== '') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    showError(field, 'Enter a valid email address');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }

            if (form.id === 'proSignupForm') {
                if (field.id === 'sPassword' && val !== '') {
                    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val)) {
                        showError(field, 'Password must be 8+ chars containing letters & numbers');
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = field;
                        return;
                    }
                }
                if (field.id === 'sConfirmPassword' && val !== '') {
                    const passField = document.getElementById('sPassword');
                    if (passField && val !== passField.value.trim()) {
                        showError(field, 'Passwords do not match');
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = field;
                        return;
                    }
                }
            }
        });

        if (!isValid) {
            if (firstInvalidInput) firstInvalidInput.focus();
            return;
        }

        if (form.id === 'proLoginForm') {
            const role = document.getElementById('role') ? document.getElementById('role').value : 'client';
            const btn = document.getElementById('loginSubmitBtn');
            if (btn) btn.innerText = "Authenticating...";
            
            const emailInput = document.getElementById('loginEmail') || document.getElementById('email');
            if(emailInput && emailInput.value) { 
                let n = emailInput.value.split("@")[0]; 
                localStorage.setItem("stacklyUserName", n.charAt(0).toUpperCase() + n.slice(1)); 
            }
            
            setTimeout(() => {
                window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
            }, 1000);
            return;
        }

        if (form.id === 'proSignupForm') {
            const btn = document.getElementById('signupSubmitBtn');
            if (btn) btn.innerText = "Creating Account...";
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
            return;
        }
        
        const successAction = form.getAttribute('data-success-action');
        if (successAction === '404') {
            window.location.href = '404.html';
        } else if (successAction === 'profile_success' || successAction === 'password_success') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = "Successfully Updated!";
                btn.style.backgroundColor = "#10b981"; 
                btn.style.color = "#ffffff";
                btn.style.borderColor = "#10b981";
                setTimeout(() => { 
                    btn.innerText = originalText; 
                    btn.style.backgroundColor = ""; 
                    btn.style.color = "";
                    btn.style.borderColor = "";
                }, 3000);
            }
        } else {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = "Success!";
                btn.style.backgroundColor = "#10b981";
                setTimeout(() => { 
                    btn.innerText = originalText; 
                    btn.style.backgroundColor = ""; 
                }, 3000);
            } else {
                form.reset();
            }
        }
    });
});
