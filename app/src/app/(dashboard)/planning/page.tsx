'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

type DragItem = {
  type: 'operator' | 'kit';
  id: string;
  name: string;
};

// Draggable Operator Card Component
function DraggableOperatorCard({ operator, getOperatorInitials }: { operator: any; getOperatorInitials: (op: any) => string }) {
  const dragData: DragItem = {
    type: 'operator',
    id: operator.id,
    name: operator.name,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `operator-${operator.id}`,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-slate-800/60 border border-green-500/20 rounded-lg p-3 hover:border-green-500 hover:translate-x-1 transition-all cursor-move relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        ⋮⋮
      </span>
      <div className="font-bold text-sm text-slate-200 mb-1">
        {operator.name} ({operator.initials || getOperatorInitials(operator)})
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
        Available Full Day
      </div>
    </div>
  );
}

// Draggable Kit Card Component
function DraggableKitCard({ kit }: { kit: any }) {
  const dragData: DragItem = {
    type: 'kit',
    id: kit.id,
    name: kit.name,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `kit-${kit.id}`,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-slate-800/60 border border-purple-500/20 rounded-lg p-3 hover:border-purple-500 hover:translate-x-1 transition-all cursor-move relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        ⋮⋮
      </span>
      <div className="font-bold text-sm text-slate-200 mb-1">
        📷 {kit.name}
      </div>
      <div className="text-xs text-slate-400 mb-1">
        {kit.gearIds.length} items
      </div>
      <div className="text-xs text-green-400 flex items-center gap-1">
        ✓ Available
      </div>
    </div>
  );
}

// Droppable Calendar Day Component
function DroppableCalendarDay({
  date,
  events,
  isCurrentMonth,
  isToday,
  getEventStatusColor,
  getEventStatusShadow,
  getOperatorInitials,
  onEventClick,
}: {
  date: Date;
  events: any[];
  isCurrentMonth: boolean;
  isToday: boolean;
  getEventStatusColor: (status: string) => string;
  getEventStatusShadow: (status: string) => string;
  getOperatorInitials: (operator: any) => string;
  onEventClick: (eventId: string) => void;
}) {
  const dropData = {
    date,
    eventId: events.length > 0 ? events[0].id : undefined,
  };

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${date.toISOString()}`,
    data: dropData,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-slate-900/80 min-h-[120px] p-2 relative cursor-pointer transition-all hover:bg-green-500/5 hover:shadow-[inset_0_0_0_2px_rgba(6,182,212,0.3)] ${
        !isCurrentMonth ? 'opacity-40' : ''
      } ${isOver ? 'bg-green-500/20 shadow-[inset_0_0_0_3px_rgba(6,182,212,0.5)]' : ''}`}
    >
      <div
        className={`text-sm font-bold mb-1.5 ${
          isToday
            ? 'text-green-400 bg-green-500/20 w-7 h-7 flex items-center justify-center rounded-full'
            : 'text-slate-400'
        }`}
      >
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {events.map((event: any) => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event.id);
            }}
            className={`${getEventStatusColor(event.status)} ${getEventStatusShadow(event.status)} rounded px-2 py-1.5 text-xs cursor-pointer transition-all hover:-translate-y-0.5 hover:translate-x-0.5 shadow-md`}
          >
            <div className="font-bold mb-1 text-white truncate">
              {event.client?.companyName || event.eventName}
            </div>
            <div className="flex gap-1 flex-wrap">
              {event.shifts?.flatMap((shift: any) =>
                shift.assignments?.map((assignment: any, idx: number) => (
                  <span
                    key={idx}
                    className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                  >
                    {getOperatorInitials(assignment?.operator)}
                  </span>
                )) || []
              ) || []}
              {event.gearAssignments?.slice(0, 2).map((ga: any, idx: number) => (
                <span key={idx} className="text-xs">📷</span>
              )) || []}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const { data: events } = trpc.event.getByDateRange.useQuery({
    startDate: firstDay,
    endDate: lastDay,
  });

  const { data: operators } = trpc.operator.list.useQuery({});
  const { data: kits } = trpc.kit.list.useQuery({});

  // Mutations for assignment
  const assignOperator = trpc.shift.assignOperator.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const assignGear = trpc.gearAssignment.assign.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const createShift = trpc.shift.create.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const getMonthName = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = () => {
    const days: Date[] = [];
    const firstDayOfWeek = firstDay.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(new Date(year, month, -firstDayOfWeek + i + 1));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
    }

    return days;
  };

  const getEventsForDay = (date: Date) => {
    if (!events) return [];
    return events.filter(event => {
      const eventDate = new Date(event.loadInTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKED':
      case 'CONFIRMED':
        return 'bg-gradient-to-br from-green-500 to-green-600 border-l-4 border-green-400';
      case 'TENTATIVE':
        return 'bg-gradient-to-br from-orange-400 to-orange-500 border-l-4 border-orange-300';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 border-l-4 border-blue-400';
      default:
        return 'bg-gradient-to-br from-green-500 to-green-600 border-l-4 border-green-400';
    }
  };

  const getEventStatusShadow = (status: string) => {
    switch (status) {
      case 'BOOKED':
      case 'CONFIRMED':
        return 'hover:shadow-[0_4px_12px_rgba(34,197,94,0.4)]';
      case 'TENTATIVE':
        return 'hover:shadow-[0_4px_12px_rgba(251,146,60,0.4)]';
      case 'IN_PROGRESS':
        return 'hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]';
      default:
        return 'hover:shadow-[0_4px_12px_rgba(34,197,94,0.4)]';
    }
  };

  const getOperatorInitials = (operator: any) => {
    if (!operator || !operator.name) {
      return '??';
    }
    const nameParts = operator.name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return operator.name.substring(0, 2).toUpperCase();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDragItem(null);
      return;
    }

    const dragData = active.data.current as DragItem;
    const dropData = over.data.current as { date: Date; eventId?: string };

    if (dragData && dropData) {
      console.log('Dropped', dragData.type, dragData.name, 'on', dropData.date);

      if (dropData.eventId) {
        // Found an existing event on this day
        const droppedEvent = events?.find(e => e.id === dropData.eventId);

        if (dragData.type === 'operator') {
          // Assign operator to event
          // First, check if event has a shift, otherwise create one
          if (droppedEvent?.shifts && droppedEvent.shifts.length > 0) {
            // Use first shift
            const shiftId = droppedEvent.shifts[0].id;
            assignOperator.mutate({
              shiftId,
              operatorId: dragData.id,
              role: 'VIDEOGRAPHER',
            });
          } else {
            // Create a shift first, then assign
            const shiftDate = new Date(droppedEvent?.loadInTime || dropData.date);
            const startTime = new Date(shiftDate);
            startTime.setHours(9, 0, 0, 0);
            const endTime = new Date(shiftDate);
            endTime.setHours(17, 0, 0, 0);

            createShift.mutate({
              eventId: dropData.eventId,
              shiftName: 'Default Shift',
              startTime,
              endTime,
            });
          }
        } else if (dragData.type === 'kit') {
          // Assign kit/gear to event
          assignGear.mutate({
            eventId: dropData.eventId,
            gearId: dragData.id,
          });
        }
      } else {
        // No event on this day - could create a new event or show a modal
        console.log('No event on this day. Consider creating an event first.');
      }
    }

    setActiveDragItem(null);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={(event) => {
        const dragData = event.active.data.current as DragItem;
        setActiveDragItem(dragData);
      }}
      onDragCancel={() => setActiveDragItem(null)}
    >
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 px-9 py-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
              SCHEDULING COMMAND CENTER
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Drag operators & kits to calendar • 3-Panel Layout
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={goToPreviousMonth}
              className="px-5 py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
            >
              ◀ Prev
            </button>
            <h2 className="px-5 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300 font-semibold">
              {getMonthName()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="px-5 py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
            >
              Next ▶
            </button>
            <button
              onClick={() => setIsNewEventModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50"
            >
              + NEW EVENT
            </button>
          </div>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Operators Panel */}
        <div data-testid="operators-panel" className="w-1/5 min-w-[240px] bg-slate-900/60 backdrop-blur-md border-r border-green-500/20 flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-green-500/20 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-200">Operators</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all text-sm font-bold">
                ↕
              </button>
              <button className="w-8 h-8 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all text-lg font-bold">
                +
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {operators?.map((operator: any) => (
              <DraggableOperatorCard
                key={operator.id}
                operator={operator}
                getOperatorInitials={getOperatorInitials}
              />
            ))}
          </div>
        </div>

        {/* Calendar Panel */}
        <div className="flex-1 bg-slate-900/60 backdrop-blur-md border-r border-green-500/20 flex flex-col min-w-[600px]">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-green-500/20">
            <span className="text-base font-semibold text-slate-200">
              {getMonthName()} Calendar
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div role="grid" data-testid="calendar-grid" className="grid grid-cols-7 gap-px bg-green-500/10 p-px">
              {/* Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-slate-800/80 p-3 text-center font-semibold text-slate-400 text-xs"
                >
                  {day}
                </div>
              ))}

              {/* Days */}
              {getDaysInMonth().map((date, index) => {
                const dayEvents = getEventsForDay(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDay = isToday(date);

                return (
                  <DroppableCalendarDay
                    key={index}
                    date={date}
                    events={dayEvents}
                    isCurrentMonth={isCurrentMonthDay}
                    isToday={isTodayDay}
                    getEventStatusColor={getEventStatusColor}
                    getEventStatusShadow={getEventStatusShadow}
                    getOperatorInitials={getOperatorInitials}
                    onEventClick={(eventId) => setSelectedEventId(eventId)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Kits Panel */}
        <div data-testid="kits-panel" className="w-1/5 min-w-[240px] bg-slate-900/60 backdrop-blur-md border-r border-purple-500/20 flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-purple-500/20 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-200">Kits</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500 transition-all text-sm">
                🔍
              </button>
              <button
                onClick={() => setIsKitModalOpen(true)}
                className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500 transition-all text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {kits?.map((kit: any) => (
              <DraggableKitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isNewEventModalOpen && (
        <NewEventModal
          isOpen={isNewEventModalOpen}
          onClose={() => setIsNewEventModalOpen(false)}
        />
      )}

      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {isKitModalOpen && (
        <KitCreationModal
          isOpen={isKitModalOpen}
          onClose={() => setIsKitModalOpen(false)}
        />
      )}
      </div>
    </DndContext>
  );
}

// New Event Modal Component
function NewEventModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'RECITAL' as const,
    clientId: '',
    loadInTime: '',
    loadOutTime: '',
    venueName: '',
    venueAddress: '',
  });

  const { data: clients } = trpc.client.list.useQuery({});

  const createEvent = trpc.event.create.useMutation({
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate({
      eventName: formData.eventName,
      eventType: formData.eventType,
      clientId: formData.clientId || undefined,
      loadInTime: new Date(formData.loadInTime),
      loadOutTime: new Date(formData.loadOutTime),
      venueName: formData.venueName,
      venueAddress: formData.venueAddress,
      status: 'TENTATIVE',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Client
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="">Select a client (optional)</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.organization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Event Type
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="DANCE_COMPETITION">Dance Competition</option>
              <option value="RECITAL">Recital</option>
              <option value="CONCERT">Concert</option>
              <option value="PLAY">Play</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Load-In Time
            </label>
            <input
              type="datetime-local"
              value={formData.loadInTime}
              onChange={(e) => setFormData({ ...formData, loadInTime: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Load-Out Time
            </label>
            <input
              type="datetime-local"
              value={formData.loadOutTime}
              onChange={(e) => setFormData({ ...formData, loadOutTime: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Venue Name
            </label>
            <input
              type="text"
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Venue Address
            </label>
            <input
              type="text"
              value={formData.venueAddress}
              onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEvent.isPending}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {createEvent.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Event Detail Modal with Shift Builder
function EventDetailModal({ eventId, isOpen, onClose }: { eventId: string; isOpen: boolean; onClose: () => void }) {
  const { data: event, refetch: refetchEvent } = trpc.event.getById.useQuery({ id: eventId });
  const { data: operators } = trpc.operator.list.useQuery({});
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  const createShift = trpc.shift.create.useMutation({
    onSuccess: () => {
      // Refetch event data to show new shift without page reload
      refetchEvent();
    },
  });

  const assignOperator = trpc.shift.assignOperator.useMutation({
    onSuccess: () => {
      // Refetch event data to show new assignment without page reload
      refetchEvent();
    },
  });

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{event.eventName}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-400 mb-1">Load-In Time</div>
              <div className="text-white">{new Date(event.loadInTime).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-400 mb-1">Venue</div>
              <div className="text-white">{event.venueName}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-400 mb-1">Type</div>
              <div className="text-white">{event.eventType}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-400 mb-1">Status</div>
              <div className="text-white">{event.status}</div>
            </div>
          </div>

          {/* Shift Builder */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Shifts & Assignments</h3>
              <button
                type="button"
                onClick={() => {
                  const shiftDate = new Date(event.loadInTime);
                  const startTime = new Date(shiftDate);
                  startTime.setHours(9, 0, 0, 0);
                  const endTime = new Date(shiftDate);
                  endTime.setHours(17, 0, 0, 0);

                  createShift.mutate({
                    eventId: event.id,
                    shiftName: 'Default Shift',
                    startTime,
                    endTime,
                  });
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all text-sm"
              >
                + Add Shift
              </button>
            </div>

            {event.shifts && event.shifts.length > 0 ? (
              <div className="space-y-3">
                {event.shifts.map((shift: any) => (
                  <div key={shift.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-white">{shift.role}</div>
                        <div className="text-sm text-slate-400">
                          {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedShiftId(shift.id)}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 rounded text-sm font-semibold"
                      >
                        Assign Operator
                      </button>
                    </div>

                    {/* Assigned Operators */}
                    {shift.assignments && shift.assignments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {shift.assignments.map((assignment: any) => (
                          <div
                            key={assignment.id}
                            className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-300"
                          >
                            {assignment.operator.name}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Operator Selection */}
                    {selectedShiftId === shift.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-sm font-semibold text-slate-300 mb-2">
                          Select Operator:
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {operators?.map((operator: any) => (
                            <button
                              key={operator.id}
                              onClick={() => {
                                assignOperator.mutate({
                                  shiftId: shift.id,
                                  operatorId: operator.id,
                                  role: 'VIDEOGRAPHER',
                                });
                                setSelectedShiftId(null);
                              }}
                              className="px-3 py-2 bg-slate-700 hover:bg-green-500/20 border border-slate-600 hover:border-green-500 text-white rounded transition-all text-sm"
                            >
                              {operator.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                No shifts created yet. Click "Add Shift" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Kit Creation Modal
function KitCreationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { data: gear } = trpc.gear.list.useQuery({});
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([]);

  const createKit = trpc.kit.create.useMutation({
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createKit.mutate({
      kitName: formData.name,
      description: formData.description,
      gearIds: selectedGearIds,
    });
  };

  const toggleGear = (gearId: string) => {
    setSelectedGearIds(prev =>
      prev.includes(gearId)
        ? prev.filter(id => id !== gearId)
        : [...prev, gearId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-purple-500/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Create New Kit</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Kit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g., Wedding Package A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 min-h-[80px]"
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
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
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
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createKit.isPending}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {createKit.isPending ? 'Creating...' : 'Create Kit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
