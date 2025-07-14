# Sevabrata Foundation Website - Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Campaign Management System](#campaign-management-system)
4. [Architecture & Code Organization](#architecture--code-organization)
5. [Common Development Tasks](#common-development-tasks)
6. [Styling & CSS](#styling--css)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Project Overview

The Sevabrata Foundation website is a static website built with vanilla HTML, CSS, and JavaScript. It features a dynamic campaign management system that supports both active and completed fundraising campaigns.

## Quick Start

```bash
# Clone or download the project
cd sevabrata

# Start local development server (REQUIRED)
python3 -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

**Important**: A web server is required for local development due to browser CORS restrictions with JSON file loading.

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Campaign Management**: Dynamic loading of active and completed campaigns
- **Tab Navigation**: Switch between active and completed campaigns
- **Modal System**: Detailed campaign information in popup modals
- **Static Hosting Ready**: Designed for S3/CDN deployment

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Icons**: FontAwesome 6.4.0
- **Fonts**: Inter from Google Fonts
- **Data Format**: JSON for campaign data
- **Hosting**: Static file hosting (S3, GitHub Pages, etc.)

## File Structure

```
sevabrata/
├── index.html                 # Main website page
├── styles.css                 # Main stylesheet
├── script.js                  # Main JavaScript application
├── master_campaign_details.csv # Source of truth for campaign data
├── assets/                    # Images and media files
│   ├── sevalog1crop.jpg      # Logo and fallback image
│   ├── prakash1.jpg          # Campaign images
│   └── ...                   # Other images
├── campaigns/                 # Campaign data directory
│   ├── active/               # Active campaigns
│   │   ├── manifest.json     # Lists active campaign files
│   │   └── *.json           # Individual campaign files
│   ├── completed/            # Completed campaigns
│   │   ├── manifest.json     # Lists completed campaign files
│   │   └── *.json           # Individual campaign files
│   └── archived/             # Archived campaigns (future use)
├── success-stories/          # Success story data
│   ├── manifest.json        # Lists available success stories
│   └── *.json               # Individual success stories
├── legacy/                   # Old website files (for reference)
└── admin.html               # Admin panel (future enhancement)
```

## Campaign Management System

### Data Flow
1. **Source of Truth**: `master_campaign_details.csv` contains all campaign information
2. **JSON Generation**: CSV data is converted to individual JSON files
3. **Directory Organization**: Campaigns are placed in `active/` or `completed/` directories
4. **Manifest Files**: Each directory has a `manifest.json` listing available campaigns
5. **Dynamic Loading**: JavaScript loads campaigns based on directory manifests

### Campaign JSON Structure
```json
{
  "id": "campaign-identifier",
  "title": "Campaign Title",
  "shortDescription": "Brief description",
  "fullDescription": "Detailed story...",
  "image": "path/to/image.jpg",
  "targetAmount": 100000,
  "raisedAmount": 75000,
  "currency": "INR",
  "status": "active|completed",
  "urgency": "high|medium|low",
  "category": "medical",
  "patientDetails": {
    "name": "Patient Name",
    "age": "25",
    "location": "City, State",
    "condition": "Medical condition",
    "hospital": "Hospital Name",
    "doctor": "Dr. Name"
  },
  "timeline": [
    {
      "date": "2024-01-01",
      "event": "Event name",
      "description": "Event description"
    }
  ],
  "createdDate": "2024-01-01",
  "lastUpdated": "2024-01-01",
  "tags": ["tag1", "tag2"]
}
```

### Success Story JSON Structure
```json
{
  "id": "success-story-identifier",
  "patientName": "Patient Name",
  "condition": "Medical condition",
  "treatment": "Treatment received",
  "amountRaised": 250000,
  "year": 2024,
  "hospital": "Hospital Name",
  "outcome": "Treatment outcome",
  "image": "path/to/image.jpg",
  "description": "Detailed success story narrative..."
}
```

### Manifest File Structure

**Campaign Manifest** (`campaigns/active/manifest.json`, `campaigns/completed/manifest.json`):
```json
{
  "campaigns": [
    "campaign1.json",
    "campaign2.json"
  ],
  "lastUpdated": "2025-07-14T10:30:00Z"
}
```

**Success Stories Manifest** (`success-stories/manifest.json`):
```json
{
  "stories": [
    "story1.json",
    "story2.json"
  ],
  "lastUpdated": "2025-07-14T10:30:00Z"
}
```

## Architecture & Code Organization

### JavaScript Architecture (`script.js`)

#### Main Classes

1. **SevabrataWebsite** - Main application class
   - Handles initialization and coordination
   - Manages campaign loading and rendering
   - Controls tab navigation

2. **FormHandler** - Form submission handling
   - Contact forms
   - Newsletter subscriptions
   - Future donation forms

3. **PerformanceOptimizer** - Performance enhancements
   - Lazy loading
   - Scroll optimization
   - Image loading optimization

#### Key Methods

**Campaign Loading:**
```javascript
loadCampaigns()           // Loads active campaigns
loadCompletedCampaigns()  // Loads completed campaigns
loadSuccessStories()      // Loads success stories from manifest
loadCampaignsFromDirectory(dir) // Generic campaign loader
```

**Rendering:**
```javascript
renderCampaigns(campaigns, type) // Renders campaign cards
renderSuccessStories(stories) // Renders success story cards
createCampaignCard(campaign, type) // Creates individual card HTML
createSuccessStoryCard(story) // Creates success story card HTML
createCampaignModal(details) // Creates detailed modal popup
```

**Navigation:**
```javascript
setupCampaignTabs()       // Handles tab switching
setupNavigation()         // Main site navigation
```

### Data Loading System

The website loads all campaign data from JSON files using fetch() API:

```javascript
// Campaign loading methods
loadCampaigns()                    // Loads active campaigns from JSON
loadEndedCampaigns()              // Loads completed campaigns from JSON
loadCampaignsFromDirectory(dir)   // Generic JSON loader for any directory
getCampaignDetails(campaignId)    // Loads individual campaign details
```

**Requirements**:
- ✅ **HTTP/HTTPS protocols** (web server required for local development)
- ❌ **file:// protocol** (not supported due to CORS restrictions)

**Protocol Detection**: The website detects file:// protocol and shows helpful error messages directing users to use a web server.

## Common Development Tasks

### Adding a New Campaign

1. **Add to CSV**: Update `master_campaign_details.csv` with new campaign data
2. **Run Conversion Script**: Execute `python3 csv_to_json_converter.py` to generate JSON files
3. **Verify JSON**: Check that the new JSON file is created in the appropriate directory (`active/` or `completed/`)
4. **Update Manifest**: The conversion script automatically updates the `manifest.json` files

### CSV to JSON Conversion

The website includes a Python script that converts CSV data to JSON files while preserving existing campaign data:

```bash
# Convert CSV to JSON files
python3 csv_to_json_converter.py

# Or use the bash wrapper
./convert_campaigns.sh
```

**Important**: The script merges CSV data with existing JSON data rather than overwriting it. This preserves:
- Timeline entries
- Patient details
- Rich descriptions
- Tags and metadata

**Script Features**:
- Reads `master_campaign_details.csv`
- Creates individual JSON files for each campaign
- Organizes campaigns by status (active/completed)
- Updates manifest.json files automatically
- Preserves existing campaign data when merging

### Admin Interface (admin.js)

The project includes an admin interface for UI-based campaign management:

```bash
# Access admin interface
http://localhost:8000/admin.html
```

**Admin Authentication**:
The admin panel requires a password to be configured for local development. There are several ways to set this up:

**Option 1: Quick Setup (Recommended)**
1. Navigate to `http://localhost:8000/admin.html`
2. Click "Quick Setup" button when prompted
3. Uses default password: `admin`

**Option 2: Browser Console**
```javascript
// In browser console, set custom password
localStorage.setItem('sevabrata_admin_password', 'your_password');
```

**Option 3: HTML Configuration**
```javascript
// Add to admin.html before admin-auth.js
<script>
window.SEVABRATA_ADMIN_PASSWORD = 'your_password';
</script>
```

**Option 4: Global Config**
```javascript
// Add to admin.html before admin-auth.js
<script>
window.SEVABRATA_CONFIG = {
    adminPassword: 'your_password'
};
</script>
```

**Security Note**: 
- The admin panel only works when a password is configured
- For S3 deployment, simply exclude `admin.html` and `admin-auth.js` files
- Without a configured password, the admin panel will show a "disabled" message

**Admin Features**:
- Create new campaigns via web form
- Edit existing campaign details
- Generate JSON files directly from the interface
- Preview campaign cards before publishing
- Manage campaign status (active/completed)
- Campaign statistics display and refresh

### Modifying Campaign Display

**Location**: `script.js` → `createCampaignCard()` method

```javascript
// To modify campaign card layout:
createCampaignCard(campaign, type = 'active') {
    // Modify HTML template here
    return `<div class="campaign-card">...</div>`;
}
```

### Updating Styles

**Main Styles**: `styles.css`
**Dynamic Styles**: `script.js` → `additionalStyles` variable

```javascript
// To add new CSS:
const additionalStyles = `
    <style>
        .your-new-class {
            /* styles here */
        }
    </style>
`;
```

### Adding New Sections

1. **HTML**: Add section to `index.html`
2. **CSS**: Add styles to `styles.css`
3. **JavaScript**: Add functionality to `script.js`
4. **Navigation**: Update navigation in `index.html`

### Modifying the Modal System

**Location**: `script.js` → `createCampaignModal()` method

```javascript
// To modify modal content:
modal.innerHTML = `
    <div class="modal-overlay">
        <div class="modal-content">
            <!-- Modify modal structure here -->
        </div>
    </div>
`;
```

## Styling & CSS

### CSS Architecture

1. **CSS Variables**: Defined in `:root` for consistent theming
2. **Mobile-First**: Responsive design with mobile breakpoints
3. **Component-Based**: Styles organized by component

### Key CSS Classes

**Layout:**
- `.container` - Max-width content container
- `.section` - Page sections
- `.grid` - Grid layouts

**Components:**
- `.campaign-card` - Individual campaign cards
- `.campaign-grid` - Campaign grid layout
- `.modal-*` - Modal system classes
- `.btn` - Button styles

**States:**
- `.active` - Active navigation/tab states
- `.urgent` - Urgent campaign styling
- `.completed` - Completed campaign styling

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Color Scheme

```css
:root {
  --primary-color: #ff6b35;      /* Orange */
  --secondary-color: #f7931e;    /* Yellow-orange */
  --tertiary-color: #ffd23f;     /* Yellow */
  --dark-color: #2c3e50;         /* Dark blue */
  --light-gray: #f8f9fa;         /* Light gray */
  --gray: #6c757d;               /* Medium gray */
  --white: #ffffff;              /* White */
}
```

## Deployment

### Local Development

**⚠️ Important**: Local development requires a web server due to browser CORS restrictions with the `file://` protocol.

**Web Server (Required for Local Development)**:
```bash
cd sevabrata
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**Alternative Web Servers**:
```bash
# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Using Python 2
python -m SimpleHTTPServer 8000
```

**Note**: Opening `index.html` directly in the browser (file:// protocol) will not work because browsers block fetch requests to local JSON files for security reasons.

### Production Deployment

#### S3 Static Hosting (Recommended)

✅ **Fully Compatible** - All JSON files are served as static assets

1. **Upload all files** to S3 bucket (including campaigns/ directory)
2. **Enable static website hosting**
3. **Set index.html as index document**
4. **Configure CloudFront** for CDN (optional)

**Admin Panel Security**:
- **⚠️ Important**: Do not upload `admin.html` and `admin-auth.js` to production unless you have proper authentication
- For S3 hosting, the admin panel will automatically be disabled (no password configured)
- Only include admin files in development/staging environments

**File Structure in S3**:
```
your-bucket/
├── index.html
├── styles.css
├── script.js
├── campaigns/
│   ├── active/
│   │   ├── manifest.json
│   │   └── *.json
│   └── completed/
│       ├── manifest.json
│       └── *.json
└── assets/
    └── *.jpg
```

#### GitHub Pages

✅ **Fully Compatible** - Uses HTTP/HTTPS protocol

1. **Push to GitHub repository** (including campaigns/ directory)
2. **Enable GitHub Pages** in repository settings
3. **Select branch** for deployment

#### Other Static Hosts

✅ **All Compatible** - Use HTTP/HTTPS protocol

- **Netlify** - Drag & drop entire project folder
- **Vercel** - Connect GitHub repository
- **Firebase Hosting** - Deploy using Firebase CLI
- **Surge.sh** - Simple command-line deployment

### Pre-Deployment Checklist

- [ ] Test campaign loading via local web server (`python3 -m http.server 8000`)
- [ ] Verify all images load correctly
- [ ] Test tab switching functionality (Active/Completed campaigns)
- [ ] Check modal popups work for campaign details
- [ ] Validate responsive design on mobile/tablet
- [ ] Verify JSON files are properly uploaded to hosting platform
- [ ] Test admin.js functionality for campaign management (if applicable)

## Troubleshooting

### Common Issues

#### Campaigns Not Loading
- **Check**: Are you using a web server? (Required for local development)
- **Check**: `manifest.json` files exist in campaign directories
- **Check**: JSON files are valid and accessible
- **Check**: Browser console for fetch errors
- **Check**: CORS errors indicate file:// protocol usage

#### "Failed to fetch" Errors
- **Cause**: Usually indicates file:// protocol usage
- **Solution**: Use a web server for local development
- **Command**: `python3 -m http.server 8000`

#### Icons Not Displaying
- **Check**: FontAwesome CDN is loading
- **Check**: CSS specificity for icon styles
- **Check**: Browser developer tools for CSS conflicts

#### Layout Issues
- **Check**: CSS Grid browser support
- **Check**: Viewport meta tag in HTML
- **Check**: Box-sizing declarations

#### Modal Not Opening
- **Check**: JavaScript event listeners
- **Check**: Campaign ID matching
- **Check**: JSON files contain campaign details

### Debug Tools

**Browser Console**: Check for JavaScript errors
```javascript
// Debug campaign loading
window.SevabrataWebsite.loadCampaigns()

// Check loaded data
console.log(window.SevabrataWebsite)
```

**Network Tab**: Monitor file loading
- Check JSON file requests
- Verify image loading
- Monitor CDN resources

### Performance Optimization

1. **Image Optimization**: Compress images before upload
2. **CSS Minification**: Minify CSS for production
3. **JavaScript Bundling**: Consider bundling for larger applications
4. **CDN Usage**: Use CDN for static assets

---

## Quick Reference

### File Locations for Common Changes

| Change Type | File Location |
|-------------|---------------|
| Add Campaign | `campaigns/active/` or `campaigns/ended/` |
| Update Styles | `styles.css` or `script.js` (additionalStyles) |
| Modify Layout | `index.html` |
| Change Content | `index.html` |
| Update Logic | `script.js` |
| Add Images | `assets/` |

### Development Workflow

1. **Start web server**: `python3 -m http.server 8000`
2. **Make changes** to relevant files
3. **Test locally** at `http://localhost:8000`
4. **Verify responsive** design on different devices
5. **Check browser** compatibility
6. **Test campaign loading** and admin interface
7. **Deploy** to staging/production

### Common Commands

```bash
# Start development server
python3 -m http.server 8000

# Convert CSV to JSON
python3 csv_to_json_converter.py

# Access admin interface
http://localhost:8000/admin.html

# Access main website
http://localhost:8000
```

For questions or issues, refer to the code comments or contact the development team.