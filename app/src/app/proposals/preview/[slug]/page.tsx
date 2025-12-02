'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { useForm } from 'react-hook-form';
import { ElementRenderer } from '@/components/proposal-builder/ElementRenderer';
import { calculateProposalPricing } from '@/lib/proposal-pricing';
import type { ProposalElement } from '@/types/proposal';

/**
 * Public Proposal Preview Page
 *
 * Client-facing proposal form rendered from template.
 * No authentication required - accessible via public URL.
 *
 * Flow:
 * 1. Fetch published template by slug
 * 2. Render elements dynamically
 * 3. Calculate pricing in real-time
 * 4. Submit to create Proposal record
 */

export default function ProposalPreviewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch published template (public endpoint - no auth)
  const { data: template, isLoading, error } = trpc.proposalTemplate.getBySlug.useQuery(
    { slug },
    { retry: false }
  );

  // Form state
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  // Watch all form values for real-time pricing
  const formValues = watch();

  // Mutation for creating proposal submission
  const createProposal = trpc.proposal.create.useMutation();

  // Calculate pricing in real-time
  const pricing = useMemo(() => {
    if (!template?.configJson) return null;
    const config = template.configJson as { elements?: ProposalElement[] };
    if (!config.elements) return null;

    return calculateProposalPricing(config.elements, formValues);
  }, [template, formValues]);

  // Handle form submission
  const onSubmit = async (data: any) => {
    if (!template) return;

    setIsSubmitting(true);
    try {
      await createProposal.mutateAsync({
        templateId: template.id,
        selectionsJson: data,
        subtotalAmount: pricing?.subtotal || 0,
        discountAmount: pricing?.discountAmount || 0,
        totalAmount: pricing?.total || 0,
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Failed to submit proposal:', error);
      alert(error.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposal Not Found</h1>
          <p className="text-gray-600 mb-6">
            This proposal template does not exist or has not been published yet.
          </p>
          <p className="text-sm text-gray-500">
            Please check the URL and try again, or contact the sender.
          </p>
        </div>
      </div>
    );
  }

  const config = template.configJson as { elements?: ProposalElement[]; theme_config?: any };
  const elements = config.elements || [];

  // Success state
  if (isSubmitted) {
    const submitButton = elements.find((el) => el.type === 'submit_button');
    const successMessage = submitButton?.config.successMessage || 'Thank you! Your proposal has been submitted successfully.';

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Submitted!</h1>
          <p className="text-gray-600 whitespace-pre-line">{successMessage}</p>
        </div>
      </div>
    );
  }

  // Main proposal form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Render elements */}
          {elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              register={register}
              formValues={formValues}
              errors={errors}
              pricing={pricing}
            />
          ))}

          {/* Sticky pricing summary for mobile */}
          {pricing && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${pricing.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
