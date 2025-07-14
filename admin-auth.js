// Simple JavaScript-based authentication for admin panel
// This should be included in admin.html

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Admin password from environment variable or config
        adminPassword: getAdminPassword(),
        
        // Session timeout in milliseconds (24 hours)
        sessionTimeout: 24 * 60 * 60 * 1000,
        
        // Storage key for authentication
        authKey: 'sevabrata_admin_auth'
    };
    
    // Function to get admin password from environment variable
    function getAdminPassword() {
        // For local development, check if password is set in a global config
        if (typeof window !== 'undefined' && window.SEVABRATA_ADMIN_PASSWORD) {
            return window.SEVABRATA_ADMIN_PASSWORD;
        }
        
        // Check if SEVABRATA_CONFIG is available (can be set in HTML)
        if (typeof window !== 'undefined' && window.SEVABRATA_CONFIG && window.SEVABRATA_CONFIG.adminPassword) {
            return window.SEVABRATA_CONFIG.adminPassword;
        }
        
        // For local development, check localStorage as fallback
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            const localPassword = localStorage.getItem('sevabrata_admin_password');
            if (localPassword) {
                return localPassword;
            }
        }
        
        // No password configured - admin panel will not work
        return null;
    }
    
    class AdminAuth {
        constructor() {
            this.init();
        }
        
        init() {
            // Check if admin password is configured
            if (!CONFIG.adminPassword) {
                console.error('Admin password not configured. Admin panel is disabled.');
                this.showPasswordNotConfiguredDialog();
                return;
            }
            
            // Check if user is already authenticated
            if (this.isAuthenticated()) {
                console.log('User already authenticated');
                return;
            }
            
            // Show authentication dialog
            this.showAuthDialog();
        }
        
        isAuthenticated() {
            const authData = localStorage.getItem(CONFIG.authKey);
            if (!authData) return false;
            
            try {
                const parsed = JSON.parse(authData);
                const now = Date.now();
                
                // Check if session has expired
                if (now - parsed.timestamp > CONFIG.sessionTimeout) {
                    localStorage.removeItem(CONFIG.authKey);
                    return false;
                }
                
                return parsed.authenticated === true;
            } catch (error) {
                localStorage.removeItem(CONFIG.authKey);
                return false;
            }
        }
        
        showPasswordNotConfiguredDialog() {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Create error dialog
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                text-align: center;
            `;
            
            dialog.innerHTML = `
                <div style="color: #dc3545; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                </div>
                <h2 style="margin-bottom: 1rem; color: #333;">Admin Panel Disabled</h2>
                <p style="margin-bottom: 1.5rem; color: #666; line-height: 1.5;">
                    The admin panel requires a password to be configured for local development.
                    Choose one of the methods below to set up admin access:
                </p>
                <div style="text-align: left; background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
                    <p style="margin: 0 0 0.5rem 0; font-weight: bold;">Option 1: Browser Console (Recommended)</p>
                    <code style="font-size: 0.875rem; color: #495057; display: block; margin-bottom: 1rem;">localStorage.setItem('sevabrata_admin_password', 'admin')</code>
                    
                    <p style="margin: 0 0 0.5rem 0; font-weight: bold;">Option 2: HTML Configuration</p>
                    <code style="font-size: 0.875rem; color: #495057; display: block;">window.SEVABRATA_ADMIN_PASSWORD = 'admin';</code>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="config-cancel" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Go Back</button>
                    <button id="config-setup" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Quick Setup</button>
                </div>
            `;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Event listeners
            dialog.querySelector('#config-cancel').addEventListener('click', () => {
                this.redirectToHome();
            });
            
            dialog.querySelector('#config-setup').addEventListener('click', () => {
                // Quick setup - set default password in localStorage
                localStorage.setItem('sevabrata_admin_password', 'admin');
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
                
                // Reload CONFIG and retry initialization
                CONFIG.adminPassword = getAdminPassword();
                this.init();
            });
            
            // Prevent background interaction
            document.body.style.overflow = 'hidden';
        }
        
        showAuthDialog() {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Create auth dialog
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
                text-align: center;
            `;
            
            dialog.innerHTML = `
                <h2 style="margin-bottom: 1rem; color: #333;">Admin Access Required</h2>
                <p style="margin-bottom: 1.5rem; color: #666;">Please enter the admin password to continue:</p>
                <input type="password" id="admin-password" placeholder="Enter password" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    box-sizing: border-box;
                ">
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="auth-submit" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Access Admin</button>
                    <button id="auth-cancel" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Cancel</button>
                </div>
                <div id="auth-error" style="
                    color: #dc3545;
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    display: none;
                "></div>
            `;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Focus on password input
            const passwordInput = dialog.querySelector('#admin-password');
            passwordInput.focus();
            
            // Event listeners
            dialog.querySelector('#auth-submit').addEventListener('click', () => {
                this.validatePassword(passwordInput.value, overlay);
            });
            
            dialog.querySelector('#auth-cancel').addEventListener('click', () => {
                this.redirectToHome();
            });
            
            // Enter key support
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validatePassword(passwordInput.value, overlay);
                }
            });
            
            // Prevent background interaction
            document.body.style.overflow = 'hidden';
        }
        
        validatePassword(password, overlay) {
            // Check if admin password is configured
            if (!CONFIG.adminPassword) {
                const errorDiv = overlay.querySelector('#auth-error');
                errorDiv.textContent = 'Admin password is not configured for this environment.';
                errorDiv.style.display = 'block';
                return;
            }
            
            if (password === CONFIG.adminPassword) {
                // Set authentication
                localStorage.setItem(CONFIG.authKey, JSON.stringify({
                    authenticated: true,
                    timestamp: Date.now()
                }));
                
                // Remove overlay
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
                
                console.log('Authentication successful');
            } else {
                // Show error
                const errorDiv = overlay.querySelector('#auth-error');
                errorDiv.textContent = 'Invalid password. Please try again.';
                errorDiv.style.display = 'block';
                
                // Clear password field
                overlay.querySelector('#admin-password').value = '';
                overlay.querySelector('#admin-password').focus();
            }
        }
        
        redirectToHome() {
            window.location.href = '/';
        }
        
        logout() {
            localStorage.removeItem(CONFIG.authKey);
            this.redirectToHome();
        }
    }
    
    // Initialize authentication when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AdminAuth();
        });
    } else {
        new AdminAuth();
    }
    
    // Expose logout function globally
    window.adminLogout = function() {
        const auth = new AdminAuth();
        auth.logout();
    };
    
})();