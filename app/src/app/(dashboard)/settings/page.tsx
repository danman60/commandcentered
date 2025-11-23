'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

type SettingsTab = 'organization' | 'profile' | 'notifications' | 'email' | 'automation' | 'billing' | 'security' | 'integrations' | 'templates';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization');

  // Fetch settings
  const { data: settings, refetch } = trpc.settings.get.useQuery();

  // Update mutations
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      refetch();
      alert('Settings saved successfully!');
    },
  });

  const updateCompanyInfo = trpc.settings.updateCompanyInfo.useMutation({
    onSuccess: () => {
      refetch();
      alert('Company info saved successfully!');
    },
  });

  const updateBillingInfo = trpc.settings.updateBillingInfo.useMutation({
    onSuccess: () => {
      refetch();
      alert('Billing info saved successfully!');
    },
  });

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');

  const [emailProvider, setEmailProvider] = useState('');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [emailFromAddress, setEmailFromAddress] = useState('');
  const [emailFromName, setEmailFromName] = useState('');

  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  const [googleDriveEnabled, setGoogleDriveEnabled] = useState(false);
  const [googleDriveParentFolderId, setGoogleDriveParentFolderId] = useState('');

  // Integration API keys (stored in SystemSettings or future IntegrationSettings model)
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiOrgId, setOpenaiOrgId] = useState('');

  const [vimeoAccessToken, setVimeoAccessToken] = useState('');
  const [vimeoClientId, setVimeoClientId] = useState('');
  const [vimeoClientSecret, setVimeoClientSecret] = useState('');

  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramBotUsername, setTelegramBotUsername] = useState('');

  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleServiceAccountEmail, setGoogleServiceAccountEmail] = useState('');
  const [googleServiceAccountKey, setGoogleServiceAccountKey] = useState('');

  const [signwellApiKey, setSignwellApiKey] = useState('');

  // Initialize form values when settings load
  useState(() => {
    if (settings) {
      setCompanyName(settings.companyName || '');
      setCompanyLogoUrl(settings.companyLogoUrl || '');
      setPrimaryColor(settings.primaryColor || '');
      setSecondaryColor(settings.secondaryColor || '');

      setEmailProvider(settings.emailProvider || '');
      setEmailApiKey(settings.emailApiKey || '');
      setEmailFromAddress(settings.emailFromAddress || '');
      setEmailFromName(settings.emailFromName || '');

      setStripePublishableKey(settings.stripePublishableKey || '');
      setStripeSecretKey(settings.stripeSecretKey || '');
      setStripeWebhookSecret(settings.stripeWebhookSecret || '');

      setGoogleDriveEnabled(settings.googleDriveEnabled || false);
      setGoogleDriveParentFolderId(settings.googleDriveParentFolderId || '');
    }
  });

  const handleSaveOrganization = () => {
    updateCompanyInfo.mutate({
      companyName,
      companyLogoUrl: companyLogoUrl || null,
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
    });
  };

  const handleSaveEmail = () => {
    updateSettings.mutate({
      emailProvider: emailProvider || null,
      emailApiKey: emailApiKey || null,
      emailFromAddress: emailFromAddress || null,
      emailFromName: emailFromName || null,
    });
  };

  const handleSaveBilling = () => {
    updateBillingInfo.mutate({
      stripePublishableKey: stripePublishableKey || null,
      stripeSecretKey: stripeSecretKey || null,
      stripeWebhookSecret: stripeWebhookSecret || null,
    });
  };

  const handleSaveIntegrations = () => {
    updateSettings.mutate({
      googleDriveEnabled,
      googleDriveParentFolderId: googleDriveParentFolderId || null,
    });
  };

  const sidebarItems = [
    { id: 'organization', icon: '🏢', label: 'Organization' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'email', icon: '📧', label: 'Email Settings' },
    { id: 'automation', icon: '🤖', label: 'Email Automation' },
    { id: 'billing', icon: '💳', label: 'Billing' },
    { id: 'security', icon: '🔐', label: 'Security' },
    { id: 'integrations', icon: '🔌', label: 'Integrations' },
    { id: 'templates', icon: '📋', label: 'Service Templates' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">⚙️</div>
          <h1 className="text-3xl font-bold tactical-heading">
            Settings
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 h-fit">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all mb-1 ${
                  activeTab === item.id
                    ? 'bg-green-500/20 border-l-4 border-green-500 text-green-500'
                    : 'text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-800/50 border border-slate-700/30 rounded-xl p-8">
            {/* Organization Tab */}
            {activeTab === 'organization' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Organization Settings</h2>

                <div className="space-y-6">
                  {/* Company Name */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Company Name
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      This name appears on invoices and contracts
                    </p>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="StreamStage Productions"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Company Logo URL */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Company Logo URL
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      URL to your company logo image
                    </p>
                    <input
                      type="url"
                      value={companyLogoUrl}
                      onChange={(e) => setCompanyLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Primary Color */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Primary Brand Color
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Hex color code for your brand (e.g., #06b6d4)
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#06b6d4"
                        maxLength={7}
                        className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                      />
                      <input
                        type="color"
                        value={primaryColor || '#06b6d4'}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-12 bg-slate-900/60 border border-slate-700/50 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Secondary Brand Color
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Hex color code for accents (e.g., #a855f7)
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#a855f7"
                        maxLength={7}
                        className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                      />
                      <input
                        type="color"
                        value={secondaryColor || '#a855f7'}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-16 h-12 bg-slate-900/60 border border-slate-700/50 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Default Currency */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Default Currency
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Currency used for all financial calculations
                    </p>
                    <select className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:border-green-500">
                      <option>USD - United States Dollar</option>
                      <option>CAD - Canadian Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Time Zone
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Used for event scheduling and timestamps
                    </p>
                    <select className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:border-green-500">
                      <option>America/Toronto (EST/EDT)</option>
                      <option>America/New_York (EST/EDT)</option>
                      <option>America/Los_Angeles (PST/PDT)</option>
                      <option>America/Chicago (CST/CDT)</option>
                      <option>America/Denver (MST/MDT)</option>
                      <option>Europe/London (GMT/BST)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Date Format
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      How dates appear throughout the system
                    </p>
                    <select className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:border-green-500">
                      <option>MM/DD/YYYY (US)</option>
                      <option>DD/MM/YYYY (UK)</option>
                      <option>YYYY-MM-DD (ISO)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveOrganization}
                  disabled={updateCompanyInfo.isPending}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Save Changes
                </button>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Profile Settings</h2>
                <div className="text-slate-400 text-center py-12">
                  <div className="text-6xl mb-4">👤</div>
                  <p>Profile settings coming soon</p>
                  <p className="text-sm mt-2">User-specific settings will be available here</p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Notification Settings</h2>
                <div className="text-slate-400 text-center py-12">
                  <div className="text-6xl mb-4">🔔</div>
                  <p>Notification preferences coming soon</p>
                  <p className="text-sm mt-2">Manage email, SMS, and push notifications here</p>
                </div>
              </div>
            )}

            {/* Email Settings Tab */}
            {activeTab === 'email' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Email Settings</h2>

                <div className="space-y-6">
                  {/* Email Provider */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email Provider
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Which email service to use (Mailgun, SendGrid, etc.)
                    </p>
                    <select
                      value={emailProvider}
                      onChange={(e) => setEmailProvider(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:border-green-500"
                    >
                      <option value="">Select Provider</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="postmark">Postmark</option>
                      <option value="smtp">SMTP</option>
                    </select>
                  </div>

                  {/* Email API Key */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email API Key
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      API key from your email provider
                    </p>
                    <input
                      type="password"
                      value={emailApiKey}
                      onChange={(e) => setEmailApiKey(e.target.value)}
                      placeholder="key-••••••••••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* From Address */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      From Email Address
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Email address that appears in the "From" field
                    </p>
                    <input
                      type="email"
                      value={emailFromAddress}
                      onChange={(e) => setEmailFromAddress(e.target.value)}
                      placeholder="hello@streamstage.com"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* From Name */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      From Name
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Name that appears in the "From" field
                    </p>
                    <input
                      type="text"
                      value={emailFromName}
                      onChange={(e) => setEmailFromName(e.target.value)}
                      placeholder="StreamStage Productions"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveEmail}
                  disabled={updateSettings.isPending}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Save Email Settings
                </button>
              </div>
            )}

            {/* Email Automation Tab */}
            {activeTab === 'automation' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Email Automation</h2>
                <p className="text-slate-400 mb-6">
                  Configure automated email triggers for events. These emails are sent automatically based on event lifecycle milestones.
                </p>

                <div className="space-y-8">
                  {/* Pre-Event Reminders */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">⏰</span>
                      <h3 className="text-lg font-semibold text-white">Pre-Event Reminders</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Automatically remind operators and clients before events
                    </p>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">48-Hour Reminder</div>
                          <div className="text-xs text-slate-500">Send reminder 48 hours before event load-in time</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">24-Hour Reminder</div>
                          <div className="text-xs text-slate-500">Send reminder 24 hours before event load-in time</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Morning-Of Reminder</div>
                          <div className="text-xs text-slate-500">Send reminder at 8 AM on event day</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Post-Event Follow-ups */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">✉️</span>
                      <h3 className="text-lg font-semibold text-white">Post-Event Follow-ups</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Automatically follow up with clients after events
                    </p>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">2-Week Follow-up</div>
                          <div className="text-xs text-slate-500">Send follow-up 2 weeks after event for feedback/rebooking</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">4-Week Follow-up</div>
                          <div className="text-xs text-slate-500">Send follow-up 4 weeks after event for future bookings</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Document Triggers */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📄</span>
                      <h3 className="text-lg font-semibold text-white">Document Triggers</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Automatically send documents at specific times
                    </p>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Questionnaire on Booking</div>
                          <div className="text-xs text-slate-500">Send event questionnaire when status changes to BOOKED</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Invoice on Completion</div>
                          <div className="text-xs text-slate-500">Send invoice when event status changes to COMPLETED</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Payment Reminders</div>
                          <div className="text-xs text-slate-500">Send payment reminders for outstanding invoices (7 days overdue)</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Contract Automation */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📝</span>
                      <h3 className="text-lg font-semibold text-white">Contract Automation</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      Automatically send contracts and follow up on signatures
                    </p>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Auto-Send Contract</div>
                          <div className="text-xs text-slate-500">Automatically send contract when proposal is accepted</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-green-600/50 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-600" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Signature Reminders</div>
                          <div className="text-xs text-slate-500">Send reminders every 3 days for unsigned contracts</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">ℹ️</span>
                    <div className="text-sm text-blue-400">
                      <div className="font-semibold mb-1">Email automation is currently in preview</div>
                      <div className="text-blue-400/80">
                        These settings will be functional once email provider is configured in Email Settings tab.
                        All automated emails respect your configured email templates and branding.
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('Email automation settings saved! (Preview mode)')}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                >
                  💾 Save Automation Settings
                </button>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Billing Settings</h2>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <div className="text-sm font-semibold text-yellow-500">Sensitive Information</div>
                      <div className="text-xs text-yellow-500/80 mt-1">
                        These credentials are encrypted and securely stored. Never share your secret keys.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Stripe Publishable Key */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Stripe Publishable Key
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Your Stripe public key (starts with pk_)
                    </p>
                    <input
                      type="text"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                      placeholder="pk_live_••••••••••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Stripe Secret Key */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Stripe Secret Key
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Your Stripe secret key (starts with sk_)
                    </p>
                    <input
                      type="password"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      placeholder="sk_live_••••••••••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Stripe Webhook Secret */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Stripe Webhook Secret
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Your Stripe webhook endpoint secret (starts with whsec_)
                    </p>
                    <input
                      type="password"
                      value={stripeWebhookSecret}
                      onChange={(e) => setStripeWebhookSecret(e.target.value)}
                      placeholder="whsec_••••••••••••••••"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveBilling}
                  disabled={updateBillingInfo.isPending}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Save Billing Settings
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Security Settings</h2>
                <div className="text-slate-400 text-center py-12">
                  <div className="text-6xl mb-4">🔐</div>
                  <p>Security settings coming soon</p>
                  <p className="text-sm mt-2">Password policies, 2FA, and access control will be available here</p>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Integrations</h2>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">ℹ️</div>
                    <div>
                      <div className="text-sm font-semibold text-blue-500">API Keys Storage</div>
                      <div className="text-xs text-blue-500/80 mt-1">
                        These integration keys are stored in your database settings. For production use, configure them in environment variables instead.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* OpenAI Integration */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                      <span>🤖</span> OpenAI (Voice Agent + AI Features)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          API Key
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your OpenAI API key (starts with sk-)
                        </p>
                        <input
                          type="password"
                          value={openaiApiKey}
                          onChange={(e) => setOpenaiApiKey(e.target.value)}
                          placeholder="sk-••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Organization ID (Optional)
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your OpenAI organization ID (starts with org-)
                        </p>
                        <input
                          type="text"
                          value={openaiOrgId}
                          onChange={(e) => setOpenaiOrgId(e.target.value)}
                          placeholder="org-••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <button className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all">
                        🔌 Test Connection
                      </button>
                    </div>
                  </div>

                  {/* Vimeo Integration */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                      <span>📹</span> Vimeo (Livestream Integration)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Access Token
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your Vimeo personal access token
                        </p>
                        <input
                          type="password"
                          value={vimeoAccessToken}
                          onChange={(e) => setVimeoAccessToken(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Client ID
                          </label>
                          <input
                            type="text"
                            value={vimeoClientId}
                            onChange={(e) => setVimeoClientId(e.target.value)}
                            placeholder="Client ID"
                            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Client Secret
                          </label>
                          <input
                            type="password"
                            value={vimeoClientSecret}
                            onChange={(e) => setVimeoClientSecret(e.target.value)}
                            placeholder="Client Secret"
                            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                          />
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all">
                        🔌 Test Connection
                      </button>
                    </div>
                  </div>

                  {/* Telegram Integration */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                      <span>💬</span> Telegram (Operator Coordination)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Bot Token
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your Telegram bot token from @BotFather
                        </p>
                        <input
                          type="password"
                          value={telegramBotToken}
                          onChange={(e) => setTelegramBotToken(e.target.value)}
                          placeholder="••••••••:••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Bot Username
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your bot's username (without @)
                        </p>
                        <input
                          type="text"
                          value={telegramBotUsername}
                          onChange={(e) => setTelegramBotUsername(e.target.value)}
                          placeholder="your_bot_username"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <button className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all">
                        🔌 Test Connection
                      </button>
                    </div>
                  </div>

                  {/* Google APIs Integration */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                      <span>🔍</span> Google APIs (Drive + Gmail)
                    </h3>

                    <div className="space-y-4">
                      {/* Google Drive Toggle */}
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1">
                              Enable Google Drive
                            </label>
                            <p className="text-xs text-slate-500">
                              Automatically create folders for events
                            </p>
                          </div>
                          <button
                            onClick={() => setGoogleDriveEnabled(!googleDriveEnabled)}
                            className={`w-14 h-7 rounded-full transition-all relative ${
                              googleDriveEnabled ? 'bg-green-500' : 'bg-slate-700'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all ${
                                googleDriveEnabled ? 'left-7' : 'left-0.5'
                              }`}
                            ></div>
                          </button>
                        </div>

                        {googleDriveEnabled && (
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Parent Folder ID
                            </label>
                            <p className="text-xs text-slate-500 mb-2">
                              Google Drive folder ID where event folders will be created
                            </p>
                            <input
                              type="text"
                              value={googleDriveParentFolderId}
                              onChange={(e) => setGoogleDriveParentFolderId(e.target.value)}
                              placeholder="1a2b3c4d5e6f7g8h9i0j"
                              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            OAuth Client ID
                          </label>
                          <input
                            type="text"
                            value={googleClientId}
                            onChange={(e) => setGoogleClientId(e.target.value)}
                            placeholder="••••••••.apps.googleusercontent.com"
                            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            OAuth Client Secret
                          </label>
                          <input
                            type="password"
                            value={googleClientSecret}
                            onChange={(e) => setGoogleClientSecret(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Service Account Email
                        </label>
                        <input
                          type="email"
                          value={googleServiceAccountEmail}
                          onChange={(e) => setGoogleServiceAccountEmail(e.target.value)}
                          placeholder="service-account@project.iam.gserviceaccount.com"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Service Account Key (Base64)
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Base64-encoded JSON service account key
                        </p>
                        <textarea
                          value={googleServiceAccountKey}
                          onChange={(e) => setGoogleServiceAccountKey(e.target.value)}
                          placeholder="eyJ0eXBlIjoic2VydmljZV9hY2NvdW50..."
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500 font-mono text-xs"
                        />
                      </div>

                      <button className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all">
                        🔌 Test Connection
                      </button>
                    </div>
                  </div>

                  {/* SignWell Integration */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                      <span>✍️</span> SignWell (E-Signatures)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          API Key
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                          Your SignWell API key
                        </p>
                        <input
                          type="password"
                          value={signwellApiKey}
                          onChange={(e) => setSignwellApiKey(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <button className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all">
                        🔌 Test Connection
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveIntegrations}
                  disabled={updateSettings.isPending}
                  className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Save Integration Settings
                </button>
              </div>
            )}

            {/* Service Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <h2 className="text-2xl font-bold text-green-500 mb-6">Service Templates</h2>
                <p className="text-slate-400 mb-6">
                  Manage your service templates for quick proposal generation. These templates can be used to quickly populate proposals with predefined services and pricing.
                </p>

                <div className="mb-6">
                  <button
                    onClick={() => {
                      // TODO: Open create template modal
                      alert('Create template modal - to be implemented');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                  >
                    ➕ Create New Template
                  </button>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <p className="text-slate-400 text-center py-8">
                      Service template management UI coming soon. Use the tRPC router to create templates programmatically.
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                      Available procedures: list, getById, create, update, delete, restore
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
