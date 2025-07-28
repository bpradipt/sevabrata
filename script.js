// Modern JavaScript for Sevabrata Foundation Website

class SevabrataWebsite {
    constructor() {
        this.init();
        this.loadCampaigns();
        this.loadSuccessStories();
        this.loadNews();
        this.loadAnnualReports();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupMobileMenu();
        this.setupCampaignTabs();
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
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle clicked');
                mobileMenu.classList.toggle('active');
                console.log('Menu active class:', mobileMenu.classList.contains('active'));
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

    // Campaign tabs functionality
    setupCampaignTabs() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                const activeTab = e.target.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Load campaigns based on tab
                if (activeTab === 'active') {
                    this.loadCampaigns();
                } else if (activeTab === 'completed') {
                    this.loadCompletedCampaigns();
                }
            }
        });
    }

    // Campaign management system
    async loadCampaigns() {
        try {
            console.log('Starting to load campaigns...');
            
            // Note: file:// protocol is not supported due to CORS restrictions
            // Use a web server for local development: python3 -m http.server 8000
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected! Please use a web server for local development.');
                console.error('Run: python3 -m http.server 8000');
                this.renderCampaigns([]);
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
            // Show empty state if loading fails
            this.renderCampaigns([]);
        }
    }

    async loadCompletedCampaigns() {
        try {
            console.log('Starting to load completed campaigns...');
            console.log('Current protocol:', window.location.protocol);
            
            // Note: file:// protocol is not supported due to CORS restrictions
            // Use a web server for local development: python3 -m http.server 8000
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected! Please use a web server for local development.');
                console.error('Run: python3 -m http.server 8000');
                this.renderCampaigns([], 'completed');
                return;
            }
            
            // Load completed campaigns from directory
            console.log('Loading completed campaigns from campaigns/completed/ directory...');
            const completedCampaigns = await this.loadCampaignsFromDirectory('campaigns/completed/');
            console.log('Completed campaigns loaded successfully:', completedCampaigns);
            console.log('Number of completed campaigns:', completedCampaigns.length);
            
            this.renderCampaigns(completedCampaigns, 'completed');
        } catch (error) {
            console.error('Error loading completed campaigns:', error);
            // Show empty state if loading fails
            this.renderCampaigns([], 'completed');
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
                        campaigns.push(this.transformCampaignData(campaign));
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
            console.log('Loading success stories from directory...');
            
            // Note: file:// protocol is not supported due to CORS restrictions
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected! Please use a web server for local development.');
                console.error('Run: python3 -m http.server 8000');
                this.renderSuccessStories([]);
                return;
            }
            
            // Load success stories using manifest file
            const manifestResponse = await fetch('success-stories/manifest.json');
            if (!manifestResponse.ok) {
                console.error('Failed to load success stories manifest');
                this.renderSuccessStories([]);
                return;
            }
            
            const manifest = await manifestResponse.json();
            const storyFiles = manifest.stories || [];
            const successStories = [];

            // Load each story file listed in the manifest
            for (const filename of storyFiles) {
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

            console.log('Success stories loaded:', successStories);
            this.renderSuccessStories(successStories);
        } catch (error) {
            console.error('Error loading success stories:', error);
            this.renderSuccessStories([]);
        }
    }

    renderSuccessStories(stories) {
        const container = document.getElementById('success-stories-container');
        if (!container) {
            console.error('Success stories container not found!');
            return;
        }

        console.log('Rendering success stories:', stories);
        
        if (stories.length === 0) {
            container.innerHTML = '<div class="no-stories"><p>No success stories available at this time.</p></div>';
            return;
        }

        // Store the stories for later use
        this.successStories = stories;
        
        // Render story cards
        container.innerHTML = stories.map(story => this.createSuccessStoryCard(story)).join('');
        
        // Add click event listeners to success story cards
        this.setupSuccessStoryInteractions();
    }

    createSuccessStoryCard(story) {
        // Format the amount raised
        const amountRaised = story.amountRaised ? this.formatAmount(story.amountRaised) : 'Amount not specified';
        
        // Create story subtitle with treatment and year
        const subtitle = `${story.treatment} - ${story.year}`;
        
        // Truncate description for card display
        const truncatedDescription = story.description.length > 150 
            ? story.description.substring(0, 150) + '...' 
            : story.description;
        
        return `
            <div class="story-card clickable" data-story-id="${story.id}" role="button" tabindex="0">
                <div class="story-image">
                    <img src="${story.image}" alt="${story.patientName}" onerror="this.src='assets/sevalog1crop.jpg'">
                </div>
                <div class="story-content">
                    <h3>${story.patientName}</h3>
                    <p class="story-subtitle">${subtitle}</p>
                    <p>${truncatedDescription}</p>
                    <div class="story-stats">
                        <span class="stat">₹${amountRaised}</span>
                        <span class="stat">${story.treatment}</span>
                        <span class="stat">${story.year}</span>
                    </div>
                    <div class="story-actions">
                        <span class="view-details-hint">Click to view full story</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCampaigns(campaigns, type = 'active') {
        const container = document.getElementById('campaigns-container');
        if (!container) {
            console.error('Campaigns container not found!');
            return;
        }

        console.log('Rendering campaigns:', campaigns, 'Type:', type);
        
        if (campaigns.length === 0) {
            const message = type === 'completed' ? 'No completed campaigns found.' : 'No active campaigns found.';
            container.innerHTML = `<div class="no-campaigns"><p>${message}</p></div>`;
            return;
        }

        container.innerHTML = campaigns.map(campaign => this.createCampaignCard(campaign, type)).join('');
        
        // Add event listeners to campaign cards
        this.setupCampaignInteractions();
    }

    createCampaignCard(campaign, type = 'active') {
        const progressPercentage = Math.round((campaign.raisedAmount / campaign.targetAmount) * 100);
        const urgencyClass = campaign.urgency === 'high' ? 'urgent' : '';
        const completedClass = type === 'completed' ? 'completed' : '';
        const isCompleted = type === 'completed';
        const goalExceeded = progressPercentage >= 100;
        
        // Success badge for completed campaigns
        const successBadge = isCompleted ? 
            `<span class="success-badge ${goalExceeded ? 'goal-exceeded' : ''}">${goalExceeded ? 'Goal Exceeded' : 'Completed'}</span>` : '';
        
        // Different actions for completed vs active campaigns
        const campaignActions = isCompleted ? 
            `<div class="campaign-actions">
                <button class="btn btn-secondary campaign-details-btn" data-campaign-id="${campaign.id}">
                    View Details
                </button>
            </div>` :
            `<div class="campaign-actions">
                <a href="#contribute" class="btn btn-primary campaign-donate-btn">Donate Now</a>
                <button class="btn btn-secondary campaign-details-btn" data-campaign-id="${campaign.id}">
                    View Details
                </button>
            </div>`;
        
        // Progress text for completed campaigns
        const progressText = isCompleted ?
            `<div class="progress-text">
                <span>₹${this.formatAmount(campaign.raisedAmount)} raised of ₹${this.formatAmount(campaign.targetAmount)}</span>
                <span>${progressPercentage}%</span>
            </div>` :
            `<div class="progress-text">
                <span>₹${this.formatAmount(campaign.raisedAmount)} raised</span>
                <span>${progressPercentage}%</span>
            </div>
            <div class="progress-text">
                <span>Goal: ₹${this.formatAmount(campaign.targetAmount)}</span>
                <span>₹${this.formatAmount(Math.max(0, campaign.targetAmount - campaign.raisedAmount))} needed</span>
            </div>`;
        
        return `
            <div class="campaign-card ${urgencyClass} ${completedClass}" data-campaign-id="${campaign.id}">
                <img src="${campaign.image}" alt="${campaign.title}" class="campaign-image" onerror="this.src='assets/sevalog1crop.jpg'">
                <div class="campaign-content">
                    <h3 class="campaign-title">${campaign.title}${successBadge}</h3>
                    <p class="campaign-description">${campaign.description}</p>
                    
                    <div class="campaign-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                        </div>
                        ${progressText}
                    </div>
                    
                    <div class="campaign-stats">
                        ${campaign.urgency === 'high' && !isCompleted ? '<span class="stat urgent-stat">Urgent</span>' : ''}
                        ${campaign.medicalCondition ? `<span class="stat">${campaign.medicalCondition}</span>` : ''}
                        ${campaign.patientAge ? `<span class="stat">Age ${campaign.patientAge}</span>` : ''}
                        ${isCompleted ? `<span class="stat">Completed ${this.formatDate(campaign.lastUpdated)}</span>` : ''}
                    </div>
                    
                    ${campaignActions}
                    
                    <div class="campaign-meta">
                        <small>${isCompleted ? 'Completed:' : 'Last updated:'} ${this.formatDate(campaign.lastUpdated)}</small>
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

    setupSuccessStoryInteractions() {
        // Handle success story card clicks
        document.querySelectorAll('.story-card.clickable').forEach(card => {
            // Click event
            card.addEventListener('click', (e) => {
                const storyId = e.currentTarget.getAttribute('data-story-id');
                this.showSuccessStoryDetails(storyId);
            });

            // Keyboard event for accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const storyId = e.currentTarget.getAttribute('data-story-id');
                    this.showSuccessStoryDetails(storyId);
                }
            });

            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.cursor = 'pointer';
            });
        });
    }

    showSuccessStoryDetails(storyId) {
        const story = this.successStories.find(s => s.id === storyId);
        if (story) {
            this.createSuccessStoryModal(story);
        }
    }

    createSuccessStoryModal(story) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.success-story-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Format the amount raised
        const amountRaised = story.amountRaised ? this.formatAmount(story.amountRaised) : 'Amount not specified';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'success-story-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${story.patientName}'s Success Story</h2>
                    </div>
                    <div class="modal-body">
                        <div class="story-hero">
                            <img src="${story.image}" alt="${story.patientName}" onerror="this.src='assets/sevalog1crop.jpg'">
                            <div class="story-summary">
                                <div class="story-detail">
                                    <strong>Condition:</strong> ${story.condition}
                                </div>
                                <div class="story-detail">
                                    <strong>Treatment:</strong> ${story.treatment}
                                </div>
                                <div class="story-detail">
                                    <strong>Hospital:</strong> ${story.hospital}
                                </div>
                                <div class="story-detail">
                                    <strong>Amount Raised:</strong> ₹${amountRaised}
                                </div>
                                <div class="story-detail">
                                    <strong>Year:</strong> ${story.year}
                                </div>
                                <div class="story-detail">
                                    <strong>Outcome:</strong> ${story.outcome}
                                </div>
                            </div>
                        </div>
                        <div class="story-description">
                            <h3>Full Story</h3>
                            <p>${story.description}</p>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary modal-close">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .success-story-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .success-story-modal .modal-overlay {
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
                
                .success-story-modal .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    padding: 0;
                }
                
                .story-hero {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                
                .story-hero img {
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    flex-shrink: 0;
                }
                
                .story-summary {
                    flex: 1;
                }
                
                .story-detail {
                    margin-bottom: 0.75rem;
                    padding: 0.5rem;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }
                
                .story-detail strong {
                    color: var(--primary-color);
                    display: inline-block;
                    min-width: 100px;
                }
                
                .story-description h3 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                
                .story-description p {
                    line-height: 1.6;
                    color: #333;
                }
                
                @media (max-width: 768px) {
                    .story-hero {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .story-hero img {
                        width: 150px;
                        height: 150px;
                        align-self: center;
                    }
                    
                    .story-detail strong {
                        min-width: auto;
                        display: block;
                        margin-bottom: 0.25rem;
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

    async loadNews() {
        try {
            console.log('Loading news articles...');
            
            // Note: file:// protocol is not supported due to CORS restrictions
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected! Please use a web server for local development.');
                console.error('Run: python3 -m http.server 8000');
                this.renderNews([]);
                return;
            }
            
            // Load news articles using manifest file
            const manifestResponse = await fetch('news/manifest.json');
            if (!manifestResponse.ok) {
                console.error('Failed to load news manifest');
                this.renderNews([]);
                return;
            }
            
            const manifest = await manifestResponse.json();
            const articleFiles = manifest.articles || [];
            const newsArticles = [];

            // Load each article file listed in the manifest
            for (const filename of articleFiles) {
                try {
                    const response = await fetch(`news/${filename}`);
                    if (response.ok) {
                        const article = await response.json();
                        newsArticles.push(article);
                    }
                } catch (error) {
                    console.error(`Error loading news article ${filename}:`, error);
                }
            }

            console.log('News articles loaded:', newsArticles);
            this.newsArticles = newsArticles;
            this.renderNews(newsArticles);
        } catch (error) {
            console.error('Error loading news:', error);
            this.renderNews([]);
        }
    }

    renderNews(articles) {
        const container = document.getElementById('news-container');
        if (!container) {
            console.error('News container not found!');
            return;
        }

        console.log('Rendering news articles:', articles);
        
        if (articles.length === 0) {
            container.innerHTML = '<div class="no-news"><p>No news articles available at this time.</p></div>';
            return;
        }

        // Render news cards
        container.innerHTML = articles.map(article => this.createNewsCard(article)).join('');
        
        // Add click event listeners to news cards
        this.setupNewsInteractions();
    }

    createNewsCard(article) {
        // Handle the current JSON structure with single image field
        const imageUrl = article.image || 'assets/sevalog1crop.jpg';
        
        // Handle date field (could be publishedDate or publishDate)
        const dateString = article.publishedDate || article.publishDate;
        const displayDate = dateString || 'Date not available';
            
        return `
            <div class="news-card">
                <div class="news-image clickable" data-news-id="${article.id}" role="button" tabindex="0" aria-label="Expand image for ${article.title}">
                    <img src="${imageUrl}" alt="${article.title}" onerror="this.src='assets/sevalog1crop.jpg'">
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="news-meta">
                        <span class="news-date">${displayDate}</span>
                        <span class="news-source">${article.source || 'Sevabrata Foundation'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupNewsInteractions() {
        // Handle news image clicks for expansion
        document.querySelectorAll('.news-image.clickable').forEach(imageContainer => {
            // Click event
            imageContainer.addEventListener('click', (e) => {
                const newsId = e.currentTarget.getAttribute('data-news-id');
                this.expandNewsImage(newsId);
            });

            // Keyboard event for accessibility
            imageContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const newsId = e.currentTarget.getAttribute('data-news-id');
                    this.expandNewsImage(newsId);
                }
            });

            // Add hover effect
            imageContainer.addEventListener('mouseenter', () => {
                imageContainer.style.cursor = 'pointer';
            });
        });
    }

    expandNewsImage(newsId) {
        const article = this.newsArticles.find(a => a.id === newsId);
        if (article) {
            this.createImageExpansionModal(article);
        }
    }

    createImageExpansionModal(article) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.image-expansion-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-expansion-modal';
        const imageUrl = article.image || 'assets/sevalog1crop.jpg';
            
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content image-modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${article.title}</h3>
                        <button class="modal-close-btn" aria-label="Close image">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img src="${imageUrl}" alt="${article.title}" class="expanded-image" onerror="this.src='assets/sevalog1crop.jpg'">
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .image-expansion-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .image-expansion-modal .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                
                .image-modal {
                    background: white;
                    border-radius: 8px;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }
                
                .image-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    flex-shrink: 0;
                }
                
                .image-modal .modal-title {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #333;
                    flex: 1;
                    padding-right: 1rem;
                }
                
                .modal-close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    transition: background-color 0.2s ease;
                    line-height: 1;
                }
                
                .modal-close-btn:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                    color: #333;
                }
                
                .image-modal .modal-body {
                    flex: 1;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f9fa;
                    min-height: 300px;
                }
                
                .expanded-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    display: block;
                }
                
                @media (max-width: 768px) {
                    .image-modal .modal-header {
                        padding: 0.75rem 1rem;
                    }
                    
                    .image-modal .modal-title {
                        font-size: 1rem;
                    }
                    
                    .modal-close-btn {
                        font-size: 1.25rem;
                    }
                }
            </style>
        `;

        // Append styles and modal to body
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        // Setup modal close functionality
        modal.querySelector('.modal-close-btn').addEventListener('click', () => {
            modal.remove();
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

    async loadAnnualReports() {
        try {
            // Static reports data - in a real implementation, this could be loaded from a manifest file
            const annualReports = [
                {
                    id: 'sevabrata-activity-report-2019-2024',
                    title: 'Sevabrata Activity Report 2019-2024',
                    description: 'Comprehensive report covering our activities, impact, and achievements from 2019 to 2024. Includes detailed financial information, success stories, and future plans.',
                    fileName: 'Sevabrata Activity Report 2019_2024_v03.pdf',
                    filePath: 'annual-reports/Sevabrata%20Activity%20Report%202019_2024_v03.pdf',
                    fileSize: '1.4 MB',
                    publishDate: '2024-12-01',
                    year: '2019-2024',
                    coverImage: 'assets/report-cover-2019-2024.jpg', // fallback to default if not found
                    pages: 45,
                    highlights: [
                        'Helped 125+ families with medical assistance',
                        'Raised ₹85+ lakhs for critical treatments',
                        'Supported 40+ students through SAS program',
                        'Conducted 15+ awareness sessions'
                    ]
                }
            ];

            this.annualReports = annualReports;
            this.renderAnnualReports(annualReports);
        } catch (error) {
            console.error('Error loading annual reports:', error);
            this.renderAnnualReports([]);
        }
    }

    renderAnnualReports(reports) {
        const container = document.getElementById('reports-container');
        if (!container) {
            console.error('Annual reports container not found!');
            return;
        }

        if (reports.length === 0) {
            container.innerHTML = '<div class="no-reports"><p>No annual reports available at this time.</p></div>';
            return;
        }

        // Render report cards
        container.innerHTML = reports.map(report => this.createReportCard(report)).join('');
        
        // Add click event listeners to download buttons
        this.setupReportInteractions();
    }

    createReportCard(report) {
        return `
            <div class="report-card">
                <div class="report-content">
                    <h3>${report.title}</h3>
                    <div class="report-actions">
                        <button class="btn btn-primary download-btn" data-report-path="${report.filePath}" data-report-name="${report.fileName}">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                        <button class="btn btn-secondary preview-btn" data-report-path="${report.filePath}" data-report-title="${report.title}">
                            <i class="fas fa-eye"></i>
                            Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupReportInteractions() {
        // Handle download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportPath = e.currentTarget.getAttribute('data-report-path');
                const reportName = e.currentTarget.getAttribute('data-report-name');
                this.downloadReport(reportPath, reportName);
            });
        });

        // Handle preview buttons
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportPath = e.currentTarget.getAttribute('data-report-path');
                const reportTitle = e.currentTarget.getAttribute('data-report-title');
                this.previewReport(reportPath, reportTitle);
            });
        });
    }

    downloadReport(reportPath, reportName) {
        try {
            // Create a temporary link element to trigger download
            const link = document.createElement('a');
            link.href = reportPath;
            link.download = reportName;
            link.style.display = 'none';
            
            // Add to DOM, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log(`Downloaded report: ${reportName}`);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Sorry, there was an error downloading the report. Please try again later.');
        }
    }

    previewReport(reportPath, reportTitle) {
        try {
            // Open PDF in a new window for preview
            const previewWindow = window.open(reportPath, '_blank');
            
            // Fallback if popup is blocked
            if (!previewWindow || previewWindow.closed || typeof previewWindow.closed == 'undefined') {
                // If popup is blocked, show a modal with iframe
                this.createPDFPreviewModal(reportPath, reportTitle);
            }
        } catch (error) {
            console.error('Error previewing report:', error);
            alert('Sorry, there was an error previewing the report. Please try downloading it instead.');
        }
    }

    createPDFPreviewModal(reportPath, reportTitle) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.pdf-preview-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'pdf-preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content pdf-modal">
                    <div class="modal-header">
                        <h2 class="modal-title">${reportTitle}</h2>
                        <button class="modal-close-btn" aria-label="Close preview">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <iframe src="${reportPath}" width="100%" height="100%" frameborder="0">
                            <p>Your browser does not support PDFs. 
                               <a href="${reportPath}" target="_blank">Download the PDF</a> instead.
                            </p>
                        </iframe>
                    </div>
                    <div class="modal-actions">
                        <a href="${reportPath}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i>
                            Open in New Tab
                        </a>
                        <button class="btn btn-secondary modal-close">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .pdf-preview-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                .pdf-preview-modal .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                
                .pdf-modal {
                    max-width: 90vw;
                    max-height: 90vh;
                    width: 900px;
                    height: 700px;
                    display: flex;
                    flex-direction: column;
                }
                
                .pdf-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #eee;
                    flex-shrink: 0;
                }
                
                .modal-close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }
                
                .modal-close-btn:hover {
                    background-color: #f0f0f0;
                    color: #333;
                }
                
                .pdf-modal .modal-body {
                    flex: 1;
                    padding: 0;
                    overflow: hidden;
                }
                
                .pdf-modal iframe {
                    border: none;
                    background: white;
                }
                
                .pdf-modal .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #eee;
                    flex-shrink: 0;
                }
                
                @media (max-width: 768px) {
                    .pdf-modal {
                        width: 95vw;
                        height: 85vh;
                    }
                    
                    .pdf-modal .modal-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        // Append styles and modal to body
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        // Setup modal close functionality
        modal.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
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

    async showCampaignDetails(campaignId) {
        // Load detailed information from the new directory structure
        const campaignDetails = await this.getCampaignDetails(campaignId);
        // Check if campaign is completed by looking for it in completed directory
        const isCompleted = await this.isCampaignCompleted(campaignId);
        this.createCampaignModal(campaignDetails, isCompleted);
    }

    async isCampaignCompleted(campaignId) {
        try {
            // Check if campaign exists in completed directory
            const response = await fetch(`campaigns/completed/${campaignId}.json`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async getCampaignDetails(campaignId) {
        try {
            // Note: file:// protocol is not supported due to CORS restrictions
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected! Campaign details cannot be loaded.');
                console.error('Use a web server for local development: python3 -m http.server 8000');
                return { 
                    title: 'Web Server Required', 
                    fullStory: 'Campaign details cannot be loaded from file:// protocol. Please use a web server for local development. Run: python3 -m http.server 8000' 
                };
            }
            
            // Try to find the campaign in different directories
            const directories = ['active', 'completed'];
            
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
            
            // If not found in any directory, return error message
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


    createCampaignModal(details, isCompleted = false) {
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
                        <h2 class="modal-title">
                            ${details.title}
                            ${isCompleted ? '<span class="success-badge" style="margin-left: 0.5rem;">Completed</span>' : ''}
                        </h2>
                    </div>
                    <div class="modal-body">
                        <p>${details.fullStory.replace(/\n\s*/g, '</p><p>')}</p>
                        ${details.timeline ? this.createTimeline(details.timeline) : ''}
                    </div>
                    <div class="modal-actions">
                        ${isCompleted ? 
                            `<button class="btn btn-secondary modal-close">Close</button>` :
                            `<a href="#contribute" class="btn btn-primary">Donate Now</a>
                             <button class="btn btn-secondary modal-close">Close</button>`
                        }
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
                        <div class="timeline-content">
                            <div class="timeline-event">${item.event}</div>
                            ${item.description ? `<div class="timeline-description">${item.description}</div>` : ''}
                        </div>
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
            .campaigns-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                max-width: 100%;
            }
            
            /* Prevent single campaign cards from becoming too wide */
            .campaigns-grid:has(.campaign-card:only-child) .campaign-card,
            .campaigns-grid .campaign-card:only-child {
                max-width: 400px;
                margin: 0 auto;
            }
            
            /* Alternative for browsers that don't support :has() */
            .campaigns-grid .campaign-card:first-child:last-child {
                max-width: 400px;
                margin: 0 auto;
            }
            
            .campaigns-tabs {
                display: flex;
                gap: 0;
                margin-bottom: 2rem;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .tab-button {
                background: none;
                border: none;
                padding: 1rem 2rem;
                font-size: 1rem;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                color: #666;
                font-weight: 500;
            }
            
            .tab-button:hover {
                color: var(--primary-color);
                background-color: rgba(255, 107, 53, 0.05);
            }
            
            .tab-button.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
                background-color: rgba(255, 107, 53, 0.1);
            }
            
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
            
            .campaign-card.completed {
                border-left: 4px solid #28a745;
                opacity: 0.95;
            }
            
            .campaign-card {
                overflow: hidden;
                position: relative;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .campaign-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }
            
            .campaign-card * {
                max-width: 100%;
                box-sizing: border-box;
            }
            
            .campaign-card img {
                max-width: 100%;
                max-height: 200px;
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            
            .campaign-content {
                padding: 1.5rem;
                width: 100%;
                max-width: 100%;
            }
            
            .campaign-title {
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
                line-height: 1.4;
                margin-bottom: 1rem;
            }
            
            .campaign-description {
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.5;
                margin-bottom: 1rem;
            }
            
            .success-badge {
                background-color: #28a745;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                margin-left: 0.5rem;
            }
            
            .goal-exceeded {
                background-color: #17a2b8;
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
            
            .timeline-content {
                flex: 1;
            }
            
            .timeline-event {
                color: #666;
                font-weight: 500;
            }
            
            .timeline-description {
                color: #555;
                margin-top: 0.5rem;
                font-size: 0.9rem;
                line-height: 1.4;
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
                
                /* Mobile single card layout fixes */
                .campaigns-grid .campaign-card:first-child:last-child {
                    max-width: 100%;
                    margin: 0;
                }
                
                .campaigns-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .campaign-card {
                    max-width: 100%;
                    width: 100%;
                }
            }
            
            /* Clickable card styles */
            .clickable {
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .clickable:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }
            
            .clickable:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
            
            .story-card.clickable {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .news-card.clickable {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .stories-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                max-width: 100%;
            }
            
            .story-card {
                overflow: hidden;
                position: relative;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }
            
            .story-card .story-image img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            
            .story-card .story-content {
                padding: 1.5rem;
            }
            
            .story-subtitle {
                color: var(--primary-color);
                font-weight: 500;
                margin-bottom: 0.5rem;
            }
            
            .story-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .story-stats .stat {
                background-color: #f8f9fa;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.875rem;
                color: #666;
            }
            
            .story-actions, .news-actions {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #eee;
            }
            
            .news-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
                max-width: 100%;
            }
            
            .news-card {
                overflow: hidden;
                position: relative;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }
            
            .news-image {
                width: 100%;
                height: 200px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f8f9fa;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .news-image:hover {
                transform: translateY(-2px);
            }
            
            .news-image::after {
                content: '🔍';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.5rem;
                border-radius: 50%;
                font-size: 1.2rem;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .news-image:hover::after {
                opacity: 1;
            }
            
            .news-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                display: block;
                transition: filter 0.3s ease;
            }
            
            .news-image:hover img {
                filter: brightness(0.8);
            }
            
            .news-card .news-content {
                padding: 1.5rem;
            }
            
            /* Annual Reports Styles */
            .reports-content {
                margin-top: 2rem;
            }
            
            .reports-intro {
                text-align: center;
                margin-bottom: 3rem;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .reports-intro p {
                font-size: 1.1rem;
                line-height: 1.6;
                color: #666;
            }
            
            .reports-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                max-width: 100%;
            }
            
            .report-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                text-align: center;
                padding: 2rem;
            }
            
            .report-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            }
            
            .report-image {
                position: relative;
                height: 200px;
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .report-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .report-overlay {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.9);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: #333;
            }
            
            .report-overlay i {
                color: #dc3545;
                font-size: 1rem;
            }
            
            .report-content h3 {
                margin: 0 0 1.5rem 0;
                color: #333;
                font-size: 1.3rem;
                line-height: 1.3;
            }
            
            .report-year {
                color: var(--primary-color);
                font-weight: 600;
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            
            .report-description {
                color: #666;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .report-highlights {
                margin-bottom: 1.5rem;
            }
            
            .report-highlights h4 {
                margin: 0 0 0.75rem 0;
                color: #333;
                font-size: 1rem;
            }
            
            .report-highlights ul {
                margin: 0;
                padding-left: 1rem;
                list-style-type: none;
            }
            
            .report-highlights li {
                position: relative;
                padding-left: 1rem;
                margin-bottom: 0.5rem;
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .report-highlights li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #28a745;
                font-weight: bold;
            }
            
            .report-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-top: 1rem;
                border-top: 1px solid #eee;
                font-size: 0.875rem;
                color: #666;
            }
            
            .report-actions {
                display: flex;
                gap: 1rem;
            }
            
            .report-actions .btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                font-size: 0.9rem;
                text-decoration: none;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .report-actions .btn-primary {
                background-color: var(--primary-color);
                color: white;
            }
            
            .report-actions .btn-primary:hover {
                background-color: #e55730;
                transform: translateY(-1px);
            }
            
            .report-actions .btn-secondary {
                background-color: #f8f9fa;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .report-actions .btn-secondary:hover {
                background-color: #e9ecef;
                transform: translateY(-1px);
            }
            
            .no-reports {
                text-align: center;
                padding: 3rem;
                color: #666;
            }
            
            @media (max-width: 767px) {
                .stories-grid, .news-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .news-image {
                    height: 180px;
                }
                
                .news-card .news-content {
                    padding: 1rem;
                }
                
                .news-card h3 {
                    font-size: 1.1rem;
                    line-height: 1.3;
                }
                
                .story-card, .news-card {
                    max-width: 100%;
                    width: 100%;
                }
                
                .reports-grid {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                .report-content {
                    padding: 1.5rem;
                }
                
                .report-meta {
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-start;
                }
                
                .report-actions {
                    flex-direction: column;
                }
                
                .reports-intro {
                    margin-bottom: 2rem;
                }
                
                /* Tablet responsive styles */
                @media (max-width: 1024px) and (min-width: 768px) {
                    .news-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }
                    
                    .news-image {
                        height: 190px;
                    }
                }
                
                /* Small mobile responsive styles */
                @media (max-width: 480px) {
                    .news-image {
                        height: 160px;
                    }
                    
                    .news-card .news-content {
                        padding: 0.75rem;
                    }
                    
                    .news-card h3 {
                        font-size: 1rem;
                        margin-bottom: 0.5rem;
                    }
                    
                    .news-card p {
                        font-size: 0.9rem;
                        line-height: 1.4;
                    }
                    
                    .news-meta {
                        font-size: 0.8rem;
                    }
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', additionalStyles);

    console.log('Sevabrata Foundation website initialized successfully!');
});