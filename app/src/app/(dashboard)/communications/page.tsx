'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'history' | 'templates' | 'telegram' | 'notifications'>('workflow');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Fetch touchpoints for workflow progress and history
  const { data: touchpoints, isLoading: touchpointsLoading, refetch: refetchTouchpoints } = trpc.communication.listTouchpoints.useQuery({});
  const { data: emailConfigs, isLoading: emailConfigsLoading, refetch: refetchEmailConfigs } = trpc.communication.listEmailConfigs.useQuery({});

  // Create touchpoint mutation
  const createTouchpoint = trpc.communication.createTouchpoint.useMutation({
    onSuccess: () => {
      setShowComposeModal(false);
      refetchTouchpoints();
    },
  });

  // Create email config mutation
  const createEmailConfig = trpc.communication.createEmailConfig.useMutation({
    onSuccess: () => {
      setShowTemplateModal(false);
      refetchEmailConfigs();
    },
  });

  // Group touchpoints by client/event for workflow progress
  const clientWorkflows = touchpoints?.reduce((acc, touchpoint) => {
    const clientName = touchpoint.client?.organization || touchpoint.event?.clientName || touchpoint.lead?.organization || 'Unknown Client';
    const clientId = touchpoint.clientId || touchpoint.eventId || touchpoint.leadId || 'unknown';

    if (!acc[clientId]) {
      acc[clientId] = {
        id: clientId,
        name: clientName,
        touchpoints: [],
      };
    }

    acc[clientId].touchpoints.push(touchpoint);
    return acc;
  }, {} as Record<string, { id: string; name: string; touchpoints: typeof touchpoints }>) || {};

  // Calculate progress for each client
  const clientsWithProgress = Object.values(clientWorkflows).map((client) => {
    const completed = client.touchpoints.filter(t => t.status === 'COMPLETED').length;
    const total = client.touchpoints.length || 1;
    const progress = Math.round((completed / total) * 100);

    return {
      ...client,
      completed,
      total,
      progress,
    };
  });

  // Email history from touchpoints (showing all touchpoints as email history)
  const emailHistory = touchpoints?.map((touchpoint) => ({
    id: touchpoint.id,
    client: touchpoint.client?.organization || touchpoint.event?.clientName || touchpoint.lead?.organization || 'Unknown',
    type: touchpoint.touchpointType.replace(/_/g, ' '),
    status: touchpoint.status.toLowerCase(),
    date: new Date(touchpoint.completedAt || touchpoint.createdAt).toLocaleDateString(),
  })) || [];

  // Templates from email configs
  const templates = emailConfigs?.map((config) => ({
    id: config.id,
    name: config.emailType.replace(/_/g, ' '),
    subject: config.subject || 'No subject',
    preview: config.bodyTemplate ? config.bodyTemplate.substring(0, 100) + '...' : 'No preview available',
  })) || [];

  const touchpointLabels: Record<string, string> = {
    'INITIAL_CONTACT': 'Initial Contact',
    'PROPOSAL_SENT': 'Proposal',
    'CONTRACT_SENT': 'Contract',
    'CONTRACT_SIGNED': 'Contract Signed',
    'QUESTIONNAIRE_SENT': 'Questionnaire',
    'QUESTIONNAIRE_COMPLETED': 'Questionnaire Done',
    'INVOICE_SENT': 'Invoice',
    'INVOICE_PAID': 'Invoice Paid',
    'PRE_EVENT_REMINDER': 'Pre-Event',
    'POST_EVENT_FOLLOWUP': 'Post-Event',
  };

  const handleComposeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createTouchpoint.mutate({
      touchpointType: formData.get('type') as any,
      clientId: formData.get('clientId') as string || undefined,
      eventId: formData.get('eventId') as string || undefined,
      leadId: formData.get('leadId') as string || undefined,
      completedAt: formData.get('completedAt') ? new Date(formData.get('completedAt') as string) : undefined,
      notes: formData.get('notes') as string || undefined,
    });
  };

  const handleTemplateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createEmailConfig.mutate({
      emailType: formData.get('emailType') as any,
      subject: formData.get('subject') as string,
      bodyTemplate: formData.get('body') as string,
      sendDelay: formData.get('sendDelay') ? parseInt(formData.get('sendDelay') as string) : undefined,
      isActive: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💬</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-purple-600 bg-clip-text text-transparent">
              Communications
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all"
            >
              📝 Email Templates
            </button>
            <button
              onClick={() => setShowComposeModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
              ✉️ Create Touchpoint
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700/30">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'workflow'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📊 Workflow Progress
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📧 Touchpoint History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'templates'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📝 Email Templates
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'telegram'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            💬 Telegram
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'notifications'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🔔 Notification Log
          </button>
        </div>

        {/* Tab 1: Workflow Progress */}
        {activeTab === 'workflow' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-semibold text-green-500">Communication Workflow Progress</h2>
            </div>

            {touchpointsLoading ? (
              <div className="text-center py-12 text-slate-400">Loading workflow data...</div>
            ) : clientsWithProgress.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-lg font-semibold mb-2">No Workflow Data</div>
                <div className="text-sm">Create touchpoints to track client communication progress.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {clientsWithProgress.map((client) => (
                  <div
                    key={client.id}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 hover:border-green-500/50 hover:-translate-y-1 transition-all"
                  >
                    <h3 className="text-lg font-bold text-slate-100 mb-4">{client.name}</h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">Communication Progress</span>
                        <span className="text-sm text-green-500 font-semibold">
                          {client.progress}% ({client.completed}/{client.total} Complete)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-purple-600 rounded-full transition-all"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Touchpoints Timeline */}
                    <div className="flex items-center gap-3 overflow-x-auto py-5">
                      {client.touchpoints.slice(0, 8).map((touchpoint, idx) => (
                        <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-all">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                                touchpoint.status === 'COMPLETED'
                                  ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 text-white'
                                  : touchpoint.status === 'SCHEDULED'
                                  ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 text-white'
                                  : 'bg-slate-700/50 border-2 border-slate-600/60 text-slate-500'
                              }`}
                            >
                              {touchpoint.status === 'COMPLETED' ? '✓' : touchpoint.status === 'SCHEDULED' ? '⏳' : '○'}
                            </div>
                            <div
                              className={`text-xs text-center max-w-[100px] ${
                                touchpoint.status === 'COMPLETED'
                                  ? 'text-green-500'
                                  : touchpoint.status === 'SCHEDULED'
                                  ? 'text-green-500'
                                  : 'text-slate-500'
                              }`}
                            >
                              {touchpointLabels[touchpoint.touchpointType] || touchpoint.touchpointType}
                            </div>
                          </div>
                          {idx < client.touchpoints.slice(0, 8).length - 1 && (
                            <div className="text-xl text-slate-600">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Touchpoint History */}
        {activeTab === 'history' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📧</span>
              <h2 className="text-xl font-semibold text-green-500">Touchpoint History</h2>
            </div>

            {touchpointsLoading ? (
              <div className="text-center py-12 text-slate-400">Loading touchpoint history...</div>
            ) : emailHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-4">📧</div>
                <div className="text-lg font-semibold mb-2">No Touchpoints</div>
                <div className="text-sm">Create touchpoints to track client communications.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Client
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Touchpoint Type
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 text-sm text-slate-300">{item.client}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.type}</td>
                        <td className="px-5 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'completed'
                                ? 'bg-green-500/20 text-green-500'
                                : item.status === 'scheduled'
                                ? 'bg-green-500/20 text-green-500'
                                : item.status === 'pending'
                                ? 'bg-orange-500/20 text-orange-500'
                                : 'bg-slate-500/20 text-slate-500'
                            }`}
                          >
                            {item.status === 'completed' ? '✅ Completed' : item.status === 'scheduled' ? '📅 Scheduled' : item.status === 'pending' ? '⏳ Pending' : '➖ Skipped'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-300">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Email Templates */}
        {activeTab === 'templates' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-semibold text-green-500">Email Templates</h2>
            </div>

            {emailConfigsLoading ? (
              <div className="text-center py-12 text-slate-400">Loading email templates...</div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-4">📝</div>
                <div className="text-lg font-semibold mb-2">No Email Templates</div>
                <div className="text-sm">Create email templates to automate client communications.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-5">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 hover:border-green-500/50 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-bold text-slate-100">{template.name}</h3>
                    </div>
                    <div className="text-sm text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-md border-l-4 border-green-500">
                      <strong>Subject:</strong> {template.subject}
                      <br />
                      {template.preview}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
              ➕ Create New Template
            </button>
          </div>
        )}

        {/* Tab 4: Telegram - Coming Soon */}
        {activeTab === 'telegram' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">💬</span>
              <h2 className="text-xl font-semibold text-green-500">Telegram Integration</h2>
            </div>
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-4">💬</div>
              <div className="text-lg font-semibold mb-2">Telegram Integration Coming Soon</div>
              <div className="text-sm">Operator group chat management will be available in Phase 2.</div>
            </div>
          </div>
        )}

        {/* Tab 5: Notification Log - Coming Soon */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-semibold text-green-500">Notification Log</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Unified log of all Email, SMS, and Telegram notifications sent from the system
            </p>
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-4">🔔</div>
              <div className="text-lg font-semibold mb-2">Notification Log Coming Soon</div>
              <div className="text-sm">Cross-channel audit log will be available in Phase 2.</div>
            </div>
          </div>
        )}
      </div>

      {/* Create Touchpoint Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-500 mb-5">Create Touchpoint</h2>
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Touchpoint Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="INITIAL_CONTACT">Initial Contact</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="CONTRACT_SENT">Contract Sent</option>
                  <option value="CONTRACT_SIGNED">Contract Signed</option>
                  <option value="QUESTIONNAIRE_SENT">Questionnaire Sent</option>
                  <option value="QUESTIONNAIRE_COMPLETED">Questionnaire Completed</option>
                  <option value="INVOICE_SENT">Invoice Sent</option>
                  <option value="INVOICE_PAID">Invoice Paid</option>
                  <option value="PRE_EVENT_REMINDER">Pre-Event Reminder</option>
                  <option value="POST_EVENT_FOLLOWUP">Post-Event Followup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Client ID (optional)</label>
                <input
                  type="text"
                  name="clientId"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Event ID (optional)</label>
                <input
                  type="text"
                  name="eventId"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Completed Date (optional)</label>
                <input
                  type="date"
                  name="completedAt"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="flex-1 px-5 py-3 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTouchpoint.isPending}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {createTouchpoint.isPending ? 'Creating...' : 'Create Touchpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Email Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-green-500 mb-5">Create Email Template</h2>
            <form onSubmit={handleTemplateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Type</label>
                <select
                  name="emailType"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="SHOW_PROGRAM_REMINDER">Show Program Reminder</option>
                  <option value="REBOOKING_FOLLOWUP">Rebooking Followup</option>
                  <option value="CONTRACT_REMINDER">Contract Reminder</option>
                  <option value="QUESTIONNAIRE_REMINDER">Questionnaire Reminder</option>
                  <option value="PAYMENT_REMINDER">Payment Reminder</option>
                  <option value="DELIVERY_NOTIFICATION">Delivery Notification</option>
                  <option value="THANK_YOU_FEEDBACK">Thank You Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Body Template</label>
                <textarea
                  name="body"
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Use {{eventName}}, {{clientName}}, etc. for placeholders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Send Delay (minutes, optional)</label>
                <input
                  type="number"
                  name="sendDelay"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 px-5 py-3 bg-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createEmailConfig.isPending}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {createEmailConfig.isPending ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
