// Admin Panel JavaScript for Sevabrata Foundation

// Global variable for admin panel instance
let adminPanel;

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
    
    // Find and activate the clicked button
    const clickedButton = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

function showAddCampaignModal() {
    if (adminPanel) {
        adminPanel.showModal('add-campaign-modal');
    } else {
        console.error('Admin panel not initialized');
    }
}

function showAddStoryModal() {
    if (adminPanel) {
        adminPanel.showModal('add-story-modal');
    } else {
        console.error('Admin panel not initialized');
    }
}

function closeModal(modalId) {
    if (adminPanel) {
        adminPanel.closeModal(modalId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function saveContent() {
    if (adminPanel) {
        adminPanel.saveContent();
    } else {
        console.error('Admin panel not initialized');
    }
}

function saveSettings() {
    if (adminPanel) {
        adminPanel.saveSettings();
    } else {
        console.error('Admin panel not initialized');
    }
}

function reloadCampaignCounts() {
    if (adminPanel) {
        adminPanel.reloadCampaignCounts();
    } else {
        console.error('Admin panel not initialized');
    }
}

function editSuccessStory(storyId) {
    if (adminPanel) {
        adminPanel.editSuccessStory(storyId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function deleteSuccessStory(storyId) {
    if (adminPanel) {
        adminPanel.deleteSuccessStory(storyId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function editCampaign(campaignId) {
    if (adminPanel) {
        adminPanel.editCampaign(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function toggleCampaignStatus(campaignId) {
    if (adminPanel) {
        adminPanel.toggleCampaignStatus(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function completeCampaign(campaignId) {
    if (adminPanel) {
        adminPanel.completeCampaign(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

class AdminPanel {
    constructor() {
        this.campaigns = [];
        this.successStories = [];
        this.init();
    }

    async init() {
        try {
            await this.loadData();
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
            const [campaigns, successStories, campaignCounts] = await Promise.all([
                this.loadAllCampaigns(),
                this.loadSuccessStories(),
                this.loadCampaignCounts()
            ]);

            this.campaigns = campaigns;
            this.successStories = successStories;
            this.campaignCounts = campaignCounts;

            console.log('Loaded campaigns:', this.campaigns.length);
            console.log('Loaded success stories:', this.successStories.length);
            console.log('Campaign counts:', this.campaignCounts);
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to sample data
            this.loadSampleData();
        }
    }

    async loadCampaignCounts() {
        const counts = {
            active: 0,
            ended: 0,
            completed: 0,
            archived: 0,
            total: 0
        };

        const directories = ['active', 'ended'];

        for (const directory of directories) {
            try {
                const manifestResponse = await fetch(`campaigns/${directory}/manifest.json`);
                if (manifestResponse.ok) {
                    const manifest = await manifestResponse.json();
                    const count = (manifest.campaigns || []).length;
                    counts[directory] = count;
                    counts.total += count;
                }
            } catch (error) {
                console.error(`Error loading manifest for ${directory}:`, error);
            }
        }

        return counts;
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
        try {
            // Load manifest file to get list of campaigns
            const manifestResponse = await fetch(`campaigns/${directory}/manifest.json`);
            if (!manifestResponse.ok) {
                console.log(`No manifest found for ${directory}, skipping...`);
                return [];
            }

            const manifest = await manifestResponse.json();
            const campaigns = [];

            // Load each campaign from the manifest
            for (const filename of manifest.campaigns || []) {
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
        } catch (error) {
            console.error(`Error loading campaigns from ${directory}:`, error);
            return [];
        }
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
        // Use empty data if loading fails - we'll rely on real manifest files
        this.campaigns = [];
        this.successStories = [];
        this.campaignCounts = {
            active: 0,
            ended: 0,
            completed: 0,
            archived: 0,
            total: 0
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

    renderCampaignStats() {
        // Use manifest-based counts for accurate statistics
        const counts = this.campaignCounts || { active: 0, ended: 0, completed: 0, total: 0 };

        // Calculate completed campaigns (ended + completed)
        const completedCampaigns = counts.ended + counts.completed;

        // Calculate total raised from loaded campaigns (only for display purposes)
        const totalRaised = (this.campaigns || []).reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

        // Update the display with null checks
        const totalCampaignsEl = document.getElementById('total-campaigns');
        const activeCampaignsEl = document.getElementById('active-campaigns');
        const completedCampaignsEl = document.getElementById('completed-campaigns');
        const totalRaisedEl = document.getElementById('total-raised');
        
        if (totalCampaignsEl) totalCampaignsEl.textContent = counts.total;
        if (activeCampaignsEl) activeCampaignsEl.textContent = counts.active;
        if (completedCampaignsEl) completedCampaignsEl.textContent = completedCampaigns;
        if (totalRaisedEl) totalRaisedEl.textContent = this.formatCurrency(totalRaised);
    }

    renderCampaigns() {
        const container = document.getElementById('campaigns-list');
        if (!container) return;

        const campaigns = this.campaigns || [];
        container.innerHTML = campaigns.map(campaign => this.createCampaignAdminCard(campaign)).join('');
        this.renderCampaignStats();
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
                    <button class="btn-edit" onclick="editCampaign('${campaign.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-pause" onclick="toggleCampaignStatus('${campaign.id}')">
                        <i class="fas fa-pause"></i> ${statusClass === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button class="btn-complete" onclick="completeCampaign('${campaign.id}')">
                        <i class="fas fa-check"></i> Complete
                    </button>
                </div>
            </div>
        `;
    }

    renderSuccessStories() {
        const container = document.getElementById('success-stories-list');
        if (!container) return;

        const successStories = this.successStories || [];
        container.innerHTML = successStories.map(story => this.createSuccessStoryCard(story)).join('');
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
                    <button class="btn-edit" onclick="editSuccessStory('${story.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-pause" onclick="deleteSuccessStory('${story.id}')">
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

        // Update campaign counts
        if (this.campaignCounts) {
            this.campaignCounts.active += 1;
            this.campaignCounts.total += 1;
        }

        // Re-render
        this.renderCampaigns();

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

            // Update campaign counts
            if (this.campaignCounts) {
                this.campaignCounts.active = Math.max(0, this.campaignCounts.active - 1);
                this.campaignCounts.ended += 1;
            }

            this.renderCampaigns();
            this.showNotification('Campaign marked as completed', 'success');
        }
    }

    // Reload campaign counts from manifest files
    async reloadCampaignCounts() {
        try {
            this.campaignCounts = await this.loadCampaignCounts();
            this.renderCampaignStats();
            this.showNotification('Campaign statistics refreshed!', 'success');
        } catch (error) {
            console.error('Error reloading campaign counts:', error);
            this.showNotification('Error refreshing statistics', 'error');
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

        // In a real implementation, after saving, we would reload the counts
        // this.reloadCampaignCounts();
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
    if (adminPanel) {
        adminPanel.showModal('add-campaign-modal');
    } else {
        console.error('Admin panel not initialized');
    }
}

function showAddStoryModal() {
    if (adminPanel) {
        adminPanel.showModal('add-story-modal');
    } else {
        console.error('Admin panel not initialized');
    }
}

function closeModal(modalId) {
    if (adminPanel) {
        adminPanel.closeModal(modalId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function saveContent() {
    if (adminPanel) {
        adminPanel.saveContent();
    } else {
        console.error('Admin panel not initialized');
    }
}

function saveSettings() {
    if (adminPanel) {
        adminPanel.saveSettings();
    } else {
        console.error('Admin panel not initialized');
    }
}

function reloadCampaignCounts() {
    if (adminPanel) {
        adminPanel.reloadCampaignCounts();
    } else {
        console.error('Admin panel not initialized');
    }
}

function editSuccessStory(storyId) {
    if (adminPanel) {
        adminPanel.editSuccessStory(storyId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function deleteSuccessStory(storyId) {
    if (adminPanel) {
        adminPanel.deleteSuccessStory(storyId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function editCampaign(campaignId) {
    if (adminPanel) {
        adminPanel.editCampaign(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function toggleCampaignStatus(campaignId) {
    if (adminPanel) {
        adminPanel.toggleCampaignStatus(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

function completeCampaign(campaignId) {
    if (adminPanel) {
        adminPanel.completeCampaign(campaignId);
    } else {
        console.error('Admin panel not initialized');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    console.log('Admin panel initialized');
    console.log('Global functions available:', {
        reloadCampaignCounts: typeof reloadCampaignCounts,
        editCampaign: typeof editCampaign,
        showAddCampaignModal: typeof showAddCampaignModal
    });
});