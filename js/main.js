
// =========================================
// PRELOADER
// =========================================
(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const removePreloader = () => {
            if (preloader.classList.contains('preloader-hidden')) return;
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                document.body.classList.remove('preloader-active');
                if(preloader.parentNode) preloader.parentNode.removeChild(preloader);
            }, 750); // Matches CSS transition duration
        };

        // Remove on window load
        window.addEventListener('load', removePreloader);

        // Fallback: Remove after 4 seconds max to prevent infinite loading
        setTimeout(removePreloader, 4000);
    }
})();

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

    
    function showError(inputElement, message) {
        clearError(inputElement);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.35rem';
        errorDiv.textContent = message;
        
        let targetWrapper = inputElement;
        if (inputElement.parentElement && inputElement.parentElement.style.position === 'relative') {
            targetWrapper = inputElement.parentElement;
        }
        
        targetWrapper.parentNode.insertBefore(errorDiv, targetWrapper.nextSibling);
        inputElement.style.borderColor = '#ef4444';
    }

    function clearError(inputElement) {
        let targetWrapper = inputElement;
        if (inputElement.parentElement && inputElement.parentElement.style.position === 'relative') {
            targetWrapper = inputElement.parentElement;
        }
        
        const nextEl = targetWrapper.nextSibling;
        if (nextEl && nextEl.classList && nextEl.classList.contains('error-message')) {
            nextEl.parentNode.removeChild(nextEl);
        }
        inputElement.style.borderColor = '';
    }

    document.addEventListener('input', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            clearError(e.target);
        }
    });
    
    document.addEventListener('change', (e) => {
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
            const isRequired = field.hasAttribute('required') || field.getAttribute('data-custom-required') === 'true';
            
            if (isRequired) {
                if ((field.type === 'checkbox' && !field.checked) || (field.type !== 'checkbox' && val === '')) {
                    const fieldName = field.getAttribute('placeholder') || field.previousElementSibling?.textContent || 'This field';
                    showError(field, fieldName.replace(/[*:]/g, '').trim() + ' is required');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }

            if (field.type === 'email' && val !== '') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field;
                    return;
                }
            }
            
            if (field.type === 'tel' && val !== '') {
                if (!/^\d{10,15}$/.test(val.replace(/[^0-9]/g, ''))) {
                    showError(field, 'Please enter a valid phone number');
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
            const roleInput = document.getElementById('loginRole');
            const role = roleInput ? roleInput.value : 'client';
            const btn = document.getElementById('loginSubmitBtn');
            if (btn) btn.textContent = "Authenticating...";
            
            const emailInput = document.getElementById('loginEmail');
            if(emailInput && emailInput.value) { 
                let n = emailInput.value.split("@")[0]; 
                localStorage.setItem("stacklyUserName", n.charAt(0).toUpperCase() + n.slice(1)); 
            }
            
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", role);
            
            setTimeout(() => {
                window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
            }, 1000);
            return;
        }

        if (form.id === 'proSignupForm') {
            const btn = document.getElementById('signupSubmitBtn');
            if (btn) btn.textContent = "Creating Account...";
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
            return;
        }
        
        const successAction = form.getAttribute('data-success-action');
        if (successAction === '404') {
            window.location.href = '404.html';
        } else if (successAction === 'login_success') {
            const role = document.getElementById('loginRole');
            if(role && role.value === 'admin') window.location.href = 'admin-dashboard.html';
            else window.location.href = 'client-dashboard.html';
        } else if (successAction === 'contact_success') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = "Message Sent Successfully!";
                btn.style.backgroundColor = "#10b981";
            }
        } else if (successAction === 'profile_success' || successAction === 'password_success') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "Successfully Updated!";
                btn.style.backgroundColor = "#10b981"; 
                btn.style.color = "#ffffff";
                btn.style.borderColor = "#10b981";
                setTimeout(() => { 
                    btn.textContent = originalText; 
                    btn.style.backgroundColor = ""; 
                    btn.style.color = "";
                    btn.style.borderColor = "";
                }, 3000);
            }
        } else {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "Success!";
                btn.style.backgroundColor = "#10b981";
                setTimeout(() => { 
                    btn.textContent = originalText; 
                    btn.style.backgroundColor = ""; 
                }, 3000);
            } else {
                form.reset();
            }
        }
    });
});
