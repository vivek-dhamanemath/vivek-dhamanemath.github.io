/**
 * Navbar Functionality
 * Handles sticky behavior, mobile menu toggle, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all navbar functionality
  initNavbar();
  
  // Add active class to current page in navigation
  highlightCurrentPage();
});

/**
 * Initialize all navbar functionality
 */
function initNavbar() {
  // Add scroll event listener for sticky navbar
  addScrollListener();
  
  // Initialize mobile menu functionality
  initMobileMenu();
  
  // Initialize dropdown menus
  initDropdowns();
}

/**
 * Add scroll event listener to handle sticky navbar
 */
function addScrollListener() {
  const navbar = document.querySelector('.navbar');
  const header = document.querySelector('header');
  const targetElement = navbar || header;
  
  if (!targetElement) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      targetElement.classList.add('scrolled');
    } else {
      targetElement.classList.remove('scrolled');
    }
  });
  
  // Initial check
  if (window.scrollY > 50) {
    targetElement.classList.add('scrolled');
  }
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const overlay = document.querySelector('.navbar-overlay');
  
  if (!mobileToggle || !navbarMenu) {
    console.error('Mobile menu elements not found');
    return;
  }
  
  mobileToggle.addEventListener('click', () => {
    toggleMobileMenu(mobileToggle, navbarMenu, overlay);
  });
  
  // Close mobile menu when clicking on overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      toggleMobileMenu(mobileToggle, navbarMenu, overlay);
    });
  }
  
  // Close mobile menu when clicking on a menu item (only on mobile)
  const menuItems = navbarMenu.querySelectorAll('a:not(.dropdown > a)');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Only trigger on mobile view
      if (window.innerWidth < 1200) {
        toggleMobileMenu(mobileToggle, navbarMenu, overlay);
      }
    });
  });
  
  // Handle window resize to reset mobile menu
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1200 && navbarMenu.classList.contains('active')) {
      toggleMobileMenu(mobileToggle, navbarMenu, overlay);
      
      // Reset dropdown menus on desktop
      const openDropdowns = document.querySelectorAll('.dropdown.active');
      openDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}

/**
 * Toggle the mobile menu state
 */
function toggleMobileMenu(mobileToggle, navbarMenu, overlay) {
  mobileToggle.classList.toggle('active');
  navbarMenu.classList.toggle('active');
  
  if (overlay) {
    overlay.classList.toggle('active');
  }
  
  // Prevent scrolling when mobile menu is open
  document.body.classList.toggle('no-scroll', navbarMenu.classList.contains('active'));
}

/**
 * Initialize dropdown menu functionality
 * Handles both desktop hover and mobile click behavior
 */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown > a');
  
  dropdowns.forEach(dropdown => {
    // For mobile: handle click to toggle dropdown
    dropdown.addEventListener('click', function(e) {
      // Only handle dropdown toggle on mobile devices
      if (window.innerWidth < 1200) {
        e.preventDefault();
        const parent = this.parentElement;
        
        // Close other open dropdowns
        const siblings = Array.from(parent.parentElement.children)
          .filter(el => el !== parent && el.classList.contains('dropdown'));
        
        siblings.forEach(sibling => {
          sibling.classList.remove('active');
        });
        
        // Toggle current dropdown
        parent.classList.toggle('active');
      }
    });
  });
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPage() {
  const navItems = document.querySelectorAll('.navbar-menu a');
  const currentPage = window.location.pathname.split('/').pop();
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (href && currentPage.startsWith(href.split('#')[0]))) {
      item.classList.add('active');
    }
  });
}

// Add no-scroll class to body to prevent background scrolling
document.head.insertAdjacentHTML('beforeend', `
  <style>
    body.no-scroll {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
    }
  </style>
`);

/**
 * Mobile navigation menu functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navbarOverlay = document.querySelector('.navbar-overlay');
  
  if (mobileMenuToggle) {
    // Fix for mobile menu toggle
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle active classes
      mobileMenuToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      
      // Toggle overlay
      if (navbarOverlay) {
        navbarOverlay.classList.toggle('active');
      }
      
      // Prevent body scrolling when menu is open
      document.body.classList.toggle('no-scroll');
    });
  }
  
  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll('.navbar-menu a:not(.dropdown > a)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 1200 && navbarMenu.classList.contains('active')) {
        // Close the mobile menu
        mobileMenuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        
        if (navbarOverlay) {
          navbarOverlay.classList.remove('active');
        }
        
        document.body.classList.remove('no-scroll');
      }
    });
  });
  
  // Mobile dropdown toggles
  const dropdownToggles = document.querySelectorAll('.navbar-menu .dropdown > a');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth < 1200) {
        e.preventDefault();
        const parent = this.parentElement;
        
        // Close other open dropdowns
        document.querySelectorAll('.navbar-menu .dropdown').forEach(dropdown => {
          if (dropdown !== parent && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
          }
        });
        
        // Toggle this dropdown
        parent.classList.toggle('active');
      }
    });
  });
  
  // Close menu when clicking overlay
  if (navbarOverlay) {
    navbarOverlay.addEventListener('click', function() {
      mobileMenuToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      navbarOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }
  
  // Close menu when resizing to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1200 && navbarMenu.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      
      if (navbarOverlay) {
        navbarOverlay.classList.remove('active');
      }
      
      document.body.classList.remove('no-scroll');
    }
  });
});