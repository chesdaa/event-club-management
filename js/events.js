// Events page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAllEvents();
    setupFilters();
    setupSearch();
    setupModal();
    checkUrlParams();
    setupRoleBasedUIEvents();
});

function loadAllEvents() {
    const events = getFromLocalStorage('events') || [];
    displayEvents(events);
}

function displayEvents(events) {
    const container = document.getElementById('eventsGrid');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No events found.</p>';
        return;
    }
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
    const status = getEventStatus(event);
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);
    
    return `
        <div class="event-card" onclick="showEventModal(${event.id})">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-content">
                <span class="event-category">${event.category}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div><i class="fas fa-calendar"></i> ${formatDate(event.date)}</div>
                    <div><i class="fas fa-clock"></i> ${formatTime(event.time)}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                    <div><i class="fas fa-users"></i> ${event.club}</div>
                </div>
                <div class="event-footer">
                    <span class="event-capacity ${statusColor}">
                        ${event.registered}/${event.capacity} - ${statusText}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    let events = getFromLocalStorage('events') || [];
    
    // Category filter
    const category = document.getElementById('categoryFilter')?.value;
    if (category && category !== 'all') {
        events = events.filter(event => event.category === category);
    }
    
    // Date filter
    const dateFilter = document.getElementById('dateFilter')?.value;
    if (dateFilter && dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        events = events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            switch(dateFilter) {
                case 'today':
                    return eventDate.getTime() === today.getTime();
                case 'week':
                    const weekLater = new Date(today);
                    weekLater.setDate(weekLater.getDate() + 7);
                    return eventDate >= today && eventDate <= weekLater;
                case 'month':
                    const monthLater = new Date(today);
                    monthLater.setMonth(monthLater.getMonth() + 1);
                    return eventDate >= today && eventDate <= monthLater;
                default:
                    return true;
            }
        });
    }
    
    // Status filter
    const status = document.getElementById('statusFilter')?.value;
    if (status && status !== 'all') {
        events = events.filter(event => getEventStatus(event) === status);
    }
    
    // Search filter
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (searchTerm) {
        events = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.club.toLowerCase().includes(searchTerm)
        );
    }
    
    displayEvents(events);
}

function resetFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    loadAllEvents();
}

function setupModal() {
    const modal = document.getElementById('eventModal');
    const closeBtn = modal?.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    });
}

function showEventModal(eventId) {
    const events = getFromLocalStorage('events') || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const content = document.getElementById('eventDetailContent');
    
    const user = getCurrentUser();
    const isRegistered = user && user.myEvents && user.myEvents.includes(eventId);
    const status = getEventStatus(event);
    const isFull = status === 'soldout';
    
    content.innerHTML = `
        <div class="event-detail">
            <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">
            <span class="event-category">${event.category}</span>
            <h2>${event.title}</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">${event.description}</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div>
                    <strong><i class="fas fa-calendar"></i> Date:</strong>
                    <p>${formatDate(event.date)}</p>
                </div>
                <div>
                    <strong><i class="fas fa-clock"></i> Time:</strong>
                    <p>${formatTime(event.time)} - ${formatTime(event.endTime)}</p>
                </div>
                <div>
                    <strong><i class="fas fa-map-marker-alt"></i> Venue:</strong>
                    <p>${event.venue}</p>
                </div>
                <div>
                    <strong><i class="fas fa-users"></i> Organized by:</strong>
                    <p>${event.club}</p>
                </div>
            </div>
            
            <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <strong>Capacity:</strong> ${event.registered}/${event.capacity} registered
                <div style="background: white; height: 10px; border-radius: 5px; margin-top: 0.5rem; overflow: hidden;">
                    <div style="background: var(--primary-color); height: 100%; width: ${(event.registered/event.capacity)*100}%;"></div>
                </div>
            </div>
            
            ${event.tags ? `
                <div style="margin: 1rem 0;">
                    <strong>Tags:</strong>
                    ${event.tags.map(tag => `<span style="display: inline-block; background: var(--light-bg); padding: 0.3rem 0.8rem; border-radius: 20px; margin: 0.2rem; font-size: 0.85rem;">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                ${user ? `
                    ${isRegistered ? `
                        <button class="btn btn-outline" onclick="cancelRSVP(${eventId})">
                            <i class="fas fa-times"></i> Cancel RSVP
                        </button>
                        <button class="btn btn-primary" onclick="downloadTicket(${eventId})">
                            <i class="fas fa-ticket-alt"></i> Download Ticket
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="registerForEvent(${eventId})" ${isFull ? 'disabled' : ''}>
                            <i class="fas fa-check"></i> ${isFull ? 'Event Full' : 'Register Now'}
                        </button>
                    `}
                ` : `
                    <button class="btn btn-primary" onclick="window.location.href='login.html'">
                        <i class="fas fa-sign-in-alt"></i> Login to Register
                    </button>
                `}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function registerForEvent(eventId) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const events = getFromLocalStorage('events') || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Check capacity
    if (event.registered >= event.capacity) {
        alert('Sorry, this event is full!');
        return;
    }
    
    // Update event
    event.registered++;
    saveToLocalStorage('events', events);
    
    // Update user
    if (!user.myEvents) user.myEvents = [];
    user.myEvents.push(eventId);
    setCurrentUser(user);
    
    // Update users list
    const users = getFromLocalStorage('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].myEvents = user.myEvents;
        saveToLocalStorage('users', users);
    }
    
    alert('Successfully registered for the event!');
    showEventModal(eventId);
}

function cancelRSVP(eventId) {
    if (!confirm('Are you sure you want to cancel your RSVP?')) return;
    
    const user = getCurrentUser();
    const events = getFromLocalStorage('events') || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Update event
    event.registered--;
    saveToLocalStorage('events', events);
    
    // Update user
    user.myEvents = user.myEvents.filter(id => id !== eventId);
    setCurrentUser(user);
    
    // Update users list
    const users = getFromLocalStorage('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].myEvents = user.myEvents;
        saveToLocalStorage('users', users);
    }
    
    alert('RSVP cancelled successfully!');
    showEventModal(eventId);
}

function downloadTicket(eventId) {
    const events = getFromLocalStorage('events') || [];
    const event = events.find(e => e.id === eventId);
    const user = getCurrentUser();
    
    if (!event || !user) return;
    
    // Generate QR code data
    const qrData = `EVENT:${event.id}|USER:${user.id}|NAME:${user.firstName} ${user.lastName}`;
    
    // Create ticket HTML
    const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Event Ticket - ${event.title}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .ticket { max-width: 600px; margin: 0 auto; border: 2px solid #667eea; border-radius: 12px; padding: 2rem; }
                .header { text-align: center; margin-bottom: 2rem; }
                .qr-code { text-align: center; margin: 2rem 0; }
                .details { margin: 1rem 0; }
                .details div { margin: 0.5rem 0; }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h1>${event.title}</h1>
                    <p>Event Ticket</p>
                </div>
                <div class="details">
                    <div><strong>Name:</strong> ${user.firstName} ${user.lastName}</div>
                    <div><strong>Student ID:</strong> ${user.studentId}</div>
                    <div><strong>Date:</strong> ${formatDate(event.date)}</div>
                    <div><strong>Time:</strong> ${formatTime(event.time)}</div>
                    <div><strong>Venue:</strong> ${event.venue}</div>
                </div>
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}" alt="QR Code">
                    <p>Scan this QR code at the event entrance</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        showEventModal(parseInt(eventId));
    }
}

function setupRoleBasedUIEvents() {
    const user = getCurrentUser();
    if (!user || user.role !== 'organizer') {
        const elms = document.querySelectorAll('.organizer-only');
        elms.forEach(e => e.style.display = 'none');
    }
}
