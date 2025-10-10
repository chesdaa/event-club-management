# Campus Events - Testing Guide

## 🎯 PRE-CONFIGURED TEST ACCOUNTS (No Signup Needed!)

### 👨‍💼 **Admin Account**
- **Email:** admin@campus.edu
- **Password:** Admin@123
- **Access:** Full admin dashboard with all controls

### 🎓 **Student Account**
- **Email:** student@test.edu
- **Password:** Student123
- **Details:** John Student, Engineering Year 2, ID: S12345

### 🏢 **Organizer Account**
- **Email:** organizer@test.edu
- **Password:** Organizer123
- **Details:** Jane Organizer, Tech Club

---

## How to Login

1. Go to `login.html` or click "Login" button
2. Use one of the test accounts above
3. Click "Sign In"
4. You'll be redirected to your dashboard

---

## How to Sign Up (Optional - Test Accounts Already Created)

### 🎓 **Student/User Registration**

1. Go to `register.html` or click "Register" button
2. Fill in the form:
   - **First Name:** Your name
   - **Last Name:** Your last name
   - **I am a:** Select "Student / User"
   - **Student ID:** Any ID (e.g., S67890)
   - **Faculty/Department:** Select any
   - **Year:** Select any
   - **Email:** your@email.edu
   - **Password:** YourPassword123
   - **Confirm Password:** YourPassword123
3. Click "Create Account"

### 🏢 **Organizer Registration**

1. Go to `register.html` or click "Register" button
2. Fill in the form:
   - **First Name:** Your name
   - **Last Name:** Your last name
   - **I am a:** Select "Organizer"
   - **Organization / Company Name:** Your organization
   - **Email:** your@email.edu
   - **Password:** YourPassword123
   - **Confirm Password:** YourPassword123
3. Click "Create Account"

**Note:** When you select "Organizer", student fields will hide and only organization field will show!

---

## Admin Dashboard Features

### ✅ **Quick Actions**
- **Create Event:** Add new events directly
- **Create Club:** Add new clubs directly
- **Notify Users:** Send notifications to all users, students only, or organizers only
- **System Settings:** Configure auto-approval, capacity limits, registration deadlines

### 📋 **Event Proposal Management**
- View pending event proposals
- **Approve:** Publish the event
- **Reject:** Decline the proposal

### 🏛️ **Club Proposal Management**
- View pending club proposals
- **Approve:** Create the club and promote submitter to organizer
- **Reject:** Decline the proposal

### 📊 **Overview Sections**
- **All Events:** View all events in the system
- **All Clubs:** View all clubs
- **Users Management:** View all registered users

---

## Testing Checklist

### Registration & Auth
- [ ] Register as Student - conditional fields show correctly
- [ ] Register as Organizer - only organization name field shows
- [ ] Login with student account
- [ ] Login with organizer account
- [ ] Login with admin account
- [ ] Logout functionality works

### Public Pages
- [ ] Navbar is transparent and changes on scroll
- [ ] Chatbot button appears on all pages
- [ ] Chatbot opens and responds to messages
- [ ] Footer links work (Help Center, Contact, Privacy, Terms)
- [ ] Events page loads and displays events
- [ ] Clubs page loads and displays clubs
- [ ] Calendar page shows events
- [ ] Gallery page displays albums

### Admin Features
- [ ] Create Event modal works
- [ ] Create Club modal works
- [ ] Notify Users modal works
- [ ] System Settings modal saves settings
- [ ] Approve event proposal
- [ ] Reject event proposal
- [ ] Approve club proposal
- [ ] Reject club proposal
- [ ] Toggle sections (collapse/expand)

### Legal Pages
- [ ] Privacy Policy accordion works
- [ ] Terms of Service accordion works
- [ ] Help Center FAQ displays
- [ ] Contact form submits

---

## Common Issues & Solutions

### Issue: Registration fields don't change when selecting role
**Solution:** The JavaScript now explicitly sets `display: block/none` on role change. Refresh the page and try again.

### Issue: Can't scroll on registration page
**Solution:** The auth page now uses `min-height: 100vh` instead of fixed height. The form panel scrolls naturally.

### Issue: Admin dashboard doesn't load
**Solution:** Make sure you're logged in as admin (admin@campus.edu / Admin@123). Check browser console for errors.

### Issue: Chatbot doesn't appear
**Solution:** Ensure `js/chatbot.js` is loaded. Check browser console for JavaScript errors.

---

## Data Storage

All data is stored in **localStorage** for easy testing:
- **users:** All registered users
- **events:** All events
- **clubs:** All clubs
- **proposals:** Club and event proposals
- **notifications:** Admin notifications
- **systemSettings:** System configuration

### Clear All Data
Open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

### View Stored Data
Open browser console and run:
```javascript
console.log('Users:', JSON.parse(localStorage.getItem('users')));
console.log('Events:', JSON.parse(localStorage.getItem('events')));
console.log('Clubs:', JSON.parse(localStorage.getItem('clubs')));
```

---

## Page URLs

- **Home:** `index.html`
- **Events:** `events.html`
- **Clubs:** `clubs.html`
- **Calendar:** `calendar.html`
- **Gallery:** `gallery.html`
- **Login:** `login.html`
- **Register:** `register.html`
- **Dashboard:** `dashboard.html` (requires login)
- **Admin:** `admin.html` (requires admin login)
- **Help Center:** `help-center.html`
- **Contact:** `contact.html`
- **Privacy Policy:** `privacy.html`
- **Terms of Service:** `terms.html`

---

## Tips for Testing

1. **Use Chrome DevTools:** Press F12 to open developer tools and check console for errors
2. **Test in Incognito:** Ensures clean localStorage state
3. **Test Different Roles:** Register as both student and organizer to see different experiences
4. **Test Responsive:** Resize browser window to test mobile layouts
5. **Test Chatbot:** Ask questions like "how do I create an event?" or "how do I join a club?"

---

## Need Help?

- Check browser console for JavaScript errors
- Verify all files are in correct directories
- Ensure all CSS and JS files are loaded
- Try clearing localStorage and refreshing

Happy Testing! 🎉
