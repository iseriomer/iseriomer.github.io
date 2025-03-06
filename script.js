// Theme Switcher Functionality
function initThemeSwitch() {
    const toggleSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme based on local storage or system preference
    if (currentTheme === 'dark' || (currentTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
    }
    
    // Handle theme toggle
    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Three.js Particle Animation
function initParticles() {
    // Your existing particle code
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        alpha: true,
        antialias: true
    });
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Particles
    const geometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x64ffda
    });
    
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    
    // Resize handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    animate();
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation Sticky Effect
function initStickyNav() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('sticky');
            navLinks.forEach(link => {
                link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            });
        } else {
            nav.classList.remove('sticky');
            navLinks.forEach(link => {
                link.style.color = '#fff';
            });
        }
    });
}

// Intersection Observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Form Submission
function handleFormSubmit() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            try {
                const response = await fetch('your-endpoint', {
                    method: 'POST',
                    body: formData
                });
                
                if(response.ok) {
                    form.reset();
                    showToast('Message sent successfully!');
                } else {
                    showToast('Error sending message. Please try again.');
                }
            } catch (error) {
                showToast('Error sending message. Please try again.');
            }
        });
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitch();
    initStickyNav();
    initParticles();
    initScrollAnimations();
    initMobileNav();
    handleFormSubmit();
    initSmoothScroll();
    initScrollToTop();
    
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });
});