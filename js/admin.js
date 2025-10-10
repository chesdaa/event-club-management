// Admin dashboard logic

document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) return;
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    // Non-admins redirected to their dashboard
    window.location.href = 'dashboard.html';
    return;
  }

  loadPendingEventProposals();
  loadPendingProposals();
  loadAllEvents();
  loadAllClubs();
  loadAllUsers();
  createAdminModals();
});

function loadPendingProposals() {
  const container = document.getElementById('pendingProposals');
  if (!container) return;

  const proposals = getFromLocalStorage('proposals') || [];
  const pending = proposals.filter(p => p.type === 'club' && p.status === 'pending');

  if (pending.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No pending club proposals.</p>';
    return;
  }

  container.innerHTML = pending.map(p => `
    <div class="proposal-card">
      <div class="proposal-header">
        <div>
          <h3><i class="fas fa-users"></i> ${p.name}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Submitted by ${p.submittedBy} (${p.submittedByEmail || 'unknown'})</p>
        </div>
        <span class="proposal-status status-pending">PENDING</span>
      </div>
      <p style="margin: 0.5rem 0 1rem;">${p.mission}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem;">
        <div><strong>Faculty:</strong> ${p.faculty}</div>
        <div><strong>Founding Members:</strong> ${p.members}</div>
        <div><strong>Requested Budget:</strong> $${p.budget}</div>
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button class="btn btn-primary btn-sm" onclick="approveClubProposal(${p.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn btn-outline btn-sm" onclick="rejectClubProposal(${p.id})">
          <i class="fas fa-times"></i> Reject
        </button>
      </div>
    </div>
  `).join('');
}

function approveClubProposal(proposalId) {
  let proposals = getFromLocalStorage('proposals') || [];
  const idx = proposals.findIndex(p => p.id === proposalId);
  if (idx === -1) return;
  const proposal = proposals[idx];

  // Mark approved
  proposals[idx].status = 'approved';
  saveToLocalStorage('proposals', proposals);

  // Add club to clubs list
  const clubs = getFromLocalStorage('clubs') || [];
  const newClubId = (clubs.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1;
  const newClub = {
    id: newClubId,
    name: proposal.name,
    description: proposal.mission,
    category: 'academic',
    faculty: proposal.faculty || 'all',
    members: proposal.members || 5,
    events: 0,
    logo: '🏫',
    mission: proposal.mission,
    founded: new Date().getFullYear().toString(),
    contact: proposal.submittedByEmail || 'info@campus.edu'
  };
  clubs.push(newClub);
  saveToLocalStorage('clubs', clubs);

  // Elevate submitter to organizer and link to club
  if (proposal.submittedByEmail) {
    const users = getFromLocalStorage('users') || [];
    const uIdx = users.findIndex(u => u.email === proposal.submittedByEmail);
    if (uIdx !== -1) {
      users[uIdx].role = 'organizer';
      users[uIdx].club = newClub.name;
      saveToLocalStorage('users', users);

      // If submitter is the current session, update it too
      const current = getCurrentUser();
      if (current && current.email === proposal.submittedByEmail) {
        current.role = 'organizer';
        current.club = newClub.name;
        setCurrentUser(current);
      }
    }
  }

  alert('Club approved and created. Submitter promoted to Organizer.');
  loadPendingProposals();
  loadAllClubs();
  loadAllUsers();
}

function rejectClubProposal(proposalId) {
  let proposals = getFromLocalStorage('proposals') || [];
  const idx = proposals.findIndex(p => p.id === proposalId);
  if (idx === -1) return;
  proposals[idx].status = 'rejected';
  saveToLocalStorage('proposals', proposals);
  alert('Proposal rejected.');
  loadPendingProposals();
}

let currentEventsPage = 1;
let eventsPerPage = 5;
let allEventsData = [];

function loadAllEvents() {
  const container = document.getElementById('allEventsList');
  if (!container) return;
  allEventsData = getFromLocalStorage('events') || [];
  if (allEventsData.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No events yet.</p>';
    return;
  }
  displayEvents(allEventsData);
}

function displayEvents(events, page = 1) {
  const container = document.getElementById('allEventsList');
  const pagination = document.getElementById('eventsPagination');
  
  const startIndex = (page - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = events.slice(startIndex, endIndex);
  
  container.innerHTML = paginatedEvents.map(e => `
    <div class="event-list-item">
      <img src="${e.image}" alt="${e.title}" class="event-list-image">
      <div class="event-list-content">
        <h4 class="event-list-title">${e.title}</h4>
        <div class="event-list-meta">
          <div><i class="fas fa-calendar"></i> ${formatDate(e.date)}</div>
          <div><i class="fas fa-map-marker-alt"></i> ${e.venue}</div>
          <div><i class="fas fa-users"></i> ${e.registered}/${e.capacity}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  if (totalPages > 1) {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm ' + (i === page ? 'btn-primary' : 'btn-outline');
      btn.textContent = i;
      btn.onclick = () => {
        currentEventsPage = i;
        displayEvents(events, i);
      };
      pagination.appendChild(btn);
    }
  } else {
    pagination.innerHTML = '';
  }
}

function filterEvents() {
  const searchTerm = document.getElementById('searchEvents').value.toLowerCase();
  const filtered = allEventsData.filter(e => 
    e.title.toLowerCase().includes(searchTerm) || 
    e.venue.toLowerCase().includes(searchTerm) ||
    e.category.toLowerCase().includes(searchTerm)
  );
  displayEvents(filtered, 1);
}

let currentClubsPage = 1;
let clubsPerPage = 8;
let allClubsData = [];

function loadAllClubs() {
  const container = document.getElementById('allClubsList');
  if (!container) return;
  allClubsData = getFromLocalStorage('clubs') || [];
  if (allClubsData.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No clubs yet.</p>';
    return;
  }
  displayClubs(allClubsData);
}

function displayClubs(clubs, page = 1) {
  const container = document.getElementById('allClubsList');
  const pagination = document.getElementById('clubsPagination');
  
  const startIndex = (page - 1) * clubsPerPage;
  const endIndex = startIndex + clubsPerPage;
  const paginatedClubs = clubs.slice(startIndex, endIndex);
  
  container.innerHTML = paginatedClubs.map(c => `
    <div class="club-card">
      <div class="club-logo">${c.logo}</div>
      <h4 class="club-name">${c.name}</h4>
      <div class="club-stats">
        <div class="club-stat"><strong>${c.members}</strong><span>Members</span></div>
        <div class="club-stat"><strong>${c.events}</strong><span>Events</span></div>
      </div>
    </div>
  `).join('');
  
  // Pagination
  const totalPages = Math.ceil(clubs.length / clubsPerPage);
  if (totalPages > 1) {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm ' + (i === page ? 'btn-primary' : 'btn-outline');
      btn.textContent = i;
      btn.onclick = () => {
        currentClubsPage = i;
        displayClubs(clubs, i);
      };
      pagination.appendChild(btn);
    }
  } else {
    pagination.innerHTML = '';
  }
}

function filterClubs() {
  const searchTerm = document.getElementById('searchClubs').value.toLowerCase();
  const filtered = allClubsData.filter(c => 
    c.name.toLowerCase().includes(searchTerm) || 
    c.category.toLowerCase().includes(searchTerm)
  );
  displayClubs(filtered, 1);
}

let currentUsersPage = 1;
let usersPerPage = 10;
let allUsersData = [];

function loadAllUsers() {
  const container = document.getElementById('allUsersList');
  if (!container) return;
  allUsersData = getFromLocalStorage('users') || [];
  if (allUsersData.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No users yet.</p>';
    return;
  }
  displayUsers(allUsersData);
}

function displayUsers(users, page = 1) {
  const container = document.getElementById('allUsersList');
  const pagination = document.getElementById('usersPagination');
  
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  container.innerHTML = paginatedUsers.map(u => `
    <div class="event-list-item" style="cursor: default;">
      <div class="event-list-content">
        <h4 class="event-list-title">${u.firstName} ${u.lastName}</h4>
        <div class="event-list-meta">
          <div><i class="fas fa-envelope"></i> ${u.email}</div>
          <div><i class="fas fa-user"></i> Role: ${u.role}${u.club ? ` (${u.club})` : ''}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Pagination
  const totalPages = Math.ceil(users.length / usersPerPage);
  if (totalPages > 1) {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm ' + (i === page ? 'btn-primary' : 'btn-outline');
      btn.textContent = i;
      btn.onclick = () => {
        currentUsersPage = i;
        displayUsers(users, i);
      };
      pagination.appendChild(btn);
    }
  } else {
    pagination.innerHTML = '';
  }
}

function filterUsers() {
  const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
  const filtered = allUsersData.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm) || 
    u.lastName.toLowerCase().includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm) ||
    u.role.toLowerCase().includes(searchTerm)
  );
  displayUsers(filtered, 1);
}

function loadPendingEventProposals() {
  const container = document.getElementById('pendingEventProposals');
  if (!container) return;

  const events = getFromLocalStorage('events') || [];
  const pending = events.filter(e => e.status === 'pending');

  if (pending.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No pending event proposals.</p>';
    return;
  }

  container.innerHTML = pending.map(e => `
    <div class="proposal-card">
      <div class="proposal-header">
        <div>
          <h3><i class="fas fa-calendar"></i> ${e.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Submitted by ${e.organizer || 'Unknown'}</p>
        </div>
        <span class="proposal-status status-pending">PENDING</span>
      </div>
      <p style="margin: 0.5rem 0 1rem;">${e.description}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem;">
        <div><strong>Date:</strong> ${formatDate(e.date)}</div>
        <div><strong>Venue:</strong> ${e.venue}</div>
        <div><strong>Capacity:</strong> ${e.capacity}</div>
        <div><strong>Category:</strong> ${e.category}</div>
      </div>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button class="btn btn-primary btn-sm" onclick="approveEvent(${e.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn btn-outline btn-sm" onclick="rejectEvent(${e.id})">
          <i class="fas fa-times"></i> Reject
        </button>
      </div>
    </div>
  `).join('');
}

function approveEvent(eventId) {
  let events = getFromLocalStorage('events') || [];
  const idx = events.findIndex(e => e.id === eventId);
  if (idx === -1) return;
  
  events[idx].status = 'approved';
  saveToLocalStorage('events', events);
  
  alert('Event approved and published!');
  loadPendingEventProposals();
  loadAllEvents();
}

function rejectEvent(eventId) {
  let events = getFromLocalStorage('events') || [];
  const idx = events.findIndex(e => e.id === eventId);
  if (idx === -1) return;
  
  events[idx].status = 'rejected';
  saveToLocalStorage('events', events);
  
  alert('Event proposal rejected.');
  loadPendingEventProposals();
}

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  if (section.style.display === 'none') {
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
}

function openCreateEventModal() {
  const modal = document.getElementById('createEventModal');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function openCreateClubModal() {
  const modal = document.getElementById('createClubModal');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function openNotifyUsersModal() {
  const modal = document.getElementById('notifyUsersModal');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function openSystemSettings() {
  const modal = document.getElementById('systemSettingsModal');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function createAdminModals() {
  const modalsHTML = `
    <!-- Create Event Modal -->
    <div id="createEventModal" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="close" onclick="closeModal('createEventModal')">&times;</span>
        <h2>Create New Event</h2>
        <form id="adminCreateEventForm" onsubmit="handleCreateEvent(event)">
          <div class="form-group">
            <label>Event Title *</label>
            <input type="text" name="title" required>
          </div>
          <div class="form-group">
            <label>Description *</label>
            <textarea name="description" rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date *</label>
              <input type="date" name="date" required>
            </div>
            <div class="form-group">
              <label>Time *</label>
              <input type="time" name="time" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Venue *</label>
              <input type="text" name="venue" required>
            </div>
            <div class="form-group">
              <label>Capacity *</label>
              <input type="number" name="capacity" required>
            </div>
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select name="category" required>
              <option value="academic">Academic</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
              <option value="social">Social</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Create Event</button>
        </form>
      </div>
    </div>

    <!-- Create Club Modal -->
    <div id="createClubModal" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="close" onclick="closeModal('createClubModal')">&times;</span>
        <h2>Create New Club</h2>
        <form id="adminCreateClubForm" onsubmit="handleCreateClub(event)">
          <div class="form-group">
            <label>Club Name *</label>
            <input type="text" name="name" required>
          </div>
          <div class="form-group">
            <label>Description *</label>
            <textarea name="description" rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category *</label>
              <select name="category" required>
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="arts">Arts & Culture</option>
                <option value="tech">Technology</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div class="form-group">
              <label>Faculty *</label>
              <input type="text" name="faculty" value="all" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Create Club</button>
        </form>
      </div>
    </div>

    <!-- Notify Users Modal -->
    <div id="notifyUsersModal" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="close" onclick="closeModal('notifyUsersModal')">&times;</span>
        <h2>Send Notification</h2>
        <form id="notifyUsersForm" onsubmit="handleNotifyUsers(event)">
          <div class="form-group">
            <label>Target Audience *</label>
            <select name="target" required>
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="organizers">Organizers Only</option>
            </select>
          </div>
          <div class="form-group">
            <label>Subject *</label>
            <input type="text" name="subject" required>
          </div>
          <div class="form-group">
            <label>Message *</label>
            <textarea name="message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Send Notification</button>
        </form>
      </div>
    </div>

    <!-- System Settings Modal -->
    <div id="systemSettingsModal" class="modal" style="display: none;">
      <div class="modal-content">
        <span class="close" onclick="closeModal('systemSettingsModal')">&times;</span>
        <h2>System Settings</h2>
        <div style="padding: 1rem 0;">
          <div class="form-group">
            <label>Event Auto-Approval</label>
            <select id="eventAutoApproval" onchange="updateSetting('eventAutoApproval', this.value)">
              <option value="false">Require Admin Approval</option>
              <option value="true">Auto-Approve All Events</option>
            </select>
          </div>
          <div class="form-group">
            <label>Club Proposal Auto-Approval</label>
            <select id="clubAutoApproval" onchange="updateSetting('clubAutoApproval', this.value)">
              <option value="false">Require Admin Approval</option>
              <option value="true">Auto-Approve All Clubs</option>
            </select>
          </div>
          <div class="form-group">
            <label>Max Event Capacity</label>
            <input type="number" id="maxEventCapacity" value="500" onchange="updateSetting('maxEventCapacity', this.value)">
          </div>
          <div class="form-group">
            <label>Registration Deadline (hours before event)</label>
            <input type="number" id="registrationDeadline" value="2" onchange="updateSetting('registrationDeadline', this.value)">
          </div>
          <button class="btn btn-primary" onclick="closeModal('systemSettingsModal')">Save Settings</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalsHTML);
  loadSystemSettings();
}

function handleCreateEvent(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const events = getFromLocalStorage('events') || [];
  
  const newEvent = {
    id: (events.reduce((m, e) => Math.max(m, e.id), 0) || 0) + 1,
    title: formData.get('title'),
    description: formData.get('description'),
    date: formData.get('date'),
    time: formData.get('time'),
    venue: formData.get('venue'),
    capacity: parseInt(formData.get('capacity')),
    category: formData.get('category'),
    organizer: 'Admin',
    registered: 0,
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
  };
  
  events.push(newEvent);
  saveToLocalStorage('events', events);
  
  alert('Event created successfully!');
  closeModal('createEventModal');
  e.target.reset();
  loadAllEvents();
}

function handleCreateClub(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const clubs = getFromLocalStorage('clubs') || [];
  
  const newClub = {
    id: (clubs.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1,
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    faculty: formData.get('faculty'),
    members: 0,
    events: 0,
    logo: '🎯',
    founded: new Date().getFullYear().toString(),
    contact: 'admin@campus.edu'
  };
  
  clubs.push(newClub);
  saveToLocalStorage('clubs', clubs);
  
  alert('Club created successfully!');
  closeModal('createClubModal');
  e.target.reset();
  loadAllClubs();
}

function handleNotifyUsers(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const notification = {
    id: Date.now(),
    target: formData.get('target'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    sentAt: new Date().toISOString(),
    sentBy: 'Admin'
  };
  
  const notifications = getFromLocalStorage('notifications') || [];
  notifications.push(notification);
  saveToLocalStorage('notifications', notifications);
  
  alert(`Notification sent to ${formData.get('target')}!`);
  closeModal('notifyUsersModal');
  e.target.reset();
}

function updateSetting(key, value) {
  const settings = getFromLocalStorage('systemSettings') || {};
  settings[key] = value;
  saveToLocalStorage('systemSettings', settings);
}

function loadSystemSettings() {
  const settings = getFromLocalStorage('systemSettings') || {};
  
  if (settings.eventAutoApproval) {
    document.getElementById('eventAutoApproval').value = settings.eventAutoApproval;
  }
  if (settings.clubAutoApproval) {
    document.getElementById('clubAutoApproval').value = settings.clubAutoApproval;
  }
  if (settings.maxEventCapacity) {
    document.getElementById('maxEventCapacity').value = settings.maxEventCapacity;
  }
  if (settings.registrationDeadline) {
    document.getElementById('registrationDeadline').value = settings.registrationDeadline;
  }
}
