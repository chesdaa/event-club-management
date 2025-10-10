// Sample data for the application
const sampleEvents = [
    {
        id: 1,
        title: "Tech Innovation Summit 2025",
        description: "Join us for an exciting day of technology talks, workshops, and networking with industry leaders.",
        category: "technology",
        date: "2025-11-15",
        time: "09:00",
        endTime: "17:00",
        venue: "Main Auditorium",
        capacity: 200,
        registered: 145,
        club: "Tech Club",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
        status: "published",
        tags: ["workshop", "networking", "innovation"]
    },
    {
        id: 2,
        title: "Annual Music Festival",
        description: "Experience live performances from talented student musicians across various genres.",
        category: "music",
        date: "2025-11-20",
        time: "18:00",
        endTime: "22:00",
        venue: "Campus Amphitheater",
        capacity: 500,
        registered: 480,
        club: "Music Society",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
        status: "published",
        tags: ["music", "performance", "entertainment"]
    },
    {
        id: 3,
        title: "Sports Day 2025",
        description: "Compete in various sports activities and show your athletic prowess!",
        category: "sports",
        date: "2025-11-25",
        time: "08:00",
        endTime: "16:00",
        venue: "Sports Complex",
        capacity: 300,
        registered: 180,
        club: "Sports Club",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
        status: "published",
        tags: ["sports", "competition", "outdoor"]
    },
    {
        id: 4,
        title: "Art Exhibition: Student Showcase",
        description: "Discover amazing artworks created by our talented art students.",
        category: "arts",
        date: "2025-12-01",
        time: "10:00",
        endTime: "18:00",
        venue: "Art Gallery",
        capacity: 150,
        registered: 65,
        club: "Art Club",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
        status: "published",
        tags: ["art", "exhibition", "culture"]
    },
    {
        id: 5,
        title: "Academic Conference: Future of AI",
        description: "Leading researchers discuss the latest developments in artificial intelligence.",
        category: "academic",
        date: "2025-12-05",
        time: "13:00",
        endTime: "17:00",
        venue: "Conference Hall B",
        capacity: 100,
        registered: 92,
        club: "Tech Club",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
        status: "published",
        tags: ["academic", "AI", "research"]
    },
    {
        id: 6,
        title: "Community Service Day",
        description: "Join us in making a difference in our local community through volunteer work.",
        category: "social",
        date: "2025-12-10",
        time: "09:00",
        endTime: "15:00",
        venue: "Community Center",
        capacity: 80,
        registered: 45,
        club: "Social Service Club",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
        status: "published",
        tags: ["volunteer", "community", "service"]
    }
];

const sampleClubs = [
    {
        id: 1,
        name: "Tech Club",
        description: "Exploring technology, coding, and innovation together.",
        category: "technology",
        faculty: "engineering",
        members: 156,
        events: 12,
        logo: "💻",
        mission: "To foster innovation and technical excellence among students.",
        founded: "2020",
        contact: "techclub@campus.edu"
    },
    {
        id: 2,
        name: "Music Society",
        description: "For music lovers and performers of all skill levels.",
        category: "arts",
        faculty: "arts",
        members: 89,
        events: 8,
        logo: "🎵",
        mission: "To promote musical talent and appreciation across campus.",
        founded: "2018",
        contact: "music@campus.edu"
    },
    {
        id: 3,
        name: "Sports Club",
        description: "Stay active and competitive with various sports activities.",
        category: "sports",
        faculty: "all",
        members: 234,
        events: 15,
        logo: "⚽",
        mission: "To encourage physical fitness and sportsmanship.",
        founded: "2015",
        contact: "sports@campus.edu"
    },
    {
        id: 4,
        name: "Art Club",
        description: "Express yourself through various forms of visual arts.",
        category: "arts",
        faculty: "arts",
        members: 67,
        events: 6,
        logo: "🎨",
        mission: "To nurture artistic talent and creativity.",
        founded: "2019",
        contact: "art@campus.edu"
    },
    {
        id: 5,
        name: "Business Club",
        description: "Learn entrepreneurship and business skills.",
        category: "academic",
        faculty: "business",
        members: 112,
        events: 10,
        logo: "💼",
        mission: "To develop future business leaders and entrepreneurs.",
        founded: "2017",
        contact: "business@campus.edu"
    },
    {
        id: 6,
        name: "Social Service Club",
        description: "Making a positive impact in our community.",
        category: "social",
        faculty: "all",
        members: 78,
        events: 9,
        logo: "🤝",
        mission: "To serve the community and promote social responsibility.",
        founded: "2016",
        contact: "service@campus.edu"
    }
];

const sampleProposals = [
    {
        id: 1,
        type: "event",
        title: "Hackathon 2025",
        description: "24-hour coding competition",
        date: "2025-12-15",
        venue: "Computer Lab",
        participants: 100,
        budget: 5000,
        status: "pending",
        submittedBy: "Tech Club",
        submittedDate: "2025-10-01"
    },
    {
        id: 2,
        type: "club",
        name: "Photography Club",
        mission: "To promote photography skills and visual storytelling",
        faculty: "arts",
        members: 15,
        budget: 3000,
        status: "approved",
        submittedBy: "John Doe",
        submittedDate: "2025-09-15"
    },
    {
        id: 3,
        type: "event",
        title: "Career Fair 2025",
        description: "Connect students with potential employers",
        date: "2025-12-20",
        venue: "Main Hall",
        participants: 500,
        budget: 10000,
        status: "approved",
        submittedBy: "Business Club",
        submittedDate: "2025-09-20"
    }
];

const sampleGalleryAlbums = [
    {
        id: 1,
        eventId: 1,
        eventName: "Tech Summit 2024",
        club: "Tech Club",
        date: "2024-10-15",
        photos: 45,
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
        views: 234
    },
    {
        id: 2,
        eventId: 2,
        eventName: "Music Fest 2024",
        club: "Music Society",
        date: "2024-09-20",
        photos: 67,
        coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
        views: 456
    },
    {
        id: 3,
        eventId: 3,
        eventName: "Sports Day 2024",
        club: "Sports Club",
        date: "2024-08-10",
        photos: 89,
        coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
        views: 189
    }
];

// User data (simulated)
let currentUser = null;

// Helper functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function initializeData() {
    // Initialize sample data if not exists
    if (!getFromLocalStorage('events')) {
        saveToLocalStorage('events', sampleEvents);
    }
    if (!getFromLocalStorage('clubs')) {
        saveToLocalStorage('clubs', sampleClubs);
    }
    if (!getFromLocalStorage('proposals')) {
        saveToLocalStorage('proposals', sampleProposals);
    }
    if (!getFromLocalStorage('galleryAlbums')) {
        saveToLocalStorage('galleryAlbums', sampleGalleryAlbums);
    }

    // Ensure users array exists and seed default accounts
    let users = getFromLocalStorage('users');
    if (!users) {
        users = [];
    }

    // Admin account
    const adminEmail = 'admin@campus.edu';
    const hasAdmin = users.some(u => u.role === 'admin' || u.email === adminEmail);
    if (!hasAdmin) {
        users.push({
            id: 1,
            firstName: 'System',
            lastName: 'Admin',
            email: adminEmail,
            studentId: 'ADMIN',
            faculty: 'administration',
            year: 'n/a',
            role: 'admin',
            password: 'Admin@123',
            registeredDate: new Date().toISOString(),
            myEvents: [],
            myClubs: []
        });
    }

    // Test Student Account
    const studentEmail = 'student@test.edu';
    const hasStudent = users.some(u => u.email === studentEmail);
    if (!hasStudent) {
        users.push({
            id: 2,
            firstName: 'John',
            lastName: 'Student',
            email: studentEmail,
            studentId: 'S12345',
            faculty: 'engineering',
            year: '2',
            role: 'student',
            password: 'Student123',
            registeredDate: new Date().toISOString(),
            myEvents: [],
            myClubs: []
        });
    }

    // Test Organizer Account
    const organizerEmail = 'organizer@test.edu';
    const hasOrganizer = users.some(u => u.email === organizerEmail);
    if (!hasOrganizer) {
        users.push({
            id: 3,
            firstName: 'Jane',
            lastName: 'Organizer',
            email: organizerEmail,
            orgName: 'Tech Club',
            role: 'organizer',
            password: 'Organizer123',
            registeredDate: new Date().toISOString(),
            myEvents: [],
            myClubs: []
        });
    }

    saveToLocalStorage('users', users);
}

function getCurrentUser() {
    return getFromLocalStorage('currentUser');
}

function setCurrentUser(user) {
    currentUser = user;
    saveToLocalStorage('currentUser', user);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getEventStatus(event) {
    const percentage = (event.registered / event.capacity) * 100;
    if (percentage >= 100) return 'soldout';
    if (percentage >= 80) return 'filling';
    return 'available';
}

function getStatusColor(status) {
    switch(status) {
        case 'available': return 'capacity-available';
        case 'filling': return 'capacity-filling';
        case 'soldout': return 'capacity-full';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'available': return 'Available';
        case 'filling': return 'Filling Fast';
        case 'soldout': return 'Sold Out';
        default: return '';
    }
}

// Initialize data on page load
if (typeof window !== 'undefined') {
    initializeData();
}
