'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'history' | 'templates' | 'telegram' | 'notifications'>('workflow');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Fetch touchpoints for workflow progress
  const { data: touchpoints } = trpc.communication.listTouchpoints.useQuery({});
  const { data: emailConfigs } = trpc.communication.listEmailConfigs.useQuery({});

  // Mock data for demonstration (replace with real API calls as needed)
  const clients = [
    {
      id: '1',
      name: 'EMPWR Dance Experience',
      progress: 75,
      completed: 6,
      total: 8,
      touchpoints: [
        { type: 'INITIAL_CONTACT', status: 'completed' },
        { type: 'PROPOSAL_SENT', status: 'completed' },
        { type: 'CONTRACT_SENT', status: 'completed' },
        { type: 'QUESTIONNAIRE_SENT', status: 'completed' },
        { type: 'INVOICE_SENT', status: 'completed' },
        { type: 'PRE_EVENT_REMINDER', status: 'completed' },
        { type: 'POST_EVENT_FOLLOWUP', status: 'active' },
        { type: 'REBOOKING', status: 'pending' },
      ]
    },
    {
      id: '2',
      name: 'Glow Dance Competition',
      progress: 50,
      completed: 4,
      total: 8,
      touchpoints: [
        { type: 'INITIAL_CONTACT', status: 'completed' },
        { type: 'PROPOSAL_SENT', status: 'completed' },
        { type: 'CONTRACT_SENT', status: 'completed' },
        { type: 'QUESTIONNAIRE_SENT', status: 'completed' },
        { type: 'INVOICE_SENT', status: 'active' },
        { type: 'PRE_EVENT_REMINDER', status: 'pending' },
        { type: 'POST_EVENT_FOLLOWUP', status: 'pending' },
        { type: 'REBOOKING', status: 'pending' },
      ]
    }
  ];

  const emailHistory = [
    { id: '1', client: 'EMPWR Dance', type: 'Show Program Reminder', status: 'pending', date: 'Dec 4, 2025' },
    { id: '2', client: 'EMPWR Dance', type: 'Contract Reminder', status: 'sent', date: 'Nov 10, 2025' },
    { id: '3', client: 'Glow Dance', type: 'Questionnaire Reminder', status: 'sent', date: 'Nov 8, 2025' },
    { id: '4', client: 'ABC Dance Studio', type: 'Payment Reminder', status: 'failed', date: 'Nov 12, 2025' },
  ];

  const templates = [
    { id: '1', name: 'Initial Contact', subject: 'Inquiry about video production services', preview: 'Hi [Client Name], thank you for your interest in CommandCentered...' },
    { id: '2', name: 'Proposal Sent', subject: 'Your custom proposal from CommandCentered', preview: 'Hi [Client Name], attached is your custom proposal...' },
    { id: '3', name: 'Contract Reminder', subject: 'Contract signature needed', preview: 'Hi [Client Name], just a friendly reminder that we\'re waiting...' },
    { id: '4', name: 'Pre-Event Checklist', subject: 'Pre-event checklist for [Event Name]', preview: 'Hi [Client Name], your event is coming up! Here\'s what we need...' },
    { id: '5', name: 'Delivery Notification', subject: 'Your event videos are ready!', preview: 'Hi [Client Name], great news! Your videos are ready for download...' },
  ];

  const telegramGroups = [
    { id: '1', name: 'EMPWR Dance Experience - Dec 6', operators: ['John Davis', 'Sarah Thompson', 'Mike K.'], count: 3 },
    { id: '2', name: 'Glow Dance Competition - Dec 10', operators: ['Sarah Thompson', 'Mike K.'], count: 2 },
    { id: '3', name: 'XYZ Corporate Event - Dec 15', operators: ['John Davis', 'Sarah T.', 'Mike K.', 'Lisa R.'], count: 4 },
  ];

  const notificationLog = [
    { time: '10:30 AM', type: 'email', recipient: 'empwrdance@gmail.com', message: 'Contract Reminder - EMPWR Dance Event', status: 'sent' },
    { time: '9:15 AM', type: 'sms', recipient: '+1-555-0147', message: 'Reminder: Contract awaiting signature', status: 'sent' },
    { time: '8:00 AM', type: 'telegram', recipient: '@empwr_dance_team', message: 'Gig Sheet: EMPWR Dance Showcase - Dec 6', status: 'sent' },
    { time: '7:45 AM', type: 'email', recipient: 'registration@glowdancecomp.com', message: 'Event confirmation: December 10 Competition', status: 'sent' },
    { time: '6:30 AM', type: 'email', recipient: 'info@abcdance.com', message: 'Questionnaire: Recital Coverage Event', status: 'pending' },
  ];

  const touchpointLabels: Record<string, string> = {
    'INITIAL_CONTACT': 'Initial Contact',
    'PROPOSAL_SENT': 'Proposal',
    'CONTRACT_SENT': 'Contract',
    'QUESTIONNAIRE_SENT': 'Questionnaire',
    'INVOICE_SENT': 'Invoice',
    'PRE_EVENT_REMINDER': 'Pre-Event',
    'POST_EVENT_FOLLOWUP': 'Post-Event',
    'REBOOKING': 'Rebooking',
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💬</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
              Communications
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📝 Email Templates
            </button>
            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              ✉️ Compose Email
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
                ? 'text-cyan-500 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📊 Workflow Progress
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-cyan-500 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📧 Email History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'templates'
                ? 'text-cyan-500 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📝 Templates
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'telegram'
                ? 'text-cyan-500 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            💬 Telegram
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'notifications'
                ? 'text-cyan-500 border-b-2 border-cyan-500'
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
              <h2 className="text-xl font-semibold text-cyan-500">Communication Workflow Progress</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-lg font-bold text-slate-100 mb-4">{client.name}</h3>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">Communication Progress</span>
                      <span className="text-sm text-cyan-500 font-semibold">
                        {client.progress}% ({client.completed}/{client.total} Complete)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Touchpoints Timeline */}
                  <div className="flex items-center gap-3 overflow-x-auto py-5">
                    {client.touchpoints.map((touchpoint, idx) => (
                      <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition-all">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                              touchpoint.status === 'completed'
                                ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 text-white'
                                : touchpoint.status === 'active'
                                ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 text-white'
                                : 'bg-slate-700/50 border-2 border-slate-600/60 text-slate-500'
                            }`}
                          >
                            {touchpoint.status === 'completed' ? '✓' : touchpoint.status === 'active' ? '⏳' : '○'}
                          </div>
                          <div
                            className={`text-xs text-center max-w-[100px] ${
                              touchpoint.status === 'completed'
                                ? 'text-green-500'
                                : touchpoint.status === 'active'
                                ? 'text-cyan-500'
                                : 'text-slate-500'
                            }`}
                          >
                            {touchpointLabels[touchpoint.type]}
                          </div>
                        </div>
                        {idx < client.touchpoints.length - 1 && (
                          <div className="text-xl text-slate-600">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Email History */}
        {activeTab === 'history' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📧</span>
              <h2 className="text-xl font-semibold text-cyan-500">Automated Emails</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Client
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Email Type
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Date
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailHistory.map((email) => (
                    <tr
                      key={email.id}
                      className="border-b border-slate-700/20 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 text-sm text-slate-300">{email.client}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{email.type}</td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            email.status === 'sent'
                              ? 'bg-green-500/20 text-green-500'
                              : email.status === 'pending'
                              ? 'bg-orange-500/20 text-orange-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {email.status === 'sent' ? '✅ Sent' : email.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{email.date}</td>
                      <td className="px-5 py-4 text-sm">
                        <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-xs hover:bg-slate-700/50 transition-all">
                          {email.status === 'failed' ? 'Resend' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Templates */}
        {activeTab === 'templates' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-semibold text-cyan-500">Email Templates</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-5">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-slate-100">{template.name}</h3>
                    <button className="px-3 py-1 bg-slate-700/30 border border-slate-700/50 rounded text-slate-300 text-xs hover:bg-slate-700/50 transition-all">
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-md border-l-4 border-cyan-500">
                    <strong>Subject:</strong> {template.subject}
                    <br />
                    {template.preview}
                  </div>
                </div>
              ))}
            </div>

            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              ➕ Create New Template
            </button>
          </div>
        )}

        {/* Tab 4: Telegram */}
        {activeTab === 'telegram' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">💬</span>
              <h2 className="text-xl font-semibold text-cyan-500">Telegram Integration</h2>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {telegramGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 flex justify-between items-center hover:border-cyan-500/60 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-100 mb-1">{group.name}</h3>
                    <p className="text-xs text-slate-500">
                      👥 {group.count} operators: {group.operators.join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-xs hover:bg-slate-700/50 transition-all">
                      📱 Open Group
                    </button>
                    <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-xs hover:bg-slate-700/50 transition-all">
                      ➕ Add Operator
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              ➕ Create New Telegram Group
            </button>
          </div>
        )}

        {/* Tab 5: Notification Log */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-semibold text-cyan-500">All Notifications - Cross-Channel Audit Log</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Unified log of all Email, SMS, and Telegram notifications sent from the system
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Time
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Type
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Recipient
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Message
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-cyan-500 uppercase tracking-wider border-b border-slate-700/30">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notificationLog.map((notification, idx) => (
                    <tr key={idx} className="border-b border-slate-700/20">
                      <td className="px-5 py-4 text-sm text-slate-300">{notification.time}</td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`${
                            notification.type === 'email'
                              ? 'text-cyan-500'
                              : notification.type === 'sms'
                              ? 'text-green-500'
                              : 'text-purple-500'
                          }`}
                        >
                          {notification.type === 'email' ? '📧 Email' : notification.type === 'sms' ? '📱 SMS' : '💬 Telegram'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{notification.recipient}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{notification.message}</td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            notification.status === 'sent' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                          }`}
                        >
                          {notification.status === 'sent' ? '✅ Sent' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alert */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-5">
              <div className="font-bold text-red-500 mb-2">⚠️ Action Required</div>
              <div className="text-sm text-slate-300">
                One email failed to send (Invoice to accounting@abcdance.com). Click "Retry" in Email History tab to resend, or verify the recipient email address.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-sm hover:bg-slate-700/50 transition-all">
                📊 Export Log (CSV)
              </button>
              <button className="flex-1 px-4 py-3 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-sm hover:bg-slate-700/50 transition-all">
                🔍 Filter by Type
              </button>
              <button className="flex-1 px-4 py-3 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-sm hover:bg-slate-700/50 transition-all">
                📅 Filter by Date
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
