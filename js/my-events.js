// My Events page JavaScript
let currentFilter = 'upcoming';

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadMyEvents();
});

function loadMyEvents() {
    const user = getCurrentUser();
    const events = getFromLocalStorage('events') || [];
    const myEventIds = user.myEvents || [];
    
    if (myEventIds.length === 0) {
        showEmptyState();
        return;
    }
    
    const myEvents = events.filter(event => myEventIds.includes(event.id));
    displayMyEvents(myEvents);
}

function displayMyEvents(events) {
    const container = document.getElementById('myEventsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;
    
    // Filter events based on current tab
    const today = new Date();
    let filteredEvents = events;
    
    if (currentFilter === 'upcoming') {
        filteredEvents = events.filter(event => new Date(event.date) >= today);
    } else if (currentFilter === 'past') {
        filteredEvents = events.filter(event => new Date(event.date) < today);
    }
    
    if (filteredEvents.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = currentFilter === 'upcoming' ? 'No Upcoming Events' : 'No Past Events';
        emptyState.querySelector('p').textContent = currentFilter === 'upcoming' ? 
            'You don\'t have any upcoming events.' : 
            'You haven\'t attended any past events.';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by date
    filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentFilter === 'past' ? dateB - dateA : dateA - dateB;
    });
    
    container.innerHTML = filteredEvents.map(event => createMyEventCard(event)).join('');
}

function createMyEventCard(event) {
    const eventDate = new Date(event.date);
    const today = new Date();
    const isPast = eventDate < today;
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="event-list-item" style="position: relative;">
            <img src="${event.image}" alt="${event.title}" class="event-list-image">
            <div class="event-list-content" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <span class="event-category">${event.category}</span>
                        <h3 class="event-list-title">${event.title}</h3>
                    </div>
                    ${!isPast ? `
                        <span style="background: var(--success-color); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">
                            ${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                        </span>
                    ` : `
                        <span style="background: var(--text-secondary); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">
                            Completed
                        </span>
                    `}
                </div>
                <div class="event-list-meta" style="margin-top: 1rem;">
                    <div><i class="fas fa-calendar"></i> ${formatDate(event.date)}</div>
                    <div><i class="fas fa-clock"></i> ${formatTime(event.time)} - ${formatTime(event.endTime)}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                    <div><i class="fas fa-users"></i> ${event.club}</div>
                </div>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${!isPast ? `
                        <button class="btn btn-primary btn-sm" onclick="downloadTicket(${event.id})">
                            <i class="fas fa-ticket-alt"></i> Download Ticket
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="viewEventDetails(${event.id})">
                            <i class="fas fa-info-circle"></i> View Details
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="cancelEventRSVP(${event.id})">
                            <i class="fas fa-times"></i> Cancel RSVP
                        </button>
                    ` : `
                        <button class="btn btn-outline btn-sm" onclick="viewEventDetails(${event.id})">
                            <i class="fas fa-info-circle"></i> View Details
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="viewEventGallery(${event.id})">
                            <i class="fas fa-images"></i> View Photos
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

function switchEventTab(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadMyEvents();
}

function showEmptyState() {
    const container = document.getElementById('myEventsList');
    const emptyState = document.getElementById('emptyState');
    
    if (container) container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
}

function viewEventDetails(eventId) {
    window.location.href = `events.html?id=${eventId}`;
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
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                    background: #f7fafc;
                }
                .ticket { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    border: 3px solid #667eea; 
                    border-radius: 16px; 
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px dashed #667eea;
                }
                .header h1 {
                    color: #667eea;
                    margin-bottom: 0.5rem;
                }
                .qr-code { 
                    text-align: center; 
                    margin: 2rem 0;
                    padding: 1rem;
                    background: #f7fafc;
                    border-radius: 8px;
                }
                .details { 
                    margin: 1.5rem 0;
                    line-height: 2;
                }
                .details div { 
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .details strong {
                    color: #2d3748;
                }
                .footer {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 2px dashed #667eea;
                    color: #718096;
                    font-size: 0.9rem;
                }
                @media print {
                    body { background: white; }
                    .ticket { border: 2px solid #667eea; box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h1>${event.title}</h1>
                    <p style="color: #718096;">Official Event Ticket</p>
                </div>
                <div class="details">
                    <div><strong>Attendee Name:</strong> <span>${user.firstName} ${user.lastName}</span></div>
                    <div><strong>Student ID:</strong> <span>${user.studentId}</span></div>
                    <div><strong>Email:</strong> <span>${user.email}</span></div>
                    <div><strong>Event Date:</strong> <span>${formatDate(event.date)}</span></div>
                    <div><strong>Time:</strong> <span>${formatTime(event.time)} - ${formatTime(event.endTime)}</span></div>
                    <div><strong>Venue:</strong> <span>${event.venue}</span></div>
                    <div><strong>Organized by:</strong> <span>${event.club}</span></div>
                </div>
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}" alt="QR Code">
                    <p style="margin-top: 1rem; color: #718096;">Scan this QR code at the event entrance</p>
                </div>
                <div class="footer">
                    <p>Please arrive 15 minutes before the event starts</p>
                    <p>Keep this ticket safe and present it at the venue</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="window.print()" style="padding: 0.8rem 2rem; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer;">
                    Print Ticket
                </button>
            </div>
        </body>
        </html>
    `;
    
    // Open in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
}

function cancelEventRSVP(eventId) {
    if (!confirm('Are you sure you want to cancel your RSVP for this event?')) return;
    
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
    loadMyEvents();
}

function viewEventGallery(eventId) {
    window.location.href = `gallery.html?event=${eventId}`;
}
