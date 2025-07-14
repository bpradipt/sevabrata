#!/usr/bin/env python3
"""
Sevabrata Foundation - CSV to JSON Campaign Converter

This script converts campaign_details.csv to individual JSON files
and organizes them into active/ended directories with manifest files.

Usage:
    python3 csv_to_json_converter.py

Requirements:
    - Python 3.6+
    - master_campaign_details.csv file in the same directory

Author: Generated for Sevabrata Foundation
"""

import csv
import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any, Optional


class CampaignConverter:
    """Converts CSV campaign data to JSON files organized by status."""
    
    def __init__(self, csv_file: str = "master_campaign_details.csv"):
        self.csv_file = csv_file
        self.campaigns_dir = "campaigns"
        self.active_dir = os.path.join(self.campaigns_dir, "active")
        self.ended_dir = os.path.join(self.campaigns_dir, "ended")
        self.archived_dir = os.path.join(self.campaigns_dir, "archived")
        
        # Store existing campaign data
        self.existing_campaigns = {}
        
        # Ensure directories exist
        self._create_directories()
        
        # Load existing campaigns
        self._load_existing_campaigns()
    
    def _create_directories(self):
        """Create necessary directories if they don't exist."""
        for directory in [self.campaigns_dir, self.active_dir, self.ended_dir, self.archived_dir]:
            os.makedirs(directory, exist_ok=True)
    
    def _load_existing_campaigns(self):
        """Load existing campaign JSON files to preserve existing data."""
        for directory in [self.active_dir, self.ended_dir, self.archived_dir]:
            if os.path.exists(directory):
                for filename in os.listdir(directory):
                    if filename.endswith('.json') and filename != 'manifest.json':
                        filepath = os.path.join(directory, filename)
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                campaign_data = json.load(f)
                                campaign_id = campaign_data.get('id')
                                if campaign_id:
                                    self.existing_campaigns[campaign_id] = campaign_data
                                    print(f"Loaded existing campaign: {campaign_data.get('title', campaign_id)}")
                        except Exception as e:
                            print(f"Warning: Could not load {filepath}: {e}")
        
        print(f"Loaded {len(self.existing_campaigns)} existing campaigns")
    
    def _slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug."""
        # Remove special characters and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', text.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def _parse_amount(self, amount_str: str) -> int:
        """Parse amount string to integer."""
        if not amount_str or amount_str.strip() == '':
            return 0
        # Remove commas and convert to int
        return int(str(amount_str).replace(',', ''))
    
    def _determine_status(self, csv_status: str, raised_amount: int, target_amount: int) -> str:
        """Determine campaign status based on CSV status and amounts."""
        if not csv_status or csv_status.strip() == '':
            # If no status, determine based on amounts
            if raised_amount >= target_amount:
                return "ended"
            else:
                return "active"
        
        csv_status = csv_status.lower().strip()
        if csv_status in ['ended', 'completed', 'finished']:
            return "ended"
        elif csv_status in ['active', 'in progress', 'ongoing']:
            return "active"
        elif csv_status in ['archived', 'paused']:
            return "archived"
        else:
            return "active"  # Default to active
    
    def _determine_urgency(self, urgency_str: str) -> str:
        """Determine urgency level."""
        if not urgency_str:
            return "medium"
        
        urgency = urgency_str.lower().strip()
        if urgency in ['high', 'urgent']:
            return "high"
        elif urgency in ['low']:
            return "low"
        else:
            return "medium"
    
    def _create_campaign_id(self, title: str) -> str:
        """Create a unique campaign ID from title."""
        return self._slugify(title)
    
    def _parse_timeline_events(self, rows: List[Dict]) -> List[Dict]:
        """Parse timeline events for a campaign from multiple CSV rows."""
        timeline = []
        for row in rows:
            if row.get('date') and row.get('event'):
                timeline.append({
                    "date": row['date'],
                    "event": row['event'],
                    "description": row.get('description', '')
                })
        return sorted(timeline, key=lambda x: x['date'])
    
    def _create_campaign_json(self, campaign_data: Dict) -> Dict:
        """Create the campaign JSON structure, merging with existing data."""
        campaign_id = self._create_campaign_id(campaign_data['title'])
        
        # Start with existing campaign data if available
        existing = self.existing_campaigns.get(campaign_id, {})
        
        # Parse amounts from CSV
        target_amount = self._parse_amount(campaign_data.get('targetAmount', '0'))
        raised_amount = self._parse_amount(campaign_data.get('raisedAmount', '0'))
        
        # Determine status (prefer CSV status, fall back to existing)
        csv_status = campaign_data.get('status', '')
        status = self._determine_status(csv_status, raised_amount, target_amount)
        if not csv_status and existing.get('status'):
            status = existing['status']
        
        # Create patient details (merge CSV with existing)
        patient_details = existing.get('patientDetails', {})
        if campaign_data.get('name'):
            csv_patient = {
                "name": campaign_data.get('name', ''),
                "age": campaign_data.get('age', ''),
                "location": campaign_data.get('location', ''),
                "condition": campaign_data.get('condition', ''),
                "hospital": campaign_data.get('hospital', ''),
                "doctor": campaign_data.get('doctor', '')
            }
            # Update with CSV data, but keep existing if CSV is empty
            for key, value in csv_patient.items():
                if value or key not in patient_details:
                    patient_details[key] = value
        
        # Merge timeline (combine CSV timeline with existing)
        timeline = existing.get('timeline', [])
        if campaign_data.get('timeline'):
            csv_timeline = campaign_data['timeline']
            # Add CSV timeline events that don't already exist
            existing_events = {(t.get('date'), t.get('event')) for t in timeline}
            for csv_event in csv_timeline:
                event_key = (csv_event.get('date'), csv_event.get('event'))
                if event_key not in existing_events:
                    timeline.append(csv_event)
            # Sort timeline by date
            timeline = sorted(timeline, key=lambda x: x.get('date', ''))
        
        # Create campaign JSON (prefer existing values, update with CSV)
        campaign_json = {
            "id": campaign_id,
            "title": campaign_data['title'],
            "shortDescription": campaign_data.get('shortDescription') or existing.get('shortDescription', ''),
            "fullDescription": campaign_data.get('fullDescription') or existing.get('fullDescription', ''),
            "image": campaign_data.get('image') or existing.get('image', ''),
            "targetAmount": target_amount,
            "raisedAmount": raised_amount,
            "currency": existing.get('currency', 'INR'),
            "status": status,
            "urgency": self._determine_urgency(campaign_data.get('urgency', '')) or existing.get('urgency', 'medium'),
            "category": campaign_data.get('category', '').lower() or existing.get('category', 'medical')
        }
        
        # Add patient details if available
        if patient_details and patient_details.get('name'):
            campaign_json["patientDetails"] = patient_details
        
        # Add timeline if available
        if timeline:
            campaign_json["timeline"] = timeline
        
        # Preserve existing metadata or use defaults
        campaign_json["createdDate"] = existing.get('createdDate', datetime.now().strftime("%Y-%m-%d"))
        campaign_json["lastUpdated"] = existing.get('lastUpdated', datetime.now().strftime("%Y-%m-%d"))
        
        # Merge tags (combine existing with CSV-derived tags)
        existing_tags = set(existing.get('tags', []))
        csv_tags = set()
        
        # Add tags from CSV data
        if campaign_data.get('condition'):
            csv_tags.update(campaign_data['condition'].lower().split())
        if campaign_data.get('category'):
            csv_tags.add(campaign_data['category'].lower())
        if patient_details.get('age'):
            try:
                age = int(patient_details['age'])
                if age < 18:
                    csv_tags.add('pediatric')
            except (ValueError, TypeError):
                pass
        
        # Combine existing and CSV tags
        all_tags = existing_tags.union(csv_tags)
        campaign_json["tags"] = sorted(list(all_tags))
        
        return campaign_json
    
    def parse_csv(self) -> Dict[str, List[Dict]]:
        """Parse the CSV file and return campaigns organized by status."""
        campaigns = {"active": [], "ended": [], "archived": []}
        
        if not os.path.exists(self.csv_file):
            print(f"Error: {self.csv_file} not found!")
            return campaigns
        
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                # Group rows by campaign title
                campaign_groups = {}
                for row in reader:
                    title = row.get('title', '').strip()
                    if not title:
                        continue
                    
                    if title not in campaign_groups:
                        campaign_groups[title] = []
                    campaign_groups[title].append(row)
                
                # Process each campaign group
                for title, rows in campaign_groups.items():
                    # Use the first row as the main campaign data
                    main_row = rows[0]
                    
                    # Parse timeline from all rows
                    timeline = self._parse_timeline_events(rows)
                    
                    # Create campaign data
                    campaign_data = {
                        'title': title,
                        'shortDescription': main_row.get('shortDescription', ''),
                        'fullDescription': main_row.get('fullDescription', ''),
                        'image': main_row.get('image (link to images if any)', ''),
                        'targetAmount': main_row.get('targetAmount', '0'),
                        'raisedAmount': main_row.get('raisedAmount', '0'),
                        'status': main_row.get('status', ''),
                        'urgency': main_row.get('urgency', ''),
                        'category': main_row.get('category', 'medical'),
                        'name': main_row.get('name', ''),
                        'age': main_row.get('age', ''),
                        'location': main_row.get('location', ''),
                        'condition': main_row.get('condition', ''),
                        'hospital': main_row.get('hospital', ''),
                        'doctor': main_row.get('doctor', ''),
                        'timeline': timeline
                    }
                    
                    # Create campaign JSON
                    campaign_json = self._create_campaign_json(campaign_data)
                    
                    # Add to appropriate status group
                    status = campaign_json['status']
                    campaigns[status].append(campaign_json)
                    
                    print(f"Processed campaign: {title} -> {status}")
        
        except Exception as e:
            print(f"Error parsing CSV: {e}")
            return campaigns
        
        return campaigns
    
    def write_json_files(self, campaigns: Dict[str, List[Dict]]):
        """Write campaign JSON files to appropriate directories."""
        
        for status, campaign_list in campaigns.items():
            if not campaign_list:
                continue
            
            # Determine target directory
            if status == "active":
                target_dir = self.active_dir
            elif status == "ended":
                target_dir = self.ended_dir
            else:
                target_dir = self.archived_dir
            
            # Write individual campaign files
            manifest_files = []
            for campaign in campaign_list:
                filename = f"{campaign['id']}.json"
                filepath = os.path.join(target_dir, filename)
                
                try:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(campaign, f, indent=2, ensure_ascii=False)
                    
                    manifest_files.append(filename)
                    print(f"Created: {filepath}")
                
                except Exception as e:
                    print(f"Error writing {filepath}: {e}")
            
            # Create manifest file
            if manifest_files:
                self._create_manifest(target_dir, manifest_files)
    
    def _create_manifest(self, directory: str, campaign_files: List[str]):
        """Create manifest.json file for a directory."""
        manifest = {
            "campaigns": sorted(campaign_files),
            "lastUpdated": datetime.now().isoformat() + "Z"
        }
        
        manifest_path = os.path.join(directory, "manifest.json")
        try:
            with open(manifest_path, 'w', encoding='utf-8') as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            print(f"Created manifest: {manifest_path}")
        except Exception as e:
            print(f"Error creating manifest {manifest_path}: {e}")
    
    def convert(self):
        """Main conversion process."""
        print(f"Starting conversion of {self.csv_file}...")
        print("-" * 50)
        
        # Parse CSV
        campaigns = self.parse_csv()
        
        # Display summary
        total_campaigns = sum(len(campaign_list) for campaign_list in campaigns.values())
        print(f"\nConversion Summary:")
        print(f"Total campaigns: {total_campaigns}")
        for status, campaign_list in campaigns.items():
            print(f"  {status.title()}: {len(campaign_list)}")
        
        if total_campaigns == 0:
            print("No campaigns found to convert.")
            return
        
        # Write JSON files
        print(f"\nWriting JSON files...")
        print("-" * 50)
        self.write_json_files(campaigns)
        
        print(f"\nConversion completed successfully!")
        print(f"JSON files created in: {self.campaigns_dir}/")
        print(f"  - Active campaigns: {self.active_dir}/")
        print(f"  - Ended campaigns: {self.ended_dir}/")
        print(f"  - Archived campaigns: {self.archived_dir}/")


def main():
    """Main entry point."""
    print("Sevabrata Foundation - CSV to JSON Converter")
    print("=" * 50)
    
    converter = CampaignConverter()
    converter.convert()


if __name__ == "__main__":
    main()