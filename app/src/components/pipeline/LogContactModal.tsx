import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc/client';
import type { Lead } from '@prisma/client';

interface LogContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSuccess: () => void;
}

export function LogContactModal({ isOpen, onClose, lead, onSuccess }: LogContactModalProps) {
  const [formData, setFormData] = useState({
    lastContactedAt: new Date().toISOString().split('T')[0],
    nextFollowUpAt: '',
    contactFrequency: lead.contactFrequency || '',
    typeOfContact: '',
    temperature: lead.temperature || '',
  });

  const updateContactInfo = trpc.lead.updateContactInfo.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo.mutate({
      id: lead.id,
      lastContactedAt: new Date(formData.lastContactedAt),
      nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt) : undefined,
      contactFrequency: formData.contactFrequency || undefined,
      typeOfContact: formData.typeOfContact || undefined,
      temperature: formData.temperature as any,
    });
  };

  return (
    <Modal
      title={`Log Contact - ${lead.organization}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Date *
          </label>
          <input
            type="date"
            required
            value={formData.lastContactedAt}
            onChange={(e) => setFormData({ ...formData, lastContactedAt: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">When did you contact this lead?</p>
        </div>

        {/* Contact Type/Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Notes
          </label>
          <textarea
            value={formData.typeOfContact}
            onChange={(e) => setFormData({ ...formData, typeOfContact: e.target.value })}
            rows={3}
            placeholder="What did you discuss? Any key points or next steps?"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Next Follow-Up */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Next Follow-Up Date
          </label>
          <input
            type="date"
            value={formData.nextFollowUpAt}
            onChange={(e) => setFormData({ ...formData, nextFollowUpAt: e.target.value })}
            min={formData.lastContactedAt}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">When should you reach out again?</p>
        </div>

        {/* Contact Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contact Frequency
          </label>
          <select
            value={formData.contactFrequency}
            onChange={(e) => setFormData({ ...formData, contactFrequency: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select frequency...</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">How often should you contact this lead?</p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lead Temperature
          </label>
          <select
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">No temperature set</option>
            <option value="Hot Lead">🔥 Hot Lead</option>
            <option value="Warm Lead">🟠 Warm Lead</option>
            <option value="Cold Lead">🔵 Cold Lead</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">How interested is this lead?</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={updateContactInfo.isPending}
          >
            {updateContactInfo.isPending ? 'Logging...' : 'Log Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
