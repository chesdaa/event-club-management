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

  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  setVal('pfFirstName', user.firstName);
  setVal('pfLastName', user.lastName);
  setVal('pfEmail', user.email);

  // Optional fields stored in user.preferences
  const prefs = user.preferences || {};
  setVal('pfNotifyEmail', prefs.notifyEmail || user.email || '');
  const prefSel = document.getElementById('pfNotifyPref');
  if (prefSel) prefSel.value = prefs.notifyPref || 'all';
  setVal('pfAbout', prefs.about || '');

  // Role-based sections
  const studentCard = document.querySelector('.role-student-only');
  const orgCard = document.querySelector('.role-organizer-only');
  const isOrganizer = user.role === 'organizer';
  if (studentCard) studentCard.style.display = isOrganizer ? 'none' : '';
  if (orgCard) orgCard.style.display = isOrganizer ? '' : 'none';

  if (isOrganizer) {
    setVal('pfOrgName', user.orgName);
    setVal('pfOrgCategory', user.orgCategory);
    setVal('pfOrgPurpose', user.orgPurpose);
    setVal('pfOrgWebsite', user.orgWebsite);
  } else {
    setVal('pfStudentId', user.studentId);
    setVal('pfFaculty', user.faculty);
    setVal('pfYear', user.year);
  }
}

function saveProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const getVal = (id) => (document.getElementById(id)?.value || '').trim();
  user.firstName = getVal('pfFirstName');
  user.lastName = getVal('pfLastName');

  user.preferences = {
    notifyEmail: getVal('pfNotifyEmail'),
    notifyPref: (document.getElementById('pfNotifyPref')?.value || 'all'),
    about: getVal('pfAbout')
  };

  if (user.role === 'organizer') {
    user.orgName = getVal('pfOrgName');
    user.orgCategory = getVal('pfOrgCategory');
    user.orgPurpose = getVal('pfOrgPurpose');
    user.orgWebsite = getVal('pfOrgWebsite');
    // Clear student-specific fields if present
    user.studentId = '';
    user.faculty = '';
    user.year = '';
  } else {
    user.studentId = getVal('pfStudentId');
    user.faculty = getVal('pfFaculty');
    user.year = getVal('pfYear');
    // Clear organizer-specific fields if present
    user.orgName = user.orgName || '';
    user.orgCategory = user.orgCategory || '';
    user.orgPurpose = user.orgPurpose || '';
    user.orgWebsite = user.orgWebsite || '';
  }

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
