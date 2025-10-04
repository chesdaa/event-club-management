# 🚀 Quick Start Guide

## How to Run the Application

### Option 1: Direct Browser (Simplest)
1. Navigate to the project folder `d:/User/pp1/`
2. Double-click `index.html`
3. The website will open in your default browser
4. Start exploring!

### Option 2: Local Server (Recommended)

#### Using Python:
```bash
cd d:/User/pp1
python -m http.server 8000
```
Then open: `http://localhost:8000`

#### Using Node.js:
```bash
cd d:/User/pp1
npx http-server -p 8000
```
Then open: `http://localhost:8000`

#### Using VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🎯 Quick Demo Guide

### 1. **Register a New Account**
- Click "Register" in the top navigation
- Fill in your details:
  - Name: John Doe
  - Email: john@campus.edu
  - Student ID: 2025001
  - Faculty: Engineering
  - Year: 3
  - Role: **Student** (or Organizer to create events)
  - Password: password123
- Click "Create Account"

### 2. **Login**
- Use the email and password you just created
- You'll be redirected to your dashboard

### 3. **Browse Events**
- Click "Events" in the sidebar
- See all available campus events
- Use filters to find specific events
- Click on any event to see details

### 4. **Register for an Event**
- Click on an event card
- Click "Register Now"
- Download your QR code ticket!

### 5. **Join a Club**
- Click "Clubs" in the sidebar
- Browse available clubs
- Click on a club to see details
- Click "Join Club"

### 6. **View Calendar**
- Click "Calendar" in the sidebar
- Switch between Month, Week, and List views
- Click on dates to see events

### 7. **Create an Event (Organizer Only)**
- Register with role "Organizer"
- Go to Dashboard
- Click "Create Event"
- Fill in event details
- Upload a poster image
- Publish!

### 8. **Submit a Proposal**
- Go to "Proposals" page
- Click "New Event Proposal" or "New Club Proposal"
- Fill in the form
- Click the AI Advisor (🤖) button for help
- Submit your proposal

### 9. **View Gallery**
- Click "Gallery" in the sidebar
- Browse past event photos
- Click on an album to view photos
- Use arrow keys to navigate

---

## 📱 Test Accounts

You can create your own accounts or use these test scenarios:

### Student Account
- **Role**: Student
- **Can**: Browse events, RSVP, join clubs, view calendar

### Organizer Account
- **Role**: Organizer
- **Can**: Everything students can + create events, submit proposals, upload photos

---

## 🎨 Features to Try

### ✅ Must Try Features:
1. **RSVP for an event** and download the QR ticket
2. **Join a club** and see it in your dashboard
3. **Use the calendar** to view events by date
4. **Submit a proposal** and chat with the AI advisor
5. **Browse the gallery** of past events

### 🤖 AI Advisor:
- Go to Proposals page
- Start creating a proposal
- Click the robot icon (🤖) next to "Budget Planning"
- Ask questions like:
  - "Help me plan a budget for a tech event"
  - "What documents do I need?"
  - "How should I market my event?"

### 🎫 QR Code Tickets:
- Register for any event
- Click "Download Ticket"
- A new window opens with a printable ticket
- The QR code contains your registration info

---

## 💡 Tips

1. **Data Persistence**: All data is saved in your browser's localStorage
2. **Clear Data**: Open browser console and run `localStorage.clear()` to reset
3. **Multiple Roles**: Create different accounts to test student vs organizer features
4. **Responsive**: Try resizing your browser or open on mobile
5. **Sample Data**: The app comes with 6 events, 6 clubs, and 3 proposals pre-loaded

---

## 🐛 Troubleshooting

### Events not showing?
- Check browser console (F12) for errors
- Make sure JavaScript is enabled
- Try refreshing the page

### Can't login?
- Make sure you registered first
- Check that email and password match
- Passwords are case-sensitive

### Images not loading?
- The app uses Unsplash images - requires internet connection
- QR codes also require internet (uses api.qrserver.com)

### Lost your data?
- Data is stored in browser localStorage
- Clearing browser cache will delete all data
- Each browser has separate storage

---

## 📂 Project Structure

```
pp1/
├── index.html          ← Start here!
├── login.html
├── register.html
├── dashboard.html
├── events.html
├── clubs.html
├── proposals.html
├── calendar.html
├── gallery.html
├── my-events.html
├── css/
│   └── style.css
└── js/
    ├── data.js         ← Sample data
    ├── main.js
    ├── auth.js
    ├── dashboard.js
    ├── events.js
    ├── clubs.js
    ├── proposals.js
    ├── calendar.js
    ├── gallery.js
    └── my-events.js
```

---

## 🎉 Enjoy!

You now have a fully functional Campus Event & Club Management System!

**Need help?** Check the README.md for detailed documentation.

---

**Built with HTML, CSS, and JavaScript** 💻
