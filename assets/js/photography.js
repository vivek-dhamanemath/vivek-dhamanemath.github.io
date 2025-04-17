/**
 * Photography page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
  // Process Instagram embeds
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  } else {
    // If Instagram script hasn't loaded yet, try again after a delay
    setTimeout(function() {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 2000);
  }
  
  // Initialize AOS animations if present
  if (window.AOS) {
    AOS.refresh();
  }
});

/**
 * Load Instagram feed
 * Using direct Instagram embed without third-party widgets
 */
function loadInstagramFeed() {
  const instagramContainer = document.getElementById('instagram-feed');
  if (!instagramContainer) return;
  
  // Create a message to guide the user
  instagramContainer.innerHTML = `
    <div class="instagram-notice text-center mb-4">
      <p>Due to Instagram's API restrictions, direct embedding is limited. Here are direct links to my Instagram posts:</p>
    </div>
    <div class="instagram-links-grid"></div>
  `;
  
  const linksGrid = instagramContainer.querySelector('.instagram-links-grid');
  
  // Array of Instagram post details
  const instagramPosts = [
    { url: 'https://www.instagram.com/vivek_jd_155/reel/CritHLxAyq_/', caption: 'Check out my drone footage of the city skyline' },
    { url: 'https://www.instagram.com/p/CNkIFdJD2ko/', caption: 'Sunrise at the beach - morning colors' },
    { url: 'https://www.instagram.com/p/CyqRvvBPvdI/', caption: 'Urban photography - street lights at night' },
    { url: 'https://www.instagram.com/p/CxiNnUJIYzn/', caption: 'Nature walk - forest and waterfalls' },
    { url: 'https://www.instagram.com/p/Cvmi63oI2xk/', caption: 'Abstract architecture photography' },
    { url: 'https://www.instagram.com/p/CuKEdMWoX4r/', caption: 'Portrait photography - lighting techniques' }
  ];
  
  // Create and append each Instagram post as a card with link
  instagramPosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'instagram-card';
    
    card.innerHTML = `
      <div class="instagram-card-content">
        <div class="instagram-icon">
          <i class="bi bi-instagram"></i>
        </div>
        <p class="instagram-caption">${post.caption}</p>
        <a href="${post.url}" target="_blank" rel="noopener" class="btn-instagram">
          View on Instagram <i class="bi bi-box-arrow-up-right ms-1"></i>
        </a>
      </div>
    `;
    
    linksGrid.appendChild(card);
  });
}
