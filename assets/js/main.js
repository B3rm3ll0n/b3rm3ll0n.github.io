// Main - Minimal initialization

const App = {
  init() {
    console.log('App initialized');
    this.setupNavigation();
  },

  setupNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar__link');
    
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && currentPage.includes(href.replace('/', ''))) {
        link.classList.add('active');
      }
    });
  },
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
