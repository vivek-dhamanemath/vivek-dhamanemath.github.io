/**
 * Navbar Functionality
 * Handles sticky behavior, mobile menu toggle, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navbar functionality
  initNavbar();
});

/**
 * Initialize all navbar functionality
 */
function initNavbar() {
  // Get navbar elements - query within the document
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const dropdowns = document.querySelectorAll('.navbar-menu .dropdown');
  const navbarOverlay = document.querySelector('.navbar-overlay'); // Get the overlay
  
  // Handle scroll effect
  handleNavbarScroll();
  
  // Handle mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
	  navbarOverlay.classList.toggle('active'); // Toggle the overlay
      document.body.classList.toggle('no-scroll'); // Prevent scrolling
    });
  }
  
    // Handle closing the menu by clicking the overlay
    if (navbarOverlay) {
        navbarOverlay.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            navbarOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
  
  // Handle dropdown toggle on mobile
  dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('a');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    
    // For mobile view
    dropdownLink.addEventListener('click', (e) => {
      // Only prevent default and toggle dropdown on mobile
      if (window.innerWidth <= 1199) {
        e.preventDefault();
        dropdown.classList.toggle('active');
        
        // Close other dropdowns
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1199 && 
        navbarMenu.classList.contains('active') && 
        !navbarMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      navbarMenu.classList.remove('active');
	  navbarOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Close mobile menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1199) {
      navbarMenu.classList.remove('active');
      
      // Reset all dropdowns
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
  
  // Mark active page in navbar - increased timeout to ensure DOM is ready
  setTimeout(setActivePage, 200);
}

/**
 * Handle navbar scroll effects
 */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  // Apply scroll class on page load if not at top
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Set the active page in the navbar based on current URL
 */
function setActivePage() {
  // Get current page URL path
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop();
  
  console.log('Current page detected:', currentPage);
  
  // Get all navigation links
  const menuLinks = document.querySelectorAll('.navbar-menu a');
  
  // Remove active class from all links first
  menuLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active class based on current URL
  let activeSet = false;
  
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip if this is a dropdown toggle
    if (href === 'javascript:void(0)') return;
    
    // More precise matching of current page to menu links
    if (
      (href === currentPage) || 
      (currentPage === '' && href === 'index.html') ||
      (currentPage === '/' && href === 'index.html') ||
      (href !== 'index.html' && currentPage && currentPage.includes(href.split('.')[0]))
    ) {
      link.classList.add('active');
      activeSet = true;
      
      // If this is a link inside a dropdown, mark its parent as active too
      const dropdownParent = link.closest('.dropdown');
      if (dropdownParent) {
        const parentLink = dropdownParent.querySelector(':scope > a');
        if (parentLink) {
          parentLink.classList.add('active');
        }
      }
    }
  });
  
  // If no matching page was found, and we're on the home page, set index.html as active
  if (!activeSet && (!currentPage || currentPage === '' || currentPage === '/')) {
    menuLinks.forEach(link => {
      if (link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
      }
    });
  }
}