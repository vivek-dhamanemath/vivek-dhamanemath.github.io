/**
 * Photography page JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize GLightbox for image previews
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
  });
  
  // Initialize Isotope for filtering
  let iso;
  const gallery = document.querySelector('.photo-gallery');
  
  if (gallery) {
    imagesLoaded(gallery, function() {
      iso = new Isotope(gallery, {
        itemSelector: '.gallery-item',
        layoutMode: 'fitRows',
        fitRows: {
          gutter: 20
        }
      });
      
      // Filter items on button click
      const filterButtons = document.querySelectorAll('#gallery-flters li');
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('filter-active'));
          // Add active class to clicked button
          this.classList.add('filter-active');
          
          const filterValue = this.getAttribute('data-filter');
          iso.arrange({
            filter: filterValue
          });
        });
      });
    });
  }
  
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
