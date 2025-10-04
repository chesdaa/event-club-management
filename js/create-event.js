// Create Event JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    const user = getCurrentUser();
    if (user.role !== 'organizer') {
        alert('Only organizers can create events!');
        window.location.href = 'dashboard.html';
        return;
    }
    
    setupEventForm();
    setupImageUpload();
});

function setupEventForm() {
    const form = document.getElementById('createEventForm');
    if (!form) return;
    
    form.addEventListener('submit', handleEventSubmit);
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        category: document.getElementById('eventCategory').value,
        club: document.getElementById('eventClub').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        endTime: document.getElementById('eventEndTime').value,
        venue: document.getElementById('eventVenue').value,
        capacity: parseInt(document.getElementById('eventCapacity').value),
        registered: 0,
        image: document.getElementById('eventPoster').dataset.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        status: 'published',
        tags: document.getElementById('eventTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    // Validate dates
    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
        alert('Event date cannot be in the past!');
        return;
    }
    
    // Save event
    const events = getFromLocalStorage('events') || [];
    events.push(formData);
    saveToLocalStorage('events', events);
    
    alert('Event created successfully!');
    window.location.href = 'events.html';
}

function saveDraft() {
    const formData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        category: document.getElementById('eventCategory').value,
        club: document.getElementById('eventClub').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        endTime: document.getElementById('eventEndTime').value,
        venue: document.getElementById('eventVenue').value,
        capacity: document.getElementById('eventCapacity').value,
    };
    
    saveToLocalStorage('eventDraft', formData);
    alert('Draft saved successfully!');
}

function setupImageUpload() {
    const fileInput = document.getElementById('eventPoster');
    const uploadArea = document.getElementById('fileUploadArea');
    const preview = document.getElementById('imagePreview');
    
    if (!fileInput || !uploadArea) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0], preview, fileInput);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0], preview, fileInput);
        }
    });
}

function handleImageFile(file, preview, fileInput) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" class="preview-image" alt="Preview">`;
        fileInput.dataset.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
}
