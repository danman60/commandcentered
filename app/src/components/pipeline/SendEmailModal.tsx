import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Copy, ExternalLink } from 'lucide-react';
import type { Lead } from '@prisma/client';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

const EMAIL_TEMPLATES = {
  followUp: {
    subject: 'Following up on our conversation',
    body: `Hi {{contactName}},

I wanted to follow up on our recent conversation about {{organization}}'s needs.

I'd love to schedule a time to discuss how we can help with:
- [Product/Service 1]
- [Product/Service 2]

Are you available for a quick call this week?

Best regards,
[Your Name]`,
  },
  proposal: {
    subject: 'Proposal for {{organization}}',
    body: `Hi {{contactName}},

Thank you for your interest in our services. I've prepared a proposal tailored to {{organization}}'s needs.

I've attached the detailed proposal document. Here are the key highlights:
- [Highlight 1]
- [Highlight 2]
- [Highlight 3]

I'm available to discuss any questions you may have.

Best regards,
[Your Name]`,
  },
  checkIn: {
    subject: 'Checking in',
    body: `Hi {{contactName}},

I hope this email finds you well! I wanted to check in and see how things are going at {{organization}}.

Is there anything we can help with at this time?

Looking forward to hearing from you.

Best regards,
[Your Name]`,
  },
  custom: {
    subject: '',
    body: '',
  },
};

export function SendEmailModal({ isOpen, onClose, lead }: SendEmailModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>('followUp');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);

  // Apply template when selected
  React.useEffect(() => {
    if (selectedTemplate && selectedTemplate !== 'custom') {
      const template = EMAIL_TEMPLATES[selectedTemplate];
      const contactName = lead.contactName || 'there';
      const organization = lead.organization || 'your organization';

      setSubject(template.subject.replace('{{contactName}}', contactName).replace('{{organization}}', organization));
      setBody(template.body.replace(/{{contactName}}/g, contactName).replace(/{{organization}}/g, organization));
    }
  }, [selectedTemplate, lead.contactName, lead.organization]);

  const handleCopyToClipboard = () => {
    const emailContent = `To: ${lead.email}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <Modal
      title={`Send Email - ${lead.organization}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            To
          </label>
          <div className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white">
            {lead.email}
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof EMAIL_TEMPLATES)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="followUp">Follow-Up</option>
            <option value="proposal">Proposal</option>
            <option value="checkIn">Check-In</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="Compose your email..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Edit the template above before sending
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="medium"
              onClick={handleCopyToClipboard}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleOpenMailto}
            >
              <ExternalLink className="w-4 h-4" />
              Open in Email Client
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
