// Main JavaScript for homepage
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadFeaturedEvents();
    loadPopularClubs();
    setupMobileMenu();
    setupNavbarScroll();
    setupAuthNavbar();
    bindNavLinks();
    ensureChatbotWidget();
    setUserRoleClass();
    setupFAB();
    setupChatbotMessages();
    setupCreateDropdown();
});

// Set body class based on user role for dashboard styling
function setUserRoleClass() {
    const user = getCurrentUser();
    if (user && user.role) {
        document.body.classList.add(user.role + '-role');
    }
}

function loadStats() {
    const events = getFromLocalStorage('events') || [];
    const clubs = getFromLocalStorage('clubs') || [];
    
    // Count upcoming events
    const today = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) >= today);
    
    // Calculate total participants
    const totalParticipants = events.reduce((sum, event) => sum + event.registered, 0);
    
    // Animate counters
    animateCounter('totalEvents', upcomingEvents.length);
    animateCounter('totalClubs', clubs.length);
    animateCounter('totalParticipants', totalParticipants);
}

// Ensure nav links always navigate (avoid interference by other handlers/overlays)
function bindNavLinks() {
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(a => {
        a.addEventListener('click', (e) => {
            // If a modal is open, close it first
            const backdrop = document.getElementById('profileModalBackdrop');
            if (backdrop && backdrop.style.display !== 'none') {
                backdrop.style.display = 'none';
            }
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            // Force navigation to avoid any preventDefault from other listeners
            e.preventDefault();
            window.location.href = href;
        }, { capture: true });
    });
}

// -------- Auth-aware Navbar & Profile Modal --------
function setupAuthNavbar() {
    // Requires helpers from js/data.js: isLoggedIn(), getCurrentUser(), logout()
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    if (!navMenu) return;

    // Ensure Dashboard link exists (when logged in)
    const dashboardLinkExists = !!navMenu.querySelector('a[href="dashboard.html"]');
    if (isLoggedIn()) {
        const user = getCurrentUser();
        // Remove Home for logged-in non-admin users
        const homeLink = navMenu.querySelector('a[href="index.html"]');
        if (homeLink && user?.role !== 'admin') {
            const li = homeLink.closest('li');
            if (li) li.remove();
        }
        if (!dashboardLinkExists) {
            const li = document.createElement('li');
            li.innerHTML = '<a href="dashboard.html">Dashboard</a>';
            navMenu.appendChild(li);
        }
        // Clean existing nav actions to avoid duplicates
        if (navActions) {
            // Clear all existing items to avoid any duplication across pages
            navActions.innerHTML = '';
        }
        renderProfileAction(navActions);
        injectProfileModal();
        bindProfileModal();
    } else {
        // If logged out, remove profile action if present
        const profileBtn = document.getElementById('profileMenuToggle');
        if (profileBtn && profileBtn.parentElement) profileBtn.parentElement.remove();
        // Optionally ensure dashboard link not shown for logged out users
        if (dashboardLinkExists) {
            const node = navMenu.querySelector('a[href="dashboard.html"]').closest('li');
            if (node) node.remove();
        }
    }
}

function renderProfileAction(container) {
    if (!container) return;
    // Avoid duplicate render
    if (document.getElementById('profileMenuToggle')) return;

    const user = getCurrentUser();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=667eea&color=fff`;
    
    // Add notification icon
    const notificationLink = document.createElement('a');
    notificationLink.href = 'notifications.html';
    notificationLink.className = 'notification-icon';
    notificationLink.style.cssText = 'position: relative; display: flex; align-items: center; margin-right: 0.5rem;';
    notificationLink.innerHTML = `
        <i class="fas fa-bell" style="font-size: 1.3rem; color: var(--text-primary);"></i>
        <span class="notification-badge">3</span>
    `;
    container?.appendChild(notificationLink);
    
    // Add profile button
    const wrapper = document.createElement('div');
    wrapper.className = 'user-menu';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '0.5rem';
    wrapper.innerHTML = `
        <button id="profileMenuToggle" class="btn btn-outline" style="display:flex;align-items:center;gap:8px;">
            <img src="${avatarUrl}" alt="User" class="user-avatar" style="width:32px;height:32px;border-radius:50%;">
            <span style="font-weight:600;">${user.firstName}</span>
            <i class="fas fa-chevron-down"></i>
        </button>
    `;
    container?.appendChild(wrapper);
}

function injectProfileModal() {
    if (document.getElementById('profileModalBackdrop')) return;
    const user = getCurrentUser() || { firstName: 'User', lastName: '' };
    const role = (user.role || 'student');
    const orgExtra = role === 'organizer' ? '<li><button data-action="proposals" class="modal-link">My Proposals</button></li>' : '';

    const modalHtml = `
    <div id="profileModalBackdrop" class="profile-modal-backdrop" style="display:none;">
      <div class="profile-modal">
        <div class="profile-modal-header">
          <h3><i class="fas fa-user-circle"></i> Profile</h3>
          <button class="modal-close" id="profileModalClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="profile-modal-body">
          <div class="profile-summary">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + (user.lastName||''))}&background=667eea&color=fff" class="profile-avatar"/>
            <div>
              <div class="profile-name">${user.firstName} ${user.lastName||''}</div>
              <div class="profile-role">${role.charAt(0).toUpperCase()+role.slice(1)}</div>
            </div>
          </div>
          <ul class="profile-actions">
            <li><button data-action="profile" class="modal-link">View Profile</button></li>
            <li><button data-action="settings" class="modal-link">Settings</button></li>
            ${orgExtra}
            <li><button data-action="logout" class="modal-link danger">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function bindProfileModal() {
    const toggle = document.getElementById('profileMenuToggle');
    const backdrop = document.getElementById('profileModalBackdrop');
    const closeBtn = document.getElementById('profileModalClose');
    if (!toggle || !backdrop || !closeBtn) return;

    const open = () => { backdrop.style.display = 'flex'; };
    const close = () => { backdrop.style.display = 'none'; };
    toggle.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

    // Action routing
    backdrop.querySelectorAll('.modal-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            switch (action) {
                case 'profile':
                    window.location.href = 'profile.html';
                    break;
                case 'settings':
                    window.location.href = 'settings.html';
                    break;
                case 'proposals':
                    window.location.href = 'proposals.html';
                    break;
                case 'logout':
                    logout();
                    break;
            }
        });
    });
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

function loadFeaturedEvents() {
    const events = getFromLocalStorage('events') || [];
    const featuredEvents = events.slice(0, 4);
    const container = document.getElementById('featuredEventsGrid');
    
    if (!container) return;
    
    container.innerHTML = featuredEvents.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
    const status = getEventStatus(event);
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);
    
    return `
        <div class="event-card" onclick="viewEventDetails(${event.id})">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <span class="event-category">${event.category}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div><i class="fas fa-calendar"></i> ${formatDate(event.date)}</div>
                    <div><i class="fas fa-clock"></i> ${formatTime(event.time)}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                </div>
                <div class="event-footer">
                    <span class="event-capacity ${statusColor}">
                        ${event.registered}/${event.capacity} - ${statusText}
                    </span>
                    <button class="btn btn-primary btn-sm">View Details</button>
                </div>
            </div>
        </div>
    `;
}

function loadPopularClubs() {
    const clubs = getFromLocalStorage('clubs') || [];
    const popularClubs = clubs.slice(0, 4);
    const container = document.getElementById('popularClubsGrid');
    
    if (!container) return;
    
    container.innerHTML = popularClubs.map(club => createClubCard(club)).join('');
}

function createClubCard(club) {
    const logoContent = club.image 
        ? `<img src="${club.image}" alt="${club.name}">`
        : `<i class="${club.logo}"></i>`;
    
    return `
        <div class="club-card" onclick="viewClubDetails(${club.id})">
            <div class="club-logo">${logoContent}</div>
            <h3 class="club-name">${club.name}</h3>
            <p class="club-description">${club.description}</p>
            <div class="club-stats">
                <div class="club-stat">
                    <strong>${club.members}</strong>
                    <span>Members</span>
                </div>
                <div class="club-stat">
                    <strong>${club.events}</strong>
                    <span>Events</span>
                </div>
            </div>
        </div>
    `;
}

function viewEventDetails(eventId) {
    window.location.href = `events.html?id=${eventId}`;
}

function viewClubDetails(clubId) {
    window.location.href = `clubs.html?id=${clubId}`;
}

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });
    }
}

// Setup FAB (Floating Action Button) toggle
function setupFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    if (!fabMain || !fabMenu) {
        console.log('FAB elements not found');
        return;
    }
    
    console.log('Setting up FAB...');
    
    // Remove any existing listeners
    const newFabMain = fabMain.cloneNode(true);
    fabMain.parentNode.replaceChild(newFabMain, fabMain);
    
    newFabMain.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('FAB clicked!');
        
        const isVisible = fabMenu.style.display === 'flex';
        fabMenu.style.display = isVisible ? 'none' : 'flex';
        newFabMain.classList.toggle('active');
        
        console.log('Menu display:', fabMenu.style.display);
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab-container')) {
            fabMenu.style.display = 'none';
            const fabBtn = document.getElementById('fabMain');
            if (fabBtn) fabBtn.classList.remove('active');
        }
    });
    
    console.log('FAB setup complete');
}

// Setup chatbot messages based on login status
function setupChatbotMessages() {
    const chatMessages = document.getElementById('chatbotMessages');
    if (!chatMessages) return;
    
    const user = getCurrentUser();
    let welcomeMessage = '';
    
    if (user) {
        welcomeMessage = `Hello ${user.firstName || 'there'}! 👋 I'm your campus assistant. How can I help you today?`;
    } else {
        welcomeMessage = `Welcome! 👋 I'm your campus assistant. Please sign in to access personalized features, or ask me anything about our events and clubs!`;
    }
    
    // Add welcome message if chat is empty
    if (chatMessages.children.length === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${welcomeMessage}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    }
}

// Setup Create Dropdown Button
function setupCreateDropdown() {
    const createBtn = document.getElementById('createDropdownBtn');
    const createMenu = document.getElementById('createDropdownMenu');
    
    if (!createBtn || !createMenu) {
        return;
    }
    
    createBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = createMenu.style.display === 'block';
        createMenu.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.create-dropdown')) {
            createMenu.style.display = 'none';
        }
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
        const scrolled = window.scrollY > 10;
        navbar.classList.toggle('scrolled', scrolled);
    };

    // Initial check and listener
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}
