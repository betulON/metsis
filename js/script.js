// Language Management
let currentLang = localStorage.getItem('language') || 'tr';

// CMS Content Loading
async function loadCMSContent() {
    try {
        // Load contact information
        const contactResponse = await fetch('/content/contact.json');
        if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            updateContactInfo(contactData);
        }
        
        // Load hero section if on homepage
        if (document.querySelector('.hero')) {
            const heroResponse = await fetch('/content/hero.json');
            if (heroResponse.ok) {
                const heroData = await heroResponse.json();
                updateHeroSection(heroData);
            }
        }
    } catch (error) {
        console.log('CMS content not available, using default content');
    }
}

function updateContactInfo(data) {
    // Update address
    const addressElement = document.querySelector('.contact-item p');
    if (addressElement && !addressElement.querySelector('a')) {
        addressElement.textContent = currentLang === 'tr' ? data.address_tr : data.address_en;
    }
    
    // Update phone
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink && data.phone) {
        phoneLink.href = `tel:${data.phone.replace(/\s/g, '')}`;
        phoneLink.textContent = data.phone;
    }
    
    // Update email
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && data.email) {
        emailLink.href = `mailto:${data.email}`;
        emailLink.textContent = data.email;
    }
    
    // Update social media links
    if (data.social) {
        const socialLinks = document.querySelectorAll('.social-icons a');
        if (data.social.facebook && socialLinks[0]) socialLinks[0].href = data.social.facebook;
        if (data.social.twitter && socialLinks[1]) socialLinks[1].href = data.social.twitter;
        if (data.social.linkedin && socialLinks[2]) socialLinks[2].href = data.social.linkedin;
        if (data.social.instagram && socialLinks[3]) socialLinks[3].href = data.social.instagram;
    }
}

function updateHeroSection(data) {
    // Update video sources
    const videoElement = document.getElementById('heroVideo');
    if (videoElement && data.video_mp4) {
        const mp4Source = videoElement.querySelector('source[type="video/mp4"]');
        const webmSource = videoElement.querySelector('source[type="video/webm"]');
        if (mp4Source) mp4Source.src = data.video_mp4;
        if (webmSource && data.video_webm) webmSource.src = data.video_webm;
        videoElement.load();
    }
    
    // Update hero content (if visible)
    const heroContent = document.getElementById('heroContent');
    if (heroContent) {
        const heading = heroContent.querySelector('h1');
        const description = heroContent.querySelector('p');
        
        if (heading) {
            heading.setAttribute('data-tr', data.heading_tr);
            heading.setAttribute('data-en', data.heading_en);
        }
        
        if (description) {
            description.setAttribute('data-tr', data.description_tr);
            description.setAttribute('data-en', data.description_en);
        }
    }
}


// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load CMS content first
    loadCMSContent().then(() => {
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
        
        // Handle dropdown hover on mobile
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            
            if (dropdownLink && dropdownMenu) {
                // Mouse enter event
                dropdown.addEventListener('mouseenter', function() {
                    if (window.innerWidth <= 968) {
                        dropdown.classList.add('active');
                    }
                });
                
                // Mouse leave event
                dropdown.addEventListener('mouseleave', function() {
                    if (window.innerWidth <= 968) {
                        dropdown.classList.remove('active');
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

// Project Modal Functionality
const projectData = {
    project1: {
        title: { tr: 'Konut Kompleksi A', en: 'Residential Complex A' },
        location: { tr: 'Türkiye, İstanbul', en: 'Turkey, Istanbul' },
        client: { tr: 'Özel Yatırımcı', en: 'Private Investor' },
        contractType: { tr: 'Anahtar Teslim', en: 'Turnkey' },
        startDate: '2023',
        completionDate: '2025',
        capacity: { tr: '200 daire', en: '200 apartments' },
        area: '45,000 m²',
        images: ['images/project1.png', 'images/project2.png', 'images/project3.png']
    },
    project2: {
        title: { tr: 'Alışveriş Merkezi B', en: 'Shopping Mall B' },
        location: { tr: 'Türkiye, Ankara', en: 'Turkey, Ankara' },
        client: { tr: 'ABC Holding', en: 'ABC Holding' },
        contractType: { tr: 'Tasarım & İnşaat', en: 'Design & Build' },
        startDate: '2022',
        completionDate: '2024',
        capacity: { tr: '150 mağaza', en: '150 stores' },
        area: '50,000 m²',
        images: ['images/project2.png', 'images/project1.png', 'images/project4.png']
    },
    project3: {
        title: { tr: 'Endüstriyel Tesis C', en: 'Industrial Facility C' },
        location: { tr: 'Türkiye, İzmir', en: 'Turkey, Izmir' },
        client: { tr: 'XYZ Sanayi', en: 'XYZ Industry' },
        contractType: { tr: 'Anahtar Teslim', en: 'Turnkey' },
        startDate: '2023',
        completionDate: { tr: 'Devam Ediyor', en: 'In Progress' },
        capacity: { tr: '5,000 ton/yıl', en: '5,000 tons/year' },
        area: '30,000 m²',
        images: ['images/project3.png', 'images/project4.png', 'images/project1.png']
    },
    project4: {
        title: { tr: 'Plaza X', en: 'Plaza X' },
        location: { tr: 'Türkiye, İstanbul', en: 'Turkey, Istanbul' },
        client: { tr: 'Belediye', en: 'Municipality' },
        contractType: { tr: 'Kamu İhalesi', en: 'Public Tender' },
        startDate: '2020',
        completionDate: '2022',
        capacity: { tr: '30 kat', en: '30 floors' },
        area: '25,000 m²',
        images: ['images/project4.png', 'images/project2.png', 'images/project3.png']
    },
    project5: {
        title: { tr: 'Konut Sitesi Y', en: 'Residential Site Y' },
        location: { tr: 'Türkiye, Bursa', en: 'Turkey, Bursa' },
        client: { tr: 'Özel Yatırımcı', en: 'Private Investor' },
        contractType: { tr: 'Anahtar Teslim', en: 'Turnkey' },
        startDate: '2019',
        completionDate: '2021',
        capacity: { tr: '150 daire', en: '150 apartments' },
        area: '35,000 m²',
        images: ['images/project1.png', 'images/project3.png', 'images/project4.png']
    },
    project6: {
        title: { tr: 'Otel Z', en: 'Hotel Z' },
        location: { tr: 'Türkiye, Antalya', en: 'Turkey, Antalya' },
        client: { tr: 'Turizm A.Ş.', en: 'Tourism Inc.' },
        contractType: { tr: 'Tasarım & İnşaat', en: 'Design & Build' },
        startDate: '2018',
        completionDate: '2020',
        capacity: { tr: '200 oda', en: '200 rooms' },
        area: '40,000 m²',
        images: ['images/project2.png', 'images/project4.png', 'images/project1.png']
    },
    project7: {
        title: { tr: 'İş Merkezi W', en: 'Business Center W' },
        location: { tr: 'Türkiye, Ankara', en: 'Turkey, Ankara' },
        client: { tr: 'Kamu Kurumu', en: 'Public Institution' },
        contractType: { tr: 'Kamu İhalesi', en: 'Public Tender' },
        startDate: '2019',
        completionDate: '2021',
        capacity: { tr: '5,000 kişi', en: '5,000 people' },
        area: '60,000 m²',
        images: ['images/project3.png', 'images/project1.png', 'images/project2.png']
    }
};

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card[data-project]');
    let currentSlide = 0;
    let currentImages = [];

    // Open modal when project card is clicked
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectData[projectId];
            if (project) {
                openModal(project);
            }
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Slider controls
    const prevBtn = document.querySelector('.modal-slider-btn.prev');
    const nextBtn = document.querySelector('.modal-slider-btn.next');
    
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));

    function openModal(project) {
        const lang = currentLang || 'tr';
        
        // Set project details
        document.getElementById('modalProjectTitle').textContent = project.title[lang];
        document.getElementById('modalLocation').textContent = project.location[lang] || project.location;
        document.getElementById('modalClient').textContent = project.client[lang] || project.client;
        document.getElementById('modalContractType').textContent = project.contractType[lang] || project.contractType;
        document.getElementById('modalStartDate').textContent = project.startDate;
        document.getElementById('modalCompletionDate').textContent = project.completionDate[lang] || project.completionDate;
        document.getElementById('modalCapacity').textContent = project.capacity[lang] || project.capacity;
        document.getElementById('modalArea').textContent = project.area;

        // Set images
        currentImages = project.images;
        const sliderContainer = document.querySelector('.modal-slider-container');
        sliderContainer.innerHTML = '';
        currentImages.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = project.title[lang];
            sliderContainer.appendChild(img);
        });

        currentSlide = 0;
        updateSlider();

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function changeSlide(direction) {
        currentSlide += direction;
        if (currentSlide < 0) {
            currentSlide = currentImages.length - 1;
        } else if (currentSlide >= currentImages.length) {
            currentSlide = 0;
        }
        updateSlider();
    }

    function updateSlider() {
        const sliderContainer = document.querySelector('.modal-slider-container');
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        }
    });
}

// Initialize project modal if on projects page
if (document.querySelector('.project-card[data-project]')) {
    initProjectModal();
}
