// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    setupPasswordToggle();
    setupRoleConditional();
});

function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

function setupRoleConditional() {
    const roleSelect = document.getElementById('role');
    if (!roleSelect) return;

    const studentSection = document.querySelector('.role-conditional.role-student');
    const organizerSection = document.querySelector('.role-conditional.role-organizer');

    const update = () => {
        const isStudent = roleSelect.value === 'student';
        
        if (studentSection) {
            if (isStudent) {
                studentSection.classList.add('show');
                studentSection.style.display = 'block';
            } else {
                studentSection.classList.remove('show');
                studentSection.style.display = 'none';
            }
        }
        
        if (organizerSection) {
            if (!isStudent) {
                organizerSection.classList.add('show');
                organizerSection.style.display = 'block';
            } else {
                organizerSection.classList.remove('show');
                organizerSection.style.display = 'none';
            }
        }
    };

    roleSelect.addEventListener('change', update);
    update(); // Run on page load
}
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = getFromLocalStorage('users') || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password before storing
        const userSession = { ...user };
        delete userSession.password;
        
        setCurrentUser(userSession);
        showNotification('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Student fields
    const studentId = (document.getElementById('studentId')?.value || '').trim();
    const faculty = (document.getElementById('faculty')?.value || '').trim();
    const year = (document.getElementById('year')?.value || '').trim();

    // Organizer fields
    const orgName = (document.getElementById('orgName')?.value || '').trim();
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Role-specific validation
    if (role === 'student') {
        if (!studentId) { showNotification('Please enter your Student ID', 'error'); return; }
        if (!faculty) { showNotification('Please select your Faculty/Department', 'error'); return; }
        if (!year) { showNotification('Please select your Year', 'error'); return; }
    } else if (role === 'organizer') {
        if (!orgName) { showNotification('Please enter your Organization/Company name', 'error'); return; }
    }

    // Get existing users
    const users = getFromLocalStorage('users') || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        role,
        password,
        registeredDate: new Date().toISOString(),
        myEvents: [],
        myClubs: []
    };

    if (role === 'student') {
        newUser.studentId = studentId;
        newUser.faculty = faculty;
        newUser.year = year;
    } else if (role === 'organizer') {
        newUser.orgName = orgName;
    }
    
    // Save user
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    showNotification('Registration successful! Please login.', 'success');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
