'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
  Settings,
  ExternalLink,
  RotateCcw,
  Move,
} from 'lucide-react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useIsMobile } from '@/hooks/useMediaQuery';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget type definitions
type WidgetType = 'overview_stats' | 'event_pipeline' | 'revenue_stats' | 'upcoming_events' | 'critical_alerts' | 'recent_activity';

interface WidgetConfig {
  id: WidgetType;
  title: string;
  defaultVisible: boolean;
}

const WIDGET_CONFIGS: WidgetConfig[] = [
  { id: 'overview_stats', title: 'Overview Stats', defaultVisible: true },
  { id: 'event_pipeline', title: 'Event Pipeline', defaultVisible: true },
  { id: 'revenue_stats', title: 'Revenue Overview', defaultVisible: true },
  { id: 'upcoming_events', title: 'Upcoming Events', defaultVisible: true },
  { id: 'critical_alerts', title: 'Critical Alerts', defaultVisible: true },
  { id: 'recent_activity', title: 'Recent Activity', defaultVisible: true },
];

// Default layout configuration
const DEFAULT_LAYOUT: Layout[] = [
  { i: 'overview_stats', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: 'event_pipeline', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
  { i: 'revenue_stats', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
  { i: 'upcoming_events', x: 0, y: 6, w: 6, h: 5, minW: 4, minH: 4 },
  { i: 'critical_alerts', x: 6, y: 6, w: 6, h: 5, minW: 4, minH: 4 },
  { i: 'recent_activity', x: 0, y: 11, w: 12, h: 4, minW: 6, minH: 3 },
];

export default function DashboardPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<Layout[]>(DEFAULT_LAYOUT);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false); // Default OFF
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all dashboard data
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  const { data: pipeline, isLoading: pipelineLoading } = trpc.dashboard.getEventPipeline.useQuery();
  const { data: revenueStats, isLoading: revenueLoading } = trpc.dashboard.getRevenueStats.useQuery();
  const { data: upcomingEvents, isLoading: upcomingLoading } = trpc.dashboard.getUpcomingEvents.useQuery({ limit: 5 });
  const { data: criticalAlerts, isLoading: alertsLoading } = trpc.dashboard.getCriticalAlerts.useQuery();
  const { data: recentActivity, isLoading: activityLoading } = trpc.dashboard.getRecentActivity.useQuery({ limit: 10 });

  // Fetch widget preferences
  const { data: widgetPrefs, refetch: refetchWidgets } = trpc.dashboard.getWidgets.useQuery();
  const updateVisibility = trpc.dashboard.updateWidgetVisibility.useMutation({
    onSuccess: () => refetchWidgets(),
  });
  const updateSettings = trpc.dashboard.updateSettings.useMutation();

  // Fetch user preferences for layout persistence
  const { data: userPrefs } = trpc.userPreferences.get.useQuery();
  const updateDashboardLayout = trpc.userPreferences.updateDashboardLayout.useMutation();
  const resetPreferences = trpc.userPreferences.resetToDefaults.useMutation({
    onSuccess: () => {
      setCurrentLayout(DEFAULT_LAYOUT);
      refetchWidgets();
    },
  });

  // Restore layout from user preferences on mount
  useEffect(() => {
    if (userPrefs?.dashboardLayout && Array.isArray(userPrefs.dashboardLayout)) {
      setCurrentLayout(userPrefs.dashboardLayout as unknown as Layout[]);
    }
  }, [userPrefs]);

  // Restore dragging state from preferences (default OFF, always OFF on mobile)
  useEffect(() => {
    if (isMobile) {
      setIsDraggingEnabled(false);
    } else if (userPrefs?.dashboardDraggingEnabled !== undefined) {
      setIsDraggingEnabled(userPrefs.dashboardDraggingEnabled);
    }
  }, [userPrefs, isMobile]);

  // Determine which widgets are visible
  const getWidgetVisibility = (widgetId: WidgetType): boolean => {
    const pref = widgetPrefs?.find(w => w.widgetType === widgetId);
    return pref?.isVisible ?? WIDGET_CONFIGS.find(w => w.id === widgetId)?.defaultVisible ?? true;
  };

  // Get layout configuration (filter by visibility)
  const getLayout = (): Layout[] => {
    return currentLayout.filter(item => getWidgetVisibility(item.i as WidgetType));
  };

  // Handle layout change with debouncing
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    // Update local state immediately for responsive UI
    setCurrentLayout(layout);

    // Debounce database save (wait 1 second after last change)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateDashboardLayout.mutate({
        dashboardLayout: layout,
        visibleWidgets: layout.map(item => item.i),
      });
    }, 1000);
  }, [updateDashboardLayout]);

  // Toggle widget visibility
  const handleToggleVisibility = async (widgetId: WidgetType) => {
    const currentVisibility = getWidgetVisibility(widgetId);
    await updateVisibility.mutateAsync({
      widgetType: widgetId,
      isVisible: !currentVisibility,
    });
  };

  // Toggle dragging mode
  const handleToggleDragging = async () => {
    if (isMobile) return; // Don't allow toggle on mobile
    const newState = !isDraggingEnabled;
    setIsDraggingEnabled(newState);
    await updateDashboardLayout.mutateAsync({
      dashboardDraggingEnabled: newState,
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="tactical-glass border-b tactical-border -mx-8 px-8 py-6 mb-6 relative overflow-hidden">
        <div className="tactical-scanline absolute inset-0 pointer-events-none opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold tactical-heading">Dashboard</h1>
            <div className="text-sm text-slate-300 mt-1" suppressHydrationWarning>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Commander
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push('/planning')}
            >
              ➕ New Event
            </Button>
            {!isMobile && (
              <Button
                variant={isDraggingEnabled ? "primary" : "secondary"}
                size="medium"
                onClick={handleToggleDragging}
                data-testid="toggle-dragging"
                title={isDraggingEnabled ? "Disable drag & drop" : "Enable drag & drop"}
              >
                <Move className="w-4 h-4" />
                {isDraggingEnabled ? 'Dragging ON' : 'Dragging OFF'}
              </Button>
            )}
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setIsCustomizeOpen(true)}
              data-testid="customize-dashboard"
            >
              <Settings className="w-4 h-4" />
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: getLayout() }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={isDraggingEnabled && !isMobile}
        isResizable={isDraggingEnabled && !isMobile}
        compactType="vertical"
        preventCollision={false}
      >
        {/* Widget 1: Overview Stats */}
        {getWidgetVisibility('overview_stats') && (
          <div key="overview_stats" data-testid="widget-overview-stats" className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
              <div
                className="tactical-stat-panel p-6 cursor-pointer transition-all relative"
                onClick={() => router.push('/planning')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                      Upcoming Events
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-3xl font-bold mt-2 tactical-number">
                      {statsLoading ? '...' : stats?.upcomingEvents ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
                  </div>
                </div>
              </div>

              <div
                className="tactical-stat-panel p-6 cursor-pointer transition-all relative"
                onClick={() => router.push('/operators')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                      Active Operators
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-3xl font-bold mt-2 tactical-number">
                      {statsLoading ? '...' : stats?.totalOperators ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <Users className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
                  </div>
                </div>
              </div>

              <div
                className="tactical-stat-panel p-6 cursor-pointer transition-all relative"
                onClick={() => router.push('/gear')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                      Gear Items
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-3xl font-bold mt-2 tactical-number">
                      {statsLoading ? '...' : stats?.totalGear ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <Package className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
                  </div>
                </div>
              </div>

              <div
                className="tactical-stat-panel p-6 cursor-pointer transition-all relative"
                onClick={() => router.push('/pipeline')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                      Total Revenue
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-3xl font-bold mt-2 tactical-number">
                      {statsLoading ? '...' : `$${stats?.totalRevenue?.toLocaleString() ?? 0}`}
                    </p>
                  </div>
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Widget 2: Event Pipeline */}
        {getWidgetVisibility('event_pipeline') && (
          <div key="event_pipeline" data-testid="widget-event-pipeline" className="overflow-hidden h-full">
            <Card padding="large" hover="glow" className="h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Event Pipeline</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              {pipelineLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="space-y-3">
                  <PipelineStage label="Proposal" count={pipeline?.PROPOSAL ?? 0} color="bg-yellow-500" />
                  <PipelineStage label="Tentative" count={pipeline?.TENTATIVE ?? 0} color="bg-orange-500" />
                  <PipelineStage label="Booked" count={pipeline?.BOOKED ?? 0} color="bg-green-500" />
                  <PipelineStage label="Confirmed" count={pipeline?.CONFIRMED ?? 0} color="bg-blue-500" />
                  <PipelineStage label="In Progress" count={pipeline?.IN_PROGRESS ?? 0} color="bg-green-500" />
                  <PipelineStage label="Completed" count={pipeline?.COMPLETED ?? 0} color="bg-green-500" />
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Widget 3: Revenue Stats */}
        {getWidgetVisibility('revenue_stats') && (
          <div key="revenue_stats" data-testid="widget-revenue-stats">
            <Card padding="large" hover="glow" className="h-full">
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
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
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
        )}

        {/* Widget 4: Upcoming Events */}
        {getWidgetVisibility('upcoming_events') && (
          <div key="upcoming_events" data-testid="widget-upcoming-events">
            <Card padding="large" hover="glow" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              {upcomingLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => router.push('/planning')}
                      className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 cursor-pointer transition-all hover:border-green-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white flex items-center gap-2">
                            {event.eventName}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">{event.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-400">
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
          </div>
        )}

        {/* Widget 5: Critical Alerts */}
        {getWidgetVisibility('critical_alerts') && (
          <div key="critical_alerts" data-testid="widget-critical-alerts">
            <Card padding="large" hover="glow" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              {alertsLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : criticalAlerts && criticalAlerts.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {criticalAlerts.map((alert) => (
                    <div
                      key={alert.eventId}
                      onClick={() => router.push('/planning')}
                      className="p-3 bg-red-900/20 rounded-lg border border-red-800/30 cursor-pointer transition-all hover:border-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white flex items-center gap-2">
                            {alert.eventName}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </h4>
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
        )}

        {/* Widget 6: Recent Activity */}
        {getWidgetVisibility('recent_activity') && (
          <div key="recent_activity" data-testid="widget-recent-activity">
            <Card padding="large" hover="glow" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              {activityLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      onClick={() => router.push('/planning')}
                      className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg cursor-pointer transition-all hover:border hover:border-green-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <div className="p-2 bg-green-600/20 rounded-lg flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-white flex items-center gap-2">
                              {activity.data.eventName}
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </h4>
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
        )}
      </ResponsiveGridLayout>

      {/* Customize Modal */}
      {isCustomizeOpen && (
        <Modal
          title="Customize Dashboard"
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          data-testid="customization-modal"
        >
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Toggle widgets on or off, then drag and resize them to customize your dashboard layout.
            </p>

            <div className="space-y-3">
              {WIDGET_CONFIGS.map((widget) => (
                <label
                  key={widget.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={getWidgetVisibility(widget.id)}
                    onChange={() => handleToggleVisibility(widget.id)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600 focus:ring-green-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-white font-medium">{widget.title}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-700">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => resetPreferences.mutate()}
                data-testid="reset-layout-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Layout
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setIsCustomizeOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
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
    BOOKED: 'bg-green-600/20 text-green-400',
    CONFIRMED: 'bg-blue-600/20 text-blue-400',
    SCHEDULED: 'bg-green-600/20 text-green-400',
    IN_PROGRESS: 'bg-green-600/20 text-green-400',
    COMPLETED: 'bg-green-600/20 text-green-400',
    CANCELLED: 'bg-red-600/20 text-red-400',
  };
  return colors[status] || 'bg-gray-600/20 text-gray-400';
}
