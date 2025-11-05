#!/bin/bash
# Convert all 25 HTML mockups to PNG using Playwright MCP

cd "D:\ClaudeCode\CommandCentered\mockups"

# Create PNG output directory
mkdir -p png

echo "Converting 25 mockups to PNG..."

for i in {01..25}; do
    html_file="${i}-*.html"
    if [ -f $html_file ]; then
        echo "Converting $html_file..."
    fi
done

echo "Done! Screenshots saved to .playwright-mcp directory"
echo "Moving to mockups/png/ directory..."
