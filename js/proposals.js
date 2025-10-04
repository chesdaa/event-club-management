// Proposals page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    loadProposals();
    setupProposalForms();
});

function loadProposals(filter = 'all') {
    const proposals = getFromLocalStorage('proposals') || [];
    const container = document.getElementById('proposalsList');
    
    if (!container) return;
    
    let filteredProposals = proposals;
    if (filter !== 'all') {
        filteredProposals = proposals.filter(p => p.status === filter);
    }
    
    if (filteredProposals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No proposals found.</p>';
        return;
    }
    
    container.innerHTML = filteredProposals.map(proposal => createProposalCard(proposal)).join('');
}

function createProposalCard(proposal) {
    const statusClass = `status-${proposal.status}`;
    const typeIcon = proposal.type === 'event' ? 'fa-calendar' : 'fa-users';
    
    return `
        <div class="proposal-card">
            <div class="proposal-header">
                <div>
                    <h3><i class="fas ${typeIcon}"></i> ${proposal.title || proposal.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Submitted by ${proposal.submittedBy} on ${formatDate(proposal.submittedDate)}
                    </p>
                </div>
                <span class="proposal-status ${statusClass}">${proposal.status.toUpperCase()}</span>
            </div>
            <p style="margin: 1rem 0;">${proposal.description || proposal.mission}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
                ${proposal.type === 'event' ? `
                    <div><strong>Date:</strong> ${formatDate(proposal.date)}</div>
                    <div><strong>Venue:</strong> ${proposal.venue}</div>
                    <div><strong>Expected:</strong> ${proposal.participants} participants</div>
                ` : `
                    <div><strong>Faculty:</strong> ${proposal.faculty}</div>
                    <div><strong>Members:</strong> ${proposal.members}</div>
                `}
                <div><strong>Budget:</strong> $${proposal.budget}</div>
            </div>
            ${proposal.status === 'pending' ? `
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-primary" onclick="editProposal(${proposal.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="deleteProposal(${proposal.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function switchTab(filter) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadProposals(filter);
}

function openProposalModal(type) {
    const modal = document.getElementById(type === 'event' ? 'eventProposalModal' : 'clubProposalModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeProposalModal(type) {
    const modal = document.getElementById(type === 'event' ? 'eventProposalModal' : 'clubProposalModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupProposalForms() {
    const eventForm = document.getElementById('eventProposalForm');
    const clubForm = document.getElementById('clubProposalForm');
    
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventProposal);
    }
    
    if (clubForm) {
        clubForm.addEventListener('submit', handleClubProposal);
    }
    
    // Setup budget calculation
    setupBudgetCalculation();
}

function handleEventProposal(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    const budgetItems = document.querySelectorAll('#budgetItems .budget-item');
    let totalBudget = 0;
    
    budgetItems.forEach(item => {
        const amount = parseFloat(item.querySelector('.budget-item-amount').value) || 0;
        totalBudget += amount;
    });
    
    const proposal = {
        id: Date.now(),
        type: 'event',
        title: document.getElementById('eventProposalTitle').value,
        description: document.getElementById('eventProposalDesc').value,
        date: document.getElementById('eventProposalDate').value,
        venue: document.getElementById('eventProposalVenue').value,
        participants: parseInt(document.getElementById('eventProposalParticipants').value),
        budget: totalBudget,
        status: 'pending',
        submittedBy: `${user.firstName} ${user.lastName}`,
        submittedDate: new Date().toISOString()
    };
    
    const proposals = getFromLocalStorage('proposals') || [];
    proposals.push(proposal);
    saveToLocalStorage('proposals', proposals);
    
    alert('Event proposal submitted successfully!');
    closeProposalModal('event');
    e.target.reset();
    loadProposals();
}

function handleClubProposal(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    
    const proposal = {
        id: Date.now(),
        type: 'club',
        name: document.getElementById('clubProposalName').value,
        mission: document.getElementById('clubProposalMission').value,
        faculty: document.getElementById('clubProposalFaculty').value,
        members: document.querySelectorAll('#foundingMembers .member-item').length,
        budget: parseInt(document.getElementById('clubBudget').value),
        status: 'pending',
        submittedBy: `${user.firstName} ${user.lastName}`,
        submittedDate: new Date().toISOString()
    };
    
    const proposals = getFromLocalStorage('proposals') || [];
    proposals.push(proposal);
    saveToLocalStorage('proposals', proposals);
    
    alert('Club proposal submitted successfully!');
    closeProposalModal('club');
    e.target.reset();
    loadProposals();
}

function addBudgetItem() {
    const container = document.getElementById('budgetItems');
    const newItem = document.createElement('div');
    newItem.className = 'budget-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Item (e.g., Venue)" class="budget-item-name">
        <input type="number" placeholder="Amount" class="budget-item-amount" min="0">
        <button type="button" class="btn-icon" onclick="removeBudgetItem(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newItem);
    
    // Add event listener for budget calculation
    newItem.querySelector('.budget-item-amount').addEventListener('input', calculateTotalBudget);
}

function removeBudgetItem(button) {
    button.closest('.budget-item').remove();
    calculateTotalBudget();
}

function setupBudgetCalculation() {
    const budgetInputs = document.querySelectorAll('.budget-item-amount');
    budgetInputs.forEach(input => {
        input.addEventListener('input', calculateTotalBudget);
    });
}

function calculateTotalBudget() {
    const budgetItems = document.querySelectorAll('.budget-item-amount');
    let total = 0;
    
    budgetItems.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    
    const totalElement = document.getElementById('totalBudget');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function addMember() {
    const container = document.getElementById('foundingMembers');
    const newMember = document.createElement('div');
    newMember.className = 'member-item';
    newMember.innerHTML = `
        <input type="text" placeholder="Name" class="member-name">
        <input type="text" placeholder="Student ID" class="member-id">
        <input type="email" placeholder="Email" class="member-email">
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newMember);
}

function editProposal(proposalId) {
    alert('Edit functionality - In a full implementation, this would open the proposal in edit mode');
}

function deleteProposal(proposalId) {
    if (!confirm('Are you sure you want to delete this proposal?')) return;
    
    const proposals = getFromLocalStorage('proposals') || [];
    const filtered = proposals.filter(p => p.id !== proposalId);
    saveToLocalStorage('proposals', filtered);
    
    alert('Proposal deleted successfully!');
    loadProposals();
}

// AI Advisor functionality
function openAIAdvisor(context) {
    const modal = document.getElementById('aiAdvisorModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Add context-specific initial message
        const messagesContainer = document.getElementById('aiMessages');
        let contextMessage = '';
        
        switch(context) {
            case 'budget':
                contextMessage = 'I can help you create a detailed budget breakdown for your event. What type of event are you planning?';
                break;
            case 'documents':
                contextMessage = 'I can suggest the necessary documents for your proposal. Common documents include: permission letters, venue booking confirmations, sponsorship agreements, and safety plans.';
                break;
            case 'club-budget':
                contextMessage = 'For a club budget, consider: meeting expenses, event costs, equipment, marketing materials, and administrative costs. What activities does your club plan?';
                break;
        }
        
        if (contextMessage) {
            const botMessage = document.createElement('div');
            botMessage.className = 'ai-message bot';
            botMessage.innerHTML = `
                <i class="fas fa-robot"></i>
                <div class="message-content">
                    <p>${contextMessage}</p>
                </div>
            `;
            messagesContainer.appendChild(botMessage);
        }
    }
}

function closeAIAdvisor() {
    const modal = document.getElementById('aiAdvisorModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear messages except the first one
        const messagesContainer = document.getElementById('aiMessages');
        const firstMessage = messagesContainer.querySelector('.ai-message');
        messagesContainer.innerHTML = '';
        if (firstMessage) {
            messagesContainer.appendChild(firstMessage.cloneNode(true));
        }
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('aiMessages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message user';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    messagesContainer.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const botResponse = generateAIResponse(message);
        const botMessage = document.createElement('div');
        botMessage.className = 'ai-message bot';
        botMessage.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <p>${botResponse}</p>
            </div>
        `;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('budget') || message.includes('cost')) {
        return 'For a typical campus event, consider these budget items:<br>• Venue rental: $500-1000<br>• Catering: $15-25 per person<br>• Audio/Visual equipment: $200-500<br>• Marketing materials: $100-300<br>• Decorations: $100-200<br>• Contingency (10%): Calculate based on total';
    } else if (message.includes('document') || message.includes('paper')) {
        return 'Essential documents for your proposal:<br>1. Event/Club proposal form<br>2. Venue booking confirmation<br>3. Budget breakdown<br>4. Risk assessment<br>5. Insurance certificate (if required)<br>6. Sponsorship letters<br>7. Marketing plan';
    } else if (message.includes('venue') || message.includes('location')) {
        return 'When selecting a venue, consider:<br>• Capacity requirements<br>• Accessibility<br>• Audio/visual capabilities<br>• Parking availability<br>• Backup indoor option for outdoor events<br>• Proximity to campus facilities';
    } else if (message.includes('marketing') || message.includes('promote')) {
        return 'Effective event marketing strategies:<br>• Social media campaigns (2-3 weeks before)<br>• Email newsletters<br>• Campus posters and flyers<br>• Collaboration with other clubs<br>• Student ambassadors<br>• Early bird registration incentives';
    } else {
        return 'I can help you with budget planning, document requirements, venue selection, marketing strategies, and general event planning advice. What specific aspect would you like to discuss?';
    }
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
});
