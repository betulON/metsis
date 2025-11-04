// Language Management
let currentLang = localStorage.getItem('language') || 'tr';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    if (currentLang === 'en') {
        switchToEnglish();
    } else {
        switchToTurkish();
    }
    
    // Update button text
    updateLangButton();
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Form handling
    initContactForm();
});

// Toggle language
function toggleLanguage() {
    if (currentLang === 'tr') {
        switchToEnglish();
    } else {
        switchToTurkish();
    }
    updateLangButton();
}

// Switch to English
function switchToEnglish() {
    currentLang = 'en';
    localStorage.setItem('language', 'en');
    document.documentElement.lang = 'en';
    
    // Update all elements with data-en attributes
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        const englishText = element.getAttribute('data-en');
        if (englishText) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = englishText;
            } else if (element.tagName === 'BUTTON' && element.type === 'submit') {
                element.textContent = englishText;
            } else {
                element.textContent = englishText;
            }
        }
    });
}

// Switch to Turkish
function switchToTurkish() {
    currentLang = 'tr';
    localStorage.setItem('language', 'tr');
    document.documentElement.lang = 'tr';
    
    // Update all elements with data-tr attributes
    const elements = document.querySelectorAll('[data-tr]');
    elements.forEach(element => {
        const turkishText = element.getAttribute('data-tr');
        if (turkishText) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = turkishText;
            } else if (element.tagName === 'BUTTON' && element.type === 'submit') {
                element.textContent = turkishText;
            } else {
                element.textContent = turkishText;
            }
        }
    });
}

// Update language button text
function updateLangButton() {
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Handle dropdown clicks on mobile
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            if (dropdownLink) {
                dropdownLink.addEventListener('click', function(e) {
                    if (window.innerWidth <= 968) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show success message (in production, this would send the data to a server)
            const successMessage = currentLang === 'tr' 
                ? 'Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.'
                : 'Your message has been sent successfully! We will get back to you as soon as possible.';
            
            alert(successMessage);
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
