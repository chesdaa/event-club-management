// AI Advisor JavaScript

let currentChatId = null;
let chatHistory = [];
let currentMessages = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadChatHistory();
    autoResizeTextarea();
});

// ===== CHAT HISTORY MANAGEMENT =====
function loadChatHistory() {
    chatHistory = getFromLocalStorage('aiChatHistory') || [];
    renderChatHistory();
    
    // Load most recent chat or create new one
    if (chatHistory.length > 0) {
        loadChat(chatHistory[0].id);
    } else {
        createNewChat();
    }
}

function renderChatHistory() {
    const container = document.getElementById('chatHistoryList');
    if (!container) return;

    if (chatHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem 1rem; font-size: 0.9rem;">No chat history yet.<br>Start a new conversation!</p>';
        return;
    }

    container.innerHTML = chatHistory.map(chat => `
        <div class="chat-history-item ${chat.id === currentChatId ? 'active' : ''}" onclick="loadChat('${chat.id}')">
            <div class="chat-item-title">
                <i class="fas fa-comment-dots"></i>
                <span>${chat.title || 'New Chat'}</span>
            </div>
            <div class="chat-item-preview">${chat.preview || 'No messages yet'}</div>
            <div class="chat-item-date">${formatDate(chat.updatedAt)}</div>
        </div>
    `).join('');
}

function createNewChat() {
    const newChat = {
        id: 'chat_' + Date.now(),
        title: 'New Chat',
        preview: '',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    chatHistory.unshift(newChat);
    saveToLocalStorage('aiChatHistory', chatHistory);
    
    currentChatId = newChat.id;
    currentMessages = [];
    
    renderChatHistory();
    renderMessages();
    showWelcomeScreen();
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    currentChatId = chatId;
    currentMessages = chat.messages || [];
    
    renderChatHistory();
    renderMessages();
    
    // Update chat subtitle
    const subtitle = document.getElementById('chatSubtitle');
    if (subtitle) {
        subtitle.textContent = `Started ${formatDate(chat.createdAt)}`;
    }
}

function saveCurrentChat() {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat) return;

    chat.messages = currentMessages;
    chat.updatedAt = new Date().toISOString();
    
    // Update title and preview from first user message
    if (currentMessages.length > 0) {
        const firstUserMsg = currentMessages.find(m => m.role === 'user');
        if (firstUserMsg) {
            chat.title = firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
            chat.preview = firstUserMsg.content.substring(0, 60) + (firstUserMsg.content.length > 60 ? '...' : '');
        }
    }

    saveToLocalStorage('aiChatHistory', chatHistory);
    renderChatHistory();
}

// ===== MESSAGE HANDLING =====
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    
    // Hide welcome screen
    hideWelcomeScreen();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
        hideTypingIndicator();
        generateAIResponse(message);
    }, 1500);
}

function sendSuggestion(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    sendMessage();
}

function addMessage(role, content, note = null) {
    const message = {
        role: role,
        content: content,
        note: note,
        timestamp: new Date().toISOString()
    };

    currentMessages.push(message);
    saveCurrentChat();
    renderMessages();
}

function renderMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    // Clear welcome screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen && currentMessages.length > 0) {
        welcomeScreen.style.display = 'none';
    }

    // Remove existing messages (keep welcome screen)
    const existingMessages = container.querySelectorAll('.message, .typing-indicator');
    existingMessages.forEach(msg => msg.remove());

    // Render all messages
    currentMessages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        container.appendChild(messageEl);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = message.role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message.content;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = formatTime(message.timestamp);

    content.appendChild(bubble);
    
    // Add note if exists
    if (message.note) {
        const noteEl = createNoteElement(message.note);
        content.appendChild(noteEl);
    }
    
    content.appendChild(time);

    div.appendChild(avatar);
    div.appendChild(content);

    return div;
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'ai-note';
    noteDiv.innerHTML = note;
    return noteDiv;
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'message ai typing-indicator-msg';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator-msg');
    if (indicator) {
        indicator.remove();
    }
}

// ===== AI RESPONSE GENERATION (MOCK) =====
function generateAIResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    let response = '';
    let note = null;

    if (lowerMsg.includes('budget')) {
        response = "I'll help you create a comprehensive budget plan for your event. Let me break this down for you.";
        note = generateBudgetNote();
    } else if (lowerMsg.includes('document')) {
        response = "Here's a complete list of documents you'll need for your campus event.";
        note = generateDocumentsNote();
    } else if (lowerMsg.includes('venue')) {
        response = "Let me guide you through the venue selection process with these important considerations.";
        note = generateVenueNote();
    } else if (lowerMsg.includes('marketing') || lowerMsg.includes('promote')) {
        response = "I've prepared a marketing strategy guide to help you promote your event effectively.";
        note = generateMarketingNote();
    } else if (lowerMsg.includes('best practice') || lowerMsg.includes('guidance') || lowerMsg.includes('tips')) {
        response = "Here are the essential best practices for successful event planning.";
        note = generateBestPracticesNote();
    } else if (lowerMsg.includes('proposal') || lowerMsg.includes('write a proposal')) {
        response = "I've created a professional proposal template for your event. You can customize this based on your specific needs.";
        note = generateProposalNote(userMessage);
    } else {
        response = "I understand you're asking about event planning. Could you please specify what aspect you'd like help with? I can assist with budget planning, document requirements, venue selection, marketing strategies, proposal generation, or general best practices.";
    }

    addMessage('ai', response, note);
}

// ===== NOTE TEMPLATES =====
function generateBudgetNote() {
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-dollar-sign"></i></div>
                <h3>Event Budget Plan</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-chart-pie"></i> Budget Breakdown</h4>
            <table class="note-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Estimated Cost</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Venue Rental</td>
                        <td>$500 - $1,000</td>
                        <td>25-30%</td>
                    </tr>
                    <tr>
                        <td>Catering & Refreshments</td>
                        <td>$400 - $800</td>
                        <td>20-25%</td>
                    </tr>
                    <tr>
                        <td>Marketing & Promotion</td>
                        <td>$200 - $400</td>
                        <td>10-15%</td>
                    </tr>
                    <tr>
                        <td>Equipment & Technology</td>
                        <td>$300 - $600</td>
                        <td>15-20%</td>
                    </tr>
                    <tr>
                        <td>Decorations & Supplies</td>
                        <td>$200 - $400</td>
                        <td>10-15%</td>
                    </tr>
                    <tr>
                        <td>Staff & Security</td>
                        <td>$200 - $400</td>
                        <td>10-15%</td>
                    </tr>
                    <tr>
                        <td>Contingency (10%)</td>
                        <td>$180 - $360</td>
                        <td>10%</td>
                    </tr>
                    <tr style="font-weight: bold; background: var(--light-bg);">
                        <td>Total Estimated Budget</td>
                        <td>$1,980 - $3,960</td>
                        <td>100%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-lightbulb"></i> Budget Tips</h4>
            <ul class="note-list">
                <li>Always add a 10-15% contingency buffer for unexpected expenses</li>
                <li>Get multiple quotes from vendors to compare prices</li>
                <li>Consider sponsorships to offset costs</li>
                <li>Track all expenses in a spreadsheet for transparency</li>
                <li>Prioritize essential items and cut non-essentials if over budget</li>
            </ul>
        </div>

        <div class="note-highlight">
            <strong>💡 Pro Tip:</strong> Start planning your budget at least 2-3 months before the event to secure better deals and have time to adjust if needed.
        </div>
    `;
}

function generateDocumentsNote() {
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-file-alt"></i></div>
                <h3>Required Documents Checklist</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-clipboard-check"></i> Essential Documents</h4>
            <ul class="note-list">
                <li><strong>Event Proposal Form</strong> - Detailed description of your event, objectives, and expected outcomes</li>
                <li><strong>Budget Plan</strong> - Complete breakdown of estimated costs and funding sources</li>
                <li><strong>Venue Booking Confirmation</strong> - Official confirmation from venue management</li>
                <li><strong>Risk Assessment Form</strong> - Identification of potential risks and mitigation strategies</li>
                <li><strong>Insurance Certificate</strong> - Event liability insurance documentation</li>
                <li><strong>Vendor Contracts</strong> - Signed agreements with all service providers</li>
                <li><strong>Marketing Materials</strong> - Posters, flyers, and digital content for approval</li>
                <li><strong>Safety Plan</strong> - Emergency procedures and first aid arrangements</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-users"></i> If Applicable</h4>
            <ul class="note-list">
                <li>Food handling permits (if serving food)</li>
                <li>Music/entertainment licenses</li>
                <li>Alcohol permits (if applicable)</li>
                <li>Parking arrangements documentation</li>
                <li>Accessibility accommodations plan</li>
            </ul>
        </div>

        <div class="note-highlight">
            <strong>⏰ Timeline:</strong> Submit all documents at least 3-4 weeks before your event date for timely approval.
        </div>
    `;
}

function generateVenueNote() {
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-map-marker-alt"></i></div>
                <h3>Venue Selection Guide</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-check-circle"></i> Key Factors to Consider</h4>
            <ul class="note-list">
                <li><strong>Capacity</strong> - Ensure venue can comfortably accommodate your expected attendance plus 10-15% buffer</li>
                <li><strong>Location</strong> - Choose accessible location with good public transport and parking options</li>
                <li><strong>Facilities</strong> - Check for AV equipment, WiFi, restrooms, and accessibility features</li>
                <li><strong>Cost</strong> - Compare rental fees and what's included (setup, cleanup, equipment)</li>
                <li><strong>Availability</strong> - Book early, especially for popular dates and times</li>
                <li><strong>Layout</strong> - Visit in person to check if space suits your event format</li>
                <li><strong>Restrictions</strong> - Understand rules about catering, decorations, noise levels, and timing</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-question-circle"></i> Questions to Ask Venue</h4>
            <ul class="note-list">
                <li>What's included in the rental fee?</li>
                <li>Are there any additional charges or hidden costs?</li>
                <li>What's the cancellation policy?</li>
                <li>Can we bring our own vendors?</li>
                <li>What time can we access for setup?</li>
                <li>Is there technical support available?</li>
            </ul>
        </div>

        <div class="note-highlight">
            <strong>📍 Campus Venues:</strong> Auditoriums, lecture halls, student centers, outdoor spaces, and sports facilities are often available at reduced rates for student organizations.
        </div>
    `;
}

function generateMarketingNote() {
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-bullhorn"></i></div>
                <h3>Marketing Strategy Plan</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-rocket"></i> Digital Marketing Channels</h4>
            <ul class="note-list">
                <li><strong>Social Media</strong> - Create event pages on Facebook, Instagram, and Twitter. Post regularly with engaging content</li>
                <li><strong>Email Campaigns</strong> - Send targeted emails to student mailing lists and club members</li>
                <li><strong>Campus Website</strong> - Get your event featured on the official campus events calendar</li>
                <li><strong>WhatsApp/Telegram Groups</strong> - Share in relevant student groups and communities</li>
                <li><strong>Event Platforms</strong> - List on Eventbrite, Meetup, or campus event apps</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-print"></i> Traditional Marketing</h4>
            <ul class="note-list">
                <li>Eye-catching posters in high-traffic areas (cafeteria, library, dorms)</li>
                <li>Flyers distributed at related events and classes</li>
                <li>Table tents in dining halls</li>
                <li>Announcements in relevant classes (with professor permission)</li>
                <li>Campus radio or TV station features</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-calendar-alt"></i> Marketing Timeline</h4>
            <table class="note-table">
                <tr>
                    <td><strong>4 weeks before</strong></td>
                    <td>Launch social media campaign, create event pages</td>
                </tr>
                <tr>
                    <td><strong>3 weeks before</strong></td>
                    <td>Put up posters, start email campaign</td>
                </tr>
                <tr>
                    <td><strong>2 weeks before</strong></td>
                    <td>Increase social media posts, distribute flyers</td>
                </tr>
                <tr>
                    <td><strong>1 week before</strong></td>
                    <td>Final push, daily reminders, create FOMO</td>
                </tr>
                <tr>
                    <td><strong>Day before</strong></td>
                    <td>Last-minute reminders, share excitement</td>
                </tr>
            </table>
        </div>

        <div class="note-highlight">
            <strong>🎯 Pro Tip:</strong> Use consistent branding, create shareable content, and engage with comments/questions promptly to build excitement!
        </div>
    `;
}

function generateBestPracticesNote() {
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-star"></i></div>
                <h3>Event Planning Best Practices</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-tasks"></i> Planning Phase</h4>
            <ul class="note-list">
                <li>Start planning at least 2-3 months in advance</li>
                <li>Define clear objectives and success metrics</li>
                <li>Create a detailed timeline with milestones</li>
                <li>Form a dedicated organizing committee with clear roles</li>
                <li>Get necessary approvals early in the process</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-users-cog"></i> Team Management</h4>
            <ul class="note-list">
                <li>Hold regular team meetings to track progress</li>
                <li>Use project management tools (Trello, Asana, Google Sheets)</li>
                <li>Delegate tasks based on team members' strengths</li>
                <li>Maintain open communication channels</li>
                <li>Celebrate small wins to keep team motivated</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-shield-alt"></i> Risk Management</h4>
            <ul class="note-list">
                <li>Have backup plans for critical elements (venue, speakers, weather)</li>
                <li>Prepare for technical difficulties with backup equipment</li>
                <li>Ensure adequate insurance coverage</li>
                <li>Create emergency contact list and procedures</li>
                <li>Brief team on safety protocols</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-calendar-check"></i> Day-of Execution</h4>
            <ul class="note-list">
                <li>Arrive early for setup and final checks</li>
                <li>Have a detailed run-of-show document</li>
                <li>Assign point persons for different areas</li>
                <li>Keep attendee registration organized</li>
                <li>Document the event with photos/videos</li>
                <li>Be prepared to adapt to unexpected situations</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-chart-line"></i> Post-Event</h4>
            <ul class="note-list">
                <li>Send thank you messages to attendees and sponsors</li>
                <li>Collect feedback through surveys</li>
                <li>Review budget vs actual expenses</li>
                <li>Document lessons learned for future events</li>
                <li>Share event highlights on social media</li>
            </ul>
        </div>

        <div class="note-highlight">
            <strong>✨ Golden Rule:</strong> Communication is key! Keep all stakeholders informed, be transparent about challenges, and don't hesitate to ask for help when needed.
        </div>
    `;
}

function generateProposalNote(userMessage) {
    // Detect if it's event or club proposal
    const isClub = userMessage.toLowerCase().includes('club');
    const eventType = isClub ? 'Club' : 'Event';
    
    return `
        <div class="note-header">
            <div class="note-title">
                <div class="note-icon"><i class="fas fa-file-signature"></i></div>
                <h3>${eventType} Proposal Template</h3>
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="downloadNote()"><i class="fas fa-download"></i> Download</button>
                <button class="note-btn" onclick="copyNote()"><i class="fas fa-copy"></i> Copy</button>
                <button class="note-btn" onclick="submitProposal()"><i class="fas fa-paper-plane"></i> Submit</button>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-heading"></i> ${eventType} Title</h4>
            <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--primary-color);">
                <input type="text" placeholder="Enter ${eventType.toLowerCase()} name..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; font-size: 1rem;" id="proposalTitle">
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-align-left"></i> Executive Summary</h4>
            <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px;">
                <textarea placeholder="Brief overview of your ${eventType.toLowerCase()}..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; min-height: 100px; font-family: inherit; resize: vertical;" id="proposalSummary"></textarea>
            </div>
        </div>

        ${isClub ? `
        <div class="note-section">
            <h4><i class="fas fa-bullseye"></i> Mission Statement</h4>
            <ul class="note-list">
                <li>What is the primary purpose of this club?</li>
                <li>What values does the club represent?</li>
                <li>Who is the target audience?</li>
                <li>What impact will this club have on campus?</li>
            </ul>
            <textarea placeholder="Write your mission statement..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; min-height: 80px; margin-top: 0.5rem; font-family: inherit; resize: vertical;" id="proposalMission"></textarea>
        </div>
        ` : `
        <div class="note-section">
            <h4><i class="fas fa-bullseye"></i> Event Objectives</h4>
            <ul class="note-list">
                <li>What are the main goals of this event?</li>
                <li>What outcomes do you expect?</li>
                <li>How will success be measured?</li>
                <li>Who is the target audience?</li>
            </ul>
            <textarea placeholder="List your event objectives..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; min-height: 80px; margin-top: 0.5rem; font-family: inherit; resize: vertical;" id="proposalObjectives"></textarea>
        </div>
        `}

        <div class="note-section">
            <h4><i class="fas fa-calendar-alt"></i> Timeline & Schedule</h4>
            <table class="note-table">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Activity</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" placeholder="Date/Time" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                        <td><input type="text" placeholder="Activity description" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                        <td><input type="text" placeholder="Duration" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; padding: 0.5rem;">
                            <button class="note-btn" style="margin: 0;"><i class="fas fa-plus"></i> Add Row</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-dollar-sign"></i> Budget Breakdown</h4>
            <table class="note-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Cost</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" placeholder="Item name" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                        <td><input type="number" placeholder="Qty" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                        <td><input type="number" placeholder="$" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                        <td><input type="number" placeholder="$" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; padding: 0.5rem;">
                            <button class="note-btn" style="margin: 0;"><i class="fas fa-plus"></i> Add Item</button>
                        </td>
                    </tr>
                    <tr style="font-weight: bold; background: var(--light-bg);">
                        <td colspan="3">Total Estimated Budget</td>
                        <td>$<input type="number" placeholder="0.00" style="width: 80px; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        ${isClub ? `
        <div class="note-section">
            <h4><i class="fas fa-users"></i> Founding Members</h4>
            <ul class="note-list">
                <li>List all founding members with their roles</li>
                <li>Include student IDs and contact information</li>
                <li>Specify leadership positions (President, Vice President, etc.)</li>
            </ul>
            <textarea placeholder="List founding members and their roles..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; min-height: 100px; margin-top: 0.5rem; font-family: inherit; resize: vertical;" id="proposalMembers"></textarea>
        </div>
        ` : `
        <div class="note-section">
            <h4><i class="fas fa-users-cog"></i> Organizing Team</h4>
            <ul class="note-list">
                <li>Event Coordinator: <input type="text" placeholder="Name" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; margin-left: 0.5rem;"></li>
                <li>Logistics Manager: <input type="text" placeholder="Name" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; margin-left: 0.5rem;"></li>
                <li>Marketing Lead: <input type="text" placeholder="Name" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; margin-left: 0.5rem;"></li>
                <li>Finance Manager: <input type="text" placeholder="Name" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; margin-left: 0.5rem;"></li>
            </ul>
        </div>
        `}

        <div class="note-section">
            <h4><i class="fas fa-map-marker-alt"></i> Venue & Location</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Venue Name:</label>
                    <input type="text" placeholder="Enter venue name" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px;">
                </div>
                <div>
                    <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Capacity:</label>
                    <input type="number" placeholder="Expected attendees" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px;">
                </div>
            </div>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-bullhorn"></i> Marketing & Promotion Plan</h4>
            <ul class="note-list">
                <li>Social media campaigns (Facebook, Instagram, Twitter)</li>
                <li>Posters and flyers in high-traffic areas</li>
                <li>Email announcements to student mailing lists</li>
                <li>Campus website and event calendars</li>
                <li>Word-of-mouth through student organizations</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-shield-alt"></i> Risk Assessment & Safety</h4>
            <ul class="note-list">
                <li>Identify potential risks and mitigation strategies</li>
                <li>Emergency contact information and procedures</li>
                <li>First aid arrangements</li>
                <li>Insurance coverage details</li>
                <li>COVID-19 safety protocols (if applicable)</li>
            </ul>
        </div>

        <div class="note-section">
            <h4><i class="fas fa-chart-line"></i> Expected Outcomes & Impact</h4>
            <textarea placeholder="Describe the expected outcomes and impact on the campus community..." style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 6px; min-height: 100px; font-family: inherit; resize: vertical;" id="proposalOutcomes"></textarea>
        </div>

        <div class="note-highlight">
            <strong>📌 Next Steps:</strong> Review all sections, fill in the details, and click "Submit" to send your proposal for approval. Make sure all required documents are attached!
        </div>
    `;
}

// ===== FEATURE SELECTION =====
function selectFeature(feature) {
    const prompts = {
        'budget': 'Help me create a budget plan for my event',
        'documents': 'What documents do I need for a campus event?',
        'venue': 'Give me tips for selecting the right venue',
        'marketing': 'What are effective marketing strategies for my event?',
        'best-practices': 'Share best practices for event planning',
        'proposal': 'Help me write a proposal for my event'
    };

    const input = document.getElementById('chatInput');
    input.value = prompts[feature] || '';
    sendMessage();
}

function submitProposal() {
    alert('Proposal submission feature will be fully integrated with the actual proposal system. For now, you can copy this template and submit it through the regular proposal page.');
    // In real implementation, this would collect all form data and submit to proposals system
}

// ===== UI FUNCTIONS =====
function toggleSidebar() {
    const sidebar = document.querySelector('.chat-history-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
    }
}

function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'block';
    }
}

function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
}

function clearCurrentChat() {
    if (!confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
        return;
    }

    currentMessages = [];
    saveCurrentChat();
    renderMessages();
    showWelcomeScreen();
}

function exportChat() {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat || !chat.messages || chat.messages.length === 0) {
        alert('No messages to export');
        return;
    }

    let exportText = `AI Event Advisor Chat\nExported: ${new Date().toLocaleString()}\n\n`;
    
    chat.messages.forEach(msg => {
        exportText += `${msg.role.toUpperCase()}: ${msg.content}\n`;
        if (msg.note) {
            exportText += `[Note attached]\n`;
        }
        exportText += `\n`;
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentChatId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadNote() {
    alert('Note download feature - will be implemented with actual AI integration');
}

function copyNote() {
    alert('Note copied to clipboard! (Feature will be fully implemented with AI integration)');
}

function attachFile() {
    alert('File attachment feature - will be implemented with actual AI integration');
}

// ===== INPUT HANDLING =====
function handleInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea() {
    const textarea = document.getElementById('chatInput');
    if (!textarea) return;

    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
