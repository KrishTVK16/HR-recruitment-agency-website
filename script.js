// ========================================
// HR RECRUIT - MAIN JAVASCRIPT
// Visual Effects & Animations
// ========================================

// ========================================
// THEME / DARK MODE TOGGLE
// ========================================
const themeToggle = document.querySelector('.theme-toggle');
const THEME_KEY = 'hrRecruitTheme';

if (themeToggle) {
    // Initialize from localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.setAttribute('aria-pressed', 'true');
        themeToggle.querySelector('.theme-toggle-icon').textContent = '🌙';
        themeToggle.querySelector('.theme-toggle-label').textContent = 'Dark';
    } else {
        themeToggle.setAttribute('aria-pressed', 'false');
        themeToggle.querySelector('.theme-toggle-icon').textContent = '☀️';
        themeToggle.querySelector('.theme-toggle-label').textContent = 'Light';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.querySelector('.theme-toggle-icon').textContent = isDark ? '🌙' : '☀️';
        themeToggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Dark' : 'Light';
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    });
}

// ========================================
// LANGUAGE TOGGLE (EN/AR)
// ========================================
const langToggle = document.getElementById('langToggle');
const LANG_KEY = 'hrRecruitLang';

if (langToggle) {
    // Initialize from localStorage
    const savedLang = localStorage.getItem(LANG_KEY) || 'en';
    setLanguage(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        localStorage.setItem(LANG_KEY, newLang);
    });
}

function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    
    // Update RTL direction for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        if (langToggle) langToggle.textContent = 'AR';
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        if (langToggle) langToggle.textContent = 'EN';
    }

    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // Check if element has child nodes we shouldn't replace
            if (el.childElementCount === 0) {
                el.textContent = text;
            } else {
                // For elements with children, only update text nodes
                const firstTextNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (firstTextNode) {
                    firstTextNode.textContent = text;
                }
            }
        }
    });
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create mobile menu backdrop (50% opacity dark overlay)
let mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
if (!mobileMenuBackdrop && navMenu) {
    mobileMenuBackdrop = document.createElement('div');
    mobileMenuBackdrop.classList.add('mobile-menu-backdrop');
    document.body.appendChild(mobileMenuBackdrop);
}

// Create close button inside nav menu
let mobileMenuClose = navMenu?.querySelector('.mobile-menu-close');
if (!mobileMenuClose && navMenu) {
    mobileMenuClose = document.createElement('button');
    mobileMenuClose.classList.add('mobile-menu-close');
    mobileMenuClose.setAttribute('aria-label', 'Close menu');
    mobileMenuClose.setAttribute('type', 'button');
    navMenu.insertBefore(mobileMenuClose, navMenu.firstChild);
}

// Ensure closed state on load
const resetMobileMenuState = () => {
    navMenu?.classList.remove('active');
    mobileMenuBackdrop?.classList.remove('active');
    mobileMenuToggle?.classList.remove('active');
    document.body.classList.remove('menu-open');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
};
resetMobileMenuState();

if (mobileMenuToggle && navMenu) {
    const toggleMobileMenu = (forceClose = false) => {
        const shouldClose = forceClose || navMenu.classList.contains('active');
        
        if (shouldClose) {
            navMenu.classList.remove('active');
            mobileMenuBackdrop?.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        } else {
            navMenu.classList.add('active');
            mobileMenuBackdrop?.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.classList.add('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    mobileMenuToggle.addEventListener('click', () => toggleMobileMenu());

    // Close menu when clicking backdrop
    mobileMenuBackdrop?.addEventListener('click', () => toggleMobileMenu(true));

    // Close menu when clicking close button
    mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(true));

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Close menu on window resize (when switching to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navMenu.classList.contains('active')) {
            toggleMobileMenu(true);
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu(true);
        }
    });
}

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================
const currentPath = window.location.pathname;
const currentPage = currentPath.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const linkPage = linkPath.split('/').pop();
    
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
    
    // Also check for service pages - they should have Services as active
    if (currentPage.startsWith('service-') && linkPage === 'services.html') {
        link.classList.add('active');
    }
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
const scrollAnimateElements = document.querySelectorAll('.scroll-animate');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

scrollAnimateElements.forEach(el => {
    scrollObserver.observe(el);
});

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(el) {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
    const suffix = el.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = target + suffix;
        }
    };

    requestAnimationFrame(updateCounter);
}

const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => {
    counterObserver.observe(num);
});

// ========================================
// CONTACT FORM VALIDATION
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        const spamCheck = document.getElementById('spam-check').checked;
        
        let isValid = true;
        
        // Spam protection (honeypot)
        if (spamCheck) {
            showFormMessage('Spam detected. Please try again.', 'error');
            return;
        }
        
        // Validate name
        if (name === '') {
            showError('name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone (optional but if provided, should be valid)
        if (phone !== '') {
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
        }
        
        // Validate message
        if (message === '') {
            showError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission (replace with actual AJAX call)
            submitForm(name, email, phone, message);
        }
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.style.borderColor = 'var(--error-color)';
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.setAttribute('role', 'alert');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

function submitForm(name, email, phone, message) {
    // Simulate AJAX submission
    showFormMessage('Sending message...', 'success');
    
    // In a real application, you would make an AJAX call here
    setTimeout(() => {
        showFormMessage('Message sent successfully! We will get back to you soon.', 'success');
        contactForm.reset();
        
        // Clear errors after successful submission
        setTimeout(() => {
            clearErrors();
        }, 100);
    }, 1000);
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// BACK TO TOP BUTTON
// ========================================
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// HOME DROPDOWN TOGGLE
// ========================================
document.querySelectorAll('.home-dropdown-label').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = button.closest('.home-dropdown');
        const isOpen = parent.classList.contains('open');

        // Close any other open home dropdowns
        document.querySelectorAll('.home-dropdown.open').forEach(item => {
            if (item !== parent) {
                item.classList.remove('open');
            }
        });

        if (!isOpen) {
            parent.classList.add('open');
        } else {
            parent.classList.remove('open');
        }
    });
});

// Close home dropdown when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.home-dropdown.open').forEach(item => {
        item.classList.remove('open');
    });
});

// ========================================
// LOGIN FORM VALIDATION
// ========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const emailError = document.getElementById('loginEmailError');
        const passwordError = document.getElementById('loginPasswordError');
        const formMessage = document.getElementById('loginFormMessage');

        emailError.textContent = '';
        passwordError.textContent = '';
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Enter a valid email address';
            isValid = false;
        }

        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Password is required';
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (isValid) {
            formMessage.textContent = 'Login successful (demo only).';
            formMessage.className = 'form-message success';
        }
    });
}

// ========================================
// REGISTER FORM VALIDATION
// ========================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('registerConfirmPassword');
        const termsCheckbox = document.getElementById('registerTerms');
        const nameError = document.getElementById('registerNameError');
        const emailError = document.getElementById('registerEmailError');
        const passwordError = document.getElementById('registerPasswordError');
        const confirmError = document.getElementById('registerConfirmPasswordError');
        const termsError = document.getElementById('registerTermsError');
        const formMessage = document.getElementById('registerFormMessage');

        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmError.textContent = '';
        if (termsError) {
            termsError.textContent = '';
        }
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameInput.value.trim()) {
            nameError.textContent = 'Full name is required';
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Enter a valid email address';
            isValid = false;
        }

        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Password is required';
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!confirmInput.value.trim()) {
            confirmError.textContent = 'Please confirm your password';
            isValid = false;
        } else if (confirmInput.value.trim() !== passwordInput.value.trim()) {
            confirmError.textContent = 'Passwords do not match';
            isValid = false;
        }

        if (termsCheckbox && !termsCheckbox.checked) {
            if (termsError) {
                termsError.textContent = 'You must agree to the Terms and Conditions';
            }
            isValid = false;
        }

        if (isValid) {
            formMessage.textContent = 'Account created successfully (demo only).';
            formMessage.className = 'form-message success';
            registerForm.reset();
        }
    });
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }
    }
    
    lastScroll = currentScroll;
});

// ========================================
// TYPEWRITER EFFECT
// ========================================
function initTypewriterEffect() {
    const targets = document.querySelectorAll('[data-typewriter]');
    targets.forEach(el => {
        const fullText = el.getAttribute('data-typewriter') || el.textContent;
        el.textContent = '';

        const caret = document.createElement('span');
        caret.className = 'typewriter-caret';
        caret.textContent = '|';
        el.appendChild(caret);

        let index = 0;
        const typeSpeed = 40;

        const typeNext = () => {
            if (index < fullText.length) {
                const char = document.createTextNode(fullText.charAt(index));
                el.insertBefore(char, caret);
                index += 1;
                setTimeout(typeNext, typeSpeed);
            } else {
                caret.classList.add('done');
            }
        };

        // Small delay so fade-in can start
        setTimeout(typeNext, 200);
    });
}

initTypewriterEffect();

// ========================================
// FLOATING PARTICLES (hero sections)
// ========================================
function createParticles(selector, count = 18) {
    const host = document.querySelector(selector);
    if (!host) return;

    const layer = document.createElement('div');
    layer.className = 'particle-layer';

    for (let i = 0; i < count; i += 1) {
        const p = document.createElement('span');
        p.className = 'particle';
        const size = Math.random() * 6 + 4; // 4px - 10px
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDuration = `${14 + Math.random() * 8}s`;
        p.style.animationDelay = `${-Math.random() * 10}s`;
        layer.appendChild(p);
    }

    host.appendChild(layer);
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language from localStorage
    const savedLang = localStorage.getItem(LANG_KEY) || 'en';
    setLanguage(savedLang);
    
    // Add loading animation to elements
    document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .stat-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Particles for hero sections
    createParticles('.hero', 18);
    createParticles('.hero-alt', 14);
});
