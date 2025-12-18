// Minimal JS: theme toggle (persisted) + masonry builder
(function(){
  'use strict';

  // Theme handling
  function applyTheme(theme){
    const html = document.documentElement;
    if(theme === 'dark'){
      html.setAttribute('data-theme','dark');
      localStorage.setItem('site-theme','dark');
      const btn = document.getElementById('theme-toggle'); if(btn) btn.textContent = '🌙';
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('site-theme','light');
      const btn = document.getElementById('theme-toggle'); if(btn) btn.textContent = '☀️';
    }
  }

  function initTheme(){
    const saved = localStorage.getItem('site-theme');
    if(saved){ applyTheme(saved); return; }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function setupThemeToggle(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', function(){
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Simple masonry builder using JS: create columns and distribute items by height
  function buildMasonry(containerSelector, minColumnWidth){
    const container = document.querySelector(containerSelector);
    if(!container) return;
    // collect items
    const items = Array.from(container.querySelectorAll('.masonry-item'));
    // clear container
    container.innerHTML = '';
    // determine columns based on container width
    const containerWidth = Math.max(container.clientWidth, 300);
    const cols = Math.max(1, Math.floor(containerWidth / minColumnWidth));
    const columns = [];
    for(let i=0;i<cols;i++){
      const col = document.createElement('div');
      col.className = 'masonry-column';
      container.appendChild(col);
      columns.push(col);
    }
    // distribute items round-robin but balance by current column height
    items.forEach(item => {
      // find shortest column
      let shortest = columns[0];
      for(let c of columns){
        if(c.scrollHeight < shortest.scrollHeight) shortest = c;
      }
      shortest.appendChild(item);
    });
  }

  // Responsive: rebuild masonry on resize (debounced)
  function setupMasonryResponsive(selector, minColWidth){
    let t;
    function rebuild(){ buildMasonry(selector, minColWidth); }
    window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(rebuild,120); });
    // run on DOM ready
    rebuild();
  }

  // Initialize
  function init(){
    initTheme();
    setupThemeToggle();
    // build masonry with ~260px min column width (adjusts by breakpoint)
    setupMasonryResponsive('.masonry', 260);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
