// Main JavaScript for homepage
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadFeaturedEvents();
    loadPopularClubs();
    setupMobileMenu();
    setupNavbarScroll();
});

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
    const featuredEvents = events.slice(0, 3);
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
    const popularClubs = clubs.slice(0, 3);
    const container = document.getElementById('popularClubsGrid');
    
    if (!container) return;
    
    container.innerHTML = popularClubs.map(club => createClubCard(club)).join('');
}

function createClubCard(club) {
    return `
        <div class="club-card" onclick="viewClubDetails(${club.id})">
            <div class="club-logo">${club.logo}</div>
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
