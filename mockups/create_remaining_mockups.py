#!/usr/bin/env python3
"""Generate remaining HTML mockups 17-25"""

mockups = [
    {
        "num": 17,
        "filename": "17-packing-list.html",
        "title": "Event Packing List",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Packing List</h2>
            <p class="text-gray-600 mt-1">Summer Music Festival • Downtown Park</p>
        </div>

        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2">
                <div class="bg-white rounded-lg shadow">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Equipment Checklist (11 items)</h3>
                    </div>
                    <div class="divide-y">
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">📷 Sony A7SIII #1</div>
                                <div class="text-sm text-gray-500">Camera • Serial: CAM001</div>
                            </div>
                            <span class="text-sm text-gray-500">In Shop</span>
                        </label>
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">📷 Sony A7SIII #2</div>
                                <div class="text-sm text-gray-500">Camera • Serial: CAM002</div>
                            </div>
                            <span class="text-sm text-green-600">✓ Packed</span>
                        </label>
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">🎙️ Wireless Mic Kit</div>
                                <div class="text-sm text-gray-500">Audio • Kit #1</div>
                            </div>
                            <span class="text-sm text-gray-500">In Shop</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-sm font-semibold mb-4">Summary</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Total Items:</span>
                            <span class="font-medium">11</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Packed:</span>
                            <span class="font-medium text-green-600">1</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Remaining:</span>
                            <span class="font-medium text-yellow-600">10</span>
                        </div>
                    </div>
                    <button class="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Mark All Packed</button>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 18,
        "filename": "18-gig-sheet-preview.html",
        "title": "Gig Sheet - Operator View",
        "content": '''
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow p-8">
                <div class="text-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">GIG SHEET</h1>
                    <p class="text-gray-600 mt-2">Summer Music Festival</p>
                </div>

                <div class="space-y-6">
                    <div class="border-l-4 border-purple-500 pl-4">
                        <h2 class="font-semibold text-gray-900">OPERATOR</h2>
                        <p class="text-gray-700">John Doe</p>
                        <p class="text-sm text-gray-600">john@email.com • (555) 123-4567</p>
                    </div>

                    <div class="border-l-4 border-blue-500 pl-4">
                        <h2 class="font-semibold text-gray-900">EVENT DETAILS</h2>
                        <p class="text-gray-700">Client: ABC Events Corp</p>
                        <p class="text-gray-700">Venue: Downtown Park</p>
                        <p class="text-sm text-gray-600">123 Main St, Los Angeles, CA 90012</p>
                    </div>

                    <div class="border-l-4 border-green-500 pl-4">
                        <h2 class="font-semibold text-gray-900 mb-3">YOUR SHIFTS</h2>
                        <div class="space-y-3">
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="font-medium">Saturday Morning - Videographer</div>
                                <div class="text-sm text-gray-600">9:00 AM - 1:00 PM (4 hours)</div>
                                <div class="text-sm text-gray-600">Pay: $50/hr × 4h = $200.00</div>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="font-medium">Saturday Afternoon - Photographer</div>
                                <div class="text-sm text-gray-600">2:00 PM - 6:00 PM (4 hours)</div>
                                <div class="text-sm text-gray-600">Pay: Flat Rate $175.00</div>
                            </div>
                        </div>
                    </div>

                    <div class="border-l-4 border-yellow-500 pl-4">
                        <h2 class="font-semibold text-gray-900 mb-2">TRAVEL ITINERARY</h2>
                        <div class="text-sm space-y-2">
                            <div>🏠 8:15 AM - Leave Home (123 Maple St)</div>
                            <div class="ml-4 text-gray-600">↓ 25-40 min (traffic)</div>
                            <div>📍 9:00 AM - Arrive Downtown Park</div>
                            <div class="ml-4 text-gray-600">(1 hour break)</div>
                            <div>📍 2:00 PM - Shift 2 (same venue)</div>
                        </div>
                    </div>

                    <div class="border-l-4 border-red-500 pl-4">
                        <h2 class="font-semibold text-gray-900 mb-2">COMPANY EQUIPMENT</h2>
                        <ul class="text-sm space-y-1">
                            <li>• Sony A7SIII #1</li>
                            <li>• 24-70mm Lens</li>
                            <li>• Wireless Mic Kit</li>
                        </ul>
                    </div>

                    <div class="border-l-4 border-purple-500 pl-4">
                        <h2 class="font-semibold text-gray-900 mb-2">🎒 BRING YOUR OWN</h2>
                        <ul class="text-sm space-y-1 text-gray-700">
                            <li>• ⚠️ Sony 70-200mm Lens (requested)</li>
                            <li>• ⚠️ Your tripod (requested)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 19,
        "filename": "19-gig-sheet-travel-itinerary.html",
        "title": "Travel Itinerary Detail",
        "content": '''
        <div class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Travel Itinerary - John Doe</h2>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="text-3xl mr-4">🏠</div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">8:15 AM - Leave Home</div>
                            <div class="text-sm text-gray-600">123 Maple St, Los Angeles, CA</div>
                            <div class="mt-2 text-sm">
                                <div class="text-gray-600">↓ 25-40 min (depending on traffic)</div>
                                <div class="text-yellow-600 mt-1">🟡 Caution: Saturday morning traffic</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="text-3xl mr-4">📍</div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">9:00 AM - Shift 1 (Videographer)</div>
                            <div class="text-sm text-gray-600">Downtown Park</div>
                            <div class="text-sm text-gray-600">123 Main St, Los Angeles, CA</div>
                            <div class="mt-2 p-3 bg-blue-50 rounded">
                                <div class="text-sm text-blue-900">Work: 9:00 AM - 1:00 PM (4 hours)</div>
                                <div class="text-sm text-blue-700">Pay: $50/hr × 4h = $200</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="text-3xl mr-4">⏸️</div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">1:00 PM - Break</div>
                            <div class="text-sm text-gray-600">1 hour lunch break</div>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="text-3xl mr-4">📍</div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">2:00 PM - Shift 2 (Photographer)</div>
                            <div class="text-sm text-gray-600">Downtown Park (same venue)</div>
                            <div class="mt-2 p-3 bg-blue-50 rounded">
                                <div class="text-sm text-blue-900">Work: 2:00 PM - 6:00 PM (4 hours)</div>
                                <div class="text-sm text-blue-700">Pay: Flat Rate $175</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="text-3xl mr-4">🏠</div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">6:00 PM - Head Home</div>
                            <div class="text-sm text-gray-600">↓ 35-50 min (rush hour traffic)</div>
                            <div class="text-red-600 text-sm mt-1">🔴 Alert: Heavy traffic expected</div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 pt-6 border-t border-gray-200">
                    <div class="text-sm text-gray-600">
                        <div class="font-semibold text-gray-900 mb-2">Summary</div>
                        <div>Total Work Time: 8 hours</div>
                        <div>Total Travel Time: ~2 hours</div>
                        <div>Estimated Day Length: 10 hours</div>
                    </div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 20,
        "filename": "20-send-gig-sheets.html",
        "title": "Send Gig Sheets",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Send Gig Sheets</h2>
            <p class="text-gray-600 mt-1">Summer Music Festival</p>
        </div>

        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2">
                <div class="bg-white rounded-lg shadow">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Select Operators (12)</h3>
                    </div>
                    <div class="divide-y">
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">John Doe</div>
                                <div class="text-sm text-gray-500">john@email.com • 2 shifts</div>
                            </div>
                            <button class="text-sm text-purple-600 hover:underline">Preview</button>
                        </label>
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">Sarah Miller</div>
                                <div class="text-sm text-gray-500">sarah@email.com • 3 shifts</div>
                            </div>
                            <button class="text-sm text-purple-600 hover:underline">Preview</button>
                        </label>
                        <label class="flex items-center p-4 hover:bg-gray-50 cursor-pointer bg-yellow-50">
                            <input type="checkbox" class="w-5 h-5 text-purple-600 rounded">
                            <div class="ml-4 flex-1">
                                <div class="font-medium">Mike Thompson</div>
                                <div class="text-sm text-gray-500">mike@email.com • 1 shift</div>
                                <div class="text-xs text-yellow-700 mt-1">⚠️ Missing personal equipment requests</div>
                            </div>
                            <button class="text-sm text-purple-600 hover:underline">Preview</button>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-sm font-semibold mb-4">Email Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-700 mb-2">Subject Line</label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded" value="Your Gig Sheet - Summer Music Festival">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-2">Include</label>
                            <div class="space-y-2 text-sm">
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="w-4 h-4 text-purple-600 rounded">
                                    <span class="ml-2">Calendar .ics file</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="w-4 h-4 text-purple-600 rounded">
                                    <span class="ml-2">PDF attachment</span>
                                </label>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-gray-200">
                            <div class="text-sm text-gray-600 mb-4">
                                <div>Selected: 2 operators</div>
                                <div class="text-xs text-yellow-600 mt-1">1 operator has warnings</div>
                            </div>
                            <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send Gig Sheets</button>
                            <button class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 21,
        "filename": "21-training-list.html",
        "title": "Training Sessions",
        "content": '''
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Training Sessions</h2>
            <button class="px-4 py-2 bg-purple-600 text-white rounded-lg">+ Schedule Training</button>
        </div>

        <div class="bg-white rounded-lg shadow">
            <div class="divide-y">
                <div class="p-6 hover:bg-gray-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold text-gray-900">Advanced Videography Techniques</h3>
                            <p class="text-sm text-gray-600 mt-1">Mon, Jun 17 • 2:00 PM - 5:00 PM (3 hours)</p>
                            <p class="text-sm text-gray-600">Studio A • Conference Room</p>
                            <div class="flex items-center space-x-4 mt-3">
                                <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">8 attendees</span>
                                <span class="text-sm text-gray-600">5 agenda items</span>
                            </div>
                        </div>
                        <button class="text-sm text-purple-600 hover:underline">View Details</button>
                    </div>
                </div>

                <div class="p-6 hover:bg-gray-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold text-gray-900">Client Relations & Professionalism</h3>
                            <p class="text-sm text-gray-600 mt-1">Wed, Jun 19 • 10:00 AM - 12:00 PM (2 hours)</p>
                            <p class="text-sm text-gray-600">Studio A • Conference Room</p>
                            <div class="flex items-center space-x-4 mt-3">
                                <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">12 attendees</span>
                                <span class="text-sm text-gray-600">3 agenda items</span>
                            </div>
                        </div>
                        <button class="text-sm text-purple-600 hover:underline">View Details</button>
                    </div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 22,
        "filename": "22-training-detail.html",
        "title": "Training Detail",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Advanced Videography Techniques</h2>
            <p class="text-gray-600 mt-1">Mon, Jun 17 • 2:00 PM - 5:00 PM (3 hours)</p>
        </div>

        <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2 space-y-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Training Agenda</h3>
                    <div class="space-y-3">
                        <div class="flex items-start p-3 bg-gray-50 rounded">
                            <div class="text-sm font-medium text-gray-500 mr-4">30 min</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Camera Settings Deep Dive</div>
                                <div class="text-sm text-gray-600 mt-1">ISO, shutter speed, and frame rate optimization</div>
                            </div>
                        </div>
                        <div class="flex items-start p-3 bg-gray-50 rounded">
                            <div class="text-sm font-medium text-gray-500 mr-4">45 min</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Lighting Techniques</div>
                                <div class="text-sm text-gray-600 mt-1">Natural vs artificial, 3-point lighting setups</div>
                            </div>
                        </div>
                        <div class="flex items-start p-3 bg-gray-50 rounded">
                            <div class="text-sm font-medium text-gray-500 mr-4">60 min</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Composition & Framing</div>
                                <div class="text-sm text-gray-600 mt-1">Rule of thirds, leading lines, depth of field</div>
                            </div>
                        </div>
                        <div class="flex items-start p-3 bg-gray-50 rounded">
                            <div class="text-sm font-medium text-gray-500 mr-4">45 min</div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Hands-On Practice</div>
                                <div class="text-sm text-gray-600 mt-1">Apply techniques with feedback</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Attendees (8)</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center p-3 bg-gray-50 rounded">
                            <div class="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-semibold text-sm">JD</div>
                            <div class="ml-3 text-sm font-medium">John Doe</div>
                        </div>
                        <div class="flex items-center p-3 bg-gray-50 rounded">
                            <div class="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-semibold text-sm">SM</div>
                            <div class="ml-3 text-sm font-medium">Sarah Miller</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-sm font-semibold mb-4">Training Info</h3>
                    <div class="space-y-3 text-sm">
                        <div>
                            <div class="text-gray-500">Date & Time</div>
                            <div class="font-medium">Mon, Jun 17</div>
                            <div class="font-medium">2:00 PM - 5:00 PM</div>
                        </div>
                        <div>
                            <div class="text-gray-500">Location</div>
                            <div class="font-medium">Studio A</div>
                            <div class="font-medium">Conference Room</div>
                        </div>
                        <div>
                            <div class="text-gray-500">Attendees</div>
                            <div class="font-medium">8 registered</div>
                        </div>
                        <div>
                            <div class="text-gray-500">Agenda Items</div>
                            <div class="font-medium">4 topics</div>
                        </div>
                    </div>
                    <button class="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Edit Training</button>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 23,
        "filename": "23-skill-upgrade-approval.html",
        "title": "Approve Skill Upgrades",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Skill Upgrade Requests</h2>
            <p class="text-gray-600 mt-1">After training completion</p>
        </div>

        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-semibold">JD</div>
                        <div class="ml-4">
                            <h3 class="font-semibold text-gray-900">John Doe</h3>
                            <p class="text-sm text-gray-600">Completed: Advanced Videography Techniques</p>
                            <p class="text-xs text-gray-500">Jun 17, 2025</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded">
                        <div class="text-sm text-gray-600 mb-2">Videography Skill</div>
                        <div class="flex items-center">
                            <span class="text-2xl font-bold text-gray-900">7</span>
                            <span class="mx-3 text-gray-400">→</span>
                            <span class="text-2xl font-bold text-green-600">9</span>
                        </div>
                        <div class="text-xs text-gray-600 mt-2">Proposed increase: +2 levels</div>
                    </div>

                    <div class="p-4 bg-gray-50 rounded">
                        <div class="text-sm text-gray-600 mb-2">Photography Skill</div>
                        <div class="text-2xl font-bold text-gray-900">7</div>
                        <div class="text-xs text-gray-600 mt-2">No change</div>
                    </div>
                </div>

                <div class="mt-4 p-3 bg-gray-50 rounded">
                    <div class="text-sm text-gray-700">
                        <div class="font-medium mb-1">Notes:</div>
                        <p>Excellent performance in training. Demonstrated mastery of advanced lighting techniques and composition. Ready for more complex videography assignments.</p>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-4">
                    <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Reject</button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve Upgrade</button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6 opacity-60">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-semibold">SM</div>
                        <div class="ml-4">
                            <h3 class="font-semibold text-gray-900">Sarah Miller</h3>
                            <p class="text-sm text-gray-600">Completed: Client Relations & Professionalism</p>
                            <p class="text-xs text-gray-500">Jun 19, 2025</p>
                        </div>
                    </div>
                </div>

                <div class="text-center py-6 text-gray-500">
                    <div class="text-sm">No skill upgrades requested for this training</div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 24,
        "filename": "24-conflict-resolution.html",
        "title": "Resolve Scheduling Conflicts",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Scheduling Conflicts</h2>
            <p class="text-gray-600 mt-1">Review and resolve operator, equipment, and vehicle conflicts</p>
        </div>

        <div class="space-y-6">
            <!-- Operator Conflict -->
            <div class="bg-white rounded-lg shadow border-l-4 border-yellow-400">
                <div class="p-6">
                    <div class="flex items-start justify-between">
                        <div class="flex items-start">
                            <div class="text-3xl mr-4">⚠️</div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Operator Double-Booking</h3>
                                <p class="text-sm text-gray-600 mt-1">Mike Thompson assigned to overlapping shifts</p>

                                <div class="mt-4 space-y-3">
                                    <div class="p-3 bg-yellow-50 rounded">
                                        <div class="font-medium text-sm">Corporate Video - Morning</div>
                                        <div class="text-xs text-gray-600">Sat, Jun 15 • 8:00 AM - 12:00 PM</div>
                                        <div class="text-xs text-gray-600">Tech Corp HQ, San Francisco</div>
                                    </div>

                                    <div class="text-center text-gray-400 text-sm">overlaps with ↓</div>

                                    <div class="p-3 bg-yellow-50 rounded">
                                        <div class="font-medium text-sm">Festival - Morning</div>
                                        <div class="text-xs text-gray-600">Sat, Jun 15 • 9:00 AM - 1:00 PM</div>
                                        <div class="text-xs text-gray-600">Downtown Park, Los Angeles</div>
                                    </div>
                                </div>

                                <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                    <div class="text-sm text-red-700">
                                        <div class="font-medium">Issues:</div>
                                        <div>• 3 hour overlap (9am-12pm)</div>
                                        <div>• 60-90 min travel time between venues</div>
                                        <div>• Impossible to attend both shifts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Unassign One</button>
                            <button class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Find Replacement</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Equipment Conflict -->
            <div class="bg-white rounded-lg shadow border-l-4 border-orange-400">
                <div class="p-6">
                    <div class="flex items-start justify-between">
                        <div class="flex items-start">
                            <div class="text-3xl mr-4">📷</div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Equipment Double-Booking</h3>
                                <p class="text-sm text-gray-600 mt-1">Sony A7SIII #1 assigned to 2 events</p>

                                <div class="mt-4 space-y-3">
                                    <div class="p-3 bg-orange-50 rounded">
                                        <div class="font-medium text-sm">Summer Festival</div>
                                        <div class="text-xs text-gray-600">Jun 14-16 (3 days)</div>
                                    </div>

                                    <div class="text-center text-gray-400 text-sm">conflicts with ↓</div>

                                    <div class="p-3 bg-orange-50 rounded">
                                        <div class="font-medium text-sm">Corporate Video</div>
                                        <div class="text-xs text-gray-600">Jun 15 (1 day)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Reassign Equipment</button>
                            <button class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Allow with Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Conflicts -->
            <div class="bg-white rounded-lg shadow border-l-4 border-green-400">
                <div class="p-6">
                    <div class="flex items-start">
                        <div class="text-3xl mr-4">✅</div>
                        <div>
                            <h3 class="font-semibold text-gray-900">No Vehicle Conflicts</h3>
                            <p class="text-sm text-gray-600 mt-1">All vehicles properly scheduled</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        '''
    },
    {
        "num": 25,
        "filename": "25-travel-time-warnings.html",
        "title": "Travel Time & Rush Hour Warnings",
        "content": '''
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Travel Time Analysis</h2>
            <p class="text-gray-600 mt-1">Saturday, June 15 • All Operators</p>
        </div>

        <div class="space-y-6">
            <!-- Good Travel Time -->
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-semibold mr-3">JD</div>
                            <div>
                                <div class="font-semibold text-gray-900">John Doe</div>
                                <div class="text-sm text-gray-600">Saturday Morning → Afternoon</div>
                            </div>
                        </div>

                        <div class="ml-13 mt-3 space-y-2 text-sm">
                            <div>🏠 Home (123 Maple St)</div>
                            <div class="ml-4 text-gray-600">↓ 25-40 min</div>
                            <div>📍 Downtown Park (9:00 AM shift)</div>
                            <div class="ml-4 text-gray-600">(1 hour break, same venue)</div>
                            <div>📍 Downtown Park (2:00 PM shift)</div>
                        </div>

                        <div class="mt-3 p-3 bg-blue-50 rounded">
                            <div class="text-sm text-blue-700">
                                <div class="font-medium">🔵 Info: Reasonable schedule</div>
                                <div class="text-xs mt-1">Same venue, adequate break time</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Caution Travel Time -->
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-semibold mr-3">SM</div>
                            <div>
                                <div class="font-semibold text-gray-900">Sarah Miller</div>
                                <div class="text-sm text-gray-600">Morning shift commute</div>
                            </div>
                        </div>

                        <div class="ml-13 mt-3 space-y-2 text-sm">
                            <div>🏠 Home (456 Oak Ave, Santa Monica)</div>
                            <div class="ml-4 text-gray-600">↓ 35-65 min (traffic variable)</div>
                            <div>📍 Downtown Park (9:00 AM shift)</div>
                        </div>

                        <div class="mt-3 p-3 bg-yellow-50 rounded">
                            <div class="text-sm text-yellow-700">
                                <div class="font-medium">🟡 Caution: Traffic possible</div>
                                <div class="text-xs mt-1">Saturday morning traffic on I-10</div>
                                <div class="text-xs">Recommended departure: 7:55 AM - 8:00 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Critical Travel Time -->
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-400">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold mr-3">MT</div>
                            <div>
                                <div class="font-semibold text-gray-900">Mike Thompson</div>
                                <div class="text-sm text-gray-600">Corporate HQ → Festival</div>
                            </div>
                        </div>

                        <div class="ml-13 mt-3 space-y-2 text-sm">
                            <div>📍 Tech Corp HQ (ends 12:00 PM)</div>
                            <div class="ml-4 text-gray-600">↓ 60-90 min (lunch hour traffic)</div>
                            <div>📍 Downtown Park (1:00 PM shift)</div>
                        </div>

                        <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <div class="text-sm text-red-700">
                                <div class="font-medium">🔴 Alert: Very tight schedule</div>
                                <div class="text-xs mt-1">• Only 1 hour between shifts</div>
                                <div class="text-xs">• 60-90 min travel time required</div>
                                <div class="text-xs">• High risk of late arrival</div>
                                <div class="text-xs">• Consider: reassign or adjust times</div>
                            </div>
                        </div>
                    </div>
                    <button class="px-4 py-2 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100">Resolve Conflict</button>
                </div>
            </div>
        </div>
        '''
    }
]

base_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - CommandCentered</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-purple-600">CommandCentered</h1>
                    <div class="ml-10 flex space-x-4">
                        <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Dashboard</a>
                        <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Calendar</a>
                        <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Events</a>
                        <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Operators</a>
                        <a href="#" class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Equipment</a>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-600">Acme Video Productions</span>
                    <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">JD</div>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {content}
    </main>
</body>
</html>'''

for mockup in mockups:
    html = base_template.format(title=mockup["title"], content=mockup["content"])
    with open(mockup["filename"], "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Created: {mockup['filename']}")

print(f"\nAll {len(mockups)} mockups created successfully!")
