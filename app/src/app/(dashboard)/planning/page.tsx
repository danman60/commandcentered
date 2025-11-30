'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { OperatorRole, PayType } from '@prisma/client';

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
      data-testid="operator-item"
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
    name: kit.kitName,
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
      data-testid="kit-item"
      className={`bg-slate-800/60 border border-green-500/20 rounded-lg p-3 hover:border-green-500 hover:translate-x-1 transition-all cursor-move relative group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        ⋮⋮
      </span>
      <div className="font-bold text-sm text-slate-200 mb-1">
        📷 {kit.kitName}
      </div>
      <div className="text-xs text-slate-400 mb-1">
        {kit.gearAssignments?.length || 0} items
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
  unassignOperatorMutation,
  unassignGearMutation,
}: {
  date: Date;
  events: any[];
  isCurrentMonth: boolean;
  isToday: boolean;
  getEventStatusColor: (status: string) => string;
  getEventStatusShadow: (status: string) => string;
  getOperatorInitials: (operator: any) => string;
  onEventClick: (eventId: string) => void;
  unassignOperatorMutation: any;
  unassignGearMutation: any;
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
                shift.shiftAssignments?.map((assignment: any, idx: number) => (
                  <span
                    key={idx}
                    className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 group"
                  >
                    {getOperatorInitials(assignment?.operator)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove ${assignment?.operator?.name} from this shift?`)) {
                          // Remove operator assignment
                          unassignOperatorMutation.mutate({ assignmentId: assignment.id });
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 ml-0.5"
                      title={`Remove ${assignment?.operator?.name}`}
                    >
                      ×
                    </button>
                  </span>
                )) || []
              ) || []}
              {(() => {
                // Group gear assignments by kit
                const kitGroups = event.gearAssignments?.reduce((acc: any, ga: any) => {
                  if (ga.kit) {
                    if (!acc[ga.kit.id]) {
                      acc[ga.kit.id] = { name: ga.kit.kitName, kitId: ga.kit.id, assignmentIds: [] };
                    }
                    acc[ga.kit.id].assignmentIds.push(ga.id);
                  }
                  return acc;
                }, {}) || {};

                return Object.values(kitGroups).slice(0, 2).map((kit: any, idx: number) => (
                  <span key={idx} className="bg-purple-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold text-purple-300 flex items-center gap-1 group">
                    📷 {kit.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove kit "${kit.name}" from this event?`)) {
                          // Remove all gear assignments for this kit
                          kit.assignmentIds.forEach((assignmentId: string) => {
                            unassignGearMutation.mutate({ assignmentId });
                          });
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 ml-0.5"
                      title={`Remove ${kit.name}`}
                    >
                      ×
                    </button>
                  </span>
                ));
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const { data: events, refetch: refetchEvents } = trpc.event.getByDateRange.useQuery({
    startDate: firstDay,
    endDate: lastDay,
  });

  const { data: operators } = trpc.operator.list.useQuery({});
  const { data: kits, refetch: refetchKits } = trpc.kit.list.useQuery({});

  // Mutations for assignment
  const assignOperator = trpc.shift.assignOperator.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const assignGear = trpc.gearAssignment.assign.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const bulkAssignGear = trpc.gearAssignment.bulkAssign.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const createShift = trpc.shift.create.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const unassignOperatorMutation = trpc.shift.unassignOperator.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const unassignGearMutation = trpc.gearAssignment.unassign.useMutation({
    onSuccess: () => {
      refetchEvents();
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
        const droppedEvent = events?.find(e => e.id === dropData.eventId) as any;

        if (dragData.type === 'operator') {
          // Assign operator to event
          // First, check if event has a shift, otherwise create one
          if (droppedEvent?.shifts && droppedEvent.shifts.length > 0) {
            // Use first shift
            const shiftId = droppedEvent.shifts[0].id;
            assignOperator.mutate({
              shiftId,
              operatorId: dragData.id,
              role: OperatorRole.VIDEOGRAPHER,
              payType: PayType.FLAT,
              flatRate: 0, // Placeholder - will be set by user later
            });
          } else {
            // Create a shift first, then assign operator to it
            const shiftDate = new Date(droppedEvent?.loadInTime || dropData.date);
            const startTime = new Date(shiftDate);
            startTime.setHours(9, 0, 0, 0);
            const endTime = new Date(shiftDate);
            endTime.setHours(17, 0, 0, 0);

            createShift.mutate(
              {
                eventId: dropData.eventId,
                shiftName: 'Default Shift',
                startTime,
                endTime,
              },
              {
                onSuccess: (newShift) => {
                  // After shift is created, assign operator to it
                  assignOperator.mutate({
                    shiftId: newShift.id,
                    operatorId: dragData.id,
                    role: OperatorRole.VIDEOGRAPHER,
                    payType: PayType.FLAT,
                    flatRate: 0, // Placeholder - will be set by user later
                  });
                },
              }
            );
          }
        } else if (dragData.type === 'kit') {
          // Assign all gear in kit to event
          const kit = kits?.find(k => k.id === dragData.id);
          if (kit && kit.gearIds && kit.gearIds.length > 0) {
            bulkAssignGear.mutate({
              eventId: dropData.eventId,
              gearIds: kit.gearIds,
              kitId: kit.id,
            });
          }
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
      <div className={`flex-shrink-0 bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 shadow-xl ${isMobile ? 'px-4 py-3' : 'px-9 py-4'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
          {!isMobile && (
          <div>
            <h1 className="text-3xl font-bold tactical-heading">
              SCHEDULING COMMAND CENTER
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Drag operators & kits to calendar • 3-Panel Layout
            </p>
          </div>
          )}
          <div className={`flex ${isMobile ? 'justify-between' : 'gap-3'} items-center`}>
            <button
              onClick={goToPreviousMonth}
              className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-5 py-3'} bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20`}
            >
              ◀ {isMobile ? '' : 'Prev'}
            </button>
            <h2 className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-5 py-3'} bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300 font-semibold`}>
              {isMobile ? getMonthName().split(' ')[0] : getMonthName()}
            </h2>
            <button
              onClick={goToNextMonth}
              className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-5 py-3'} bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20`}
            >
              {isMobile ? '' : 'Next'} ▶
            </button>
            {isMobile ? (
              <button
                onClick={() => setIsNewEventModalOpen(true)}
                className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg text-sm"
              >
                + Event
              </button>
            ) : (
            <button
              onClick={() => setIsNewEventModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/50"
            >
              + NEW EVENT
            </button>
            )}
          </div>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Operators Panel - Hidden on mobile */}
        {!isMobile && (
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
        )}

        {/* Calendar Panel */}
        <div className={`flex-1 bg-slate-900/60 backdrop-blur-md border-r border-green-500/20 flex flex-col ${!isMobile ? 'min-w-[600px]' : ''}`}>
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
                    unassignOperatorMutation={unassignOperatorMutation}
                    unassignGearMutation={unassignGearMutation}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Kits Panel - Hidden on mobile */}
        {!isMobile && (
        <div data-testid="kits-panel" className="w-1/5 min-w-[240px] bg-slate-900/60 backdrop-blur-md border-r border-green-500/20 flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-green-500/20 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-200">Kits</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all text-sm">
                🔍
              </button>
              <button
                onClick={() => setIsKitModalOpen(true)}
                className="w-8 h-8 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all text-lg font-bold"
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
        )}
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="bg-slate-800 border-2 border-green-500 rounded-lg p-3 shadow-2xl opacity-90">
            <div className="font-bold text-white">
              {activeDragItem.type === 'operator' ? '👤' : '📷'} {activeDragItem.name}
            </div>
          </div>
        ) : null}
      </DragOverlay>
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
      clientId: formData.clientId, // REQUIRED - all events must have a client
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
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              required
            >
              <option value="">Select a client</option>
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

// Droppable Shift Container (for detail modal drag-drop)
function DroppableShift({ shiftId, children }: { shiftId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: shiftId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${isOver ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
    >
      {children}
    </div>
  );
}

// Draggable Operator Badge (for detail modal drag-drop)
function DraggableOperatorBadge({ assignment, shiftId }: { assignment: any; shiftId: string }) {
  const dragData = {
    assignmentId: assignment.id,
    operatorId: assignment.operator.id,
    role: assignment.role,
    payType: assignment.payType,
    hourlyRate: assignment.hourlyRate,
    estimatedHours: assignment.estimatedHours,
    flatRate: assignment.flatRate,
    needsRide: assignment.needsRide,
    rideProviderId: assignment.rideProviderId,
    currentShiftId: shiftId,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `shift-assignment-${assignment.id}`,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-300 cursor-move hover:bg-green-500/30 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {assignment.operator.name}
    </div>
  );
}

// Event Detail Modal with Shift Builder
function EventDetailModal({ eventId, isOpen, onClose }: { eventId: string; isOpen: boolean; onClose: () => void }) {
  const { data: event, refetch: refetchEvent } = trpc.event.getById.useQuery({ id: eventId });
  const { data: operators } = trpc.operator.list.useQuery({});
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [showCommanderGigSheet, setShowCommanderGigSheet] = useState(false);
  const [showOperatorSelection, setShowOperatorSelection] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);
  const [editShiftData, setEditShiftData] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
  });

  // Refetch event data when modal opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      refetchEvent();
    }
  }, [isOpen, refetchEvent]);

  const createShift = trpc.shift.create.useMutation({
    onSuccess: () => {
      // Refetch event data to show new shift without page reload
      refetchEvent();
    },
  });

  const updateShift = trpc.shift.update.useMutation({
    onSuccess: () => {
      refetchEvent();
      setEditingShiftId(null);
    },
  });

  const assignOperator = trpc.shift.assignOperator.useMutation({
    onSuccess: () => {
      // Refetch event data to show new assignment without page reload
      refetchEvent();
    },
  });

  const unassignOperator = trpc.shift.unassignOperator.useMutation({
    onSuccess: () => {
      refetchEvent();
    },
  });

  // Handle drag-drop of operators between shifts
  const handleShiftDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active.data.current) return;

    const draggedAssignment = active.data.current as {
      assignmentId: string;
      operatorId: string;
      role: string;
      payType: string;
      hourlyRate: number | null;
      estimatedHours: number | null;
      flatRate: number | null;
      needsRide: boolean;
      rideProviderId: string | null;
      currentShiftId: string;
    };
    const targetShiftId = over.id as string;

    // Don't do anything if dropped on the same shift
    if (draggedAssignment.currentShiftId === targetShiftId) return;

    // Prepare assignment data with defaults for missing values
    const payType = (draggedAssignment.payType as PayType) || 'FLAT';
    const assignmentData: any = {
      shiftId: targetShiftId,
      operatorId: draggedAssignment.operatorId,
      role: (draggedAssignment.role as OperatorRole) || 'VIDEOGRAPHER',
      payType: payType,
      needsRide: draggedAssignment.needsRide ?? false,
    };

    // Add pay fields based on payType
    if (payType === 'HOURLY') {
      assignmentData.hourlyRate = draggedAssignment.hourlyRate ?? 50; // Default hourly rate
      assignmentData.estimatedHours = draggedAssignment.estimatedHours ?? 8; // Default 8 hours
    } else if (payType === 'FLAT') {
      assignmentData.flatRate = draggedAssignment.flatRate ?? 0; // Default flat rate
    }

    // Add ride provider if specified
    if (draggedAssignment.rideProviderId) {
      assignmentData.rideProviderId = draggedAssignment.rideProviderId;
    }

    console.log('[handleShiftDragEnd] Assignment data:', assignmentData);

    // Reassign operator: unassign from current shift, then assign to new shift
    unassignOperator.mutate(
      { assignmentId: draggedAssignment.assignmentId },
      {
        onSuccess: () => {
          // After unassigning, assign to new shift with all original assignment details
          assignOperator.mutate(assignmentData);
        },
        onError: (error) => {
          console.error('[handleShiftDragEnd] Unassign error:', error);
        },
      }
    );
  };

  const startEditShift = (shift: any) => {
    setEditingShiftId(shift.id);
    setEditShiftData({
      shiftName: shift.shiftName || shift.role || 'Default Shift',
      startTime: new Date(shift.startTime).toISOString().slice(0, 16),
      endTime: new Date(shift.endTime).toISOString().slice(0, 16),
    });
  };

  const saveShiftEdit = () => {
    if (!editingShiftId) return;
    updateShift.mutate({
      id: editingShiftId,
      shiftName: editShiftData.shiftName,
      startTime: new Date(editShiftData.startTime),
      endTime: new Date(editShiftData.endTime),
    });
  };

  const cancelShiftEdit = () => {
    setEditingShiftId(null);
    setEditShiftData({ shiftName: '', startTime: '', endTime: '' });
  };

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
            {event.revenueAmount && (
              <div>
                <div className="text-sm font-semibold text-slate-400 mb-1">Expected Revenue</div>
                <div className="text-green-400 font-bold">${Number(event.revenueAmount).toFixed(2)}</div>
              </div>
            )}
            {event.actualRevenue && (
              <div>
                <div className="text-sm font-semibold text-slate-400 mb-1">Actual Revenue</div>
                <div className="text-lime-400 font-bold">${Number(event.actualRevenue).toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Hotel Details */}
          {event.hasHotel && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-xl">🏨</span>
                Hotel Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.hotelName && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Hotel Name</div>
                    <div className="text-white">{event.hotelName}</div>
                  </div>
                )}
                {event.hotelAddress && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Address</div>
                    <div className="text-white">{event.hotelAddress}</div>
                  </div>
                )}
                {event.hotelCheckInDate && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Check-in</div>
                    <div className="text-green-400">{new Date(event.hotelCheckInDate).toLocaleString()}</div>
                  </div>
                )}
                {event.hotelCheckOutDate && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Check-out</div>
                    <div className="text-orange-400">{new Date(event.hotelCheckOutDate).toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parking & Logistics */}
          {event.parkingInstructions && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-xl">🚗</span>
                Parking Instructions
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed">{event.parkingInstructions}</div>
            </div>
          )}

          {/* Cancellation Info */}
          {(event.cancellationReason || event.cancellationPenalty) && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Cancellation Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.cancellationReason && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Reason</div>
                    <div className="text-white">{event.cancellationReason}</div>
                  </div>
                )}
                {event.cancellationPenalty && (
                  <div>
                    <div className="text-sm font-semibold text-slate-400 mb-1">Penalty</div>
                    <div className="text-red-400 font-bold">${Number(event.cancellationPenalty).toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Integrations */}
          {(event.vimeoEventId || event.telegramGroupId || event.googleDriveFolderId) && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Integrations
              </h3>

              <div className="space-y-4">
                {/* Vimeo Livestream */}
                {event.vimeoEventId && (
                  <div className="bg-slate-900/50 border border-purple-600/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📹</span>
                      <h4 className="text-md font-semibold text-purple-400">Vimeo Livestream</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-400 mb-1">Event ID</div>
                        <div className="text-white text-sm font-mono bg-slate-800 px-3 py-2 rounded border border-slate-700">
                          {event.vimeoEventId}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 italic">
                        Stream configuration available in Settings → Integrations
                      </div>
                    </div>
                  </div>
                )}

                {/* Telegram Group */}
                {event.telegramGroupId && (
                  <div className="bg-slate-900/50 border border-blue-600/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💬</span>
                      <h4 className="text-md font-semibold text-blue-400">Telegram Group</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-400 mb-1">Group ID</div>
                        <div className="text-white text-sm font-mono bg-slate-800 px-3 py-2 rounded border border-slate-700">
                          {event.telegramGroupId}
                        </div>
                      </div>
                      {event.telegramInviteLink && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1">Invite Link</div>
                          <a
                            href={event.telegramInviteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-sm hover:text-blue-300 underline break-all"
                          >
                            {event.telegramInviteLink}
                          </a>
                        </div>
                      )}
                      {event.telegramGroupCreatedAt && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1">Created</div>
                          <div className="text-slate-300 text-sm">
                            {new Date(event.telegramGroupCreatedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Google Drive Folder */}
                {event.googleDriveFolderId && (
                  <div className="bg-slate-900/50 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📁</span>
                      <h4 className="text-md font-semibold text-green-400">Google Drive Folder</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-400 mb-1">Folder ID</div>
                        <div className="text-white text-sm font-mono bg-slate-800 px-3 py-2 rounded border border-slate-700">
                          {event.googleDriveFolderId}
                        </div>
                      </div>
                      {event.googleDriveFolderUrl && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1">Folder URL</div>
                          <a
                            href={event.googleDriveFolderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 text-sm hover:text-green-300 underline break-all inline-flex items-center gap-1"
                          >
                            Open in Google Drive
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gig Sheets */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Gig Sheets
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Generate event brief documents for operators with all event details, location, equipment checklists, and contacts.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCommanderGigSheet(true)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📄</span>
                Commander Gig Sheet
              </button>
              <button
                type="button"
                onClick={() => setShowOperatorSelection(true)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>👥</span>
                Per-Operator Gig Sheets
              </button>
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
              <DndContext onDragEnd={handleShiftDragEnd}>
                <div className="space-y-3">
                  {event.shifts.map((shift: any) => (
                    <DroppableShift key={shift.id} shiftId={shift.id}>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    {editingShiftId === shift.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Shift Name</label>
                          <input
                            type="text"
                            value={editShiftData.shiftName}
                            onChange={(e) => setEditShiftData({ ...editShiftData, shiftName: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Start Time</label>
                            <input
                              type="datetime-local"
                              value={editShiftData.startTime}
                              onChange={(e) => setEditShiftData({ ...editShiftData, startTime: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">End Time</label>
                            <input
                              type="datetime-local"
                              value={editShiftData.endTime}
                              onChange={(e) => setEditShiftData({ ...editShiftData, endTime: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveShiftEdit}
                            disabled={updateShift.isPending}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-semibold disabled:opacity-50"
                          >
                            {updateShift.isPending ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelShiftEdit}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-white">{shift.shiftName || shift.role || 'Default Shift'}</div>
                            <div className="text-sm text-slate-400">
                              {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditShift(shift)}
                              className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 rounded text-sm font-semibold"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => setSelectedShiftId(shift.id)}
                              className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 rounded text-sm font-semibold"
                            >
                              + Operator
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Assigned Operators */}
                    {!editingShiftId && shift.shiftAssignments && shift.shiftAssignments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {shift.shiftAssignments.map((assignment: any) => (
                          <DraggableOperatorBadge
                            key={assignment.id}
                            assignment={assignment}
                            shiftId={shift.id}
                          />
                        ))}
                      </div>
                    )}

                    {/* Operator Selection */}
                    {!editingShiftId && selectedShiftId === shift.id && (
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
                    </DroppableShift>
                  ))}
                </div>
              </DndContext>
            ) : (
              <div className="text-center text-slate-400 py-8">
                No shifts created yet. Click "Add Shift" to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commander Gig Sheet Modal */}
      {showCommanderGigSheet && event && (
        <CommanderGigSheetModal
          event={event}
          isOpen={showCommanderGigSheet}
          onClose={() => setShowCommanderGigSheet(false)}
        />
      )}

      {/* Operator Selection Modal */}
      {showOperatorSelection && event && (
        <OperatorSelectionModal
          event={event}
          isOpen={showOperatorSelection}
          onClose={() => setShowOperatorSelection(false)}
          onSelectOperator={(operatorId) => {
            setSelectedOperatorId(operatorId);
            setShowOperatorSelection(false);
          }}
        />
      )}

      {/* Per-Operator Gig Sheet Modal */}
      {selectedOperatorId && event && (
        <PerOperatorGigSheetModal
          event={event}
          operatorId={selectedOperatorId}
          isOpen={!!selectedOperatorId}
          onClose={() => setSelectedOperatorId(null)}
        />
      )}
    </div>
  );
}

// Commander Gig Sheet Modal Component
function CommanderGigSheetModal({ event, isOpen, onClose }: { event: any; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const loadInDate = new Date(event.loadInTime);
  const loadOutDate = new Date(event.loadOutTime);
  const duration = (loadOutDate.getTime() - loadInDate.getTime()) / (1000 * 60 * 60); // hours

  // Collect all operator emails
  const getAllOperatorEmails = () => {
    const emails: string[] = [];
    const operators = new Map();

    event.shifts?.forEach((shift: any) => {
      shift.shiftAssignments?.forEach((assignment: any) => {
        if (assignment.operator?.email && !operators.has(assignment.operator.id)) {
          operators.set(assignment.operator.id, assignment.operator);
          emails.push(assignment.operator.email);
        }
      });
    });

    return emails;
  };

  // Generate mailto: link for all operators
  const generateTeamMailtoLink = () => {
    const emails = getAllOperatorEmails();

    if (emails.length === 0) {
      alert('No operator emails found for this event');
      return;
    }

    const subject = `Team Gig Sheet: ${event.eventName}`;
    const body = `Hi Team,

Here are the details for our upcoming event:

EVENT: ${event.eventName}
DATE: ${loadInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
TIME: ${loadInDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${loadOutDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} (${duration.toFixed(1)} hours)
TYPE: ${event.eventType.replace('_', ' ')}

${event.venueName ? `LOCATION:
${event.venueName}
${event.venueAddress || ''}
${event.parkingInstructions ? `Parking: ${event.parkingInstructions}` : ''}

` : ''}${event.notes ? `EVENT NOTES:
${event.notes}

` : ''}TEAM ASSIGNMENTS:
${event.shifts?.map((shift: any) => {
  const assignments = shift.shiftAssignments || [];
  return `${shift.shiftName || 'Shift'} (${new Date(shift.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(shift.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}):
${assignments.map((a: any) => `  - ${a.operator?.name || 'TBD'}: ${a.role || 'Unassigned'}`).join('\n')}`;
}).join('\n\n')}

${event.clientName ? `CLIENT CONTACT:
${event.clientName}${event.clientPhone ? ` - ${event.clientPhone}` : ''}${event.clientEmail ? ` - ${event.clientEmail}` : ''}

` : ''}Looking forward to working with you all!`;

    const mailtoLink = `mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center bg-gradient-to-r from-green-600/10 to-cyan-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              GIG SHEET: {event.eventName.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Commander Event Brief & Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Event Details */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
              <span>🎬</span>
              EVENT DETAILS
            </h3>
            <div className="space-y-2 text-white">
              <div className="text-xl font-bold">{event.eventName}</div>
              <div className="text-slate-300">
                {loadInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-slate-300">
                {loadInDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {loadOutDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({duration.toFixed(1)} hours)
              </div>
              <div className="text-sm text-slate-400">Type: {event.eventType.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
              <span>📍</span>
              LOCATION
            </h3>
            <div className="space-y-2">
              <div className="text-white font-bold">{event.venueName}</div>
              <div className="text-slate-300">{event.venueAddress}</div>
              {event.parkingInstructions && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 mb-1">🅿️ PARKING INSTRUCTIONS</div>
                  <div className="text-slate-300 text-sm">{event.parkingInstructions}</div>
                </div>
              )}
            </div>
          </div>

          {/* Team (Operators) */}
          {event.shifts && event.shifts.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <span>👥</span>
                TEAM
              </h3>
              <div className="space-y-3">
                {event.shifts.map((shift: any) => (
                  <div key={shift.id}>
                    <div className="text-xs font-semibold text-slate-400 mb-2">
                      {shift.shiftName || 'Shift'}: {new Date(shift.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(shift.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div className="space-y-1">
                      {shift.shiftAssignments && shift.shiftAssignments.map((assignment: any) => (
                        <div key={assignment.id} className="text-slate-300 flex items-center gap-2">
                          <span className="text-green-400">•</span>
                          <span className="font-medium">{assignment.operator?.name || 'Unknown Operator'}</span>
                          <span className="text-slate-500">-</span>
                          <span className="text-sm text-slate-400">{assignment.role || 'Unassigned'}</span>
                        </div>
                      ))}
                      {(!shift.shiftAssignments || shift.shiftAssignments.length === 0) && (
                        <div className="text-slate-500 italic text-sm">No operators assigned yet</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Checklist */}
          {event.gearAssignments && event.gearAssignments.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <span>📦</span>
                EQUIPMENT CHECKLIST
              </h3>
              <div className="space-y-1">
                {event.gearAssignments.map((assignment: any) => (
                  <div key={assignment.id} className="flex items-center gap-2 text-slate-300">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600" />
                    <span>{assignment.gear?.name || 'Unknown Gear'}</span>
                    {assignment.kit?.kitName && (
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                        📷 {assignment.kit.kitName}
                      </span>
                    )}
                    {assignment.gear?.category && (
                      <span className="text-xs text-slate-500">({assignment.gear.category})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Telegram Group */}
          {event.telegramGroupId && (
            <div className="bg-slate-800/50 border border-blue-600/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <span>💬</span>
                TELEGRAM GROUP
              </h3>
              {event.telegramInviteLink ? (
                <a
                  href={event.telegramInviteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500 text-blue-300 rounded-lg font-semibold transition-all"
                >
                  JOIN GROUP →
                </a>
              ) : (
                <div className="text-slate-400">Group ID: {event.telegramGroupId}</div>
              )}
            </div>
          )}

          {/* Event Notes */}
          {event.notes && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                <span>📋</span>
                EVENT NOTES & INSTRUCTIONS
              </h3>
              <div className="text-slate-300 whitespace-pre-wrap">{event.notes}</div>
            </div>
          )}

          {/* Contacts */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
              <span>📞</span>
              CONTACTS
            </h3>
            <div className="space-y-2">
              {event.clientName && (
                <div>
                  <span className="font-semibold text-white">Client:</span>
                  <span className="text-slate-300 ml-2">{event.clientName}</span>
                  {event.clientPhone && <span className="text-slate-400 ml-2">({event.clientPhone})</span>}
                  {event.clientEmail && <span className="text-slate-400 ml-2">- {event.clientEmail}</span>}
                </div>
              )}
              <div>
                <span className="font-semibold text-white">Venue:</span>
                <span className="text-slate-300 ml-2">{event.venueName}</span>
              </div>
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                <div className="text-red-400 font-bold text-sm">🚨 EMERGENCY CONTACT</div>
                <div className="text-slate-300 text-sm">Commander: (Contact info from profile)</div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>🖨️</span>
              Print Gig Sheet
            </button>
            <button
              onClick={generateTeamMailtoLink}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>📧</span>
              Email to Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Operator Selection Modal Component
function OperatorSelectionModal({
  event,
  isOpen,
  onClose,
  onSelectOperator
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onSelectOperator: (operatorId: string) => void;
}) {
  if (!isOpen) return null;

  // Get all unique operators from shift assignments
  const operators = new Map();
  event.shifts?.forEach((shift: any) => {
    shift.shiftAssignments?.forEach((assignment: any) => {
      if (assignment.operator) {
        operators.set(assignment.operator.id, assignment.operator);
      }
    });
  });

  const operatorList = Array.from(operators.values());

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex justify-between items-center bg-gradient-to-r from-cyan-600/10 to-green-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>👥</span>
              SELECT OPERATOR
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Choose operator for gig sheet</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {operatorList.length > 0 ? (
            <div className="space-y-3">
              {operatorList.map((operator: any) => {
                // Get all assignments for this operator across all shifts
                const assignments: any[] = [];
                event.shifts?.forEach((shift: any) => {
                  shift.shiftAssignments?.forEach((assignment: any) => {
                    if (assignment.operator?.id === operator.id) {
                      assignments.push({
                        ...assignment,
                        shift: {
                          shiftName: shift.shiftName,
                          startTime: shift.startTime,
                          endTime: shift.endTime,
                        },
                      });
                    }
                  });
                });

                return (
                  <button
                    key={operator.id}
                    onClick={() => onSelectOperator(operator.id)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg p-4 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {operator.name}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}: {assignments.map(a => a.role).join(', ')}
                        </div>
                      </div>
                      <span className="text-cyan-400 text-xl">→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👤</div>
              <p className="text-slate-400">No operators assigned to this event yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Per-Operator Gig Sheet Modal Component
function PerOperatorGigSheetModal({
  event,
  operatorId,
  isOpen,
  onClose
}: {
  event: any;
  operatorId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const loadInDate = new Date(event.loadInTime);
  const loadOutDate = new Date(event.loadOutTime);

  // Find operator and their assignments
  let operatorName = '';
  let operatorEmail = '';
  const operatorAssignments: any[] = [];
  event.shifts?.forEach((shift: any) => {
    shift.shiftAssignments?.forEach((assignment: any) => {
      if (assignment.operator?.id === operatorId) {
        operatorName = assignment.operator.name;
        operatorEmail = assignment.operator.email;
        operatorAssignments.push({
          ...assignment,
          shift: {
            id: shift.id,
            shiftName: shift.shiftName,
            startTime: shift.startTime,
            endTime: shift.endTime,
          },
        });
      }
    });
  });

  // Calculate earliest start and latest end for this operator
  let earliestStart = operatorAssignments.length > 0 ? new Date(operatorAssignments[0].shift.startTime) : loadInDate;
  let latestEnd = operatorAssignments.length > 0 ? new Date(operatorAssignments[0].shift.endTime) : loadOutDate;

  operatorAssignments.forEach(assignment => {
    const start = new Date(assignment.shift.startTime);
    const end = new Date(assignment.shift.endTime);
    if (start < earliestStart) earliestStart = start;
    if (end > latestEnd) latestEnd = end;
  });

  const duration = (latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60 * 60);

  // Generate mailto: link for operator
  const generateMailtoLink = () => {
    if (!operatorEmail) {
      alert('Operator email not found');
      return;
    }

    const subject = `Gig Sheet: ${event.eventName}`;

    const body = `Hi ${operatorName},

Here are your details for the upcoming event:

EVENT: ${event.eventName}
DATE: ${loadInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
YOUR TIME: ${earliestStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${latestEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} (${duration.toFixed(1)} hours)
TYPE: ${event.eventType.replace('_', ' ')}

${event.venueName ? `LOCATION:
${event.venueName}
${event.venueAddress || ''}
${event.parkingInstructions ? `Parking: ${event.parkingInstructions}` : ''}

` : ''}YOUR ASSIGNMENTS:
${operatorAssignments.map((assignment: any) =>
  `- ${assignment.shift.shiftName || 'Shift'}: ${new Date(assignment.shift.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(assignment.shift.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
  Role: ${assignment.role || 'Unassigned'}`
).join('\n')}

${event.notes ? `EVENT NOTES:
${event.notes}

` : ''}${event.client ? `CLIENT CONTACT:
${event.client.organization}${event.client.contactName ? ` - ${event.client.contactName}` : ''}${event.client.phone ? ` (${event.client.phone})` : ''}

` : ''}Looking forward to working with you!`;

    const mailtoLink = `mailto:${encodeURIComponent(operatorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-xl w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex justify-between items-center bg-gradient-to-r from-cyan-600/10 to-green-600/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              GIG SHEET: {event.eventName.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
              Operator Brief for {operatorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Event Details */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <span>🎬</span>
              EVENT DETAILS
            </h3>
            <div className="space-y-2 text-white">
              <div className="text-xl font-bold">{event.eventName}</div>
              <div className="text-slate-300">
                {loadInDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-slate-300">
                Your Time: {earliestStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {latestEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({duration.toFixed(1)} hours)
              </div>
              <div className="text-sm text-slate-400">Type: {event.eventType.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Location */}
          {event.venueName && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📍</span>
                LOCATION
              </h3>
              <div className="space-y-2">
                <div className="text-white font-medium">{event.venueName}</div>
                {event.venueAddress && (
                  <div className="text-slate-300">{event.venueAddress}</div>
                )}
                {event.parkingInstructions && (
                  <div className="mt-3 text-sm text-slate-400">
                    <div className="font-semibold text-slate-300 mb-1">🅿️ Parking Instructions:</div>
                    {event.parkingInstructions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Your Assignments */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <span>👤</span>
              YOUR ASSIGNMENTS
            </h3>
            <div className="space-y-3">
              {operatorAssignments.map((assignment: any) => (
                <div key={assignment.id} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-slate-400 mb-2">
                    {assignment.shift.shiftName || 'Shift'}: {new Date(assignment.shift.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(assignment.shift.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <div className="text-white font-medium">
                    Role: {assignment.role || 'Unassigned'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Checklist */}
          {event.gearAssignments && event.gearAssignments.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📦</span>
                EQUIPMENT CHECKLIST
              </h3>
              <div className="space-y-2">
                {event.gearAssignments.map((assignment: any) => (
                  <label key={assignment.id} className="flex items-center gap-3 p-2 hover:bg-slate-900/50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{assignment.gear?.name || 'Unknown Gear'}</div>
                      {assignment.gear?.category && (
                        <div className="text-xs text-slate-400">{assignment.gear.category}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Telegram Group */}
          {event.telegramGroupId && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <span>💬</span>
                TELEGRAM GROUP
              </h3>
              <button
                onClick={() => window.open(`https://t.me/${event.telegramGroupId}`, '_blank')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <span>📱</span>
                Join Event Group
              </button>
              <div className="mt-3 text-sm text-slate-400">
                Quick access to event coordination and team communication.
              </div>
            </div>
          )}

          {/* Event Notes */}
          {event.notes && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <span>📋</span>
                EVENT NOTES & INSTRUCTIONS
              </h3>
              <div className="text-slate-300 whitespace-pre-wrap">{event.notes}</div>
            </div>
          )}

          {/* Contacts */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <span>📞</span>
              CONTACTS
            </h3>
            <div className="space-y-2 text-slate-300">
              {event.client && (
                <div>
                  <span className="font-semibold text-white">Client: </span>
                  {event.client.organization}
                  {event.client.contactName && ` - ${event.client.contactName}`}
                  {event.client.phone && ` (${event.client.phone})`}
                </div>
              )}
              {event.venueName && (
                <div>
                  <span className="font-semibold text-white">Venue: </span>
                  {event.venueName}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="text-red-400 font-bold">
                  🚨 EMERGENCY CONTACT: [Commander Contact Info]
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>🖨️</span>
              Print Gig Sheet
            </button>
            <button
              onClick={generateMailtoLink}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>📧</span>
              Email Gig Sheet
            </button>
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
      <div className="bg-slate-900 border-2 border-green-500/30 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createKit.isPending}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {createKit.isPending ? 'Creating...' : 'Create Kit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
