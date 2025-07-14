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
│   ├── ended/                # Completed campaigns
│   │   ├── manifest.json     # Lists ended campaign files
│   │   └── *.json           # Individual campaign files
│   └── archived/             # Archived campaigns (future use)
├── success-stories/          # Success story data
│   └── *.json               # Individual success stories
├── legacy/                   # Old website files (for reference)
└── admin.html               # Admin panel (future enhancement)
```

## Campaign Management System

### Data Flow
1. **Source of Truth**: `master_campaign_details.csv` contains all campaign information
2. **JSON Generation**: CSV data is converted to individual JSON files
3. **Directory Organization**: Campaigns are placed in `active/` or `ended/` directories
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
  "status": "active|ended|archived",
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

### Manifest File Structure
```json
{
  "campaigns": [
    "campaign1.json",
    "campaign2.json"
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
loadEndedCampaigns()      // Loads completed campaigns
loadCampaignsFromDirectory(dir) // Generic campaign loader
```

**Rendering:**
```javascript
renderCampaigns(campaigns, type) // Renders campaign cards
createCampaignCard(campaign, type) // Creates individual card HTML
createCampaignModal(details) // Creates detailed modal popup
```

**Navigation:**
```javascript
setupCampaignTabs()       // Handles tab switching
setupNavigation()         // Main site navigation
```

### Fallback System

The website includes a robust fallback system for local development:

```javascript
// For file:// protocol (opening HTML directly)
getFallbackCampaigns()        // Hardcoded active campaigns
getFallbackEndedCampaigns()   // Hardcoded ended campaigns
getFallbackCampaignDetails()  // Hardcoded campaign details
```

## Common Development Tasks

### Adding a New Campaign

1. **Add to CSV**: Update `master_campaign_details.csv` with new campaign data
2. **Create JSON**: Generate JSON file in appropriate directory (`active/` or `ended/`)
3. **Update Manifest**: Add filename to relevant `manifest.json`
4. **Update Fallbacks**: Add to fallback data in `script.js` for local testing

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

1. **Direct File Access**: Open `index.html` in browser
   - Uses fallback data
   - Good for quick testing

2. **Local Server** (Recommended):
   ```bash
   cd sevabrata
   python3 -m http.server 8000
   # Visit: http://localhost:8000
   ```

### Production Deployment

#### S3 Static Hosting (Recommended)

1. **Upload all files** to S3 bucket
2. **Enable static website hosting**
3. **Set index.html as index document**
4. **Configure CloudFront** for CDN (optional)

#### GitHub Pages

1. **Push to GitHub repository**
2. **Enable GitHub Pages** in repository settings
3. **Select branch** for deployment

#### Other Static Hosts

- Netlify
- Vercel
- Firebase Hosting

### Pre-Deployment Checklist

- [ ] Test campaign loading via web server
- [ ] Verify all images load correctly
- [ ] Test tab switching functionality
- [ ] Check modal popups work
- [ ] Validate responsive design
- [ ] Test fallback mechanisms

## Troubleshooting

### Common Issues

#### Campaigns Not Loading
- **Check**: `manifest.json` files exist in campaign directories
- **Check**: JSON files are valid and accessible
- **Check**: Browser console for fetch errors

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
- **Check**: Fallback data includes campaign details

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

1. **Make changes** to relevant files
2. **Test locally** using web server
3. **Verify responsive** design
4. **Check browser** compatibility
5. **Deploy** to staging/production

For questions or issues, refer to the code comments or contact the development team.