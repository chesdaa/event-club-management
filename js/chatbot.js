// Chatbot functionality (role-aware)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initChatbot === 'function') initChatbot();
});

function initChatbot() {
    if (window.__chatbotBound) return; // avoid double-binding across pages
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (!chatbotToggle) return;
    window.__chatbotBound = true;

    const limited = (typeof isLoggedIn === 'function') ? !isLoggedIn() : true;

    // Toggle chatbot window
    if (!chatbotToggle.dataset.bound) {
      chatbotToggle.addEventListener('click', () => {
        // If user is logged in, redirect to AI Advisor page
        if (!limited) {
            window.location.href = 'ai-advisor.html';
            return;
        }
        
        // For non-logged-in users, show chatbot widget
        chatbotWindow.classList.toggle('show');
        if (chatbotWindow.classList.contains('show')) {
            chatbotInput.focus();
            // Show welcome message if first time
            if (chatbotMessages.children.length === 0) {
                addBotMessage('Hi! 👋 I\'m your Campus Events assistant. How can I help you today?');
                setTimeout(() => {
                    addBotMessage('You can ask me about:\n• Upcoming events\n• Club information\n• How to register/login\n\nFor personalized AI assistance with event planning, proposals, and more, please login to access our AI Event Advisor!');
                }, 450);
            }
        }
      });
      chatbotToggle.dataset.bound = '1';
    }

    // Close chatbot
    if (chatbotClose && !chatbotClose.dataset.bound) {
      chatbotClose.addEventListener('click', () => {
          chatbotWindow.classList.remove('show');
      });
      chatbotClose.dataset.bound = '1';
    }

    // Send message on button click
    if (chatbotSend && !chatbotSend.dataset.bound) {
      chatbotSend.addEventListener('click', sendMessage);
      chatbotSend.dataset.bound = '1';
    }

    // Send message on Enter key
    if (chatbotInput && !chatbotInput.dataset.bound) {
      chatbotInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              sendMessage();
          }
      });
      chatbotInput.dataset.bound = '1';
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addUserMessage(message);
        chatbotInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message, limited);
            addBotMessage(response);
        }, 500);
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    function getBotResponse(message, limited = true) {
        const lowerMessage = message.toLowerCase();

        // Gate advanced topics for guests
        if (limited) {
            const restrictedIntents = [
              'create event','my proposal','proposal','dashboard','rsvp','check-in','notifications','settings','profile','organizer','submit','budget','ai advisor','admin'
            ];
            if (restrictedIntents.some(key => lowerMessage.includes(key))) {
                return 'Please login to use this feature. As a guest, you can ask about upcoming events, clubs, or how to register.';
            }
        }

        // Event-related queries
        if (lowerMessage.includes('event') || lowerMessage.includes('what') && lowerMessage.includes('happening')) {
            return 'You can browse all upcoming events on our Events page! Click on any event to see details and RSVP. Would you like me to help you find specific types of events?';
        }

        // Club-related queries
        if (lowerMessage.includes('club') || lowerMessage.includes('join')) {
            return 'We have many active clubs! Visit the Clubs page to explore different clubs by category. You can join clubs that match your interests. Need help finding a specific club?';
        }

        // Registration help
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
            return 'To create an account, click "Register" in the top menu. Choose whether you\'re a Student/User or an Organizer, then fill in your details. Need help with registration?';
        }

        // Login help
        if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
            return 'You can login using the "Login" button in the top menu. Use your registered email and password. Forgot your password? Contact support for help.';
        }

        // Create event
        if (lowerMessage.includes('create') && lowerMessage.includes('event')) {
            return limited
              ? 'Event creation is available after login. You can register as an Organizer to submit events.'
              : 'To create an event, go to Dashboard and click "Create Event". Fill details and submit for approval!';
        }

        // Calendar
        if (lowerMessage.includes('calendar') || lowerMessage.includes('schedule')) {
            return 'Check out our Calendar page to see all events in a monthly view! You can switch between month, week, and list views to plan your schedule.';
        }

        // Contact/Support
        if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
            return 'Need more help? Visit our Help Center or Contact Us page in the footer. Our support team is here to assist you!';
        }

        // Greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! 😊 How can I assist you with Campus Events today?';
        }

        // Thank you
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return 'You\'re welcome! Feel free to ask if you need anything else. Happy exploring! 🎉';
        }

        // Default response
        return 'I\'m here to help! You can ask me about events, clubs, registration, or how to use the platform. What would you like to know?';
    }
}
