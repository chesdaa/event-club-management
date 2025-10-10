// Notifications page logic

document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) return;
  renderNotifications();
  document.getElementById('markAllReadBtn')?.addEventListener('click', markAllRead);
  document.getElementById('clearAllBtn')?.addEventListener('click', clearAll);
});

function getNotifications() {
  // Seed with sample notifications if empty
  let notifs = getFromLocalStorage('notifications');
  if (!notifs) {
    notifs = [
      { id: Date.now(), title: 'Welcome!', body: 'Thanks for joining Campus Events.', time: new Date().toISOString(), read: false },
      { id: Date.now()+1, title: 'Event Reminder', body: 'Tech Innovation Summit starts tomorrow.', time: new Date().toISOString(), read: false },
      { id: Date.now()+2, title: 'RSVP Confirmed', body: 'Your RSVP for Music Fest is confirmed.', time: new Date().toISOString(), read: true }
    ];
    saveToLocalStorage('notifications', notifs);
  }
  return notifs;
}

function renderNotifications() {
  const list = document.getElementById('notificationsList');
  const notifs = getNotifications();
  if (!list) return;
  if (notifs.length === 0) {
    list.innerHTML = '<p class="text-center" style="color: var(--text-secondary);">No notifications yet.</p>';
    return;
  }
  list.innerHTML = notifs
    .sort((a,b)=> new Date(b.time)-new Date(a.time))
    .map(n => `
      <div class="notification-item ${n.read ? 'read' : ''}" style="display:flex; gap:1rem; align-items:flex-start; background:white; border:1px solid var(--border-color); border-radius:12px; padding:1rem; margin-bottom:0.75rem;">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--light-bg);display:flex;align-items:center;justify-content:center;color:var(--primary-color);"><i class="fas ${iconFor(n)}"></i></div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h4 style="margin:0;">${n.title}</h4>
            <small style="color:var(--text-secondary);">${formatDate(new Date(n.time).toISOString())}</small>
          </div>
          <p style="margin:0.25rem 0 0; color:var(--text-secondary);">${n.body}</p>
        </div>
        ${!n.read ? `<button class="btn btn-sm btn-outline" onclick="markRead(${n.id})">Mark read</button>` : ''}
        <button class="btn btn-sm btn-outline" onclick="deleteNotif(${n.id})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
}

function iconFor(n) {
  const t = n.title.toLowerCase();
  if (t.includes('rsvp')) return 'fa-ticket-alt';
  if (t.includes('reminder')) return 'fa-bell';
  if (t.includes('welcome')) return 'fa-graduation-cap';
  return 'fa-info-circle';
}

function markRead(id) {
  const notifs = getNotifications();
  const idx = notifs.findIndex(n => n.id === id);
  if (idx !== -1) notifs[idx].read = true;
  saveToLocalStorage('notifications', notifs);
  renderNotifications();
}

function markAllRead() {
  const notifs = getNotifications().map(n => ({...n, read: true}));
  saveToLocalStorage('notifications', notifs);
  renderNotifications();
}

function deleteNotif(id) {
  const notifs = getNotifications().filter(n => n.id !== id);
  saveToLocalStorage('notifications', notifs);
  renderNotifications();
}

function clearAll() {
  saveToLocalStorage('notifications', []);
  renderNotifications();
}
