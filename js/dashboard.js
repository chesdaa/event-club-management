// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadUserInfo();
    loadDashboardStats();
    loadUpcomingEvents();
    loadMyClubs();
    setupRoleBasedUI();
});

function loadUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userName = document.getElementById('userName');
    const userNameGreeting = document.getElementById('userNameGreeting');
    
    if (userName) {
        userName.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    if (userNameGreeting) {
        userNameGreeting.textContent = user.firstName;
    }
}

function loadDashboardStats() {
    const user = getCurrentUser();
    const events = getFromLocalStorage('events') || [];
    
    // My events (registered events)
    const myEvents = user.myEvents || [];
    document.getElementById('myEventsCount').textContent = myEvents.length;
    
    // My clubs
    const myClubs = user.myClubs || [];
    document.getElementById('myClubsCount').textContent = myClubs.length;
    
    // Upcoming events
    const today = new Date();
    const upcoming = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && myEvents.includes(event.id);
    });
    document.getElementById('upcomingCount').textContent = upcoming.length;
    
    // Total attendees (for organizers)
    if (user.role === 'organizer') {
        const myOrganizedEvents = events.filter(event => event.club === user.club);
        const totalAttendees = myOrganizedEvents.reduce((sum, event) => sum + event.registered, 0);
        const attendeesElement = document.getElementById('totalAttendees');
        if (attendeesElement) {
            attendeesElement.textContent = totalAttendees;
        }
    }
}

function loadUpcomingEvents() {
    const user = getCurrentUser();
    const events = getFromLocalStorage('events') || [];
    const container = document.getElementById('upcomingEventsList');
    
    if (!container) return;
    
    const today = new Date();
    const myEventIds = user.myEvents || [];
    
    // Get upcoming events user is registered for
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && myEventIds.includes(event.id);
    }).slice(0, 5);
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No upcoming events. <a href="events.html">Browse events</a></p>';
        return;
    }
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-list-item" onclick="viewEventDetails(${event.id})">
            <img src="${event.image}" alt="${event.title}" class="event-list-image">
            <div class="event-list-content">
                <h4 class="event-list-title">${event.title}</h4>
                <div class="event-list-meta">
                    <div><i class="fas fa-calendar"></i> ${formatDate(event.date)}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadMyClubs() {
    const user = getCurrentUser();
    const clubs = getFromLocalStorage('clubs') || [];
    const container = document.getElementById('myClubsList');
    
    if (!container) return;
    
    const myClubIds = user.myClubs || [];
    const myClubs = clubs.filter(club => myClubIds.includes(club.id)).slice(0, 4);
    
    if (myClubs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No clubs joined yet. <a href="clubs.html">Explore clubs</a></p>';
        return;
    }
    
    container.innerHTML = myClubs.map(club => `
        <div class="club-card" onclick="viewClubDetails(${club.id})">
            <div class="club-logo">${club.logo}</div>
            <h4 class="club-name">${club.name}</h4>
            <div class="club-stats">
                <div class="club-stat">
                    <strong>${club.members}</strong>
                    <span>Members</span>
                </div>
            </div>
        </div>
    `).join('');
}

function setupRoleBasedUI() {
    const user = getCurrentUser();
    
    if (user.role !== 'organizer') {
        // Hide organizer-only elements
        const organizerElements = document.querySelectorAll('.organizer-only');
        organizerElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

function viewEventDetails(eventId) {
    window.location.href = `events.html?id=${eventId}`;
}

function viewClubDetails(clubId) {
    window.location.href = `clubs.html?id=${clubId}`;
}
