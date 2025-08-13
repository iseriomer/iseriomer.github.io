// Theme Switcher Functionality
function initThemeSwitch() {
    const toggleSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark' || (currentTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggleSwitch) toggleSwitch.checked = true;
    }
    if (toggleSwitch) {
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
}

// Three.js Particle Animation
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const geometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 5; }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.005, color: 0x64ffda });
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 2;

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

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
    if (!scrollToTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) scrollToTopBtn.classList.add('show');
        else scrollToTopBtn.classList.remove('show');
    });
    scrollToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const navList = document.querySelector('.nav-list');
            const hamburger = document.querySelector('.hamburger');
            if (navList && hamburger && navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Navigation Sticky Effect
function initStickyNav() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
    });
}

// Highlight active section link
function initActiveSectionLink() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    function onScroll() {
        let currentId = '';
        const offset = 120;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= offset && rect.bottom >= offset) currentId = section.id;
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const id = href.startsWith('#') ? href.slice(1) : '';
            if (id && id === currentId) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
            else { link.classList.remove('active'); link.removeAttribute('aria-current'); }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Intersection Observer animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section, .project-card, .ai-projects, .game-projects').forEach(el => { observer.observe(el); });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            const isActive = navList.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    }
}

// Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const isPercent = suffix === '%' || el.getAttribute('data-suffix') === '%';
    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const current = target * eased;
      el.textContent = isPercent ? current.toFixed(1) : Math.round(current).toString();
      el.setAttribute('data-suffix', suffix);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}



// Form Submission
function handleFormSubmit() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            try {
                const response = await fetch('https://formspree.io/f/xwpqyaoo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
                });                
                if(response.ok) { form.reset(); showToast('Message sent successfully!'); }
                else { showToast('Error sending message. Please try again.'); }
            } catch (error) { showToast('Error sending message. Please try again.'); }
        });
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// Scroll progress bar
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / (docHeight || 1)));
    bar.style.width = (progress * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Resume downloads
function initResumeDownloads() {
  document.querySelectorAll('.download-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const file = btn.getAttribute('data-file');
      if (!file) return;
      const link = document.createElement('a');
      link.href = encodeURI(file);
      link.download = file;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });
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
    initActiveSectionLink();
    initCounters();
    initTestimonialsCarousel();

    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
    });
});

// Initialize additions after previous inits
(function initEnhancements(){
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initResumeDownloads();
  });
})();