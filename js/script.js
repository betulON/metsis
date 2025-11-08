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
    
    // Update language switcher UI
    updateLangSwitcher();
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Form handling
    initContactForm();
    
    // Initialize animations
    initAnimations();
});

// Switch language function (called from HTML onclick)
function switchLanguage(lang) {
    if (lang === 'en') {
        switchToEnglish();
    } else {
        switchToTurkish();
    }
    updateLangSwitcher();
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

// Update language switcher UI
function updateLangSwitcher() {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
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

// Hero Video and Slider Management
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('heroVideo');
    const heroSlider = document.getElementById('heroSlider');
    const heroContent = document.getElementById('heroContent');
    
    if (heroVideo && heroSlider) {
        // When video ends, switch to slider
        heroVideo.addEventListener('ended', function() {
            heroVideo.style.opacity = '0';
            heroVideo.style.transition = 'opacity 1s';
            
            setTimeout(() => {
                heroVideo.style.display = 'none';
                heroSlider.style.display = 'block';
                heroSlider.style.opacity = '0';
                
                // Fade in slider
                setTimeout(() => {
                    heroSlider.style.transition = 'opacity 1s';
                    heroSlider.style.opacity = '1';
                }, 50);
                
                // Hide hero content (welcome text)
                if (heroContent) {
                    heroContent.style.opacity = '0';
                    heroContent.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        heroContent.style.display = 'none';
                    }, 500);
                }
                
                // Initialize slider
                initHeroSlider();
            }, 1000);
        });
    }
});

// Hero Slider Functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoplayInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Show specific slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoplay);
        heroSlider.addEventListener('mouseleave', startAutoplay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Animation on scroll and load
function initAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.project-card, .reference-card, .testimonial-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.content-section, .project-card, .reference-card, .testimonial-card, .info-item, .contact-form');
    animatedElements.forEach(el => {
        // Set initial state for scroll animations
        if (!el.classList.contains('page-header')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });
    
    // Add hover effects to navigation items
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}
