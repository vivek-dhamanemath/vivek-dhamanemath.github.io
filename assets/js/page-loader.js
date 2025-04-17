/**
 * Page loader script that ensures content from individual HTML files
 * is properly loaded with their styles into index.html
 */
document.addEventListener('DOMContentLoaded', function() {
  // Function to load content from other pages with proper styling
  function loadPageContent(pageUrl, targetId) {
    fetch(pageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${pageUrl}: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the target element where content will be placed
        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
          console.error(`Target element with ID '${targetId}' not found`);
          return;
        }
        
        // Extract main content from the page
        const mainContent = doc.querySelector('main');
        if (!mainContent) {
          console.error(`No <main> element found in ${pageUrl}`);
          return;
        }
        
        // Skip hero/banner section if present at the beginning
        const sections = Array.from(mainContent.children);
        if (sections.length > 0) {
          const firstSection = sections[0];
          if (firstSection && (firstSection.id === 'hero' || firstSection.classList.contains('hero'))) {
            sections.shift(); // Remove the first section (hero)
          }
        }
        
        // Create a wrapper to preserve structure and styles
        const contentWrapper = document.createElement('div');
        contentWrapper.className = `${pageUrl.replace(/\.html$/, '')}-content-wrapper imported-content`;
        
        // Copy all remaining sections to our wrapper
        sections.forEach(section => {
          contentWrapper.appendChild(section.cloneNode(true));
        });
        
        // Set the content
        targetElement.innerHTML = '';
        targetElement.appendChild(contentWrapper);
        
        // Apply page-specific classes and ensure CSS
        const pageName = pageUrl.replace(/\.html$/, '');
        
        // Check if page-specific CSS is loaded, if not, load it
        const cssPath = `assets/css/${pageName}.css`;
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssPath;
          document.head.appendChild(link);
        }
        
        // Load and execute page-specific JavaScript
        const jsPath = `assets/js/${pageName}.js`;
        if (!document.querySelector(`script[src="${jsPath}"]`)) {
          // Check if file exists first
          fetch(jsPath)
            .then(response => {
              if (response.ok) {
                const script = document.createElement('script');
                script.src = jsPath;
                script.defer = true;
                document.body.appendChild(script);
              }
            })
            .catch(() => {
              // File doesn't exist, that's fine
            });
        }
        
        // Process Instagram embeds if they exist
        if (pageUrl === 'photography.html') {
          // Allow some time for the DOM to update
          setTimeout(() => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
            } else {
              // If the Instagram script hasn't loaded yet, try again
              const instaScript = document.createElement('script');
              instaScript.src = '//www.instagram.com/embed.js';
              instaScript.async = true;
              document.body.appendChild(instaScript);
              
              instaScript.onload = function() {
                window.instgrm.Embeds.process();
              };
            }
          }, 1000);
        }
        
        // Reinitialize AOS animations
        if (window.AOS) {
          setTimeout(() => {
            AOS.refresh();
          }, 100);
        }
        
        // Fire event for other scripts to know content is loaded
        const contentLoadedEvent = new CustomEvent('contentLoaded', {
          detail: { pageUrl, targetId }
        });
        document.dispatchEvent(contentLoadedEvent);
      })
      .catch(error => {
        console.error(`Error loading ${pageUrl}:`, error);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.innerHTML = `
            <div class="alert alert-warning text-center my-5">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Unable to load content from ${pageUrl}.
              <br>
              <small>Please try refreshing the page.</small>
            </div>`;
        }
      });
  }

  // Load content from other pages based on navbar order
  loadPageContent('about.html', 'about-content');
  
  // Make a slight delay between page loads to ensure proper rendering
  setTimeout(() => {
    loadPageContent('projects.html', 'projects-content');
  }, 100);
  
  setTimeout(() => {
    loadPageContent('experience.html', 'experience-content');
  }, 200);
  
  setTimeout(() => {
    loadPageContent('chess.html', 'chess-content');
  }, 300);
  
  setTimeout(() => {
    loadPageContent('photography.html', 'photography-content');
  }, 400);
  
  
  
  setTimeout(() => {
    loadPageContent('contact.html', 'contact-content');
  }, 600);
});
