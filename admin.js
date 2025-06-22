// Admin Panel JavaScript for Sevabrata Foundation

class AdminPanel {
    constructor() {
        this.campaigns = [];
        this.successStories = [];
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.renderDashboard();
            this.renderCampaigns();
            this.renderSuccessStories();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
            this.showNotification('Failed to load data', 'error');
        }
    }

    async loadData() {
        try {
            // Load data from new directory structure
            const [campaigns, successStories, statistics] = await Promise.all([
                this.loadAllCampaigns(),
                this.loadSuccessStories(),
                this.loadStatistics()
            ]);
            
            this.campaigns = campaigns;
            this.successStories = successStories;
            this.statistics = statistics;
            
            console.log('Loaded campaigns:', this.campaigns.length);
            console.log('Loaded success stories:', this.successStories.length);
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to sample data
            this.loadSampleData();
        }
    }

    async loadAllCampaigns() {
        const campaigns = [];
        const directories = ['active', 'completed', 'ended', 'archived'];
        
        for (const directory of directories) {
            try {
                const dirCampaigns = await this.loadCampaignsFromDirectory(directory);
                campaigns.push(...dirCampaigns);
            } catch (error) {
                console.error(`Error loading campaigns from ${directory}:`, error);
            }
        }
        
        return campaigns;
    }

    async loadCampaignsFromDirectory(directory) {
        // Known campaign files - in a real implementation, you'd have a directory listing API
        const knownFiles = {
            'active': ['child-heart-surgery-fund.json'],
            'ended': ['palash-kidney-2024.json', 'emergency-medical-fund.json'],
            'completed': [],
            'archived': []
        };
        
        const campaigns = [];
        const files = knownFiles[directory] || [];
        
        for (const filename of files) {
            try {
                const response = await fetch(`campaigns/${directory}/${filename}`);
                if (response.ok) {
                    const campaign = await response.json();
                    campaigns.push(campaign);
                }
            } catch (error) {
                console.error(`Error loading ${filename} from ${directory}:`, error);
            }
        }
        
        return campaigns;
    }

    async loadSuccessStories() {
        const stories = [];
        const knownFiles = ['prakash-heart-surgery.json', 'poltu-heart-transplant.json'];
        
        for (const filename of knownFiles) {
            try {
                const response = await fetch(`success-stories/${filename}`);
                if (response.ok) {
                    const story = await response.json();
                    stories.push(story);
                }
            } catch (error) {
                console.error(`Error loading success story ${filename}:`, error);
            }
        }
        
        return stories;
    }

    async loadStatistics() {
        try {
            const response = await fetch('campaigns/_stats.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
        
        return {
            totalCampaigns: 0,
            activeCampaigns: 0,
            totalAmountRaised: 0,
            livesImpacted: 0,
            successRate: 0
        };
    }

    loadSampleData() {
        this.campaigns = [
            {
                id: 'palash-kidney-2024',
                title: 'Palash Das - Kidney Transplant',
                shortDescription: 'Young Palash needs urgent kidney transplant surgery.',
                targetAmount: 500000,
                raisedAmount: 125000,
                status: 'active',
                urgency: 'high',
                patientDetails: {
                    name: 'Palash Das',
                    age: 28,
                    condition: 'Chronic Kidney Disease'
                },
                lastUpdated: '2024-01-15'
            },
            {
                id: 'emergency-fund',
                title: 'Emergency Medical Fund',
                shortDescription: 'General fund for immediate medical assistance.',
                targetAmount: 1000000,
                raisedAmount: 350000,
                status: 'active',
                urgency: 'medium',
                lastUpdated: '2024-01-10'
            }
        ];

        this.successStories = [
            {
                id: 'poltu-heart-transplant',
                patientName: 'Poltu Bera',
                condition: 'Heart Failure',
                treatment: 'Heart Transplant',
                amountRaised: 1500000,
                year: 2015,
                outcome: 'Successful transplant, patient leading normal life'
            }
        ];

        this.statistics = {
            totalCampaigns: 48,
            activeCampaigns: 8,
            totalAmountRaised: 12500000,
            livesImpacted: 156,
            successRate: 92
        };
    }

    setupEventListeners() {
        // Campaign form submission
        document.getElementById('add-campaign-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCampaign(e.target);
        });

        // Success story form submission
        document.getElementById('add-story-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSuccessStory(e.target);
        });

        // Modal close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    renderDashboard() {
        const stats = this.statistics;
        
        document.getElementById('total-campaigns').textContent = stats.totalCampaigns || '0';
        document.getElementById('active-campaigns').textContent = stats.activeCampaigns || '0';
        document.getElementById('total-raised').textContent = this.formatCurrency(stats.totalAmountRaised || 0);
        document.getElementById('lives-impacted').textContent = stats.livesImpacted || '0';
        document.getElementById('success-rate').textContent = `${stats.successRate || 0}%`;
    }

    renderCampaigns() {
        const container = document.getElementById('campaigns-list');
        if (!container) return;

        container.innerHTML = this.campaigns.map(campaign => this.createCampaignAdminCard(campaign)).join('');
    }

    createCampaignAdminCard(campaign) {
        const progressPercentage = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);
        const statusClass = campaign.status || 'active';
        
        return `
            <div class="campaign-admin-card" data-campaign-id="${campaign.id}">
                <h3>${campaign.title}</h3>
                <span class="status ${statusClass}">${this.capitalizeFirst(statusClass)}</span>
                
                <p>${campaign.shortDescription || campaign.description}</p>
                
                <div class="progress-info">
                    <div class="progress-bar-admin">
                        <div class="progress-fill-admin" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #666;">
                        <span>${this.formatCurrency(campaign.raisedAmount)} / ${this.formatCurrency(campaign.targetAmount)}</span>
                        <span>${progressPercentage}%</span>
                    </div>
                </div>
                
                ${campaign.patientDetails ? `
                    <div style="margin: 1rem 0; font-size: 0.875rem; color: #666;">
                        <strong>Patient:</strong> ${campaign.patientDetails.name || 'N/A'}
                        ${campaign.patientDetails.age ? `(Age: ${campaign.patientDetails.age})` : ''}
                        ${campaign.patientDetails.condition ? `<br><strong>Condition:</strong> ${campaign.patientDetails.condition}` : ''}
                        ${campaign.patientDetails.hospital ? `<br><strong>Hospital:</strong> ${campaign.patientDetails.hospital}` : ''}
                    </div>
                ` : ''}
                
                <div style="font-size: 0.875rem; color: #666; margin-bottom: 1rem;">
                    <strong>Last Updated:</strong> ${this.formatDate(campaign.lastUpdated)}
                    ${campaign.category ? `<br><strong>Category:</strong> ${campaign.category}` : ''}
                    ${campaign.urgency ? `<br><strong>Urgency:</strong> ${campaign.urgency}` : ''}
                </div>
                
                <div class="campaign-actions">
                    <button class="btn-edit" onclick="adminPanel.editCampaign('${campaign.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-pause" onclick="adminPanel.toggleCampaignStatus('${campaign.id}')">
                        <i class="fas fa-pause"></i> ${statusClass === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button class="btn-complete" onclick="adminPanel.completeCampaign('${campaign.id}')">
                        <i class="fas fa-check"></i> Complete
                    </button>
                </div>
            </div>
        `;
    }

    renderSuccessStories() {
        const container = document.getElementById('success-stories-list');
        if (!container) return;

        container.innerHTML = this.successStories.map(story => this.createSuccessStoryCard(story)).join('');
    }

    createSuccessStoryCard(story) {
        return `
            <div class="success-story-card" data-story-id="${story.id}">
                <h4>${story.patientName}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div>
                        <strong>Condition:</strong> ${story.condition}<br>
                        <strong>Treatment:</strong> ${story.treatment}<br>
                        <strong>Year:</strong> ${story.year}
                    </div>
                    <div>
                        <strong>Amount Raised:</strong> ${this.formatCurrency(story.amountRaised)}<br>
                        <strong>Outcome:</strong> ${story.outcome}
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn-edit" onclick="adminPanel.editSuccessStory('${story.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-pause" onclick="adminPanel.deleteSuccessStory('${story.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Campaign Management Methods
    handleAddCampaign(form) {
        const formData = new FormData(form);
        const campaignData = {};
        
        // Extract form data
        for (let [key, value] of formData.entries()) {
            if (key !== 'image') {
                campaignData[key] = value;
            }
        }
        
        // Generate unique ID
        campaignData.id = this.generateId();
        campaignData.status = 'active';
        campaignData.createdDate = new Date().toISOString().split('T')[0];
        campaignData.lastUpdated = new Date().toISOString().split('T')[0];
        
        // Structure patient details
        if (campaignData.patientName || campaignData.patientAge || campaignData.medicalCondition) {
            campaignData.patientDetails = {
                name: campaignData.patientName || '',
                age: parseInt(campaignData.patientAge) || null,
                condition: campaignData.medicalCondition || '',
                hospital: campaignData.hospital || ''
            };
            
            // Clean up individual fields
            delete campaignData.patientName;
            delete campaignData.patientAge;
            delete campaignData.medicalCondition;
            delete campaignData.hospital;
        }
        
        // Convert numeric fields
        campaignData.targetAmount = parseInt(campaignData.targetAmount) || 0;
        campaignData.raisedAmount = parseInt(campaignData.raisedAmount) || 0;
        
        // Handle image (in real implementation, this would upload to server)
        const imageFile = form.querySelector('input[name="image"]').files[0];
        if (imageFile) {
            campaignData.image = `assets/${imageFile.name}`;
        } else {
            campaignData.image = 'assets/sevalog1crop.jpg'; // Default image
        }
        
        console.log('Adding new campaign:', campaignData);
        
        // Add to campaigns array
        this.campaigns.unshift(campaignData);
        
        // In a real implementation, save to appropriate directory based on status
        this.saveCampaignToDirectory(campaignData, campaignData.status);
        
        // Update statistics
        this.statistics.totalCampaigns = (this.statistics.totalCampaigns || 0) + 1;
        this.statistics.activeCampaigns = (this.statistics.activeCampaigns || 0) + 1;
        
        // Re-render
        this.renderCampaigns();
        this.renderDashboard();
        
        // Close modal and reset form
        this.closeModal('add-campaign-modal');
        form.reset();
        
        this.showNotification('Campaign added successfully!', 'success');
    }

    handleAddSuccessStory(form) {
        const formData = new FormData(form);
        const storyData = {};
        
        // Extract form data
        for (let [key, value] of formData.entries()) {
            if (key !== 'image') {
                storyData[key] = value;
            }
        }
        
        // Generate unique ID
        storyData.id = this.generateId();
        
        // Convert numeric fields
        storyData.year = parseInt(storyData.year) || new Date().getFullYear();
        storyData.amountRaised = parseInt(storyData.amountRaised) || 0;
        
        // Handle image
        const imageFile = form.querySelector('input[name="image"]').files[0];
        if (imageFile) {
            storyData.image = `assets/${imageFile.name}`;
        }
        
        console.log('Adding new success story:', storyData);
        
        // Add to success stories array
        this.successStories.unshift(storyData);
        
        // In a real implementation, save to success-stories directory
        this.saveSuccessStoryToDirectory(storyData);
        
        // Re-render
        this.renderSuccessStories();
        
        // Close modal and reset form
        this.closeModal('add-story-modal');
        form.reset();
        
        this.showNotification('Success story added!', 'success');
    }

    editCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) {
            this.showNotification('Campaign not found', 'error');
            return;
        }
        
        // Pre-fill form with campaign data
        const form = document.getElementById('add-campaign-form');
        const modal = document.getElementById('add-campaign-modal');
        
        // Fill form fields
        form.querySelector('[name="title"]').value = campaign.title || '';
        form.querySelector('[name="category"]').value = campaign.category || '';
        form.querySelector('[name="shortDescription"]').value = campaign.shortDescription || '';
        form.querySelector('[name="fullDescription"]').value = campaign.fullDescription || '';
        form.querySelector('[name="targetAmount"]').value = campaign.targetAmount || '';
        form.querySelector('[name="raisedAmount"]').value = campaign.raisedAmount || '';
        form.querySelector('[name="urgency"]').value = campaign.urgency || 'medium';
        
        if (campaign.patientDetails) {
            form.querySelector('[name="patientName"]').value = campaign.patientDetails.name || '';
            form.querySelector('[name="patientAge"]').value = campaign.patientDetails.age || '';
            form.querySelector('[name="medicalCondition"]').value = campaign.patientDetails.condition || '';
            form.querySelector('[name="hospital"]').value = campaign.patientDetails.hospital || '';
        }
        
        // Change modal title and button text
        modal.querySelector('h2').textContent = 'Edit Campaign';
        modal.querySelector('button[type="submit"]').textContent = 'Update Campaign';
        
        // Store editing campaign ID
        form.dataset.editingId = campaignId;
        
        this.showModal('add-campaign-modal');
    }

    toggleCampaignStatus(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        campaign.status = campaign.status === 'active' ? 'paused' : 'active';
        campaign.lastUpdated = new Date().toISOString().split('T')[0];
        
        this.renderCampaigns();
        this.showNotification(`Campaign ${campaign.status}`, 'success');
    }

    completeCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        
        if (confirm('Mark this campaign as completed? This action cannot be undone.')) {
            const oldStatus = campaign.status;
            campaign.status = 'completed';
            campaign.raisedAmount = campaign.targetAmount; // Assume target was reached
            campaign.lastUpdated = new Date().toISOString().split('T')[0];
            
            // In a real implementation, move campaign file from old status to completed directory
            this.moveCampaignBetweenDirectories(campaign, oldStatus, 'completed');
            
            // Update statistics
            this.statistics.activeCampaigns = Math.max(0, (this.statistics.activeCampaigns || 0) - 1);
            
            this.renderCampaigns();
            this.renderDashboard();
            this.showNotification('Campaign marked as completed', 'success');
        }
    }

    // Directory-based save methods (for real implementation)
    saveCampaignToDirectory(campaign, directory) {
        // In a real implementation, this would make an API call to save the campaign
        // to the appropriate directory (campaigns/active/, campaigns/completed/, etc.)
        console.log(`Would save campaign ${campaign.id} to campaigns/${directory}/`);
        console.log('Campaign data:', campaign);
        
        // Note: Static file hosting doesn't allow writing files from JavaScript
        // This would require a backend API endpoint
        this.showNotification('Note: File saving requires backend API (not available in static hosting)', 'info');
    }

    saveSuccessStoryToDirectory(story) {
        // In a real implementation, this would make an API call to save the success story
        // to the success-stories/ directory
        console.log(`Would save success story ${story.id} to success-stories/`);
        console.log('Story data:', story);
        
        // Note: Static file hosting doesn't allow writing files from JavaScript
        this.showNotification('Note: File saving requires backend API (not available in static hosting)', 'info');
    }

    moveCampaignBetweenDirectories(campaign, fromDirectory, toDirectory) {
        // In a real implementation, this would move the campaign file between directories
        console.log(`Would move campaign ${campaign.id} from ${fromDirectory} to ${toDirectory}`);
        
        // This would involve:
        // 1. DELETE campaigns/${fromDirectory}/${campaign.id}.json
        // 2. POST campaigns/${toDirectory}/${campaign.id}.json with campaign data
    }

    editSuccessStory(storyId) {
        const story = this.successStories.find(s => s.id === storyId);
        if (!story) {
            this.showNotification('Success story not found', 'error');
            return;
        }
        
        // Pre-fill form with story data
        const form = document.getElementById('add-story-form');
        const modal = document.getElementById('add-story-modal');
        
        form.querySelector('[name="patientName"]').value = story.patientName || '';
        form.querySelector('[name="year"]').value = story.year || '';
        form.querySelector('[name="condition"]').value = story.condition || '';
        form.querySelector('[name="treatment"]').value = story.treatment || '';
        form.querySelector('[name="amountRaised"]').value = story.amountRaised || '';
        form.querySelector('[name="hospital"]').value = story.hospital || '';
        form.querySelector('[name="outcome"]').value = story.outcome || '';
        form.querySelector('[name="description"]').value = story.description || '';
        
        // Change modal title and button text
        modal.querySelector('h2').textContent = 'Edit Success Story';
        modal.querySelector('button[type="submit"]').textContent = 'Update Story';
        
        // Store editing story ID
        form.dataset.editingId = storyId;
        
        this.showModal('add-story-modal');
    }

    deleteSuccessStory(storyId) {
        if (confirm('Are you sure you want to delete this success story?')) {
            this.successStories = this.successStories.filter(s => s.id !== storyId);
            this.renderSuccessStories();
            this.showNotification('Success story deleted', 'success');
        }
    }

    // Content Management Methods
    saveContent() {
        const content = {
            heroHeading: document.getElementById('hero-heading').value,
            heroDescription: document.getElementById('hero-description').value,
            generalEmail: document.getElementById('general-email').value,
            membershipEmail: document.getElementById('membership-email').value
        };
        
        console.log('Saving content:', content);
        // In real implementation, this would save to backend
        
        this.showNotification('Content saved successfully!', 'success');
    }

    saveSettings() {
        const settings = {
            accountName: document.getElementById('account-name').value,
            accountNumber: document.getElementById('account-number').value,
            ifscCode: document.getElementById('ifsc-code').value,
            bankName: document.getElementById('bank-name').value,
            websiteTitle: document.getElementById('website-title').value,
            metaDescription: document.getElementById('meta-description').value
        };
        
        console.log('Saving settings:', settings);
        // In real implementation, this would save to backend
        
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Utility Methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatCurrency(amount) {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(0)}K`;
        } else {
            return `₹${amount.toLocaleString('en-IN')}`;
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            delete form.dataset.editingId;
            
            // Reset modal title and button text
            if (modalId === 'add-campaign-modal') {
                modal.querySelector('h2').textContent = 'Add New Campaign';
                modal.querySelector('button[type="submit"]').textContent = 'Create Campaign';
            } else if (modalId === 'add-story-modal') {
                modal.querySelector('h2').textContent = 'Add Success Story';
                modal.querySelector('button[type="submit"]').textContent = 'Add Success Story';
            }
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showAddCampaignModal() {
    adminPanel.showModal('add-campaign-modal');
}

function showAddStoryModal() {
    adminPanel.showModal('add-story-modal');
}

function closeModal(modalId) {
    adminPanel.closeModal(modalId);
}

function saveContent() {
    adminPanel.saveContent();
}

function saveSettings() {
    adminPanel.saveSettings();
}

// Initialize admin panel when DOM is loaded
let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    console.log('Admin panel initialized');
});