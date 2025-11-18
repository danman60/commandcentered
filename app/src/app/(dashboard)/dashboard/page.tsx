'use client';

import { Card } from '@/components/ui/Card';
import { trpc } from '@/lib/trpc/client';
import {
  Calendar,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  // Fetch all dashboard data
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  const { data: pipeline, isLoading: pipelineLoading } = trpc.dashboard.getEventPipeline.useQuery();
  const { data: revenueStats, isLoading: revenueLoading } = trpc.dashboard.getRevenueStats.useQuery();
  const { data: upcomingEvents, isLoading: upcomingLoading } = trpc.dashboard.getUpcomingEvents.useQuery({ limit: 5 });
  const { data: criticalAlerts, isLoading: alertsLoading } = trpc.dashboard.getCriticalAlerts.useQuery();
  const { data: recentActivity, isLoading: activityLoading } = trpc.dashboard.getRecentActivity.useQuery({ limit: 10 });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Widget 1: Overview Stats - 4 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="medium" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Upcoming Events</p>
              <p className="text-3xl font-bold text-white mt-2">
                {statsLoading ? '...' : stats?.upcomingEvents ?? 0}
              </p>
            </div>
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Calendar className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        <Card padding="medium" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Operators</p>
              <p className="text-3xl font-bold text-white mt-2">
                {statsLoading ? '...' : stats?.totalOperators ?? 0}
              </p>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card padding="medium" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Gear Items</p>
              <p className="text-3xl font-bold text-white mt-2">
                {statsLoading ? '...' : stats?.totalGear ?? 0}
              </p>
            </div>
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        <Card padding="medium" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">
                {statsLoading ? '...' : `$${stats?.totalRevenue?.toLocaleString() ?? 0}`}
              </p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Event Pipeline + Revenue Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 2: Event Pipeline */}
        <Card padding="large" hover="glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Event Pipeline</h3>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          {pipelineLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-3">
              <PipelineStage label="Proposal" count={pipeline?.PROPOSAL ?? 0} color="bg-yellow-500" />
              <PipelineStage label="Tentative" count={pipeline?.TENTATIVE ?? 0} color="bg-orange-500" />
              <PipelineStage label="Booked" count={pipeline?.BOOKED ?? 0} color="bg-cyan-500" />
              <PipelineStage label="Confirmed" count={pipeline?.CONFIRMED ?? 0} color="bg-blue-500" />
              <PipelineStage label="In Progress" count={pipeline?.IN_PROGRESS ?? 0} color="bg-purple-500" />
              <PipelineStage label="Completed" count={pipeline?.COMPLETED ?? 0} color="bg-green-500" />
            </div>
          )}
        </Card>

        {/* Widget 3: Revenue Stats */}
        <Card padding="large" hover="glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          {revenueLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Expected Revenue</span>
                  <span className="text-lg font-semibold text-white">
                    ${revenueStats?.expectedRevenue?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((revenueStats?.expectedRevenue ?? 0) / 100000) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Actual Revenue</span>
                  <span className="text-lg font-semibold text-green-400">
                    ${revenueStats?.actualRevenue?.toLocaleString() ?? 0}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((revenueStats?.actualRevenue ?? 0) / (revenueStats?.expectedRevenue ?? 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Cancelled Penalty</span>
                  <span className="text-sm font-medium text-red-400">
                    ${revenueStats?.cancelledPenalty?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Row 3: Upcoming Events + Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 4: Upcoming Events */}
        <Card padding="large" hover="glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          {upcomingLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{event.eventName}</h4>
                      <p className="text-xs text-gray-400 mt-1">{event.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-cyan-400">
                        {new Date(event.loadInTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.loadInTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No upcoming events in the next 7 days</p>
          )}
        </Card>

        {/* Widget 5: Critical Alerts */}
        <Card padding="large" hover="glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          {alertsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : criticalAlerts && criticalAlerts.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {criticalAlerts.map((alert) => (
                <div key={alert.eventId} className="p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{alert.eventName}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(alert.loadInTime).toLocaleDateString()}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {alert.issues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-red-400">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <p className="text-sm">All upcoming events are properly staffed</p>
            </div>
          )}
        </Card>
      </div>

      {/* Widget 6: Recent Activity */}
      <Card padding="large" hover="glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Clock className="w-5 h-5 text-purple-400" />
        </div>
        {activityLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
                <div className="p-2 bg-purple-600/20 rounded-lg flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">{activity.data.eventName}</h4>
                      <p className="text-xs text-gray-400 mt-1">Event {activity.type === 'event_created' ? 'created' : 'updated'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.data.status)}`}>
                        {activity.data.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No recent activity</p>
        )}
      </Card>
    </div>
  );
}

// Helper component for pipeline stages
function PipelineStage({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm font-semibold text-white">{count}</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(100, count * 10)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PROPOSAL: 'bg-yellow-600/20 text-yellow-400',
    TENTATIVE: 'bg-orange-600/20 text-orange-400',
    BOOKED: 'bg-cyan-600/20 text-cyan-400',
    CONFIRMED: 'bg-blue-600/20 text-blue-400',
    SCHEDULED: 'bg-purple-600/20 text-purple-400',
    IN_PROGRESS: 'bg-purple-600/20 text-purple-400',
    COMPLETED: 'bg-green-600/20 text-green-400',
    CANCELLED: 'bg-red-600/20 text-red-400',
  };
  return colors[status] || 'bg-gray-600/20 text-gray-400';
}
