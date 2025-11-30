'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

type ActiveTab = 'inventory' | 'calendar' | 'maintenance' | 'kits';
type ActiveView = 'cards' | 'table';

// Gear Assignment Calendar Component
function GearAssignmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Query gear assignments for the current month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: events, isLoading } = trpc.event.list.useQuery();
  const { data: gear } = trpc.gear.list.useQuery();

  // Get events in the current month
  const monthEvents = events?.filter(event => {
    if (!event.loadInTime) return false;
    const eventDate = new Date(event.loadInTime);
    return eventDate >= startOfMonth && eventDate <= endOfMonth;
  }) || [];

  // Generate calendar days
  const firstDayOfMonth = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const calendarDays = [];

  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, events: [] });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayEvents = monthEvents.filter(event => {
      const eventDate = new Date(event.loadInTime);
      return eventDate.getDate() === day;
    });
    calendarDays.push({ day, events: dayEvents });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-100">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-300 hover:bg-slate-800 hover:border-green-500/30 transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-lg text-slate-300 hover:bg-slate-800 hover:border-green-500/30 transition-all"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-green-500 py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className={`min-h-[100px] p-2 rounded-lg border transition-all ${
              dayData.day
                ? 'bg-slate-800/30 border-slate-700/30 hover:border-green-500/30'
                : 'bg-transparent border-transparent'
            }`}
          >
            {dayData.day && (
              <>
                <div className="text-sm font-semibold text-slate-300 mb-1">
                  {dayData.day}
                </div>
                <div className="space-y-1">
                  {dayData.events.map(event => (
                    <div
                      key={event.id}
                      className="text-xs px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30 transition-colors cursor-pointer"
                      title={`${event.eventName} - ${event.venueName || 'No venue'}`}
                    >
                      <div className="font-semibold truncate">{event.eventName}</div>
                      {event.venueName && (
                        <div className="text-green-500/70 truncate text-xs">
                          {event.venueName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-700/30">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
          <span className="text-sm text-slate-400">Events with gear assignments</span>
        </div>
        <div className="text-sm text-slate-500">
          Total events this month: {monthEvents.length}
        </div>
      </div>
    </div>
  );
}

export default function GearPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [activeView, setActiveView] = useState<ActiveView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGearModal, setShowCreateGearModal] = useState(false);
  const [showCreateKitModal, setShowCreateKitModal] = useState(false);
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([]);
  const [kitFormData, setKitFormData] = useState({ name: '', description: '' });

  // Fetch gear with real data
  const { data: gear, isLoading: gearLoading, refetch: refetchGear } = trpc.gear.list.useQuery({
    search: searchQuery || undefined,
  });

  // Fetch kits with real data
  const { data: kits, isLoading: kitsLoading, refetch: refetchKits } = trpc.kit.list.useQuery();

  // Create gear mutation
  const createGear = trpc.gear.create.useMutation({
    onSuccess: () => {
      setShowCreateGearModal(false);
      refetchGear();
    },
  });

  // Create kit mutation
  const createKit = trpc.kit.create.useMutation({
    onSuccess: () => {
      setShowCreateKitModal(false);
      setKitFormData({ name: '', description: '' });
      setSelectedGearIds([]);
      refetchKits();
    },
  });

  const toggleGear = (gearId: string) => {
    setSelectedGearIds(prev =>
      prev.includes(gearId)
        ? prev.filter(id => id !== gearId)
        : [...prev, gearId]
    );
  };

  // Transform gear data for UI
  const gearData = gear?.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    type: item.type || 'N/A',
    serialNumber: item.serialNumber || 'N/A',
    purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A',
    status: item.status,
    icon: getCategoryIcon(item.category),
  })) || [];

  // Transform kit data for UI
  const kitData = kits?.map((kit) => ({
    id: kit.id,
    name: kit.kitName,
    description: kit.description || 'No description',
    itemCount: kit.gearIds?.length || 0,
    isActive: kit.isActive,
  })) || [];

  function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      CAMERA: '📷',
      LENS: '🔭',
      AUDIO: '🎤',
      COMPUTER: '💻',
      RIGGING: '🎬',
      CABLE: '🔌',
      LIGHTING: '💡',
      ACCESSORIES: '🎒',
      STABILIZERS: '📐',
      DRONES: '🚁',
      MONITORS: '🖥️',
      OTHER: '📦',
    };
    return icons[category] || '📦';
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-500 text-slate-900';
      case 'IN_USE':
        return 'bg-blue-500 text-white';
      case 'NEEDS_REPAIR':
      case 'IN_REPAIR':
        return 'bg-orange-500 text-slate-900';
      case 'RETIRED':
      case 'OUT_OF_SERVICE':
        return 'bg-red-500 text-white';
      case 'UNAVAILABLE':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleCreateGear = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createGear.mutate({
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      type: formData.get('type') as string,
      serialNumber: formData.get('serialNumber') as string || undefined,
      purchaseDate: formData.get('purchaseDate')
        ? new Date(formData.get('purchaseDate') as string)
        : undefined,
      purchasePrice: formData.get('purchasePrice')
        ? Number(formData.get('purchasePrice'))
        : undefined,
      notes: formData.get('notes') as string || undefined,
    });
  };

  const handleCreateKit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createKit.mutate({
      kitName: kitFormData.name,
      description: kitFormData.description || undefined,
      gearIds: selectedGearIds,
      isActive: true,
    });
  };

  if (gearLoading || kitsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-slate-400">Loading gear...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎥</div>
            <h1 className="text-3xl font-bold tactical-heading">
              Gear Inventory
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📊 Export Inventory
            </button>
            <button
              onClick={() => {
                if (activeTab === 'kits') {
                  setShowCreateKitModal(true);
                } else {
                  setShowCreateGearModal(true);
                }
              }}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
              ➕ {activeTab === 'kits' ? 'Add Kit' : 'Add Gear'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6 border-b border-slate-700/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all border-b-3 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-slate-400 hover:text-green-500'
            }`}
          >
            INVENTORY
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all border-b-3 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-slate-400 hover:text-green-500'
            }`}
          >
            CALENDAR
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all border-b-3 whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-slate-400 hover:text-green-500'
            }`}
          >
            MAINTENANCE
          </button>
          <button
            onClick={() => setActiveTab('kits')}
            className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all border-b-3 whitespace-nowrap ${
              activeTab === 'kits'
                ? 'border-green-500 text-green-500'
                : 'border-transparent text-slate-400 hover:text-green-500'
            }`}
          >
            KITS
          </button>
        </div>

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Gear Inventory</h2>
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveView('cards')}
                  title="Card View"
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    activeView === 'cards'
                      ? 'bg-green-500 text-white'
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
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-800/80'
                  }`}
                >
                  📊 Table View
                </button>
              </div>
            </div>

            {/* Empty State */}
            {gearData.length === 0 && (
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🎥</div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">No Gear Yet</h2>
                <p className="text-slate-400 mb-6">Add your first gear item to get started</p>
                <button
                  onClick={() => setShowCreateGearModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                >
                  ➕ Add Gear
                </button>
              </div>
            )}

            {/* Card View */}
            {activeView === 'cards' && gearData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {gearData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-5 hover:border-green-500/50 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{item.icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-2">{item.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-300">{item.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Type:</span>
                        <span className="text-slate-300">{item.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Serial #:</span>
                        <span className="text-slate-300 font-mono text-xs">{item.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Purchased:</span>
                        <span className="text-slate-300">{item.purchaseDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {activeView === 'table' && gearData.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/80">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Item
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Category
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Type
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Serial Number
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gearData.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{item.icon}</div>
                              <div className="text-sm font-medium text-slate-100">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">{item.category}</td>
                          <td className="px-5 py-4 text-sm text-slate-300">{item.type}</td>
                          <td className="px-5 py-4 text-sm text-slate-300 font-mono text-xs">{item.serialNumber}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* KITS TAB */}
        {activeTab === 'kits' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Gear Kits</h2>

            {/* Empty State */}
            {kitData.length === 0 && (
              <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">No Kits Yet</h2>
                <p className="text-slate-400 mb-6">Create your first gear kit to get started</p>
                <button
                  onClick={() => setShowCreateKitModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                >
                  ➕ Create Kit
                </button>
              </div>
            )}

            {/* Kits Grid */}
            {kitData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {kitData.map((kit) => (
                  <div
                    key={kit.id}
                    className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 hover:border-green-500/50 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-100">{kit.name}</h3>
                      {kit.isActive && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{kit.description}</p>
                    <div className="text-sm text-green-500">
                      {kit.itemCount} {kit.itemCount === 1 ? 'item' : 'items'} in kit
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/30 bg-slate-950/80">
              <h2 className="text-xl font-bold text-slate-100">Gear Assignment Calendar</h2>
              <p className="text-sm text-slate-400 mt-1">View gear assignments across all events</p>
            </div>
            <div className="p-6">
              <GearAssignmentCalendar />
            </div>
          </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Maintenance Tracking</h2>

            {/* Maintenance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">
                      {gearData.filter(g => g.status === 'NEEDS_REPAIR').length}
                    </div>
                    <div className="text-sm text-slate-400">Needs Repair</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">🔧</div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {gearData.filter(g => g.status === 'IN_REPAIR').length}
                    </div>
                    <div className="text-sm text-slate-400">In Repair</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">🚫</div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      {gearData.filter(g => g.status === 'OUT_OF_SERVICE' || g.status === 'RETIRED').length}
                    </div>
                    <div className="text-sm text-slate-400">Out of Service</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gear Requiring Attention */}
            <div className="space-y-4">
              {/* Needs Repair Section */}
              {gearData.filter(g => g.status === 'NEEDS_REPAIR').length > 0 && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Needs Repair ({gearData.filter(g => g.status === 'NEEDS_REPAIR').length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gearData.filter(g => g.status === 'NEEDS_REPAIR').map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 hover:border-orange-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-2xl">{item.icon}</div>
                          <span className="px-2 py-1 bg-orange-500 text-slate-900 rounded text-xs font-semibold">
                            Needs Repair
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-100 mb-2">{item.name}</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Category:</span>
                            <span className="text-slate-300">{item.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Serial #:</span>
                            <span className="text-slate-300 font-mono text-xs">{item.serialNumber}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In Repair Section */}
              {gearData.filter(g => g.status === 'IN_REPAIR').length > 0 && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-blue-500 mb-4 flex items-center gap-2">
                    <span>🔧</span> In Repair ({gearData.filter(g => g.status === 'IN_REPAIR').length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gearData.filter(g => g.status === 'IN_REPAIR').map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 hover:border-blue-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-2xl">{item.icon}</div>
                          <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-semibold">
                            In Repair
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-100 mb-2">{item.name}</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Category:</span>
                            <span className="text-slate-300">{item.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Serial #:</span>
                            <span className="text-slate-300 font-mono text-xs">{item.serialNumber}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Out of Service Section */}
              {gearData.filter(g => g.status === 'OUT_OF_SERVICE' || g.status === 'RETIRED').length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                    <span>🚫</span> Out of Service ({gearData.filter(g => g.status === 'OUT_OF_SERVICE' || g.status === 'RETIRED').length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gearData.filter(g => g.status === 'OUT_OF_SERVICE' || g.status === 'RETIRED').map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 hover:border-red-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-2xl">{item.icon}</div>
                          <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold">
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-100 mb-2">{item.name}</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Category:</span>
                            <span className="text-slate-300">{item.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Serial #:</span>
                            <span className="text-slate-300 font-mono text-xs">{item.serialNumber}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {gearData.filter(g =>
                g.status === 'NEEDS_REPAIR' ||
                g.status === 'IN_REPAIR' ||
                g.status === 'OUT_OF_SERVICE' ||
                g.status === 'RETIRED'
              ).length === 0 && (
                <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-12 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">All Gear in Good Condition</h3>
                  <p className="text-slate-400">No items currently need maintenance or repair</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Gear Modal */}
      {showCreateGearModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 p-6">
              <h2 className="text-2xl font-bold text-slate-100">Add New Gear</h2>
            </div>

            <form onSubmit={handleCreateGear} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="Canon EOS R5"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-green-500"
                >
                  <option value="">Select category...</option>
                  <option value="CAMERA">Camera</option>
                  <option value="LENS">Lens</option>
                  <option value="AUDIO">Audio</option>
                  <option value="COMPUTER">Computer</option>
                  <option value="RIGGING">Rigging</option>
                  <option value="CABLE">Cable</option>
                  <option value="LIGHTING">Lighting</option>
                  <option value="ACCESSORIES">Accessories</option>
                  <option value="STABILIZERS">Stabilizers</option>
                  <option value="DRONES">Drones</option>
                  <option value="MONITORS">Monitors</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type *
                </label>
                <input
                  type="text"
                  name="type"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="Full-Frame Mirrorless"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="CFJ012345"
                />
              </div>

              {/* Purchase Date & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    placeholder="3999.00"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                  placeholder="Additional notes about this gear..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setShowCreateGearModal(false)}
                  className="px-6 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createGear.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {createGear.isPending ? 'Creating...' : 'Create Gear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Kit Modal */}
      {showCreateKitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div role="dialog" data-testid="kit-modal" className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[80%] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create New Kit</h2>
              <button
                onClick={() => {
                  setShowCreateKitModal(false);
                  setKitFormData({ name: '', description: '' });
                  setSelectedGearIds([]);
                }}
                className="text-slate-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateKit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Kit Name
                </label>
                <input
                  type="text"
                  value={kitFormData.name}
                  onChange={(e) => setKitFormData({ ...kitFormData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  placeholder="e.g., Wedding Package A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={kitFormData.description}
                  onChange={(e) => setKitFormData({ ...kitFormData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 min-h-[80px]"
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Gear Items ({selectedGearIds.length} selected)
                </label>
                <div className="border border-slate-700 rounded-lg max-h-[300px] overflow-y-auto">
                  {gear && gear.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {gear.map((item: any) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 hover:bg-slate-800/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGearIds.includes(item.id)}
                            onChange={() => toggleGear(item.id)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-green-500 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.category}</div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            item.status === 'AVAILABLE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {item.status}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400">
                      No gear items available. Create some gear first.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateKitModal(false);
                    setKitFormData({ name: '', description: '' });
                    setSelectedGearIds([]);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createKit.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-purple-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {createKit.isPending ? 'Creating...' : 'Create Kit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
