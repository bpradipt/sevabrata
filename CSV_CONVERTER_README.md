# CSV to JSON Campaign Converter

This tool converts the master campaign CSV file into individual JSON files organized by campaign status for the Sevabrata Foundation website.

## Files

- `csv_to_json_converter.py` - Main Python conversion script
- `convert_campaigns.sh` - Bash wrapper script for easy execution
- `master_campaign_details.csv` - Source CSV file (must be present)

## Requirements

- Python 3.6 or higher
- `master_campaign_details.csv` file in the same directory

## Usage

### Option 1: Using the Bash Script (Recommended)

```bash
./convert_campaigns.sh
```

### Option 2: Using Python Directly

```bash
python3 csv_to_json_converter.py
```

## What the Script Does

1. **Reads CSV Data**: Parses `master_campaign_details.csv`
2. **Groups Campaign Data**: Combines multiple rows per campaign (for timeline events)
3. **Determines Status**: Automatically categorizes campaigns as:
   - `active` - Ongoing fundraising campaigns
   - `ended` - Completed campaigns (goal reached or manually ended)
   - `archived` - Paused or old campaigns
4. **Creates JSON Files**: Generates individual JSON files for each campaign
5. **Organizes by Directory**: Places files in appropriate folders:
   - `campaigns/active/` - Active campaigns
   - `campaigns/ended/` - Completed campaigns
   - `campaigns/archived/` - Archived campaigns
6. **Generates Manifests**: Creates `manifest.json` files listing campaigns in each directory

## Output Structure

```
campaigns/
├── active/
│   ├── manifest.json
│   └── campaign-name.json
├── ended/
│   ├── manifest.json
│   └── campaign-name.json
└── archived/
    ├── manifest.json
    └── campaign-name.json
```

## JSON File Format

Each campaign JSON file contains:

```json
{
  "id": "campaign-slug",
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
  "tags": ["medical", "pediatric"]
}
```

## CSV Format Expected

The script expects a CSV with these columns:

- `title` - Campaign title (required)
- `shortDescription` - Brief description
- `fullDescription` - Detailed campaign story
- `image (link to images if any)` - Image path
- `targetAmount` - Fundraising goal
- `raisedAmount` - Amount raised so far
- `status` - Campaign status (Active/Ended/etc.)
- `urgency` - Priority level (High/Medium/Low)
- `category` - Campaign category
- `name` - Patient name
- `age` - Patient age
- `location` - Patient location
- `condition` - Medical condition
- `hospital` - Treatment hospital
- `doctor` - Treating doctor
- `date` - Timeline event date (YYYY-MM-DD)
- `event` - Timeline event name
- `description` - Timeline event description

## Status Detection Logic

The script automatically determines campaign status:

1. **From CSV Status Field**:
   - "Ended", "Completed", "Finished" → `ended`
   - "Active", "In Progress", "Ongoing" → `active`
   - "Archived", "Paused" → `archived`

2. **From Amount Comparison**:
   - If `raisedAmount >= targetAmount` → `ended`
   - Otherwise → `active`

## Timeline Processing

- Multiple CSV rows with the same title are treated as timeline events
- Timeline events are sorted by date
- Each event needs `date`, `event`, and optionally `description`

## Error Handling

The script handles:
- Missing CSV file
- Invalid data formats
- Missing required fields
- File write permissions
- Empty or malformed data

## Example Usage

```bash
# Make sure your CSV is ready
ls master_campaign_details.csv

# Run the converter
./convert_campaigns.sh

# Check the output
ls campaigns/active/
ls campaigns/ended/

# Test the website
python3 -m http.server 8000
# Visit: http://localhost:8000
```

## Troubleshooting

### Script Won't Run
- Check Python 3 is installed: `python3 --version`
- Make script executable: `chmod +x convert_campaigns.sh`

### No Campaigns Generated
- Verify CSV file exists and has correct name
- Check CSV has required columns
- Ensure at least `title` column has data

### JSON Files Not Loading on Website
- Check manifest.json files were created
- Verify JSON syntax is valid
- Test via web server, not file:// protocol

### Timeline Events Missing
- Ensure date format is YYYY-MM-DD
- Check event names are not empty
- Verify multiple rows have same campaign title

## Integration with Website

After running the converter:

1. **Test Locally**: Run `python3 -m http.server 8000`
2. **Verify Tabs**: Check both "Active Campaigns" and "Completed Campaigns" tabs
3. **Test Modals**: Click "Learn More" on campaigns to verify details load
4. **Deploy**: Upload generated files to your hosting platform

The website will automatically load campaigns from the generated JSON files and manifest files.