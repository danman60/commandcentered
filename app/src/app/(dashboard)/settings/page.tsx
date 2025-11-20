'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

type SettingsTab = 'organization' | 'profile' | 'notifications' | 'email' | 'billing' | 'security' | 'integrations';

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
    { id: 'billing', icon: '💳', label: 'Billing' },
    { id: 'security', icon: '🔐', label: 'Security' },
    { id: 'integrations', icon: '🔌', label: 'Integrations' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">⚙️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
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

                <div className="space-y-6">
                  {/* Google Drive */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1">
                          Google Drive Integration
                        </label>
                        <p className="text-xs text-slate-500">
                          Sync files and deliverables to Google Drive
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
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Parent Folder ID
                        </label>
                        <p className="text-xs text-slate-500 mb-3">
                          Google Drive folder ID where files will be stored
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

                  {/* Vimeo Integration (Placeholder) */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1">
                          Vimeo Integration
                        </label>
                        <p className="text-xs text-slate-500">
                          Manage livestreams and video hosting
                        </p>
                      </div>
                      <button
                        disabled
                        className="w-14 h-7 rounded-full bg-slate-700 opacity-50 cursor-not-allowed relative"
                      >
                        <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Coming soon</p>
                  </div>

                  {/* Telegram Integration (Placeholder) */}
                  <div className="pb-6 border-b border-slate-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1">
                          Telegram Bot Integration
                        </label>
                        <p className="text-xs text-slate-500">
                          Send notifications via Telegram
                        </p>
                      </div>
                      <button
                        disabled
                        className="w-14 h-7 rounded-full bg-slate-700 opacity-50 cursor-not-allowed relative"
                      >
                        <div className="w-6 h-6 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Coming soon</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
