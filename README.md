# Sevabrata Foundation Website

A modern, responsive website for the Sevabrata Foundation - a non-profit organization dedicated to providing medical assistance and education support to underprivileged families.

## Features

- **Modern Design**: Responsive design that works on all devices
- **Campaign Management**: Easy-to-use system for managing medical campaigns
- **Success Stories**: Showcase of successful treatments and lives saved
- **Admin Panel**: Simple interface for content management
- **Performance Optimized**: Fast loading with modern web standards
- **Accessibility**: Built with accessibility in mind

## File Structure

```sh
sevabrata/
├── index.html              # Main website file
├── styles.css              # Modern CSS with custom properties
├── script.js               # Interactive functionality
├── admin.html              # Admin panel interface
├── admin.js                # Admin panel functionality
├── assets/                 # Images and media files
├── campaigns/              # Campaign data directory
│   ├── active/            # Active campaigns
│   │   ├── manifest.json  # List of active campaign files
│   │   └── *.json         # Individual campaign files
│   ├── completed/         # Successfully completed campaigns
│   ├── _stats.json        # Campaign statistics
│   ├── _categories.json   # Campaign categories
│   └── _config.json       # Campaign configuration
├── success-stories/        # Success story files
│   └── *.json             # Individual success story files
├── legacy/                 # Original website files (backup)
└── README.md               # This documentation
```

## Campaign Management

### Directory Structure

The website uses a new directory-based campaign management system that's optimized for static hosting (like S3):

- **`campaigns/active/`**: Contains currently active fundraising campaigns
- **`campaigns/completed/`**: Successfully completed campaigns that reached their goal

### Adding New Campaigns

**Method 1: Manual File Creation**
1. Create a new JSON file in `campaigns/active/` directory
2. Use the format shown in the "Campaign Data Format" section below
3. Add the filename to `campaigns/active/manifest.json`
4. Upload any campaign images to the `assets/` folder

**Method 2: Admin Panel (if available)**
1. Go to Admin Panel (`admin.html`)
2. Click "Campaigns" tab
3. Click "Add New Campaign" button
4. Fill in the campaign details and save

### Updating Campaign Progress

**Method 1: Edit JSON Files Directly**
1. Open the campaign's JSON file in `campaigns/active/`
2. Update the `raisedAmount` field
3. Add any updates to the `updates` array
4. Update the `lastUpdated` field

**Method 2: Admin Panel**
1. Use the admin panel to update campaign amounts
2. Changes will be reflected in the JSON files

### Managing Campaign Status

**Moving Campaigns Between Statuses:**

1. **Active → Completed**: Move JSON file from `active/` to `completed/`, remove from active manifest
2. **Active → Ended**: Move JSON file from `active/` to `ended/`, remove from active manifest  
3. **Any → Archived**: Move JSON file to `archived/` directory

**Important**: Always update the `campaigns/active/manifest.json` file when adding or removing campaigns from the active directory.

### Adding Success Stories

1. Go to Admin Panel → Success Stories
2. Click "Add Success Story"
3. Fill in patient details and treatment outcome
4. Include before/after photos if available
5. Write a compelling story about the successful treatment

### Updating Website Content

1. Admin Panel → Content Management
2. Edit sections like:
   - Hero section text
   - Contact information
   - Mission statements
3. Click "Save Changes"

### Managing Bank Details

1. Admin Panel → Settings
2. Update bank account information
3. Ensure all details are accurate before saving

## Technical Details

### Colors Used (Preserved from Original)
- **Primary**: `rgb(101, 28, 45)` - Deep maroon
- **Secondary**: `rgb(255, 192, 0)` - Golden yellow  
- **Tertiary**: `rgb(166, 44, 82)` - Rose pink
- **Background**: `rgb(247, 219, 143)` - Light cream

### Responsive Breakpoints
- **Mobile**: Up to 767px
- **Tablet**: 768px to 1023px  
- **Desktop**: 1024px and above


## Manifest File System

### Active Campaigns Manifest

The `campaigns/active/manifest.json` file lists all active campaign files:

```json
{
  "campaigns": [
    "child-heart-surgery-fund.json",
    "emergency-fund.json",
    "new-campaign.json"
  ],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

**Important**: This file must be updated whenever you add or remove campaigns from the active directory. The website loads this manifest first to know which campaign files to load.

### Why Use a Manifest?

Static hosting services (like S3) don't allow directory listing, so we use a manifest file to tell the website which files exist. This approach:
- Works with any static hosting service
- Allows dynamic campaign loading
- Maintains backwards compatibility
- Enables easy campaign management

## Campaign Data Format

Individual campaign files use the following structure:

```json
{
  "id": "unique-campaign-id",
  "title": "Campaign Title",
  "shortDescription": "Brief description for cards",
  "fullDescription": "Detailed campaign story",
  "image": "assets/image-file.jpg",
  "targetAmount": 500000,
  "raisedAmount": 125000,
  "currency": "INR",
  "status": "active",
  "urgency": "high",
  "category": "medical",
  "patientDetails": {
    "name": "Patient Name",
    "age": 28,
    "location": "Location",
    "condition": "Medical Condition",
    "hospital": "Hospital Name",
    "doctor": "Doctor Name"
  },
  "timeline": [
    {
      "date": "2024-01-01",
      "event": "Campaign launched",
      "description": "Fundraising campaign started"
    }
  ],
  "updates": [
    {
      "date": "2024-01-15",
      "title": "Update Title",
      "content": "Update content"
    }
  ],
  "documents": [
    "Medical reports",
    "Hospital estimates"
  ],
  "createdDate": "2024-01-01",
  "lastUpdated": "2024-01-15",
  "tags": ["kidney", "urgent", "family"]
}
```

## Image Management

### Adding Images

1. Place images in the `assets/` folder
2. Use descriptive filenames (e.g., `patient-name-photo.jpg`)
3. Recommended image sizes:
   - Campaign images: 400x300px
   - Patient photos: 300x300px
   - Success story images: 500x400px

### Image Formats

- **Preferred**: JPG for photos, PNG for graphics
- **Maximum size**: 2MB per image
- **Minimum resolution**: 300x200px

## Content Guidelines

### Writing Campaign Descriptions

**Short Description (for cards):**

- Keep under 150 characters
- Focus on urgency and patient need
- Example: "Young Palash needs urgent kidney transplant surgery. Help us save his life."

**Full Description (for detailed view):**

- Tell the complete story
- Include medical background
- Explain financial situation
- Show impact of donations
- Keep paragraphs short for readability

### Success Story Guidelines

1. **Start with patient background**
2. **Describe the medical challenge**
3. **Explain how donations helped**
4. **Share the successful outcome**
5. **Include current status if possible**

## Maintenance Tasks

### Regular Updates (On need basis)
- [ ] Update campaign progress amounts in JSON files
- [ ] Add any new campaign updates to the `updates` array
- [ ] Check for completed campaigns and move to appropriate directories
- [ ] Update `campaigns/active/manifest.json` if campaigns change status
- [ ] Review and approve new success stories



## Troubleshooting

### Common Issues

**Campaign not displaying:**

- Check if campaign file is listed in `campaigns/active/manifest.json`
- Verify campaign status is "active" in the JSON file
- Ensure JSON format is valid (use a JSON validator)
- Check if image file exists in assets folder
- Verify file paths are correct (case sensitive)

**Admin panel not loading:**

- Check browser console for errors
- Ensure campaign files are accessible
- Try refreshing the page

**Images not showing:**

- Verify image files are in assets/ folder
- Check file names match exactly (case sensitive)
- Ensure image files are not corrupted

### Getting Help

For technical issues:
1. Check browser console for error messages
2. Verify all files are uploaded correctly
3. Test in different browsers
4. Contact development team if needed

### Data Backup

- Regularly backup entire `campaigns/` directory
- Save copies of all images in `assets/` folder
- Backup `success-stories/` directory
- Keep copies of `manifest.json` files

## Quick Reference

### Adding a New Campaign (Step by Step)

1. **Create campaign file**: Save as `campaigns/active/new-campaign-name.json`
2. **Update manifest**: Add filename to `campaigns/active/manifest.json`
3. **Add images**: Upload to `assets/` folder
4. **Test**: Open `index.html` to verify campaign displays

### Completing a Campaign

1. **Move file**: From `campaigns/active/` to `campaigns/completed/`
2. **Update manifest**: Remove from `campaigns/active/manifest.json`
3. **Update status**: Change `"status": "completed"` in the JSON file

### Emergency Campaign Updates

For urgent updates when you need to change campaign amounts quickly:

1. Edit the `raisedAmount` field in the campaign's JSON file
2. Update the `lastUpdated` field to current date
3. Add an entry to the `updates` array if needed

---

*Last updated: January 2024*
*Website version: 2.1 - New Campaign Management System*