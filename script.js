// Theme / Dark Mode Toggle
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

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Active Navigation Link
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

// Contact Form Validation
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

// Smooth scroll for anchor links
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

// Back to top button in footer
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Home dropdown toggle (for two home layouts)
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

// Simple front-end validation for login and register forms
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

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('registerConfirmPassword');
        const nameError = document.getElementById('registerNameError');
        const emailError = document.getElementById('registerEmailError');
        const passwordError = document.getElementById('registerPasswordError');
        const confirmError = document.getElementById('registerConfirmPasswordError');
        const formMessage = document.getElementById('registerFormMessage');

        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmError.textContent = '';
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

        if (isValid) {
            formMessage.textContent = 'Account created successfully (demo only).';
            formMessage.className = 'form-message success';
            registerForm.reset();
        }
    });
}

