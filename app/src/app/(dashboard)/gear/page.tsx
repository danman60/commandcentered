'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function GearPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'calendar' | 'maintenance' | 'kits'>('inventory');
  const [activeView, setActiveView] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch gear
  const { data: gear } = trpc.gear.list.useQuery({
    search: searchQuery || undefined,
  });

  // Mock data for demonstration
  const gearData = [
    {
      id: '1',
      name: 'Canon EOS R5',
      category: 'Camera',
      type: 'Full-Frame Mirrorless',
      serialNumber: 'CFJ012345',
      purchaseDate: '2023-01-15',
      status: 'available',
      icon: '📷',
    },
    {
      id: '2',
      name: 'Sony FX30',
      category: 'Camera',
      type: 'Cinema Camera',
      serialNumber: 'SONY98765',
      purchaseDate: '2023-06-20',
      status: 'in-use',
      icon: '🎥',
    },
    {
      id: '3',
      name: 'Rode Wireless GO II',
      category: 'Audio',
      type: 'Wireless Microphone',
      serialNumber: 'RODE54321',
      purchaseDate: '2023-03-10',
      status: 'available',
      icon: '🔊',
    },
    {
      id: '4',
      name: 'Neewer LED Panel',
      category: 'Lighting',
      type: 'Bi-Color LED',
      serialNumber: 'NWLED99999',
      purchaseDate: '2023-02-28',
      status: 'repair',
      icon: '💡',
    },
    {
      id: '5',
      name: 'HDMI Cable Bundle',
      category: 'Cable',
      type: 'Audio/Video Cable Set',
      serialNumber: 'CABLE00001',
      purchaseDate: '2023-01-05',
      status: 'available',
      icon: '🔌',
    },
    {
      id: '6',
      name: 'Ronin 4D Gimbal',
      category: 'Rigging',
      type: 'Stabilization Gimbal',
      serialNumber: 'DJI456789',
      purchaseDate: '2024-01-12',
      status: 'retired',
      icon: '🎬',
    },
  ];

  const kitData = [
    {
      id: '1',
      name: 'Standard Dance Kit',
      description: 'Complete setup for single-camera dance events',
      items: [
        { name: 'Canon EOS R5', type: 'Full-Frame Mirrorless Camera', status: 'available' },
        { name: 'Rode Wireless GO II', type: 'Wireless Microphone System', status: 'available' },
        { name: 'HDMI Cable Bundle', type: 'Audio/Video Cable Set', status: 'available' },
      ],
      allAvailable: true,
    },
    {
      id: '2',
      name: 'Drone Package',
      description: 'Aerial footage kit with backup batteries',
      items: [
        { name: 'DJI Air 3S', type: '4K Drone with Gimbal', status: 'available' },
        { name: 'Extra Battery Pack (x3)', type: 'DJI Flight Batteries', status: 'in-use' },
        { name: 'ND Filter Set', type: 'Neutral Density Filters', status: 'available' },
      ],
      allAvailable: false,
      conflict: 'Battery pack already assigned to "XYZ Concert" event (Nov 15)',
    },
    {
      id: '3',
      name: 'Audio Kit',
      description: 'Professional audio recording and monitoring setup',
      items: [
        { name: 'Sony FX30', type: 'Cinema Camera with Audio I/O', status: 'in-use' },
        { name: 'Sennheiser EW 100 G4', type: 'Wireless Mic System', status: 'available' },
        { name: 'Audio Interface & XLR Bundle', type: 'Audio Connectors & Equipment', status: 'available' },
      ],
      allAvailable: false,
      conflict: 'Sony FX30 assigned to "ABC Dance Recital" (Nov 8)',
    },
  ];

  const maintenanceTimeline = [
    {
      gearName: 'Canon EOS R5',
      events: [
        { date: '2025-10-15', description: 'Sensor cleaning performed by technician. Status: AVAILABLE' },
        { date: '2025-09-20', description: 'Software update (v1.4.2) installed. No issues found.' },
        { date: '2025-08-10', description: 'Annual maintenance check-up. All components functioning normally.' },
        { date: '2025-07-05', description: 'Battery replaced. Original battery at 85% capacity.' },
      ],
    },
    {
      gearName: 'Neewer LED Panel',
      isInRepair: true,
      events: [
        { date: '2025-11-01', description: 'Sent to technician. Issue: Power supply malfunction. Status: IN REPAIR' },
        { date: '2025-10-28', description: 'Intermittent power issues reported during event.' },
        { date: '2025-08-15', description: 'Warranty service: LED cooling fan replacement.' },
      ],
    },
  ];

  const activeAssignments = [
    {
      gear: 'Canon EOS R5',
      event: 'ABC Dance Recital',
      fromDate: '2025-11-08',
      toDate: '2025-11-08',
      packStatus: 'packed',
    },
    {
      gear: 'Sony FX30',
      event: 'XYZ Concert',
      fromDate: '2025-11-15',
      toDate: '2025-11-16',
      packStatus: 'at-event',
    },
    {
      gear: 'Rode Wireless GO II',
      event: 'Metro Promo Video',
      fromDate: '2025-11-22',
      toDate: '2025-11-22',
      packStatus: 'needs-packing',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-slate-900';
      case 'in-use':
        return 'bg-blue-500 text-white';
      case 'repair':
        return 'bg-orange-500 text-slate-900';
      case 'retired':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in-use':
        return 'In Use';
      case 'repair':
        return 'In Repair';
      case 'retired':
        return 'Retired';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎥</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              Gear
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📊 Export Inventory
            </button>
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              ➕ Add Gear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6 border-b border-slate-700/30">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 font-semibold transition-all border-b-3 ${
              activeTab === 'inventory'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-slate-400 hover:text-cyan-500'
            }`}
          >
            INVENTORY
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-3 font-semibold transition-all border-b-3 ${
              activeTab === 'calendar'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-slate-400 hover:text-cyan-500'
            }`}
          >
            CALENDAR
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-6 py-3 font-semibold transition-all border-b-3 ${
              activeTab === 'maintenance'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-slate-400 hover:text-cyan-500'
            }`}
          >
            MAINTENANCE
          </button>
          <button
            onClick={() => setActiveTab('kits')}
            className={`px-6 py-3 font-semibold transition-all border-b-3 ${
              activeTab === 'kits'
                ? 'border-cyan-500 text-cyan-500'
                : 'border-transparent text-slate-400 hover:text-cyan-500'
            }`}
          >
            KITS
          </button>
        </div>

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Gear Inventory</h2>
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveView('cards')}
                  title="Card View"
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    activeView === 'cards'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
                  }`}
                >
                  📇 Card View
                </button>
                <button
                  onClick={() => setActiveView('table')}
                  title="Table View"
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    activeView === 'table'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
                  }`}
                >
                  📊 Table View
                </button>
              </div>
            </div>

            {/* Card View */}
            {activeView === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {gearData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
                  >
                    {/* Icon */}
                    <div className="w-full h-32 bg-slate-900/60 rounded-lg flex items-center justify-center text-5xl mb-4">
                      {item.icon}
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-cyan-500">{item.name}</h3>
                      <p className="text-sm text-slate-400">Category: {item.category}</p>
                      <p className="text-sm text-slate-400">Type: {item.type}</p>
                      <p className="text-sm text-slate-400">Serial: {item.serialNumber}</p>
                      <p className="text-sm text-slate-400">Purchase: {item.purchaseDate}</p>
                      <div className="mt-3">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {activeView === 'table' && (
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Name
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Category
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Type
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Serial #
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Purchase Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gearData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-slate-100 font-medium">{item.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.category}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.type}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.serialNumber}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.purchaseDate}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button className="px-3 py-1 bg-cyan-500 text-white rounded text-xs font-semibold hover:bg-cyan-600 transition-all">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Gear Assignment Calendar</h2>
              <p className="text-slate-400 text-sm mb-6">View when gear is assigned to events and deployments</p>

              {/* Simple calendar visualization */}
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700/30">
                <div className="grid grid-cols-7 gap-1">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-cyan-500 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded">
                    <div className="text-sm font-semibold text-slate-100 mb-2">4</div>
                    <div className="bg-cyan-500 text-slate-900 px-2 py-1 text-xs rounded mb-1 font-semibold">Canon R5</div>
                    <div className="bg-blue-500 text-white px-2 py-1 text-xs rounded font-semibold">Audio Kit</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">5</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">6</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">7</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">8</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">9</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">10</div>

                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">11</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">12</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded">
                    <div className="text-sm font-semibold text-slate-100 mb-2">13</div>
                    <div className="bg-green-500 text-slate-900 px-2 py-1 text-xs rounded font-semibold">LED Panel</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">14</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">15</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">16</div>
                  <div className="bg-slate-800/50 p-3 min-h-[80px] rounded text-slate-400">17</div>
                </div>
              </div>
            </div>

            {/* Active Assignments */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-4">Active Assignments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Gear
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Event
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        From Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        To Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Pack Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAssignments.map((assignment, idx) => (
                      <tr key={idx} className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors">
                        <td className="px-5 py-4 text-sm text-slate-100">{assignment.gear}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{assignment.event}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{assignment.fromDate}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{assignment.toDate}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                              assignment.packStatus === 'packed'
                                ? 'bg-green-500 text-slate-900'
                                : assignment.packStatus === 'at-event'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-slate-900'
                            }`}
                          >
                            {assignment.packStatus === 'packed'
                              ? 'Packed'
                              : assignment.packStatus === 'at-event'
                              ? 'At Event'
                              : 'Needs Packing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Maintenance & Service History</h2>
              <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
                + LOG MAINTENANCE
              </button>
            </div>

            {maintenanceTimeline.map((gear, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-500 mb-4">{gear.gearName} - Service Timeline</h3>

                {gear.isInRepair && (
                  <div className="bg-orange-500/20 border-l-3 border-orange-500 p-4 mb-4">
                    <strong className="text-orange-500">Currently In Repair</strong> - Expected completion: 2025-11-20
                  </div>
                )}

                <div className="relative pl-8">
                  {gear.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="relative pb-8 last:pb-0">
                      {/* Timeline dot */}
                      <div className="absolute left-[-1.5rem] top-0 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-800"></div>
                      {/* Timeline line */}
                      {eventIdx < gear.events.length - 1 && (
                        <div className="absolute left-[-1.25rem] top-3 w-0.5 h-full bg-slate-700/30"></div>
                      )}
                      {/* Event content */}
                      <div>
                        <div className="text-sm font-bold text-cyan-500 mb-1">{event.date}</div>
                        <div className="text-sm text-slate-400">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Upcoming Maintenance */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-500 mb-4">Upcoming Maintenance Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Gear
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Maintenance Type
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Due Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-100">Sony FX30</td>
                      <td className="px-5 py-4 text-sm text-slate-300">Sensor Cleaning</td>
                      <td className="px-5 py-4 text-sm text-slate-300">2025-12-01</td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-green-500 text-slate-900">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-100">Rode Wireless GO II</td>
                      <td className="px-5 py-4 text-sm text-slate-300">Battery Check</td>
                      <td className="px-5 py-4 text-sm text-slate-300">2025-11-25</td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-green-500 text-slate-900">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-100">HDMI Cable Bundle</td>
                      <td className="px-5 py-4 text-sm text-slate-300">Visual Inspection</td>
                      <td className="px-5 py-4 text-sm text-slate-300">2025-12-15</td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-green-500 text-slate-900">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* KITS TAB */}
        {activeTab === 'kits' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Gear Kits</h2>
              <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
                + CREATE KIT
              </button>
            </div>

            <div className="space-y-6">
              {kitData.map((kit) => (
                <div key={kit.id} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-cyan-500">{kit.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{kit.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-cyan-500 text-white rounded text-sm font-semibold hover:bg-cyan-600 transition-all">
                        EDIT
                      </button>
                      <button className="px-4 py-2 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded text-sm font-semibold hover:bg-slate-700/50 transition-all">
                        ARCHIVE
                      </button>
                    </div>
                  </div>

                  {/* Kit Items */}
                  <div className="bg-slate-900/60 border border-slate-700/30 rounded-lg p-4 mb-4 max-h-[200px] overflow-y-auto">
                    {kit.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-700/20 last:border-b-0">
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.type}</div>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            item.status === 'available' ? 'bg-green-500 text-slate-900' : 'bg-blue-500 text-white'
                          }`}
                        >
                          {item.status === 'available' ? 'Available' : 'In Use'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deploy Button + Conflict Warning */}
                  <div className="border-t border-slate-700/30 pt-4">
                    {kit.allAvailable ? (
                      <>
                        <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
                          DEPLOY TO EVENT
                        </button>
                        <span className="ml-4 text-green-500 font-semibold text-sm">✓ All items available</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-sm text-red-500">Warning: {kit.conflict}</span>
                        </div>
                        <button className="px-5 py-3 bg-slate-700/30 text-slate-400 border border-slate-700/50 rounded-lg font-semibold cursor-not-allowed">
                          DEPLOY TO EVENT
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
