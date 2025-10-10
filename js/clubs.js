// Clubs page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAllClubs();
    setupFilters();
    setupSearch();
    setupModal();
    checkUrlParams();
});

function loadAllClubs() {
    const clubs = getFromLocalStorage('clubs') || [];
    displayClubs(clubs);
}

function displayClubs(clubs) {
    const container = document.getElementById('clubsGrid');
    if (!container) return;
    
    if (clubs.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No clubs found.</p>';
        return;
    }
    
    container.innerHTML = clubs.map(club => createClubCard(club)).join('');
}

function createClubCard(club) {
    return `
        <div class="club-card" onclick="showClubModal(${club.id})">
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

function setupFilters() {
    const categoryFilter = document.getElementById('clubCategoryFilter');
    const facultyFilter = document.getElementById('facultyFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (facultyFilter) {
        facultyFilter.addEventListener('change', applyFilters);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchClubs');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    let clubs = getFromLocalStorage('clubs') || [];
    
    // Category filter
    const category = document.getElementById('clubCategoryFilter')?.value;
    if (category && category !== 'all') {
        clubs = clubs.filter(club => club.category === category);
    }
    
    // Faculty filter
    const faculty = document.getElementById('facultyFilter')?.value;
    if (faculty && faculty !== 'all') {
        clubs = clubs.filter(club => club.faculty === faculty || club.faculty === 'all');
    }
    
    // Search filter
    const searchTerm = document.getElementById('searchClubs')?.value.toLowerCase();
    if (searchTerm) {
        clubs = clubs.filter(club => 
            club.name.toLowerCase().includes(searchTerm) ||
            club.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayClubs(clubs);
}

function setupModal() {
    const modal = document.getElementById('clubModal');
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

    // Close on Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    });
}

function showClubModal(clubId) {
    const clubs = getFromLocalStorage('clubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    const modal = document.getElementById('clubModal');
    const content = document.getElementById('clubDetailContent');
    
    const user = getCurrentUser();
    const isMember = user && user.myClubs && user.myClubs.includes(clubId);
    
    content.innerHTML = `
        <div class="club-detail">
            <div class="club-logo" style="width: 80px; height: 80px; font-size: 2.5rem; margin: 0 auto 1rem;">${club.logo}</div>
            <h2 style="text-align: center; font-size: 1.4rem;">${club.name}</h2>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">${club.description}</p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; text-align: center;">
                <div style="background: var(--light-bg); padding: 0.75rem; border-radius: 8px;">
                    <strong style="font-size: 1.6rem; color: var(--primary-color);">${club.members}</strong>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Members</p>
                </div>
                <div style="background: var(--light-bg); padding: 0.75rem; border-radius: 8px;">
                    <strong style="font-size: 1.6rem; color: var(--primary-color);">${club.events}</strong>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Events</p>
                </div>
                <div style="background: var(--light-bg); padding: 0.75rem; border-radius: 8px;">
                    <strong style="font-size: 1rem; color: var(--primary-color);">${club.founded}</strong>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Founded</p>
                </div>
            </div>
            
            <div style="margin: 1rem 0;">
                <h3 style="font-size: 1.05rem;"><i class="fas fa-bullseye"></i> Mission</h3>
                <p style="font-size: 0.95rem;">${club.mission}</p>
            </div>
            
            <div style="margin: 1rem 0;">
                <h3 style="font-size: 1.05rem;"><i class="fas fa-info-circle"></i> Details</h3>
                <div style="display: grid; gap: 0.35rem; font-size: 0.95rem;">
                    <div><strong>Category:</strong> ${club.category}</div>
                    <div><strong>Faculty:</strong> ${club.faculty}</div>
                    <div><strong>Contact:</strong> ${club.contact}</div>
                </div>
            </div>
            
            <div style="margin-top: 1rem; display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                ${user ? `
                    ${isMember ? `
                        <button class="btn btn-outline" onclick="leaveClub(${clubId})">
                            <i class="fas fa-sign-out-alt"></i> Leave Club
                        </button>
                        <button class="btn btn-primary" onclick="viewClubEvents(${clubId})">
                            <i class="fas fa-calendar"></i> View Events
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="joinClub(${clubId})">
                            <i class="fas fa-user-plus"></i> Join Club
                        </button>
                    `}
                ` : `
                    <button class="btn btn-primary" onclick="window.location.href='login.html'">
                        <i class="fas fa-sign-in-alt"></i> Login to Join
                    </button>
                `}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function joinClub(clubId) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const clubs = getFromLocalStorage('clubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    // Update club
    club.members++;
    saveToLocalStorage('clubs', clubs);
    
    // Update user
    if (!user.myClubs) user.myClubs = [];
    user.myClubs.push(clubId);
    setCurrentUser(user);
    
    // Update users list
    const users = getFromLocalStorage('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].myClubs = user.myClubs;
        saveToLocalStorage('users', users);
    }
    
    alert('Successfully joined the club!');
    showClubModal(clubId);
}

function leaveClub(clubId) {
    if (!confirm('Are you sure you want to leave this club?')) return;
    
    const user = getCurrentUser();
    const clubs = getFromLocalStorage('clubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    // Update club
    club.members--;
    saveToLocalStorage('clubs', clubs);
    
    // Update user
    user.myClubs = user.myClubs.filter(id => id !== clubId);
    setCurrentUser(user);
    
    // Update users list
    const users = getFromLocalStorage('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].myClubs = user.myClubs;
        saveToLocalStorage('users', users);
    }
    
    alert('Left the club successfully!');
    showClubModal(clubId);
}

function viewClubEvents(clubId) {
    const clubs = getFromLocalStorage('clubs') || [];
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    window.location.href = `events.html?club=${encodeURIComponent(club.name)}`;
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get('id');
    
    if (clubId) {
        showClubModal(parseInt(clubId));
    }
}
