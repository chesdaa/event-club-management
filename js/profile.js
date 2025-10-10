// Profile page logic

document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) return;
  loadProfile();
  document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
  document.getElementById('changePasswordBtn')?.addEventListener('click', changePassword);
});

function loadProfile() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('pfFirstName').value = user.firstName || '';
  document.getElementById('pfLastName').value = user.lastName || '';
  document.getElementById('pfEmail').value = user.email || '';
  document.getElementById('pfStudentId').value = user.studentId || '';
  document.getElementById('pfFaculty').value = user.faculty || '';
  document.getElementById('pfYear').value = user.year || '';

  // Optional fields stored in user.preferences
  const prefs = user.preferences || {};
  document.getElementById('pfNotifyEmail').value = prefs.notifyEmail || user.email || '';
  document.getElementById('pfNotifyPref').value = prefs.notifyPref || 'all';
  document.getElementById('pfAbout').value = prefs.about || '';
}

function saveProfile() {
  const user = getCurrentUser();
  if (!user) return;

  user.firstName = document.getElementById('pfFirstName').value.trim();
  user.lastName = document.getElementById('pfLastName').value.trim();
  user.studentId = document.getElementById('pfStudentId').value.trim();
  user.faculty = document.getElementById('pfFaculty').value.trim();
  user.year = document.getElementById('pfYear').value.trim();

  user.preferences = {
    notifyEmail: document.getElementById('pfNotifyEmail').value.trim(),
    notifyPref: document.getElementById('pfNotifyPref').value,
    about: document.getElementById('pfAbout').value.trim()
  };

  setCurrentUser(user);
  // Persist back to users list
  const users = getFromLocalStorage('users') || [];
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...user };
    saveToLocalStorage('users', users);
  }

  showToast('Profile saved');
}

function changePassword() {
  const newPass = document.getElementById('pfNewPassword').value;
  const confirmPass = document.getElementById('pfConfirmPassword').value;
  if (!newPass) return showToast('Enter a new password', 'error');
  if (newPass !== confirmPass) return showToast('Passwords do not match', 'error');
  if (newPass.length < 8) return showToast('Password must be at least 8 characters', 'error');

  const user = getCurrentUser();
  const users = getFromLocalStorage('users') || [];
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx].password = newPass;
    saveToLocalStorage('users', users);
  }
  document.getElementById('pfNewPassword').value = '';
  document.getElementById('pfConfirmPassword').value = '';
  showToast('Password changed');
}

function showToast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:0.75rem 1rem;border-radius:8px;color:#fff;z-index:9999;background:' +
    (type === 'success' ? '#48bb78' : '#f56565');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
