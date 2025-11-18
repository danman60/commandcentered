'use client'

import { trpc } from '@/lib/trpc/client'
import { useState } from 'react'

export default function PlanningPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const { data: events, isLoading } = trpc.event.getMonthView.useQuery({
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth() + 1,
  })

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Planning Calendar</h1>
        <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors">
          + New Event
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            ← Previous
          </button>
          <h2 className="text-xl font-semibold text-white">{monthName}</h2>
          <button
            onClick={goToNextMonth}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            Next →
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading events...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors border border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{event.eventName}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(event.loadInTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.clientName && (
                        <p className="text-sm text-cyan-400 mt-1">{event.clientName}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        event.status === 'CONFIRMED'
                          ? 'bg-green-500/20 text-green-400'
                          : event.status === 'BOOKED'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>Type: {event.eventType}</span>
                    {event.shifts.length > 0 && (
                      <span>
                        {event.shifts.reduce(
                          (acc, shift) => acc + shift._count.shiftAssignments,
                          0
                        )}{' '}
                        operators assigned
                      </span>
                    )}
                    {event.gearAssignments.length > 0 && (
                      <span>{event.gearAssignments.length} kits assigned</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No events scheduled for {monthName}</p>
                <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors">
                  Create your first event
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
