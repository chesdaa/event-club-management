// Create Club JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupForm();
    setupLogoPreview();
});

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    if (user.role !== 'organizer') {
        alert('Only organizers can create clubs!');
        window.location.href = 'clubs.html';
        return;
    }
}

function setupForm() {
    const form = document.getElementById('createClubForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

function setupLogoPreview() {
    const logoInput = document.getElementById('clubLogo');
    const logoPreview = document.getElementById('logoPreview');
    
    if (logoInput && logoPreview) {
        logoInput.addEventListener('input', function() {
            logoPreview.textContent = this.value || '🎯';
        });
    }
}

function addMember() {
    const container = document.getElementById('foundingMembers');
    const memberItem = document.createElement('div');
    memberItem.className = 'member-item';
    memberItem.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;';
    memberItem.innerHTML = `
        <input type="text" placeholder="Full Name" class="member-name" required>
        <input type="text" placeholder="Student ID" class="member-id" required>
        <input type="email" placeholder="Email" class="member-email" required>
        <button type="button" class="btn-icon" onclick="removeMember(this)" style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer;">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(memberItem);
}

function removeMember(button) {
    const container = document.getElementById('foundingMembers');
    const memberItems = container.querySelectorAll('.member-item');
    
    if (memberItems.length <= 1) {
        alert('You must have at least one founding member!');
        return;
    }
    
    button.closest('.member-item').remove();
}

function handleSubmit(e) {
    e.preventDefault();
    
    // Validate founding members
    const memberItems = document.querySelectorAll('.member-item');
    if (memberItems.length < 5) {
        alert('You need at least 5 founding members to create a club!');
        return;
    }
    
    // Collect form data
    const formData = {
        name: document.getElementById('clubName').value,
        description: document.getElementById('clubDescription').value,
        mission: document.getElementById('clubMission').value,
        category: document.getElementById('clubCategory').value,
        faculty: document.getElementById('clubFaculty').value,
        logo: document.getElementById('clubLogo').value || '🎯',
        contact: document.getElementById('clubEmail').value,
        phone: document.getElementById('clubPhone').value,
        website: document.getElementById('clubWebsite').value,
        requiresApproval: document.getElementById('requiresApproval').checked,
        openMembership: document.getElementById('openMembership').checked,
        activities: document.getElementById('clubActivities').value,
        goals: document.getElementById('clubGoals').value
    };
    
    // Collect founding members
    const members = [];
    memberItems.forEach(item => {
        const name = item.querySelector('.member-name').value;
        const id = item.querySelector('.member-id').value;
        const email = item.querySelector('.member-email').value;
        
        if (name && id && email) {
            members.push({ name, id, email });
        }
    });
    
    formData.foundingMembers = members;
    
    // Create club object
    const clubs = getFromLocalStorage('clubs') || [];
    const newClub = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        mission: formData.mission,
        category: formData.category,
        faculty: formData.faculty,
        logo: formData.logo,
        contact: formData.contact,
        phone: formData.phone,
        website: formData.website,
        members: members.length,
        events: 0,
        founded: new Date().getFullYear(),
        requiresApproval: formData.requiresApproval,
        openMembership: formData.openMembership,
        activities: formData.activities,
        goals: formData.goals,
        foundingMembers: formData.foundingMembers,
        organizer: getCurrentUser().id,
        createdAt: new Date().toISOString()
    };
    
    clubs.push(newClub);
    saveToLocalStorage('clubs', clubs);
    
    // Update user's clubs
    const user = getCurrentUser();
    if (!user.myClubs) user.myClubs = [];
    user.myClubs.push(newClub.id);
    setCurrentUser(user);
    
    // Update users list
    const users = getFromLocalStorage('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].myClubs = user.myClubs;
        saveToLocalStorage('users', users);
    }
    
    alert('Club created successfully!');
    window.location.href = `clubs.html?id=${newClub.id}`;
}

function saveDraft() {
    const formData = {
        name: document.getElementById('clubName').value,
        description: document.getElementById('clubDescription').value,
        mission: document.getElementById('clubMission').value,
        category: document.getElementById('clubCategory').value,
        faculty: document.getElementById('clubFaculty').value,
        logo: document.getElementById('clubLogo').value,
        contact: document.getElementById('clubEmail').value
    };
    
    localStorage.setItem('clubDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
}

// Load draft if exists
window.addEventListener('load', function() {
    const draft = localStorage.getItem('clubDraft');
    if (draft) {
        const shouldLoad = confirm('You have a saved draft. Would you like to load it?');
        if (shouldLoad) {
            const data = JSON.parse(draft);
            document.getElementById('clubName').value = data.name || '';
            document.getElementById('clubDescription').value = data.description || '';
            document.getElementById('clubMission').value = data.mission || '';
            document.getElementById('clubCategory').value = data.category || '';
            document.getElementById('clubFaculty').value = data.faculty || '';
            document.getElementById('clubLogo').value = data.logo || '';
            document.getElementById('clubEmail').value = data.contact || '';
            
            // Trigger logo preview update
            const event = new Event('input');
            document.getElementById('clubLogo').dispatchEvent(event);
        }
    }
});
