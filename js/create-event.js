// Create Event JavaScript
let questionCounter = 0;

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
    toggleRegistrationSettings(); // Initialize visibility
});

function setupEventForm() {
    const form = document.getElementById('createEventForm');
    if (!form) return;
    
    form.addEventListener('submit', handleEventSubmit);
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    const requiresRegistration = document.getElementById('requiresRegistration').checked;
    const customQuestions = requiresRegistration ? getCustomQuestions() : [];
    
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
        tags: document.getElementById('eventTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        requiresRegistration: requiresRegistration,
        requiresApproval: document.getElementById('requiresApproval')?.checked || false,
        customQuestions: customQuestions,
        registrations: [] // Store participant registrations here
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

// Registration Settings Functions
function toggleRegistrationSettings() {
    const requiresReg = document.getElementById('requiresRegistration');
    const settings = document.getElementById('registrationSettings');
    if (requiresReg && settings) {
        settings.style.display = requiresReg.checked ? 'block' : 'none';
    }
}

function addCustomQuestion() {
    questionCounter++;
    const container = document.getElementById('customQuestions');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'custom-question-item';
    questionDiv.dataset.questionId = questionCounter;
    questionDiv.style.cssText = 'background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--border-color);';
    
    questionDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="margin: 0; font-size: 1rem; color: var(--text-primary);">Question ${questionCounter}</h4>
            <button type="button" class="icon-btn" onclick="removeQuestion(${questionCounter})" style="color: var(--danger-color);">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        
        <div class="form-group">
            <label>Question Text *</label>
            <input type="text" class="question-text" placeholder="Enter your question" required style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px;">
        </div>
        
        <div class="form-group">
            <label>Question Type *</label>
            <select class="question-type" onchange="handleQuestionTypeChange(${questionCounter})" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px;">
                <option value="text">Short Text</option>
                <option value="textarea">Long Text</option>
                <option value="select">Multiple Choice (Dropdown)</option>
                <option value="radio">Multiple Choice (Radio)</option>
                <option value="checkbox">Checkboxes</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
            </select>
        </div>
        
        <div class="options-container" style="display: none;">
            <label>Options (one per line) *</label>
            <textarea class="question-options" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px;"></textarea>
        </div>
        
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" class="question-required" checked>
                <span>Required</span>
            </label>
        </div>
    `;
    
    container.appendChild(questionDiv);
}

function removeQuestion(id) {
    const questionDiv = document.querySelector(`[data-question-id="${id}"]`);
    if (questionDiv) {
        questionDiv.remove();
    }
}

function handleQuestionTypeChange(id) {
    const questionDiv = document.querySelector(`[data-question-id="${id}"]`);
    if (!questionDiv) return;
    
    const typeSelect = questionDiv.querySelector('.question-type');
    const optionsContainer = questionDiv.querySelector('.options-container');
    
    const needsOptions = ['select', 'radio', 'checkbox'].includes(typeSelect.value);
    optionsContainer.style.display = needsOptions ? 'block' : 'none';
}

function getCustomQuestions() {
    const questions = [];
    const questionDivs = document.querySelectorAll('.custom-question-item');
    
    questionDivs.forEach((div, index) => {
        const text = div.querySelector('.question-text').value.trim();
        const type = div.querySelector('.question-type').value;
        const required = div.querySelector('.question-required').checked;
        const optionsTextarea = div.querySelector('.question-options');
        
        if (!text) return; // Skip empty questions
        
        const question = {
            id: index + 1,
            text: text,
            type: type,
            required: required
        };
        
        // Add options for select/radio/checkbox types
        if (['select', 'radio', 'checkbox'].includes(type) && optionsTextarea) {
            const optionsText = optionsTextarea.value.trim();
            if (optionsText) {
                question.options = optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt);
            }
        }
        
        questions.push(question);
    });
    
    return questions;
}
