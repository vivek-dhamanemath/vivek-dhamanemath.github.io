/**
 * Photography page JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize lightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    preload: false
  });
  
  // Initialize Isotope for filtering
  imagesLoaded(document.querySelector('.photo-gallery'), function() {
    const photoGallery = new Isotope('.photo-gallery', {
      itemSelector: '.masonry-item',
      percentPosition: true,
      layoutMode: 'masonry'
    });
    
    // Filter items on button click
    document.querySelectorAll('.gallery-filters button').forEach(button => {
      button.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        
        // Toggle active class
        document.querySelectorAll('.gallery-filters button').forEach(btn => {
          btn.classList.remove('filter-active');
        });
        this.classList.add('filter-active');
        
        if (filterValue === '*') {
          photoGallery.arrange({ filter: '*' });
        } else {
          photoGallery.arrange({ filter: filterValue });
        }
        
        // Update layout after filtering
        photoGallery.layout();
      });
    });
  });
  
  // Implement lazy loading
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver support
    lazyImages.forEach(img => img.classList.add('loaded'));
  }
  
  // Load Instagram feed
  loadInstagramFeed();
});

/**
 * Load Instagram feed
 * Using LightWidget embed for automatic updates
 */
function loadInstagramFeed() {
  // Load LightWidget script
  const lightWidgetScript = document.createElement('script');
  lightWidgetScript.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
  lightWidgetScript.async = true;
  document.body.appendChild(lightWidgetScript);
  
  // Optional: Add a scroll event listener to lazy load the iframe
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const widget = document.getElementById('instagram-widget');
        if (widget && !widget.getAttribute('data-loaded')) {
          widget.setAttribute('data-loaded', 'true');
          // Refresh the widget to ensure proper loading
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const embedContainer = document.querySelector('.instagram-embed-container');
  if (embedContainer) {
    observer.observe(embedContainer);
  }
}
