'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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
        return 'bg-gradient-to-br from-green-500 to-green-600';
      case 'TENTATIVE':
        return 'bg-gradient-to-br from-orange-400 to-orange-500';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-br from-cyan-500 to-cyan-600';
    }
  };

  const getOperatorInitials = (operator: any) => {
    return `${operator.firstName[0]}${operator.lastName[0]}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-950 to-slate-800 border-b-2 border-cyan-500/30 px-9 py-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              SCHEDULING COMMAND CENTER
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Drag operators & kits to calendar • 3-Panel Layout
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={goToPreviousMonth}
              className="px-5 py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all"
            >
              ◀ Prev
            </button>
            <button className="px-5 py-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300 font-semibold">
              {getMonthName()}
            </button>
            <button
              onClick={goToNextMonth}
              className="px-5 py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 font-semibold transition-all"
            >
              Next ▶
            </button>
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-0.5">
              + NEW EVENT
            </button>
          </div>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Operators Panel */}
        <div className="w-1/5 min-w-[240px] bg-slate-900/60 backdrop-blur-md border-r border-cyan-500/20 flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-cyan-500/20 flex justify-between items-center">
            <span className="text-base font-semibold text-slate-200">Operators</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all text-sm font-bold">
                ↕
              </button>
              <button className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all text-lg font-bold">
                +
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {operators?.map((operator: any) => (
              <div
                key={operator.id}
                className="bg-slate-800/60 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500 hover:translate-x-1 transition-all cursor-move relative group"
                draggable
              >
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  ⋮⋮
                </span>
                <div className="font-bold text-sm text-slate-200 mb-1">
                  {operator.firstName} {operator.lastName} ({operator.initials || getOperatorInitials(operator)})
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
                  Available Full Day
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kits Panel */}
        <div className="w-1/5 min-w-[240px] bg-slate-900/60 backdrop-blur-md border-r border-purple-500/20 flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-purple-500/20 flex justify-between items-center">
            <span className="text-base font-semibold text-slate-200">Kits</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500 transition-all text-sm">
                🔍
              </button>
              <button className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500 transition-all text-lg font-bold">
                +
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {kits?.map((kit: any) => (
              <div
                key={kit.id}
                className="bg-slate-800/60 border border-purple-500/20 rounded-lg p-3 hover:border-purple-500 hover:translate-x-1 transition-all cursor-move relative group"
                draggable
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
            ))}
          </div>
        </div>

        {/* Calendar Panel */}
        <div className="flex-1 bg-slate-900/60 backdrop-blur-md flex flex-col min-w-[600px]">
          <div className="flex-shrink-0 px-5 py-4 bg-slate-950/80 border-b border-cyan-500/20">
            <span className="text-base font-semibold text-slate-200">
              {getMonthName()} Calendar
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-7 gap-px bg-cyan-500/10 p-px">
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
                  <div
                    key={index}
                    className={`bg-slate-900/80 min-h-[120px] p-2 relative cursor-pointer transition-all hover:bg-cyan-500/5 hover:shadow-[inset_0_0_0_2px_rgba(6,182,212,0.3)] ${
                      !isCurrentMonthDay ? 'opacity-40' : ''
                    }`}
                  >
                    <div
                      className={`text-sm font-bold mb-1.5 ${
                        isTodayDay
                          ? 'text-cyan-400 bg-cyan-500/20 w-7 h-7 flex items-center justify-center rounded-full'
                          : 'text-slate-400'
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.map((event: any) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventId(event.id);
                          }}
                          className={`${getEventStatusColor(event.status)} rounded px-2 py-1.5 text-xs cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-md`}
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
                                  {getOperatorInitials(assignment.operator)}
                                </span>
                              ))
                            )}
                            {event.gearAssignments?.slice(0, 2).map((ga: any, idx: number) => (
                              <span key={idx} className="text-xs">📷</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
