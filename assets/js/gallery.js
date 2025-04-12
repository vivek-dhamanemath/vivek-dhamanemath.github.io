/**
 * Gallery functionality for photo galleries
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize lightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
  });
  
  // Add lazy loading to images
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  // Convert gallery images to lazy loading
  galleryImages.forEach(img => {
    // Skip if already set up for lazy loading
    if (img.classList.contains('lazy-image')) return;
    
    // Save original src
    const src = img.src;
    
    // Add lazy loading class and attributes
    img.classList.add('lazy-image');
    img.dataset.src = src;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 1x1 transparent gif
  });

  // Implement lazy loading with Intersection Observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('.lazy-image').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('.lazy-image').forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
  
  // Convert standard links to lightbox links
  document.querySelectorAll('.gallery-item').forEach(item => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');
    
    // Skip if already set up for lightbox
    if (link && !link.classList.contains('glightbox')) {
      link.classList.add('glightbox');
      link.dataset.gallery = 'gallery-collection';
      
      // If there's no title, add the alt text as description
      if (img && img.alt && !link.dataset.description) {
        link.dataset.description = img.alt;
      }
    }
  });

  // Filter functionality for gallery
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');
      // Set active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
