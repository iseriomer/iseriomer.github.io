// Mobile Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (isActive) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Scroll Effects
const nav = document.getElementById('nav');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Navbar scroll state - küçülme
    if (currentScrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Scroll to top button
    if (currentScrollY > 400) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Form Submission
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(message) {
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('https://formspree.io/f/xwpqyaoo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('✅ Message sent successfully!');
                contactForm.reset();
            } else {
                showToast('❌ Error sending message. Please try again.');
            }
        } catch (error) {
            showToast('❌ Error sending message. Please try again.');
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.game-card, .skill-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0005})`;
        heroGlow.style.opacity = Math.max(0, 0.8 - scrolled * 0.001);
    }
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0005})`;
        heroGlow.style.opacity = Math.max(0, 0.8 - scrolled * 0.001);
    }
});

// Project Modal Functionality
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const gamesGrid = document.querySelector('.games-grid');

// Gallery state
let galleryImages = [];
let currentGalleryIndex = 0;
let galleryAutoPlayInterval = null;

// Open modal function
function openModal(card) {
    if (!projectModal) return;

    // Get data from card attributes
    const image = card.getAttribute('data-image');
    const title = card.getAttribute('data-title');
    const meta = card.getAttribute('data-meta');
    const award = card.getAttribute('data-award');
    const description = card.getAttribute('data-description');
    const features = JSON.parse(card.getAttribute('data-features') || '[]');
    const tech = JSON.parse(card.getAttribute('data-tech') || '[]');
    const links = JSON.parse(card.getAttribute('data-links') || '[]');
    const gallery = JSON.parse(card.getAttribute('data-gallery') || '[]');

    // Set gallery images
    galleryImages = gallery.length > 0 ? gallery : [image];
    currentGalleryIndex = 0;

    // Set modal image
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = galleryImages[0];
        modalImage.alt = title;
    }

    // Update gallery indicator
    updateGalleryIndicator();

    // Start auto-play if gallery has multiple images
    startGalleryAutoPlay();

    // Set modal title
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = title;
    }

    // Set modal meta
    const modalMeta = document.getElementById('modalMeta');
    if (modalMeta) {
        modalMeta.textContent = meta;
    }

    // Set modal award badge
    const modalAward = document.getElementById('modalAward');
    if (modalAward) {
        if (award) {
            modalAward.textContent = award;
            modalAward.style.display = 'inline-flex';
        } else {
            modalAward.style.display = 'none';
        }
    }

    // Set modal description
    const modalDescription = document.getElementById('modalDescription');
    if (modalDescription) {
        modalDescription.textContent = description;
    }

    // Set modal features
    const modalFeatures = document.getElementById('modalFeatures');
    if (modalFeatures) {
        modalFeatures.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
    }

    // Set modal tech stack
    const modalTech = document.getElementById('modalTech');
    if (modalTech) {
        modalTech.innerHTML = '';
        tech.forEach(techItem => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = techItem;
            modalTech.appendChild(span);
        });
    }

    // Set modal links
    const modalLinks = document.getElementById('modalLinks');
    if (modalLinks) {
        modalLinks.innerHTML = '';
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.className = `btn ${link.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`;
            a.textContent = link.text;
            modalLinks.appendChild(a);
        });
    }

    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal function
function closeModal() {
    if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        stopGalleryAutoPlay();
        galleryImages = [];
        currentGalleryIndex = 0;
    }
}

// Gallery functions
function updateGalleryIndicator() {
    const current = document.getElementById('galleryCurrent');
    const total = document.getElementById('galleryTotal');
    if (current && total) {
        current.textContent = currentGalleryIndex + 1;
        total.textContent = galleryImages.length;
    }
    
    // Show/hide navigation buttons
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    if (prevBtn && nextBtn) {
        prevBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    }
    
    // Show/hide indicator
    const indicator = document.querySelector('.gallery-indicator');
    if (indicator) {
        indicator.style.display = galleryImages.length > 1 ? 'block' : 'none';
    }
}

function showGalleryImage(index) {
    if (galleryImages.length === 0) return;
    
    // Loop around
    if (index < 0) {
        currentGalleryIndex = galleryImages.length - 1;
    } else if (index >= galleryImages.length) {
        currentGalleryIndex = 0;
    } else {
        currentGalleryIndex = index;
    }
    
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.src = galleryImages[currentGalleryIndex];
            modalImage.style.opacity = '1';
        }, 200);
    }
    
    updateGalleryIndicator();
    resetGalleryAutoPlay();
}

function nextGalleryImage() {
    showGalleryImage(currentGalleryIndex + 1);
}

function prevGalleryImage() {
    showGalleryImage(currentGalleryIndex - 1);
}

function startGalleryAutoPlay() {
    stopGalleryAutoPlay();
    if (galleryImages.length > 1) {
        galleryAutoPlayInterval = setInterval(() => {
            nextGalleryImage();
        }, 3000);
    }
}

function stopGalleryAutoPlay() {
    if (galleryAutoPlayInterval) {
        clearInterval(galleryAutoPlayInterval);
        galleryAutoPlayInterval = null;
    }
}

function resetGalleryAutoPlay() {
    stopGalleryAutoPlay();
    if (galleryImages.length > 1) {
        startGalleryAutoPlay();
    }
}

// Event delegation for game cards
if (gamesGrid) {
    gamesGrid.addEventListener('click', (e) => {
        // Don't open modal if clicking on buttons
        if (e.target.closest('.game-card-buttons')) {
            return;
        }
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            openModal(gameCard);
        }
    });
}

// Gallery navigation
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const modalImageWrapper = document.querySelector('.modal-image-wrapper');

if (galleryPrev) {
    galleryPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevGalleryImage();
    });
}

if (galleryNext) {
    galleryNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextGalleryImage();
    });
}

// Click on image to navigate (left/right)
if (modalImageWrapper) {
    modalImageWrapper.addEventListener('click', (e) => {
        if (galleryImages.length <= 1) return;
        if (e.target.closest('.gallery-nav')) return; // Don't trigger if clicking nav buttons
        
        const rect = modalImageWrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        
        // Left half = previous, right half = next
        if (clickX < width / 2) {
            prevGalleryImage();
        } else {
            nextGalleryImage();
        }
    });
}

// Close modal on close button click
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal on overlay click
if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
}

// Close modal on Escape key (handles both modal close and gallery navigation)
document.addEventListener('keydown', (e) => {
    if (projectModal && projectModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (galleryImages.length > 1) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevGalleryImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextGalleryImage();
            }
        }
    }
});

