# Sevabrata Foundation Website

A modern, responsive website for the Sevabrata Foundation - a non-profit organization dedicated to providing medical assistance to underprivileged families.

## Features

- **Modern Design**: Responsive design that works on all devices
- **Campaign Management**: Easy-to-use system for managing medical campaigns
- **Success Stories**: Showcase of successful treatments and lives saved
- **Admin Panel**: Simple interface for content management
- **Performance Optimized**: Fast loading with modern web standards
- **Accessibility**: Built with accessibility in mind

## File Structure

```
sevabrata/
├── index.html              # Main website file
├── styles.css              # Modern CSS with custom properties
├── script.js               # Interactive functionality
├── campaigns.json          # Campaign data storage
├── admin.html              # Admin panel interface
├── admin.js                # Admin panel functionality
├── assets/                 # Images and media files
├── legacy/                 # Original website files (backup)
└── README.md               # This documentation
```

## Getting Started

### For Website Visitors
Simply open `index.html` in a web browser to view the website.

### For Administrators
1. Open `admin.html` in a web browser
2. Use the admin panel to manage campaigns and content
3. Changes are reflected immediately on the main website

## Managing Content

### Adding New Campaigns

1. Go to Admin Panel (`admin.html`)
2. Click "Campaigns" tab
3. Click "Add New Campaign" button
4. Fill in the campaign details:
   - **Title**: Campaign name (e.g., "Patient Name - Treatment Type")
   - **Category**: Type of medical treatment
   - **Description**: Brief and detailed descriptions
   - **Target Amount**: Fundraising goal in rupees
   - **Patient Details**: Name, age, condition, hospital
   - **Urgency**: Low, Medium, or High
   - **Image**: Patient photo or relevant image

### Updating Campaign Progress

1. In Admin Panel, go to Campaigns section
2. Find the campaign to update
3. Click "Edit" button
4. Update the "Current Amount" field
5. Save changes

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

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Campaign Data Format

Campaigns are stored in `campaigns.json` with the following structure:

```json
{
  "id": "unique-campaign-id",
  "title": "Campaign Title",
  "shortDescription": "Brief description for cards",
  "fullDescription": "Detailed campaign story",
  "image": "assets/image-file.jpg",
  "targetAmount": 500000,
  "raisedAmount": 125000,
  "status": "active",
  "urgency": "high",
  "patientDetails": {
    "name": "Patient Name",
    "age": 28,
    "condition": "Medical Condition",
    "hospital": "Hospital Name"
  }
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

### Regular Updates (Weekly)
- [ ] Update campaign progress amounts
- [ ] Add any new campaign updates
- [ ] Check for completed campaigns
- [ ] Review and approve new success stories

### Monthly Reviews
- [ ] Analyze campaign performance
- [ ] Update website statistics
- [ ] Review and update contact information
- [ ] Check all links and forms

### Annual Tasks
- [ ] Backup all data and images
- [ ] Review and update mission statements
- [ ] Update team information
- [ ] Refresh success story highlights

## Troubleshooting

### Common Issues

**Campaign not displaying:**
- Check if campaign status is "active"
- Verify image file exists in assets folder
- Ensure JSON format is valid

**Admin panel not loading:**
- Check browser console for errors
- Ensure campaigns.json file is accessible
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

## Security Notes

### Admin Access
- Keep admin.html link private
- Only share with authorized personnel
- Consider password protection for production use

### Data Backup
- Regularly backup campaigns.json
- Save copies of all images
- Export success stories data

## Future Enhancements

### Planned Features
- [ ] Online payment integration
- [ ] Email notification system
- [ ] Social media sharing
- [ ] Volunteer management
- [ ] Donor management system
- [ ] Mobile app

### Technical Improvements
- [ ] Database integration
- [ ] Content Management System (CMS)
- [ ] Automated backups
- [ ] Advanced analytics
- [ ] SEO optimization

## Contact Information

**For website issues:**
- Technical support: [Contact development team]

**For content updates:**
- Campaign managers: Use admin panel
- Emergency updates: [Contact admin]

**General foundation contact:**
- Email: sevabratafoundation@gmail.com
- Membership: nanda_sandip@yahoo.com

---

*Last updated: January 2024*
*Website version: 2.0*