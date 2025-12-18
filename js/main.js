// Main interactive behaviors for Olha-inspired site
(function () {
  'use strict';

  // Reveal on scroll using IntersectionObserver
  function setupReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  }

  // Media modal for images and videos
  function setupMediaModal() {
    const modal = document.getElementById('media-modal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');

    // Open modal on image/video click
    document.addEventListener('click', (e) => {
      const img = e.target.closest('.media-grid img');
      const vid = e.target.closest('.media-grid video');
      
      if (img) {
        const newImg = img.cloneNode();
        modalContent.innerHTML = '';
        modalContent.appendChild(newImg);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else if (vid) {
        const newVid = vid.cloneNode(true);
        newVid.controls = true;
        modalContent.innerHTML = '';
        modalContent.appendChild(newVid);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close modal
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  // Smooth scroll for anchor links
  function setupSmoothLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Day / Night theme toggle
  function applyTheme(theme){
    const html = document.documentElement;
    if(theme === 'dark'){
      html.setAttribute('data-theme','dark');
      localStorage.setItem('site-theme','dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('site-theme','light');
    }
    // update toggle icon if present
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  function initTheme(){
    const saved = localStorage.getItem('site-theme');
    if(saved){
      applyTheme(saved);
      return;
    }
    // fallback to system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function setupThemeToggle(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Initialize all interactions
  function init() {
    setupReveal();
    setupMediaModal();
    setupSmoothLinks();
    initTheme();
    setupThemeToggle();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
