// Modern JavaScript for Sevabrata Foundation Website

class SevabrataWebsite {
    constructor() {
        this.init();
        this.loadCampaigns();
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
    loadCampaigns() {
        // Sample campaigns data - in a real implementation, this would come from a CMS or API
        const campaigns = [
            {
                id: 'palash-kidney',
                title: 'Palash Das - Kidney Transplant',
                description: 'Young Palash needs urgent kidney transplant surgery. Help us save his life by contributing to his medical expenses.',
                image: 'assets/palash1.png',
                targetAmount: 500000,
                raisedAmount: 125000,
                status: 'active',
                urgency: 'high',
                patientAge: 28,
                medicalCondition: 'Chronic Kidney Disease',
                hospital: 'Apollo Hospital, Kolkata',
                lastUpdated: '2024-01-15'
            },
            {
                id: 'emergency-fund',
                title: 'Emergency Medical Fund',
                description: 'General fund to help patients who need immediate medical assistance. Your contribution helps us respond quickly to medical emergencies.',
                image: 'assets/heart1.png',
                targetAmount: 1000000,
                raisedAmount: 350000,
                status: 'active',
                urgency: 'medium',
                lastUpdated: '2024-01-10'
            }
        ];

        this.renderCampaigns(campaigns);
    }

    renderCampaigns(campaigns) {
        const container = document.getElementById('campaigns-container');
        if (!container) return;

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

    showCampaignDetails(campaignId) {
        // In a real implementation, this would fetch detailed information
        // For now, we'll create a simple modal or detailed view
        const campaignDetails = this.getCampaignDetails(campaignId);
        this.createCampaignModal(campaignDetails);
    }

    getCampaignDetails(campaignId) {
        // Sample detailed information - would come from API in real implementation
        const details = {
            'palash-kidney': {
                title: 'Palash Das - Kidney Transplant Campaign',
                fullStory: `Palash Das, a 28-year-old from rural West Bengal, has been suffering from chronic kidney disease for the past two years. Despite his family's best efforts, they cannot afford the expensive treatment required for a kidney transplant.

                Palash was the sole breadwinner for his family of four, but his deteriorating health has made it impossible for him to work. The family has already exhausted their savings and borrowed money from relatives.

                The doctors at Apollo Hospital, Kolkata, have confirmed that Palash urgently needs a kidney transplant to save his life. The total cost of the surgery and post-operative care is estimated at ₹5,00,000.

                Every contribution, no matter how small, brings us closer to saving Palash's life. Your generosity can give him a second chance at life and help his family during this difficult time.`,
                medicalReports: [
                    'Kidney function test results',
                    'Specialist consultation report',
                    'Hospital treatment plan'
                ],
                timeline: [
                    { date: '2023-12-01', event: 'Initial diagnosis confirmed' },
                    { date: '2023-12-15', event: 'Campaign launched' },
                    { date: '2024-01-05', event: 'Suitable donor identified' },
                    { date: '2024-01-15', event: 'Surgery scheduled for February 2024' }
                ]
            },
            'emergency-fund': {
                title: 'Emergency Medical Fund',
                fullStory: `Our Emergency Medical Fund is designed to provide immediate assistance to patients who face life-threatening situations and cannot afford urgent medical care.

                This fund has helped numerous families over the years, enabling quick medical interventions that have saved lives. The fund covers various medical emergencies including cardiac surgeries, cancer treatments, accident victims, and critical care.

                By contributing to this fund, you become part of our rapid response team that can mobilize resources within hours of receiving a genuine medical emergency request.

                Your contribution helps us maintain a ready fund that can be deployed immediately when every minute counts in saving a life.`
            }
        };

        return details[campaignId] || { title: 'Campaign Details', fullStory: 'Details not available.' };
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
                    <button class="modal-close">&times;</button>
                    <h2>${details.title}</h2>
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
                    padding: 2rem;
                }
                
                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #666;
                }
                
                .modal-close:hover {
                    color: #000;
                }
                
                .modal-body {
                    margin: 1rem 0 2rem;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 1rem;
                    }
                    
                    .modal-content {
                        padding: 1.5rem;
                    }
                    
                    .modal-actions {
                        flex-direction: column;
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