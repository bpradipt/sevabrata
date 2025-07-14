#!/bin/bash

# Sevabrata Foundation - Campaign Converter Script
# Simple wrapper script to run the CSV to JSON converter

echo "Sevabrata Foundation - Campaign Converter"
echo "========================================"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not found."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check if the CSV file exists
if [ ! -f "master_campaign_details.csv" ]; then
    echo "Error: master_campaign_details.csv not found in current directory."
    echo "Please ensure the CSV file is present and try again."
    exit 1
fi

# Run the converter
echo "Running CSV to JSON converter..."
python3 csv_to_json_converter.py

# Check if conversion was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Conversion completed successfully!"
    echo ""
    echo "Generated files:"
    echo "📁 campaigns/active/ - Active campaign JSON files"
    echo "📁 campaigns/ended/ - Completed campaign JSON files"
    echo "📄 manifest.json files in each directory"
    echo ""
    echo "You can now test the website by running:"
    echo "python3 -m http.server 8000"
else
    echo ""
    echo "❌ Conversion failed. Please check the error messages above."
    exit 1
fi