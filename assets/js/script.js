
// This script contains all the interactive logic for the site.
document.addEventListener('DOMContentLoaded', function() {
  
  // --- 1. GLOBAL: Login State Management & Header Update ---
  checkLoginState();

  // --- 2. GLOBAL: Header & Accessibility Logic ---
  
  // Advanced Search toggle
  const advancedSearchBtn = document.getElementById('advanced-search-btn');
  const advancedSearchPopup = document.getElementById('advanced-search-popup-content');

  if (advancedSearchBtn && advancedSearchPopup) {
    advancedSearchBtn.addEventListener('click', () => {
      advancedSearchPopup.classList.toggle('hidden');
    });
  }

  // Homepage date picker input
  const datePicker = document.getElementById('date-picker');
  if(datePicker) {
      datePicker.addEventListener('focus', function() {
          this.type = 'date';
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

  // Price range slider
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  if (priceRange && priceValue) {
    const updatePriceValue = (value) => {
      priceValue.textContent = `$${value}`;
    };
    
    priceRange.addEventListener('input', (event) => {
      updatePriceValue(event.target.value);
    });
    updatePriceValue(priceRange.value);
  }

  // Footer year update
  const copyrightElement = document.querySelector('.copyright-text');
  if (copyrightElement) {
      copyrightElement.innerHTML = `&copy; ${new Date().getFullYear()} Bison Prof. All rights reserved.`;
  }

  // Accessibility Button
  setupAccessibility();

  // --- 3. PAGE SPECIFIC: Login Form Handling ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('email-address').value;
      let userType = 'student';
      let userName = 'Alex Johnson';
      let redirectUrl = 'student-dashboard.html';

      if (email.toLowerCase().includes('tutor')) {
        userType = 'tutor';
        userName = 'Sarah Chen';
        redirectUrl = 'tutor-dashboard.html';
      }

      // Store session
      const session = {
        type: userType,
        name: userName,
        email: email,
        initials: userName.charAt(0)
      };
      localStorage.setItem('bisonSession', JSON.stringify(session));

      window.location.href = redirectUrl;
    });
  }

  // --- 4. PAGE SPECIFIC: Tutor Signup ---
  const tutorForm = document.getElementById('tutor-signup-form');
  const tutorFormContainer = document.getElementById('tutor-signup-container');
  const tutorSuccessMessage = document.getElementById('tutor-success-message');

  if (tutorForm && tutorSuccessMessage) {
      tutorForm.addEventListener('submit', function(e) {
          e.preventDefault(); 
          if(tutorFormContainer) tutorFormContainer.classList.add('hidden');
          tutorSuccessMessage.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  // --- 5. PAGE SPECIFIC: Tutor Dashboard Calendar ---
  // We run this check to see if we are on the tutor dashboard page
  const calendarContainer = document.getElementById('calendar-days');
  if (calendarContainer) {
      initializeCalendar();
  }

  // --- 6. PAGE SPECIFIC: Tutors View Toggle ---
  setupViewToggle();

  // --- 7. GLOBAL: Chat Popup ---
  setupChatPopup();

  // --- 8. PAGE SPECIFIC: Tutor Profile Booking Modal ---
  setupBookingModal();

});

// --- Helper Functions ---

function checkLoginState() {
    const sessionStr = localStorage.getItem('bisonSession');
    const currentPage = window.location.pathname.split('/').pop();
    const isAuthPage = currentPage === 'login.html' || currentPage === 'signup.html' || currentPage === 'tutor-signup.html';
    const isDashboard = currentPage === 'student-dashboard.html' || currentPage === 'tutor-dashboard.html';

    if (sessionStr) {
        const session = JSON.parse(sessionStr);
        
        // Update Header on public pages
        // Look for the container that holds the auth buttons.
        const headerAuthContainer = document.querySelector('header .container .flex.justify-between > div:last-child');
        
        if (headerAuthContainer) {
            const dashboardLink = session.type === 'student' ? 'student-dashboard.html' : 'tutor-dashboard.html';
            
            headerAuthContainer.innerHTML = `
                <a href="${dashboardLink}" class="flex items-center gap-2 text-white font-medium text-sm border-r border-slate-700 pr-4 mr-2 hover:text-brand-blue transition-colors">
                    <div class="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold uppercase">${session.initials}</div>
                    <span class="hidden sm:inline">${session.name}</span>
                </a>
                <button id="global-sign-out" class="text-white border border-slate-700 hover:bg-slate-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                  Sign Out
                </button>
            `;

            // Add logout listener
            document.getElementById('global-sign-out').addEventListener('click', handleLogout);
        }
    } else {
        // No Session
        if (isDashboard) {
            // Redirect to login if trying to access dashboard without session
            window.location.href = 'login.html';
        }
    }
}

function handleLogout() {
    localStorage.removeItem('bisonSession');
    window.location.href = 'index.html';
}

function setupAccessibility() {
    if (document.getElementById('access-btn')) return; // Prevent duplicate initialization

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
            <!-- Universal Access Icon -->
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
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

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    if(themeToggle) {
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
    }

    let currentZoom = 100;
    if(textInc) {
        textInc.addEventListener('click', () => {
            if (currentZoom < 150) {
                currentZoom += 10;
                document.documentElement.style.fontSize = currentZoom + '%';
            }
        });
    }

    if(textDec) {
        textDec.addEventListener('click', () => {
            if (currentZoom > 70) {
                currentZoom -= 10;
                document.documentElement.style.fontSize = currentZoom + '%';
            }
        });
    }
}

// --- Tutors View Toggle Logic ---
function setupViewToggle() {
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    const container = document.getElementById('tutors-grid');
    
    if (!gridBtn || !listBtn || !container) return;

    const cards = container.querySelectorAll('.tutor-card');

    gridBtn.addEventListener('click', () => {
        // Update buttons state
        gridBtn.classList.add('bg-brand-light-dark', 'text-white', 'border-slate-700');
        gridBtn.classList.remove('bg-transparent', 'text-brand-text-secondary', 'border-transparent');
        
        listBtn.classList.remove('bg-brand-light-dark', 'text-white', 'border-slate-700');
        listBtn.classList.add('bg-transparent', 'text-brand-text-secondary', 'border-transparent');

        // Restore grid container
        container.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';

        cards.forEach(card => {
            card.classList.remove('md:flex-row', 'items-center', 'gap-6');
            card.classList.add('flex-col');
            
            const header = card.querySelector('.tutor-header');
            if(header) {
                header.classList.remove('md:w-1/4', 'md:border-r', 'md:border-slate-700', 'md:pr-6');
                header.classList.add('items-center', 'text-center');
            }
            
            const body = card.querySelector('.tutor-body');
            if(body) {
                body.classList.remove('md:w-1/2', 'md:border-0', 'md:px-4', 'md:my-0', 'md:pt-0', 'md:border-t-0');
                body.classList.add('w-full', 'border-t', 'border-slate-700', 'pt-4', 'my-4');
            }
            
            const footer = card.querySelector('.tutor-footer');
            if(footer) {
                footer.classList.remove('md:w-1/4', 'md:border-l', 'md:border-slate-700', 'md:pl-6', 'md:pt-0', 'md:mt-0');
                footer.classList.add('w-full', 'pt-4', 'mt-auto');
            }
        });
    });

    listBtn.addEventListener('click', () => {
        // Update buttons state
        listBtn.classList.add('bg-brand-light-dark', 'text-white', 'border-slate-700');
        listBtn.classList.remove('bg-transparent', 'text-brand-text-secondary', 'border-transparent');
        
        gridBtn.classList.remove('bg-brand-light-dark', 'text-white', 'border-slate-700');
        gridBtn.classList.add('bg-transparent', 'text-brand-text-secondary', 'border-transparent');

        // Switch to list layout
        container.className = 'flex flex-col gap-4';

        cards.forEach(card => {
            card.classList.add('flex-col', 'md:flex-row', 'items-center', 'gap-6');
            
            const header = card.querySelector('.tutor-header');
            if(header) {
                header.classList.add('md:w-1/4', 'md:border-r', 'md:border-slate-700', 'md:pr-6');
            }

            const body = card.querySelector('.tutor-body');
            if(body) {
                 body.classList.add('md:w-1/2', 'md:border-0', 'md:px-4', 'md:my-0', 'md:pt-0', 'md:border-t-0');
            }
            
            const footer = card.querySelector('.tutor-footer');
            if(footer) {
                footer.classList.add('md:w-1/4', 'md:border-l', 'md:border-slate-700', 'md:pl-6', 'md:pt-0', 'md:mt-0');
            }
        });
    });
}

// --- Booking Modal Logic ---
let bookingCurrentDate = new Date();
let bookingSelectedDate = null;
let bookingSelectedSlots = new Set();

function setupBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openBtn = document.getElementById('book-session-btn');
    const closeBtn = document.getElementById('close-booking-modal');
    const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');
    const backToStep1Btn = document.getElementById('back-to-step-1');
    const payBookBtn = document.getElementById('pay-book-btn');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // Views
    const step1 = document.getElementById('booking-step-1');
    const step2 = document.getElementById('booking-step-2');
    const step3 = document.getElementById('booking-step-3');

    // Calendar Nav
    const calPrev = document.getElementById('booking-cal-prev');
    const calNext = document.getElementById('booking-cal-next');

    if(!modal || !openBtn) return;

    // Toggle Modal
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Reset state
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        bookingSelectedDate = null;
        bookingSelectedSlots.clear();
        bookingCurrentDate = new Date();
        renderBookingCalendar();
        document.getElementById('booking-slots-container').classList.add('hidden');
        goToCheckoutBtn.disabled = true;
    });

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

    // Session Type Selection Visuals
    const sessionBtns = document.querySelectorAll('.session-type-btn');
    sessionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sessionBtns.forEach(b => {
                b.classList.remove('active', 'border-brand-blue', 'bg-brand-blue/10', 'text-white');
                b.classList.add('border-slate-700', 'bg-slate-800', 'text-brand-text-secondary');
            });
            btn.classList.add('active', 'border-brand-blue', 'bg-brand-blue/10', 'text-white');
            btn.classList.remove('border-slate-700', 'bg-slate-800', 'text-brand-text-secondary');
        });
    });

    // Calendar Navigation
    if(calPrev) {
        calPrev.addEventListener('click', () => {
            bookingCurrentDate.setMonth(bookingCurrentDate.getMonth() - 1);
            renderBookingCalendar();
        });
    }
    if(calNext) {
        calNext.addEventListener('click', () => {
            bookingCurrentDate.setMonth(bookingCurrentDate.getMonth() + 1);
            renderBookingCalendar();
        });
    }

    // Step 1 -> Step 2
    if(goToCheckoutBtn) {
        goToCheckoutBtn.addEventListener('click', () => {
            // Update Summary
            const count = bookingSelectedSlots.size;
            const price = count * 25;
            const total = price + 2; // Service fee

            document.getElementById('summary-session-text').textContent = `Session (${count} hour${count > 1 ? 's' : ''})`;
            document.getElementById('summary-session-price').textContent = `$${price.toFixed(2)}`;
            document.getElementById('summary-total-price').textContent = `$${total.toFixed(2)}`;

            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.classList.add('animate-fade-in');
        });
    }

    // Step 2 -> Step 1
    if(backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }

    // Step 2 -> Step 3 (Simulate Payment)
    if(payBookBtn) {
        payBookBtn.addEventListener('click', () => {
            // Simulate processing
            payBookBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
            
            setTimeout(() => {
                step2.classList.add('hidden');
                step3.classList.remove('hidden');
                step3.classList.add('animate-fade-in');
                payBookBtn.innerHTML = 'Pay & Book Session';
            }, 1500);
        });
    }
}

function renderBookingCalendar() {
    const calendarGrid = document.getElementById('booking-cal-grid');
    const monthTitle = document.getElementById('booking-cal-month');
    
    if(!calendarGrid || !monthTitle) return;

    const year = bookingCurrentDate.getFullYear();
    const month = bookingCurrentDate.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthTitle.textContent = `${monthNames[month]} ${year}`;
    
    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        
        // Simulation: Availability on Mon, Wed, Fri
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay();
        const isAvailable = (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && dateObj >= new Date().setHours(0,0,0,0);
        
        // Check if selected
        const isSelected = bookingSelectedDate === dateStr;

        let classes = 'p-2 rounded text-sm text-center flex items-center justify-center transition-colors ';
        if (isSelected) {
            classes += 'bg-brand-blue text-white font-bold';
        } else if (isAvailable) {
            classes += 'text-white font-medium cursor-pointer hover:bg-brand-blue/20 hover:text-brand-blue border border-transparent hover:border-brand-blue';
        } else {
            classes += 'text-slate-600 cursor-not-allowed';
        }
        
        dayDiv.className = classes;
        dayDiv.textContent = day;

        if (isAvailable) {
            dayDiv.addEventListener('click', () => selectBookingDate(dateStr, dateObj));
        }

        calendarGrid.appendChild(dayDiv);
    }
}

function selectBookingDate(dateStr, dateObj) {
    bookingSelectedDate = dateStr;
    bookingSelectedSlots.clear();
    renderBookingCalendar(); // Re-render to update selection highlight

    const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    document.getElementById('selected-date-display').textContent = displayDate;
    document.getElementById('booking-slots-container').classList.remove('hidden');
    
    renderBookingSlots();
    updateBookingButton();
}

function renderBookingSlots() {
    const slotsContainer = document.getElementById('booking-time-slots');
    slotsContainer.innerHTML = '';

    // Mock slots for demonstration
    const mockSlots = [
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "1:00 PM - 2:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM"
    ];

    mockSlots.forEach(slotTime => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isSelected = bookingSelectedSlots.has(slotTime);
        
        let classes = 'p-2 rounded border text-xs font-medium transition-all ';
        if (isSelected) {
            classes += 'bg-brand-blue border-brand-blue text-white';
        } else {
            classes += 'border-slate-600 bg-slate-700/50 text-white hover:border-brand-blue hover:text-brand-blue';
        }
        
        btn.className = classes;
        btn.textContent = slotTime;
        
        btn.addEventListener('click', () => {
            if (bookingSelectedSlots.has(slotTime)) {
                bookingSelectedSlots.delete(slotTime);
            } else {
                bookingSelectedSlots.add(slotTime);
            }
            renderBookingSlots();
            updateBookingButton();
        });

        slotsContainer.appendChild(btn);
    });
}

function updateBookingButton() {
    const btn = document.getElementById('go-to-checkout-btn');
    const count = bookingSelectedSlots.size;
    
    if (count > 0) {
        btn.disabled = false;
        btn.textContent = `Book ${count} Slot${count > 1 ? 's' : ''} - Continue`;
    } else {
        btn.disabled = true;
        btn.textContent = 'Select a time slot';
    }
}

// --- Chat Popup Logic ---
function setupChatPopup() {
    const chatPopup = document.getElementById('chat-popup');
    const openChatBtn = document.querySelectorAll('#open-chat-btn'); // Select all buttons with this ID (class would be better, but sticking to existing ID usage for now)
    const closeChatBtn = document.getElementById('close-chat-btn');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatPopup) return;

    const toggleChat = () => {
        chatPopup.classList.toggle('hidden');
        if(!chatPopup.classList.contains('hidden')) {
            // Scroll to bottom when opening
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    // Attach event to all open chat buttons (sidebar + profile)
    openChatBtn.forEach(btn => {
        btn.addEventListener('click', toggleChat);
    });
    
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

    // Send Message Logic
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            // Append User Message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'flex gap-3 justify-end animate-fade-in';
            userMsgDiv.innerHTML = `
                <div class="bg-brand-blue text-white p-3 rounded-2xl rounded-br-none max-w-[80%] text-sm shadow-sm">
                    <p>${escapeHtml(message)}</p>
                </div>
            `;
            chatMessages.appendChild(userMsgDiv);
            
            // Clear Input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate Reply (Optional)
            setTimeout(() => {
                const tutorMsgDiv = document.createElement('div');
                tutorMsgDiv.className = 'flex gap-3 animate-fade-in';
                tutorMsgDiv.innerHTML = `
                    <img src="assets/images/f1" class="w-8 h-8 rounded-full self-end mb-1 border border-slate-700">
                    <div class="bg-slate-700 text-white p-3 rounded-2xl rounded-bl-none max-w-[80%] text-sm shadow-sm">
                        <p>Got it! I'll get back to you shortly.</p>
                    </div>
                `;
                chatMessages.appendChild(tutorMsgDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        }
    };

    if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


// --- Calendar Logic ---
let globalAvailabilityData = {};
let globalCurrentDate = new Date();
let globalSelectedDateKey = null;

function initializeCalendar() {
    renderCalendar();
    
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');
    
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            globalCurrentDate.setMonth(globalCurrentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            globalCurrentDate.setMonth(globalCurrentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    setupCalendarModal();
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;

    const year = globalCurrentDate.getFullYear();
    const month = globalCurrentDate.getMonth();
    
    const monthTitle = document.getElementById('calendar-month-year');
    if(monthTitle) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthTitle.textContent = `${monthNames[month]} ${year}`;
    }
    
    calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = "h-20 md:h-24 bg-brand-dark/20 rounded-lg border border-transparent";
        calendarDays.appendChild(emptyDiv);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasSlots = globalAvailabilityData[dateKey] && globalAvailabilityData[dateKey].length > 0;
        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

        const dayDiv = document.createElement('div');
        dayDiv.className = `h-20 md:h-24 rounded-lg border p-1 sm:p-2 flex flex-col items-start justify-between cursor-pointer transition-all hover:bg-slate-700 ${isToday ? 'border-brand-blue bg-slate-800/80' : 'border-slate-700 bg-slate-800/40'}`;
        
        let slotsIndicator = '';
        if (hasSlots) {
            slotsIndicator = `<div class="w-full mt-1">
                <div class="text-[10px] sm:text-xs text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded truncate">${globalAvailabilityData[dateKey].length} slots</div>
            </div>`;
        }

        dayDiv.innerHTML = `
            <span class="font-semibold text-sm sm:text-base ${isToday ? 'text-brand-blue' : 'text-white'}">${day}</span>
            ${slotsIndicator}
        `;

        dayDiv.addEventListener('click', () => openAvailabilityModal(dateKey));
        calendarDays.appendChild(dayDiv);
    }
}

function setupCalendarModal() {
    const availModal = document.getElementById('availability-modal');
    if(!availModal) return;

    document.getElementById('close-avail-modal').addEventListener('click', closeAvailModal);
    availModal.addEventListener('click', (e) => {
        if(e.target === availModal) closeAvailModal();
    });

    document.getElementById('add-time-slot').addEventListener('click', () => addTimeSlotInput());
    
    document.getElementById('save-availability').addEventListener('click', () => {
        if (!globalSelectedDateKey) return;
        const timeSlotsContainer = document.getElementById('time-slots-container');
        const slots = [];
        const slotDivs = timeSlotsContainer.querySelectorAll('div.flex');
        
        slotDivs.forEach(div => {
            const start = div.querySelector('.slot-start').value;
            const end = div.querySelector('.slot-end').value;
            if (start && end) {
                slots.push({ start, end });
            }
        });

        globalAvailabilityData[globalSelectedDateKey] = slots;
        renderCalendar();
        closeAvailModal();
    });
}

window.openAvailabilityModal = (dateKey) => {
    globalSelectedDateKey = dateKey;
    const dateObj = new Date(dateKey + 'T00:00:00'); // Fix timezone issue by appending time
    document.getElementById('modal-date-title').textContent = `Edit: ${dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    
    const timeSlotsContainer = document.getElementById('time-slots-container');
    timeSlotsContainer.innerHTML = '';
    const slots = globalAvailabilityData[dateKey] || [];
    
    if(slots.length === 0) {
      addTimeSlotInput();
    } else {
      slots.forEach(slot => addTimeSlotInput(slot.start, slot.end));
    }
    
    document.getElementById('availability-modal').classList.remove('hidden');
};

function closeAvailModal() {
    document.getElementById('availability-modal').classList.add('hidden');
    globalSelectedDateKey = null;
}

function addTimeSlotInput(start = '', end = '') {
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2 animate-fade-in';
    div.innerHTML = `
        <input type="time" value="${start}" class="slot-start bg-slate-700 border border-slate-600 text-white rounded px-2 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue w-full">
        <span class="text-brand-text-secondary">-</span>
        <input type="time" value="${end}" class="slot-end bg-slate-700 border border-slate-600 text-white rounded px-2 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue w-full">
        <button class="text-red-400 hover:text-red-300 p-2" onclick="this.parentElement.remove()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
    `;
    timeSlotsContainer.appendChild(div);
}

// --- Dashboard Tab Switcher ---
// Attached to window for HTML access
window.switchDashboardTab = function(userType, sectionId) {
    const allSections = document.querySelectorAll('.dashboard-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        // If switching to availability, ensure calendar is rendered (fix for display issues)
        if (sectionId === 'availability') {
            // Small delay to ensure element visibility calculation if needed
            setTimeout(() => {
                renderCalendar();
            }, 50);
        }
    }

    const allNavItems = document.querySelectorAll('.dashboard-nav-item');
    allNavItems.forEach(item => {
        item.classList.remove('active', 'bg-slate-800/50', 'border-brand-blue', 'text-white');
        item.classList.add('text-brand-text-secondary', 'border-transparent');
    });

    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        activeNav.classList.add('active', 'bg-slate-800/50', 'border-brand-blue', 'text-white');
        activeNav.classList.remove('text-brand-text-secondary', 'border-transparent');
    }

    const breadcrumbSpan = document.getElementById('breadcrumb-current-section');
    if (breadcrumbSpan && activeNav) {
        breadcrumbSpan.textContent = activeNav.textContent.trim();
    }
};
