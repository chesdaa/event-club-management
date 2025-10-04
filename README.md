# 🎓 Campus Event & Club Management System

A comprehensive web-based platform for managing campus events, clubs, and student activities. Built with HTML, CSS, and JavaScript.

## ✨ Features

### 1. **User Management**
- **Registration & Login System**
  - Student and Organizer roles
  - Profile management with faculty/department info
  - Secure authentication

### 2. **Event Management**
- **Browse Events** - View all campus events with filters
- **Event Details** - Complete information including date, venue, capacity
- **RSVP System** - Register for events with capacity tracking
- **Event Creation** - Organizers can create and publish events
- **Event Status** - Available, Filling Fast, Sold Out indicators
- **QR Code Tickets** - Generate downloadable tickets with QR codes

### 3. **Club Management**
- **Browse Clubs** - Explore all campus clubs
- **Club Details** - View mission, members, and events
- **Join/Leave Clubs** - Easy membership management
- **Club Statistics** - Track members and events

### 4. **Proposal System**
- **Event Proposals** - Submit proposals for new events
- **Club Proposals** - Propose new clubs with founding members
- **Budget Planning** - Interactive budget breakdown tool
- **AI Advisor** - Get smart suggestions for proposals and budgets
- **Approval Workflow** - Track proposal status (Pending/Approved/Rejected)

### 5. **Event Calendar**
- **Multiple Views** - Month, Week, and List views
- **Visual Calendar** - See all events at a glance
- **Event Navigation** - Easy date selection and filtering

### 6. **Gallery System**
- **Photo Albums** - Browse past event photos
- **Photo Viewer** - Full-screen image viewing with navigation
- **Upload Photos** - Organizers can upload event photos
- **View Statistics** - Track album views

### 7. **Dashboard**
- **Personalized Dashboard** - Role-based interface
- **Quick Stats** - View your events, clubs, and activities
- **Quick Actions** - Fast access to common tasks
- **Upcoming Events** - See your registered events

### 8. **Smart Features**
- **Real-time Search** - Search events and clubs instantly
- **Advanced Filters** - Filter by category, date, status, faculty
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Notifications** - Visual feedback for all actions
- **Local Storage** - Data persists across sessions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser!

### Installation

1. **Download/Clone the project**
   ```bash
   git clone <repository-url>
   cd pp1
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Start exploring!**
   - Register a new account
   - Browse events and clubs
   - Create events (as organizer)
   - Submit proposals

## 📁 Project Structure

```
pp1/
├── index.html              # Homepage
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # User dashboard
├── events.html             # Events listing
├── create-event.html       # Event creation form
├── clubs.html              # Clubs listing
├── proposals.html          # Proposal management
├── calendar.html           # Event calendar
├── gallery.html            # Photo gallery
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── data.js            # Data management & sample data
│   ├── main.js            # Homepage functionality
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── events.js          # Events page logic
│   ├── create-event.js    # Event creation
│   ├── clubs.js           # Clubs page logic
│   ├── proposals.js       # Proposals & AI advisor
│   ├── calendar.js        # Calendar functionality
│   └── gallery.js         # Gallery management
└── README.md              # This file
```

## 🎨 Key Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox & Grid
- **JavaScript (ES6+)** - Interactive functionality
- **LocalStorage API** - Client-side data persistence
- **Font Awesome** - Icons
- **QR Code API** - Ticket generation

## 👥 User Roles

### Student (Default)
- Browse events and clubs
- RSVP for events
- Join clubs
- View calendar and gallery
- Download event tickets

### Organizer
- All student features
- Create and manage events
- Submit proposals
- Upload event photos
- Access AI advisor for planning
- View attendee statistics

### Admin (Future Enhancement)
- Approve/reject proposals
- Manage all events and clubs
- System-wide control

## 🤖 AI Advisor Features

The AI Advisor helps with:
- **Budget Planning** - Suggests budget breakdowns
- **Document Requirements** - Lists necessary documents
- **Venue Selection** - Provides venue selection tips
- **Marketing Strategies** - Event promotion advice
- **Best Practices** - General event planning guidance

## 📱 Responsive Design

The system is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (< 768px)

## 🔐 Security Notes

**Important:** This is a demo application using client-side storage. For production use:
- Implement server-side authentication
- Use secure password hashing
- Add HTTPS
- Implement proper session management
- Add input validation and sanitization
- Use a real database

## 🎯 Sample Data

The application comes with pre-loaded sample data:
- 6 sample events across different categories
- 6 campus clubs
- 3 sample proposals
- 3 gallery albums

## 🛠️ Customization

### Adding New Event Categories
Edit `events.html` and `create-event.html`:
```html
<option value="new-category">New Category</option>
```

### Changing Color Scheme
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... */
}
```

### Adding New Features
1. Create HTML page in root directory
2. Add JavaScript file in `js/` folder
3. Link in navigation menu
4. Update `data.js` if needed

## 📝 Usage Examples

### Register as Student
1. Click "Register" in navigation
2. Fill in details, select "Student" role
3. Submit form
4. Login with credentials

### Create an Event (Organizer)
1. Login as organizer
2. Go to Dashboard
3. Click "Create Event"
4. Fill in event details
5. Upload poster image
6. Publish event

### Submit a Proposal
1. Go to Proposals page
2. Click "New Event Proposal" or "New Club Proposal"
3. Fill in details
4. Use AI Advisor for help (click robot icon)
5. Submit proposal

### RSVP for Event
1. Browse events
2. Click on event card
3. Click "Register Now"
4. Download QR code ticket

## 🐛 Known Limitations

- Data stored in browser (cleared when cache is cleared)
- No real-time updates between users
- QR codes are generated but not validated
- Email notifications are simulated
- File uploads are stored as base64 (not recommended for production)

## 🚀 Future Enhancements

- [ ] Backend integration with Node.js/Express
- [ ] Real database (MongoDB/PostgreSQL)
- [ ] Real-time notifications with WebSockets
- [ ] Email integration
- [ ] Payment gateway for paid events
- [ ] Mobile app version
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For questions or issues:
1. Check the code comments
2. Review this README
3. Test in different browsers
4. Check browser console for errors

## 🎉 Acknowledgments

- Font Awesome for icons
- Unsplash for sample images
- QR Server API for QR code generation

---

**Built with ❤️ for campus communities**
