// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        console.log(`Attempting to load component from: ${componentPath}`);
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.status} - ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Try different selector approaches - ID, class, or tag + class combo
        const element = document.getElementById(elementId) || 
                        document.querySelector(`.${elementId}`) || 
                        document.querySelector(`div[id="${elementId}"]`) ||
                        document.querySelector(`div[class*="${elementId}"]`);
        
        if (!element) {
            throw new Error(`Element with ID "${elementId}" not found`);
        }
        
        // Append the component HTML instead of overwriting
        element.innerHTML = html;
        console.log(`Successfully loaded component into ${elementId}`);

        // If this is the header, initialize dropdown functionality after loading
        if (elementId === 'header-placeholder') {
            initializeDropdowns();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath} into ${elementId}:`, error);
        // Create the element if it doesn't exist
        if (error.message.includes("not found")) {
            console.log(`Attempting to create missing ${elementId} element`);
            const newElement = document.createElement('div');
            newElement.id = elementId;
            
            if (elementId === 'header-placeholder') {
                // Insert at the beginning of body
                document.body.insertBefore(newElement, document.body.firstChild);
            } else if (elementId === 'footer-placeholder') {
                // Insert before the scripts at the end
                document.body.appendChild(newElement);
            }
            
            // Try loading again
            try {
                const retryResponse = await fetch(componentPath);
                if (retryResponse.ok) {
                    const html = await retryResponse.text();
                    newElement.innerHTML = html;
                    console.log(`Successfully created and loaded component into ${elementId}`);
                    
                    if (elementId === 'header-placeholder') {
                        initializeDropdowns();
                    }
                }
            } catch (retryError) {
                console.error(`Final attempt to load ${elementId} failed:`, retryError);
            }
        }
    }
}

// Initialize dropdown functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.preventDefault();
            this.nextElementSibling.classList.toggle('show');
        });
    });
}

// Set active menu item based on current page
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage); // Log the current page

    const menuItems = document.querySelectorAll('.navmenu a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
            // If item is in dropdown, add active to parent
            const dropdownParent = item.closest('.dropdown');
            if (dropdownParent) {
                dropdownParent.querySelector('a').classList.add('active');
            }
        }
    });
}

function removePreloader() {
    // Remove the preloader if it exists
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        console.log('Removing preloader');
        // Use a fade out effect for smoother transition
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            setTimeout(() => {
                preloader.remove();
            }, 100);
        }, 500);
    } else {
        console.log('Preloader element not found');
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load header and footer components first
        await Promise.all([
            loadComponent('header-placeholder', './components/header.html'),
            loadComponent('footer-placeholder', './components/footer.html')
        ]);

        // Ensure main content is visible after components load
        const main = document.querySelector('main') || document.querySelector('.main');
        if (main) {
            main.style.display = 'block';
            main.style.visibility = 'visible';
            main.style.opacity = '1';
        }

        // Remove preloader if it exists
        const preloader = document.querySelector('#preloader');
        if (preloader) {
            preloader.remove();
        }

        // Initialize required functionality
        initializeDropdowns();
        setActiveMenuItem();
        
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
    
    // Timeout to prevent infinite loading
    setTimeout(() => {
        const preloader = document.querySelector('#preloader');
        if (preloader) {
            handleLoadingError();
        }
    }, 5000);
});

// Fix extra padding after navbar
document.addEventListener('DOMContentLoaded', function() {
  // Execute after header is loaded
  setTimeout(() => {
    const main = document.querySelector('.main');
    if (main) {
      main.style.marginTop = '0';
      main.style.paddingTop = '0';
    }
  }, 100);
});

// Helper function to load individual components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

function handleLoadingError() {
    const preloader = document.querySelector('#preloader');
    if (preloader) preloader.remove();
    
    const main = document.querySelector('main') || document.querySelector('.main');
    if (main) {
        main.style.display = 'block';
        main.style.visibility = 'visible';
        main.style.opacity = '1';
    }
    
    console.error('Failed to load page components. Please refresh the page.');
}

// Fix the page structure if elements are not where they should be
function fixPageStructure() {
    console.log('Checking and fixing page structure if needed');
    
    // Identify potential content area - look for various common selectors
    const contentArea = document.querySelector('main') || 
                       document.querySelector('.main-content') || 
                       document.querySelector('#content') ||
                       document.querySelector('.content') ||
                       document.querySelector('section:not(#header-placeholder):not(#footer-placeholder)');
    
    if (!contentArea) {
        console.warn('No identifiable content area found on page');
        return;
    }
    
    // Make sure content isn't hidden by CSS
    contentArea.style.display = 'block';
    contentArea.style.visibility = 'visible';
    contentArea.style.opacity = '1';
    
    // If content is in wrong order, fix it
    const body = document.body;
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Create a div to wrap all main content if it's not already in a main tag
    if (!document.querySelector('main')) {
        console.log('Wrapping content in main tag');
        const mainWrapper = document.createElement('main');
        mainWrapper.className = 'main';
        
        // Clone all content between header and footer to preserve event listeners
        let currentNode = headerPlaceholder ? headerPlaceholder.nextSibling : body.firstChild;
        const nodesToMove = [];
        
        while (currentNode && (!footerPlaceholder || currentNode !== footerPlaceholder)) {
            if (currentNode.nodeType === Node.ELEMENT_NODE && 
                currentNode.id !== 'header-placeholder' && 
                currentNode.id !== 'footer-placeholder' &&
                !currentNode.matches('script')) {
                nodesToMove.push(currentNode);
            }
            currentNode = currentNode.nextSibling;
        }
        
        // Move nodes to main wrapper
        nodesToMove.forEach(node => mainWrapper.appendChild(node));
        
        // Insert main wrapper between header and footer
        if (headerPlaceholder && headerPlaceholder.nextSibling) {
            body.insertBefore(mainWrapper, headerPlaceholder.nextSibling);
        } else if (footerPlaceholder) {
            body.insertBefore(mainWrapper, footerPlaceholder);
        } else {
            body.appendChild(mainWrapper);
        }
    }
}

// Ensure main content is visible
function ensureMainContentVisibility() {
    // Find main content containers using common selectors
    const mainContainers = [
        document.querySelector('main'),
        document.querySelector('.main'),
        document.querySelector('#main-content'),
        document.querySelector('.main-content'),
        document.querySelector('#content'),
        document.querySelector('.content')
    ].filter(Boolean); // Remove null/undefined values
    
    if (mainContainers.length > 0) {
        console.log('Found main content containers:', mainContainers.length);
        
        // Make sure all main containers are visible
        mainContainers.forEach(container => {
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.position = 'relative';
            container.style.zIndex = '1';
        });
    } else {
        console.warn('No main content containers found');
    }
}

// Function to fix text visibility issues
function fixTextVisibility() {
    console.log('Fixing text visibility issues');
    
    // Add a style tag with overrides
    const styleOverrides = document.createElement('style');
    styleOverrides.textContent = `
        /* Text visibility overrides */
        body, main, section, div, p, h1, h2, h3, h4, h5, h6, span, a, li {
            color: inherit !important;
        }
        
        .about-page, .projects-page, .contact-page, .index-page {
            color: var(--color-default, #212529) !important;
        }
        
        .main {
            color: var(--color-default, #212529) !important;
            background-color: var(--color-background, #ffffff) !important;
            visibility: visible !important;
            display: block !important;
        }
        
        section {
            visibility: visible !important;
            display: block !important;
        }
        
        /* Ensure content is visible and not covered */
        .main {
            position: relative;
            z-index: 5;
        }
        
        #header-placeholder {
            position: relative;
            z-index: 10;
        }
        
        #footer-placeholder {
            position: relative;
            z-index: 10;
        }
    `;
    
    document.head.appendChild(styleOverrides);
    
    // Force visible colors on all text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, label, input, textarea');
    textElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        console.log(`Element ${el.tagName} has color: ${color} on background: ${backgroundColor}`);
        
        // If text color is too similar to background or is transparent/semi-transparent
        if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent' || 
            color === backgroundColor || color === 'rgba(255, 255, 255, 0)') {
            el.style.color = '#212529';  // Set to dark color for visibility
        }
    });
    
    // Make sure sections are visible
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
}

function applyCriticalStyles() {
    const criticalStyles = `
        main, .main, section, .section, .content {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: #000000 !important;
        }
        #header-placeholder, #footer-placeholder {
            display: block !important;
        }
        body {
            visibility: visible !important;
            display: block !important;
        }
    `;
    
    let styleEl = document.getElementById('critical-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'critical-styles';
        styleEl.textContent = criticalStyles;
        document.head.insertBefore(styleEl, document.head.firstChild);
    }
}

function handleStylesheets() {
    // Get all existing stylesheets
    const sheets = Array.from(document.styleSheets);
    
    sheets.forEach(sheet => {
        try {
            if (!sheet.href || sheet.href.includes('main.css')) {
                // Move main.css rules to the end to take precedence
                const rules = Array.from(sheet.cssRules);
                sheet.disabled = true;
                
                const newSheet = document.createElement('style');
                newSheet.textContent = rules.map(rule => rule.cssText).join('\n');
                document.head.appendChild(newSheet);
            }
        } catch (e) {
            console.log('Could not process stylesheet:', e);
        }
    });
}

/**
 * Load header and footer components
 */
document.addEventListener('DOMContentLoaded', function() {
  // Load header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;
        
        // After header is loaded, initialize navigation scripts
        const navbarScript = document.createElement('script');
        navbarScript.src = 'assets/js/navbar.js';
        document.body.appendChild(navbarScript);
        
        // Set active navigation item based on current page
        setTimeout(setActiveNavItem, 100);
      });
  }
  
  // Load footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
        footerPlaceholder.innerHTML = data;
      });
  }
  
  // Function to set active navigation item
  function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
        
        // If in dropdown, also activate parent
        const dropdown = link.closest('.dropdown');
        if (dropdown) {
          dropdown.querySelector('a').classList.add('active');
        }
      }
    });
    
    // Set index.html as active when on homepage
    if (currentPage === 'index.html') {
      const homeLink = document.querySelector('.navbar-menu a[href="index.html"]');
      if (homeLink) {
        homeLink.classList.add('active');
      }
    }
  }
});