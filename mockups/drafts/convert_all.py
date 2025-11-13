#!/usr/bin/env python3
"""
Batch convert HTML mockups to PNG
This script creates a list of commands to manually convert each mockup
"""

mockups = [
    "01-login.html",
    "02-dashboard-home.html",
    "03-calendar-month-view.html",
    "04-event-create.html",
    "05-event-detail-shifts.html",
    "06-shift-assignment.html",
    "07-shift-create.html",
    "08-shift-pay-negotiation.html",
    "09-operators-list.html",
    "10-operator-profile.html",
    "11-operator-personal-equipment.html",
    "12-operator-skills.html",
    "13-operator-blackout-dates.html",
    "14-equipment-list.html",
    "15-equipment-detail.html",
    "16-equipment-location-tracking.html",
    "17-packing-list.html",
    "18-gig-sheet-preview.html",
    "19-gig-sheet-travel-itinerary.html",
    "20-send-gig-sheets.html",
    "21-training-list.html",
    "22-training-detail.html",
    "23-skill-upgrade-approval.html",
    "24-conflict-resolution.html",
    "25-travel-time-warnings.html",
]

print("HTML Mockups to Convert:")
print("=" * 60)
for i, mockup in enumerate(mockups, 1):
    url = f"file:///D:/ClaudeCode/CommandCentered/mockups/{mockup}"
    png_name = mockup.replace('.html', '.png')
    print(f"{i:2d}. {mockup:40s} → {png_name}")

print(f"\nTotal: {len(mockups)} mockups")
print("\nNavigate to each file:// URL and take screenshot with Playwright MCP")
