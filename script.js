// This script contains all the interactive logic for the site.
document.addEventListener('DOMContentLoaded', function() {
  
  // --- Logic for Advanced Search toggle ---
  // This logic applies to any page with the search elements
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

  // --- Logic for Tutor Signup Form Submission ---
  const tutorForm = document.getElementById('tutor-signup-form');
  const tutorFormContainer = document.getElementById('tutor-signup-container');
  const tutorSuccessMessage = document.getElementById('tutor-success-message');

  if (tutorForm && tutorSuccessMessage) {
      tutorForm.addEventListener('submit', function(e) {
          e.preventDefault(); // Prevent actual submission
          
          // Hide the form content
          if(tutorFormContainer) tutorFormContainer.classList.add('hidden');
          
          // Show success message
          tutorSuccessMessage.classList.remove('hidden');
          
          // Scroll to top to ensure message is visible if page is long
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  // --- Shared logic: Update footer year dynamically ---
  const copyrightElement = document.querySelector('.copyright-text');
  if (copyrightElement) {
      copyrightElement.innerHTML = `&copy; ${new Date().getFullYear()} Bison Prof. All rights reserved.`;
  }

  // --- Accessibility Features ---
  // Inject floating button
  const accessBtn = document.createElement('div');
  accessBtn.className = 'fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2';
  accessBtn.innerHTML = `
    <div id="access-menu" class="hidden bg-brand-light-dark border border-slate-700 rounded-lg shadow-xl p-3 flex flex-col gap-3 mb-2 min-w-[160px]">
      <button id="theme-toggle" class="flex items-center justify-between w-full text-white hover:text-brand-blue transition-colors p-1">
        <span class="font-medium">Theme</span>
        <div class="relative">
             <svg id="moon-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
             <svg id="sun-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
      </button>
      <div class="flex items-center justify-between text-white p-1">
        <span class="font-medium">Text Size</span>
        <div class="flex gap-2">
          <button id="text-dec" class="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-slate-600 font-bold text-white transition-colors">-</button>
          <button id="text-inc" class="w-8 h-8 flex items-center justify-center bg-slate-700 rounded hover:bg-slate-600 font-bold text-white transition-colors">+</button>
        </div>
      </div>
    </div>
    <button id="access-btn" class="bg-brand-blue hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue" aria-label="Accessibility Options">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
    </button>
  `;
  document.body.appendChild(accessBtn);

  const menu = document.getElementById('access-menu');
  const toggleBtn = document.getElementById('access-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  const textInc = document.getElementById('text-inc');
  const textDec = document.getElementById('text-dec');

  // Toggle Menu
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Theme Logic
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
  });

  // Text Size Logic
  let currentZoom = 100;
  textInc.addEventListener('click', () => {
    if (currentZoom < 150) {
        currentZoom += 10;
        document.documentElement.style.fontSize = currentZoom + '%';
    }
  });

  textDec.addEventListener('click', () => {
    if (currentZoom > 70) {
        currentZoom -= 10;
        document.documentElement.style.fontSize = currentZoom + '%';
    }
  });
});

/**
 * Handles switching tabs in the dashboards (Student and Tutor).
 * @param {string} userType - 'student' or 'tutor'
 * @param {string} sectionId - The ID suffix of the section to show (e.g., 'overview', 'settings')
 */
function switchDashboardTab(userType, sectionId) {
    // 1. Hide all sections
    const allSections = document.querySelectorAll('.dashboard-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Show target section
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // 3. Update Navigation State
    const allNavItems = document.querySelectorAll('.dashboard-nav-item');
    allNavItems.forEach(item => {
        // Reset to default styles
        item.classList.remove('active', 'bg-slate-800/50', 'border-brand-blue', 'text-white');
        item.classList.add('text-brand-text-secondary', 'border-transparent');
    });

    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        // Apply active styles
        activeNav.classList.add('active', 'bg-slate-800/50', 'border-brand-blue', 'text-white');
        activeNav.classList.remove('text-brand-text-secondary', 'border-transparent');
    }

    // 4. Update Breadcrumb
    const breadcrumbSpan = document.getElementById('breadcrumb-current-section');
    if (breadcrumbSpan) {
        // Capitalize first letter for display
        // Special case: if sectionId is 'profile', maybe show 'Profile & Settings' based on nav text, 
        // but simple Capitalization works for most.
        let displayText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        
        // Check if we can get the text directly from the button to match exactly
        if(activeNav) {
            displayText = activeNav.textContent.trim();
        }
        
        breadcrumbSpan.textContent = displayText;
    }
}