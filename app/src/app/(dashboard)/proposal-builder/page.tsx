'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/Button';
import { Save, Eye, Globe } from 'lucide-react';
import { ElementPalette } from '@/components/proposal-builder/ElementPalette';
import { Canvas } from '@/components/proposal-builder/Canvas';
import { SettingsPanel } from '@/components/proposal-builder/SettingsPanel';
import type { ProposalElement } from '@/types/proposal';

/**
 * Proposal Builder Page
 *
 * Drag-and-drop builder for creating customizable proposal templates.
 * 3-column layout: Element Palette | Canvas | Settings Panel
 *
 * Features:
 * - Drag elements from palette to canvas
 * - Configure element settings in right panel
 * - Real-time preview
 * - Save as draft or publish template
 */

export default function ProposalBuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>}>
      <ProposalBuilderContent />
    </Suspense>
  );
}

function ProposalBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');

  // State
  const [elements, setElements] = useState<ProposalElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [templateSlug, setTemplateSlug] = useState('untitled-template');
  const [templateDescription, setTemplateDescription] = useState('');

  // Load template if editing existing
  const { data: template, isLoading } = trpc.proposalTemplate.getById.useQuery(
    { id: templateId! },
    { enabled: !!templateId }
  );

  // Mutations
  const createTemplate = trpc.proposalTemplate.create.useMutation();
  const updateTemplate = trpc.proposalTemplate.update.useMutation();
  const publishTemplate = trpc.proposalTemplate.publish.useMutation();

  // Initialize from loaded template
  useState(() => {
    if (template && template.configJson) {
      const config = template.configJson as { elements?: ProposalElement[] };
      if (config.elements) {
        setElements(config.elements);
      }
      setTemplateName(template.name);
      setTemplateSlug(template.slug);
      setTemplateDescription(template.description || '');
    }
  });

  // Selected element
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Handlers
  const handleAddElement = (elementType: ProposalElement['type']) => {
    const newElement: ProposalElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      order: elements.length,
      config: getDefaultConfig(elementType),
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleMoveElement = (elementId: string, direction: 'up' | 'down') => {
    const index = elements.findIndex((el) => el.id === elementId);
    if (index === -1) return;

    const newElements = [...elements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= elements.length) return;

    // Swap elements
    [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];

    // Update order property
    newElements.forEach((el, idx) => {
      el.order = idx;
    });

    setElements(newElements);
  };

  const handleDeleteElement = (elementId: string) => {
    const newElements = elements.filter((el) => el.id !== elementId);

    // Update order property
    newElements.forEach((el, idx) => {
      el.order = idx;
    });

    setElements(newElements);

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleUpdateElementConfig = (elementId: string, newConfig: Record<string, any>) => {
    setElements(
      elements.map((el) =>
        el.id === elementId
          ? { ...el, config: newConfig }
          : el
      )
    );
  };

  const handleSaveDraft = async () => {
    const configJson = {
      elements,
      theme_config: {},
    };

    try {
      if (templateId) {
        await updateTemplate.mutateAsync({
          id: templateId,
          name: templateName,
          slug: templateSlug,
          description: templateDescription,
          configJson,
        });
      } else {
        const newTemplate = await createTemplate.mutateAsync({
          name: templateName,
          slug: templateSlug,
          description: templateDescription,
          configJson,
        });
        router.push(`/proposal-builder?id=${newTemplate.id}`);
      }
    } catch (error: any) {
      console.error('Failed to save template:', error);
      alert(error.message || 'Failed to save template');
    }
  };

  const handlePublish = async () => {
    // Save first if changes exist
    await handleSaveDraft();

    if (!templateId) {
      alert('Please save the template first');
      return;
    }

    try {
      const result = await publishTemplate.mutateAsync({ id: templateId });
      alert(`Template published! URL: ${result.publishedUrl}`);
    } catch (error: any) {
      console.error('Failed to publish template:', error);
      alert(error.message || 'Failed to publish template');
    }
  };

  const handlePreview = () => {
    window.open(`/proposals/preview/${templateSlug}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Proposal Builder</h1>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
            placeholder="Template name"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="medium" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleSaveDraft}
            disabled={createTemplate.isPending || updateTemplate.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {createTemplate.isPending || updateTemplate.isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handlePublish}
            disabled={publishTemplate.isPending}
          >
            <Globe className="w-4 h-4 mr-2" />
            {publishTemplate.isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Element Palette */}
        <ElementPalette onAddElement={handleAddElement} />

        {/* Center: Canvas */}
        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onMoveElement={handleMoveElement}
          onDeleteElement={handleDeleteElement}
          onAddElement={handleAddElement}
        />

        {/* Right: Settings Panel */}
        <SettingsPanel
          element={selectedElement}
          onUpdateConfig={(newConfig) => {
            if (selectedElement) {
              handleUpdateElementConfig(selectedElement.id, newConfig);
            }
          }}
          onDelete={() => {
            if (selectedElement) {
              handleDeleteElement(selectedElement.id);
            }
          }}
        />
      </div>
    </div>
  );
}

/**
 * Get default configuration for each element type
 */
function getDefaultConfig(type: ProposalElement['type']): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        title: 'Your Proposal Title',
        subtitle: 'Subtitle goes here',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
      };

    case 'number_input':
      return {
        label: 'Quantity',
        placeholder: 'Enter number',
        min: 1,
        max: 1000,
        defaultValue: 1,
        required: true,
        pricingVariable: 'quantity',
      };

    case 'service_toggles':
      return {
        label: 'Select Services',
        services: [
          {
            id: 'service-1',
            name: 'Service 1',
            description: 'Description',
            basePrice: 500,
            defaultEnabled: false,
          },
        ],
        layout: 'grid',
        allowMultiple: true,
      };

    case 'pricing_summary':
      return {
        label: 'Total Investment',
        showBreakdown: true,
        showTax: false,
        currencySymbol: '$',
        position: 'inline',
      };

    case 'submit_button':
      return {
        label: 'Request This Proposal',
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        successMessage: 'Thank you! We will be in touch soon.',
      };

    case 'date_picker':
      return {
        label: 'Event Date',
        placeholder: '',
        required: false,
        helpText: '',
        defaultValue: '',
        minDate: '',
        maxDate: '',
      };

    case 'dropdown':
      return {
        label: 'Select Option',
        placeholder: 'Choose...',
        required: false,
        helpText: '',
        options: [
          { value: 'option-1', label: 'Option 1', priceModifier: 0 },
          { value: 'option-2', label: 'Option 2', priceModifier: 0 },
        ],
      };

    case 'radio_group':
      return {
        label: 'Choose One',
        required: false,
        layout: 'vertical',
        options: [
          { value: 'option-1', label: 'Option 1', description: '', priceModifier: 0 },
          { value: 'option-2', label: 'Option 2', description: '', priceModifier: 0 },
        ],
      };

    case 'checkbox_group':
      return {
        label: 'Select All That Apply',
        options: [
          { value: 'option-1', label: 'Option 1', description: '', priceModifier: 0 },
          { value: 'option-2', label: 'Option 2', description: '', priceModifier: 0 },
        ],
      };

    case 'pricing_tiers':
      return {
        label: 'Pricing',
        basedOn: 'quantity',
        showCalculation: true,
        tiers: [
          { label: '1-10 units', minQty: 1, maxQty: 10, pricePerUnit: 100 },
          { label: '11-50 units', minQty: 11, maxQty: 50, pricePerUnit: 90 },
          { label: '51+ units', minQty: 51, maxQty: null, pricePerUnit: 80 },
        ],
      };

    case 'package_tiers':
      return {
        label: 'Choose Your Package',
        layout: 'cards',
        allowMultiple: false,
        packages: [
          {
            id: 'basic',
            name: 'Basic',
            price: 1000,
            icon: '📦',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            recommended: false,
          },
          {
            id: 'pro',
            name: 'Professional',
            price: 2500,
            icon: '🚀',
            features: ['Everything in Basic', 'Feature 4', 'Feature 5', 'Priority Support'],
            recommended: true,
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 5000,
            icon: '⭐',
            features: ['Everything in Pro', 'Feature 6', 'Feature 7', 'Dedicated Account Manager'],
            recommended: false,
          },
        ],
      };

    case 'rich_text':
      return {
        content: '<h2>Heading</h2><p>Your content here...</p>',
        textAlign: 'left',
        fontSize: 'base',
      };

    case 'image':
      return {
        imageUrl: '',
        altText: 'Image',
        caption: '',
        width: 'full',
      };

    case 'video':
      return {
        embedUrl: '',
        aspectRatio: '16:9',
      };

    default:
      return {};
  }
}
