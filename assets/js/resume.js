document.addEventListener('DOMContentLoaded', function() {
  
  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would normally send the form data to a server
      // For demonstration, we'll just log it and show a success message
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      console.log('Form submitted with data:', formData);
      
      // Reset form and show success message
      contactForm.reset();
      // Replace alert with a more user-friendly message
      const formContainer = contactForm.closest('.contact-form-box') || contactForm.parentElement;
      const successMsg = document.createElement('div');
      successMsg.className = 'alert alert-success mt-3';
      successMsg.textContent = 'Thank you for your message! I will get back to you soon.';
      formContainer.appendChild(successMsg);
      
      // Remove the success message after a few seconds
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    });
  }

  // Initialize animations for timeline items when they enter the viewport
  const initTimelineAnimations = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0 && typeof Waypoint !== 'undefined') {
      timelineItems.forEach(item => {
        new Waypoint({
          element: item,
          handler: function() {
            item.classList.add('animate');
            this.destroy();
          },
          offset: '90%'
        });
      });
    }
  };
  
  // Call initialization functions
  initTimelineAnimations();
});
