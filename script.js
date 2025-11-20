// This script contains all the interactive logic for the site.
document.addEventListener('DOMContentLoaded', function() {
  
  // --- Logic for Advanced Search toggle on the homepage ---
  const advancedSearchBtn = document.getElementById('advanced-search-btn');
  const advancedSearchPopup = document.getElementById('advanced-search-popup-content');

  if (advancedSearchBtn && advancedSearchPopup) {
    advancedSearchBtn.addEventListener('click', () => {
      advancedSearchPopup.classList.toggle('hidden');
    });
  }

  // --- Logic for homepage date picker input ---
  const datePicker = document.getElementById('date-picker');
  if(datePicker) {
      datePicker.addEventListener('focus', function() {
          this.type = 'date';
          // Use showPicker() for a better user experience on supported browsers
          if (typeof this.showPicker === 'function') {
            this.showPicker();
          }
      });
      datePicker.addEventListener('blur', function() {
          if (!this.value) {
              this.type = 'text';
          }
      });
  }

  // --- Logic for price range slider on the tutors page ---
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  if (priceRange && priceValue) {
    const updatePriceValue = (value) => {
      priceValue.textContent = `$${value}`;
    };
    
    priceRange.addEventListener('input', (event) => {
      updatePriceValue(event.target.value);
    });
    
    // Set initial value on page load
    updatePriceValue(priceRange.value);
  }

  // --- Logic for mock user login ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('email-address').value;
      
      if (email.toLowerCase() === 'student@email.com') {
        window.location.href = 'student-dashboard.html';
      } else if (email.toLowerCase() === 'tutor@email.com') {
        window.location.href = 'tutor-dashboard.html';
      } else {
        alert('Invalid credentials. Please use student@email.com or tutor@email.com');
      }
    });
  }

  // --- Shared logic: Update footer year dynamically ---
  const copyrightElement = document.querySelector('.copyright-text');
  if (copyrightElement) {
      copyrightElement.innerHTML = `&copy; ${new Date().getFullYear()} Bison Prof. All rights reserved.`;
  }
});