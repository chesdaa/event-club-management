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
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No upcoming events. <a href="events.html" style="color: var(--primary-color); font-weight: 600;">Browse events</a></p>';
        return;
    }
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-card-compact" data-event-id="${event.id}" style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
            <img src="${event.image}" alt="${event.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${event.title}</h4>
                <div style="display: flex; gap: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                    <div><i class="fas fa-calendar"></i> ${formatDate(event.date)}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click listeners after rendering
    document.querySelectorAll('.event-card-compact').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const eventId = this.getAttribute('data-event-id');
            window.location.href = `events.html?id=${eventId}`;
        });
    });
}

function loadMyClubs() {
    const user = getCurrentUser();
    const clubs = getFromLocalStorage('clubs') || [];
    const container = document.getElementById('myClubsList');
    
    if (!container) return;
    
    const myClubIds = user.myClubs || [];
    const myClubs = clubs.filter(club => myClubIds.includes(club.id)).slice(0, 6);
    
    if (myClubs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1; padding: 2rem;">No clubs joined yet. <a href="clubs.html" style="color: var(--primary-color); font-weight: 600;">Explore clubs</a></p>';
        return;
    }
    
    container.innerHTML = myClubs.map(club => `
        <div class="club-card-compact" data-club-id="${club.id}" style="background: white; padding: 1.5rem; border-radius: 8px; text-align: center; cursor: pointer; border: 1px solid #e0e0e0; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${club.logo}</div>
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${club.name}</h4>
            <div style="color: var(--text-secondary); font-size: 0.85rem;">
                <strong>${club.members}</strong> Members
            </div>
        </div>
    `).join('');
    
    // Add click listeners after rendering
    document.querySelectorAll('.club-card-compact').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const clubId = this.getAttribute('data-club-id');
            window.location.href = `clubs.html?id=${clubId}`;
        });
    });
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
