// Modern JavaScript for Sevabrata Foundation Website

class SevabrataWebsite {
    constructor() {
        this.init();
        this.loadCampaigns();
        this.loadSuccessStories();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupMobileMenu();
    }

    // Navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section, .hero');

        // Handle navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Update active state
                this.updateActiveNavLink(link);
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateActiveNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                this.animateHamburger(mobileMenuToggle);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.nav-toggle');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        if (mobileMenuToggle) {
            this.animateHamburger(mobileMenuToggle, false);
        }
    }

    animateHamburger(button, isOpen = null) {
        const spans = button.querySelectorAll('span');
        const isActive = isOpen !== null ? isOpen : button.classList.contains('active');
        
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            button.classList.add('active');
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            button.classList.remove('active');
        }
    }

    // Smooth scrolling for all anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section, .card, .story-card, .news-card, .campaign-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Campaign management system
    async loadCampaigns() {
        try {
            console.log('Starting to load campaigns...');
            
            // Check if we're running from file:// protocol (local file testing)
            if (window.location.protocol === 'file:') {
                console.log('File protocol detected, using hardcoded campaign data');
                this.renderCampaigns(this.getFallbackCampaigns());
                return;
            }
            
            // Load all campaign data from the new directory structure
            const [activeCampaigns, stats, categories] = await Promise.all([
                this.loadActiveCampaigns(),
                this.loadStats(),
                this.loadCategories()
            ]);

            console.log('Loaded active campaigns:', activeCampaigns);
            console.log('Loaded stats:', stats);
            console.log('Loaded categories:', categories);

            // Store loaded data for later use
            this.campaignStats = stats;
            this.campaignCategories = categories;
            
            this.renderCampaigns(activeCampaigns);
        } catch (error) {
            console.error('Error loading campaigns:', error);
            // Fallback to hardcoded campaigns if loading fails
            this.renderCampaigns(this.getFallbackCampaigns());
        }
    }

    async loadActiveCampaigns() {
        try {
            console.log('Loading active campaigns from directory...');
            // Load campaigns from active directory
            const activeCampaigns = await this.loadCampaignsFromDirectory('campaigns/active/');
            console.log('Active campaigns loaded from directory:', activeCampaigns);
            return activeCampaigns;
        } catch (error) {
            console.error('Error loading active campaigns:', error);
            return [];
        }
    }

    async loadCampaignsFromDirectory(directory) {
        try {
            // Load the manifest file to get list of campaign files
            const manifestResponse = await fetch(`${directory}manifest.json`);
            if (!manifestResponse.ok) {
                console.error('Failed to load campaigns manifest');
                return [];
            }
            
            const manifest = await manifestResponse.json();
            const campaignFiles = manifest.campaigns || [];
            const campaigns = [];

            // Load each campaign file listed in the manifest
            for (const filename of campaignFiles) {
                try {
                    const response = await fetch(`${directory}${filename}`);
                    if (response.ok) {
                        const campaign = await response.json();
                        // Only include if status is active
                        if (campaign.status === 'active') {
                            campaigns.push(this.transformCampaignData(campaign));
                        }
                    }
                } catch (error) {
                    console.error(`Error loading campaign ${filename}:`, error);
                }
            }

            return campaigns;
        } catch (error) {
            console.error('Error loading campaigns from directory:', error);
            return [];
        }
    }

    async loadStats() {
        try {
            const response = await fetch('campaigns/_stats.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
        return {};
    }

    async loadCategories() {
        try {
            const response = await fetch('campaigns/_categories.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
        return [];
    }

    transformCampaignData(campaignData) {
        // Transform the new campaign data format to match the expected format
        return {
            id: campaignData.id,
            title: campaignData.title,
            description: campaignData.shortDescription,
            fullDescription: campaignData.fullDescription,
            image: campaignData.image,
            targetAmount: campaignData.targetAmount,
            raisedAmount: campaignData.raisedAmount,
            status: campaignData.status,
            urgency: campaignData.urgency,
            patientAge: campaignData.patientDetails?.age,
            medicalCondition: campaignData.patientDetails?.condition,
            hospital: campaignData.patientDetails?.hospital,
            lastUpdated: campaignData.lastUpdated,
            category: campaignData.category,
            timeline: campaignData.timeline,
            updates: campaignData.updates
        };
    }

    async loadSuccessStories() {
        try {
            // Load success stories from the success-stories directory
            const knownStories = ['prakash-heart-surgery.json', 'poltu-heart-transplant.json'];
            const successStories = [];

            for (const filename of knownStories) {
                try {
                    const response = await fetch(`success-stories/${filename}`);
                    if (response.ok) {
                        const story = await response.json();
                        successStories.push(story);
                    }
                } catch (error) {
                    console.error(`Error loading success story ${filename}:`, error);
                }
            }

            this.renderSuccessStories(successStories);
        } catch (error) {
            console.error('Error loading success stories:', error);
        }
    }

    renderSuccessStories(stories) {
        // This method can be used to populate a success stories section if it exists
        // For now, just store the stories for later use
        this.successStories = stories;
        console.log('Success stories loaded:', stories);
    }

    renderCampaigns(campaigns) {
        const container = document.getElementById('campaigns-container');
        if (!container) {
            console.error('Campaigns container not found!');
            return;
        }

        console.log('Rendering campaigns:', campaigns);
        
        if (campaigns.length === 0) {
            container.innerHTML = '<div class="no-campaigns"><p>No active campaigns found.</p></div>';
            return;
        }

        container.innerHTML = campaigns.map(campaign => this.createCampaignCard(campaign)).join('');
        
        // Add event listeners to campaign cards
        this.setupCampaignInteractions();
    }

    createCampaignCard(campaign) {
        const progressPercentage = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);
        const urgencyClass = campaign.urgency === 'high' ? 'urgent' : '';
        
        return `
            <div class="campaign-card ${urgencyClass}" data-campaign-id="${campaign.id}">
                <img src="${campaign.image}" alt="${campaign.title}" class="campaign-image" onerror="this.src='assets/sevalog1crop.jpg'">
                <div class="campaign-content">
                    <h3 class="campaign-title">${campaign.title}</h3>
                    <p class="campaign-description">${campaign.description}</p>
                    
                    <div class="campaign-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="progress-text">
                            <span>₹${this.formatAmount(campaign.raisedAmount)} raised</span>
                            <span>${progressPercentage}%</span>
                        </div>
                        <div class="progress-text">
                            <span>Goal: ₹${this.formatAmount(campaign.targetAmount)}</span>
                            <span>₹${this.formatAmount(campaign.targetAmount - campaign.raisedAmount)} needed</span>
                        </div>
                    </div>
                    
                    <div class="campaign-stats">
                        ${campaign.urgency === 'high' ? '<span class="stat urgent-stat">Urgent</span>' : ''}
                        ${campaign.medicalCondition ? `<span class="stat">${campaign.medicalCondition}</span>` : ''}
                        ${campaign.patientAge ? `<span class="stat">Age ${campaign.patientAge}</span>` : ''}
                    </div>
                    
                    <div class="campaign-actions">
                        <a href="#contribute" class="btn btn-primary campaign-donate-btn">Donate Now</a>
                        <button class="btn btn-secondary campaign-details-btn" data-campaign-id="${campaign.id}">
                            Learn More
                        </button>
                    </div>
                    
                    <div class="campaign-meta">
                        <small>Last updated: ${this.formatDate(campaign.lastUpdated)}</small>
                    </div>
                </div>
            </div>
        `;
    }

    setupCampaignInteractions() {
        // Handle campaign detail buttons
        document.querySelectorAll('.campaign-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const campaignId = e.target.getAttribute('data-campaign-id');
                this.showCampaignDetails(campaignId);
            });
        });

        // Handle donate buttons
        document.querySelectorAll('.campaign-donate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Scroll to contribute section
                document.querySelector('#contribute').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    async showCampaignDetails(campaignId) {
        // Load detailed information from the new directory structure
        const campaignDetails = await this.getCampaignDetails(campaignId);
        this.createCampaignModal(campaignDetails);
    }

    async getCampaignDetails(campaignId) {
        try {
            // Check if we're running from file:// protocol (local file testing)
            if (window.location.protocol === 'file:') {
                console.log('File protocol detected, using fallback campaign details');
                return this.getFallbackCampaignDetails(campaignId);
            }
            
            // Try to find the campaign in different directories
            const directories = ['active', 'completed', 'ended', 'archived'];
            
            for (const directory of directories) {
                try {
                    const response = await fetch(`campaigns/${directory}/${campaignId}.json`);
                    if (response.ok) {
                        const campaignData = await response.json();
                        return {
                            title: campaignData.title,
                            fullStory: campaignData.fullDescription,
                            timeline: campaignData.timeline,
                            updates: campaignData.updates,
                            documents: campaignData.documents,
                            patientDetails: campaignData.patientDetails
                        };
                    }
                } catch (error) {
                    // Continue to next directory
                    continue;
                }
            }
            
            // If not found in any directory, return fallback
            return { 
                title: 'Campaign Details', 
                fullStory: 'Campaign details not available at this time.' 
            };
        } catch (error) {
            console.error('Error loading campaign details:', error);
            return { 
                title: 'Campaign Details', 
                fullStory: 'Error loading campaign details.' 
            };
        }
    }

    getFallbackCampaignDetails(campaignId) {
        // Fallback campaign details for local file testing
        const campaignDetailsMap = {
            "naba-kumar-tripathi-throat-cancer": {
                title: "Naba Kumar Tripathi - Throat cancer patient",
                fullStory: "The annual income of Naba Kumar's family is Rs. 36000/-. Two surgeries, prolonged intravenous chemotherapy, and brief radiation therapy (which could not be tolerated) have been completed free of cost. When the patient was finding it difficult to travel repeatedly between Mednipur and Pondicherry, the patient has shifted to treatment from the Department of Oncology/cancer in Mednipur Medical College.\n\nIn Mednipur, doctors have put him on oral chemotherapy along with a set of other medications to control the side effects. He is also on protein supplements such as proteinex for nutrition since he cannot chew well. While treatment at JIPMER was free, it is not free at Mednipur Medical College and amounts to nearly Rs. 7100/- per month.\n\nHe is also to soon undergo two scans which include a PET CT scan (cost ranging from Rs. 15K to Rs. 35 K) to monitor the spread of the cancer and the effectiveness of medicines being given. Paying such a large amount in one shot for this scan is seeming impossible for the patient's family.\n\nWhile the school helps in bearing some cost of the education of his daughters, they are still understandably in severe need for funds given their background and annual income. We aim to raise funds for this scan as well as to bear the cost of some months of treatment.",
                timeline: [
                    {
                        date: "2025-06-02",
                        event: "Campaign launched",
                        description: "Fundraising campaign started for ongoing treatment costs"
                    }
                ],
                patientDetails: {
                    name: "Naba Kumar Tripathi",
                    age: "43",
                    location: "West Bengal, India",
                    condition: "Throat cancer",
                    hospital: "Mednipur Medical College"
                }
            }
        };

        return campaignDetailsMap[campaignId] || {
            title: 'Campaign Details',
            fullStory: 'Campaign details not available at this time.'
        };
    }

    createCampaignModal(details) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.campaign-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'campaign-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${details.title}</h2>
                    </div>
                    <div class="modal-body">
                        <p>${details.fullStory.replace(/\n\s*/g, '</p><p>')}</p>
                        ${details.timeline ? this.createTimeline(details.timeline) : ''}
                    </div>
                    <div class="modal-actions">
                        <a href="#contribute" class="btn btn-primary">Donate Now</a>
                        <button class="btn btn-secondary modal-close">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .campaign-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    padding: 0;
                }
                
                .modal-header {
                    padding: 2rem 2rem 1rem 2rem;
                    border-bottom: 1px solid #eee;
                }
                
                .modal-title {
                    margin: 0;
                    font-size: 1.5rem;
                    line-height: 1.3;
                    color: #333;
                }
                
                .modal-body {
                    padding: 1rem 2rem 2rem 2rem;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    padding: 0 2rem 2rem 2rem;
                    border-top: 1px solid #eee;
                    padding-top: 1.5rem;
                }
                
                .modal-actions .btn {
                    min-width: 120px;
                    text-align: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 1rem;
                    }
                    
                    .modal-header {
                        padding: 1.5rem 1.5rem 1rem 1.5rem;
                    }
                    
                    .modal-title {
                        font-size: 1.25rem;
                    }
                    
                    .modal-body {
                        padding: 1rem 1.5rem 1.5rem 1.5rem;
                    }
                    
                    .modal-actions {
                        flex-direction: column;
                        padding: 0 1.5rem 1.5rem 1.5rem;
                    }
                }
            </style>
        `;

        // Append styles and modal to body
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        // Setup modal close functionality
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.remove();
            });
        });

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    createTimeline(timeline) {
        return `
            <div class="campaign-timeline">
                <h3>Campaign Timeline</h3>
                ${timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-date">${this.formatDate(item.date)}</div>
                        <div class="timeline-event">${item.event}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Utility functions
    formatAmount(amount) {
        return new Intl.NumberFormat('en-IN').format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Fallback campaign data for local file testing
    getFallbackCampaigns() {
        return [
            {
                id: "naba-kumar-tripathi-throat-cancer",
                title: "Naba Kumar Tripathi - Throat cancer patient",
                description: "Supporting throat cancer treatment for Naba Kumar Tripathi",
                fullDescription: "The annual income of Naba Kumar's family is Rs. 36000/-. Two surgeries, prolonged intravenous chemotherapy, and brief radiation therapy (which could not be tolerated) have been completed free of cost. When the patient was finding it difficult to travel repeatedly between Mednipur and Pondicherry, the patient has shifted to treatment from the Department of Oncology/cancer in Mednipur Medical College. In Mednipur, doctors have put him on oral chemotherapy along with a set of other medications to control the side effects. He is also on protein supplements such as proteinex for nutrition since he cannot chew well. While treatment at JIPMER was free, it is not free at Mednipur Medical College and amounts to nearly Rs. 7100/- per month. He is also to soon undergo two scans which include a PET CT scan (cost ranging from Rs. 15K to Rs. 35 K) to monitor the spread of the cancer and the effectiveness of medicines being given. Paying such a large amount in one shot for this scan is seeming impossible for the patient's family. While the school helps in bearing some cost of the education of his daughters, they are still understandably in severe need for funds given their background and annual income. We aim to raise funds for this scan as well as to bear the cost of some months of treatment",
                image: "",
                targetAmount: 70000,
                raisedAmount: 57000,
                status: "active",
                urgency: "medium",
                patientAge: "43",
                medicalCondition: "Throat cancer",
                hospital: "Mednipur Medical College",
                lastUpdated: "2025-06-02",
                category: "medical"
            }
        ];
    }

    // Public API for external campaign management
    addCampaign(campaign) {
        // This would integrate with a backend API in a real implementation
        console.log('Adding new campaign:', campaign);
        this.loadCampaigns(); // Reload campaigns
    }

    updateCampaign(campaignId, updates) {
        // This would integrate with a backend API in a real implementation
        console.log('Updating campaign:', campaignId, updates);
        this.loadCampaigns(); // Reload campaigns
    }

    deleteCampaign(campaignId) {
        // This would integrate with a backend API in a real implementation
        console.log('Deleting campaign:', campaignId);
        this.loadCampaigns(); // Reload campaigns
    }
}

// Form handling for contact and contributions
class FormHandler {
    constructor() {
        this.setupFormHandling();
    }

    setupFormHandling() {
        // Handle any forms that might be added later
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.contact-form, .contribution-form')) {
                this.handleFormSubmission(e);
            }
        });
    }

    handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Show loading state
        this.showFormLoading(form);
        
        // Simulate form submission (in real implementation, this would be an API call)
        setTimeout(() => {
            this.showFormSuccess(form);
        }, 2000);
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }
    }

    showFormSuccess(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.backgroundColor = '#28a745';
        }
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }
        }, 3000);
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.optimizeScrollListeners();
    }

    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    optimizeScrollListeners() {
        // Throttle scroll events for better performance
        let ticking = false;

        function updateScrollPosition() {
            // Custom scroll handling can be added here
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const website = new SevabrataWebsite();
    const formHandler = new FormHandler();
    const performanceOptimizer = new PerformanceOptimizer();

    // Make website instance globally available for debugging
    window.SevabrataWebsite = website;

    // Add some additional CSS for campaign cards
    const additionalStyles = `
        <style>
            .campaign-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .campaign-meta {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #eee;
            }
            
            .campaign-meta small {
                color: #666;
                font-size: 0.875rem;
            }
            
            .urgent-stat {
                background-color: #dc3545 !important;
                color: white !important;
            }
            
            .campaign-card.urgent {
                border-left: 4px solid #dc3545;
            }
            
            .campaign-timeline {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #eee;
            }
            
            .timeline-item {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .timeline-date {
                font-weight: 600;
                color: var(--primary-color);
                min-width: 120px;
            }
            
            .timeline-event {
                flex: 1;
                color: #666;
            }
            
            @media (max-width: 767px) {
                .campaign-actions {
                    flex-direction: column;
                }
                
                .timeline-item {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .timeline-date {
                    min-width: auto;
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', additionalStyles);

    console.log('Sevabrata Foundation website initialized successfully!');
});