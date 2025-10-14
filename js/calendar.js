// Calendar page JavaScript
let currentDate = new Date();
let currentView = 'month';

document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    updateMonthDisplay();
});

function renderCalendar() {
    if (currentView === 'month') {
        renderMonthView();
    } else if (currentView === 'week') {
        renderWeekView();
    } else {
        renderListView();
    }
}

function renderMonthView() {
    const calendarBody = document.getElementById('calendarBody');
    if (!calendarBody) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();
    
    const events = getFromLocalStorage('events') || [];
    
    let days = [];
    
    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
        days.push({
            date: prevLastDayDate - i + 1,
            isCurrentMonth: false,
            events: []
        });
    }
    
    // Current month days
    for (let i = 1; i <= lastDayDate; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateStr);
        
        days.push({
            date: i,
            isCurrentMonth: true,
            isToday: isToday(year, month, i),
            events: dayEvents,
            dateStr: dateStr
        });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: i,
            isCurrentMonth: false,
            events: []
        });
    }
    
    calendarBody.innerHTML = days.map(day => {
        const classes = ['calendar-day'];
        if (!day.isCurrentMonth) classes.push('other-month');
        if (day.isToday) classes.push('today');
        
        return `
            <div class="${classes.join(' ')}" onclick="selectDate('${day.dateStr || ''}')">
                <div class="day-number">${day.date}</div>
                <div class="day-events">
                    ${day.events.slice(0, 3).map(event => `
                        <div class="day-event" title="${event.title}" onclick="event.stopPropagation(); showEventDetails(${event.id})">${event.title}</div>
                    `).join('')}
                    ${day.events.length > 3 ? `<div class="day-event">+${day.events.length - 3} more</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderWeekView() {
    const weekGrid = document.getElementById('weekGrid');
    if (!weekGrid) return;
    
    const events = getFromLocalStorage('events') || [];
    const startOfWeek = getStartOfWeek(currentDate);
    
    let weekHTML = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border-color);">';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = events.filter(event => event.date === dateStr);
        
        weekHTML += `
            <div style="background: white; padding: 1rem; min-height: 400px;">
                <h4 style="margin-bottom: 1rem; text-align: center;">
                    ${date.toLocaleDateString('en-US', { weekday: 'short' })}<br>
                    ${date.getDate()}
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${dayEvents.map(event => `
                        <div style="background: var(--primary-color); color: white; padding: 0.5rem; border-radius: 4px; font-size: 0.85rem; cursor: pointer;" onclick="showEventDetails(${event.id})">
                            <strong>${formatTime(event.time)}</strong><br>
                            ${event.title}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    weekHTML += '</div>';
    weekGrid.innerHTML = weekHTML;
}

function renderListView() {
    const listView = document.getElementById('eventsListView');
    if (!listView) return;
    
    const events = getFromLocalStorage('events') || [];
    const today = new Date();
    
    // Group events by date
    const groupedEvents = {};
    events.forEach(event => {
        const eventDate = new Date(event.date);
        if (eventDate >= today) {
            if (!groupedEvents[event.date]) {
                groupedEvents[event.date] = [];
            }
            groupedEvents[event.date].push(event);
        }
    });
    
    const sortedDates = Object.keys(groupedEvents).sort();
    
    if (sortedDates.length === 0) {
        listView.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No upcoming events.</p>';
        return;
    }
    
    listView.innerHTML = sortedDates.map(date => `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">${formatDate(date)}</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${groupedEvents[date].map(event => `
                    <div class="event-list-item" onclick="showEventDetails(${event.id})">
                        <img src="${event.image}" alt="${event.title}" class="event-list-image">
                        <div class="event-list-content">
                            <h4 class="event-list-title">${event.title}</h4>
                            <div class="event-list-meta">
                                <div><i class="fas fa-clock"></i> ${formatTime(event.time)}</div>
                                <div><i class="fas fa-map-marker-alt"></i> ${event.venue}</div>
                                <div><i class="fas fa-users"></i> ${event.club}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function switchView(view) {
    currentView = view;
    
    // Update active button
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide views
    document.getElementById('monthView').style.display = view === 'month' ? 'block' : 'none';
    document.getElementById('weekView').style.display = view === 'week' ? 'block' : 'none';
    document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
    
    renderCalendar();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthDisplay();
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    updateMonthDisplay();
    renderCalendar();
}

function updateMonthDisplay() {
    const monthDisplay = document.getElementById('currentMonth');
    if (monthDisplay) {
        monthDisplay.textContent = currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    }
}

function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function selectDate(dateStr) {
    if (!dateStr) return;
    
    const events = getFromLocalStorage('events') || [];
    const dayEvents = events.filter(event => event.date === dateStr);
    
    const sidebar = document.getElementById('eventDetailsSidebar');
    const content = document.getElementById('eventDetailsContent');
    
    if (!sidebar || !content) return;
    
    if (dayEvents.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-calendar-times" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h4 style="margin-bottom: 0.5rem;">No Events</h4>
                <p style="color: var(--text-secondary);">No events scheduled for ${formatDate(dateStr)}</p>
            </div>
        `;
    } else {
        content.innerHTML = `
            <h4 style="margin-bottom: 1rem;">${formatDate(dateStr)}</h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${dayEvents.map(event => `
                    <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; cursor: pointer;" onclick="showEventDetails(${event.id})">
                        <h5 style="margin-bottom: 0.5rem;">${event.title}</h5>
                        <p style="font-size: 0.9rem; color: var(--text-secondary);">
                            <i class="fas fa-clock"></i> ${formatTime(event.time)}<br>
                            <i class="fas fa-map-marker-alt"></i> ${event.venue}
                        </p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    sidebar.classList.add('active');
}

function showEventDetails(eventId) {
    window.location.href = `events.html?id=${eventId}`;
}

function closeEventDetails() {
    const sidebar = document.getElementById('eventDetailsSidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}
