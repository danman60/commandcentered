'use client';

import { trpc } from '@/lib/trpc/client';
import { useState, useMemo, useRef } from 'react';
import {
  FileActionsMenu,
  FileRenameModal,
  FileDeleteModal,
  FileMetadataModal,
} from '@/components/files/FileActionsMenu';

export default function FilesPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'contracts' | 'proposals' | 'livestreams' | 'service-library'>('documents');
  const [selectedServices, setSelectedServices] = useState<string[]>(['multi-camera', 'highlight-reel']);
  const [currentStep, setCurrentStep] = useState(1);
  const [proposalPricing, setProposalPricing] = useState({ discount: 0, notes: '', terms: '' });
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('documents');
  const [uploadDescription, setUploadDescription] = useState('');
  const [serviceFormData, setServiceFormData] = useState({ name: '', description: '', price: '' });
  const [customServices, setCustomServices] = useState<Array<{ id: string; name: string; description: string; price: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File actions state
  const [selectedFileForAction, setSelectedFileForAction] = useState<any>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  // Fetch contracts and proposals from backend
  const { data: contractsData, isLoading: contractsLoading } = trpc.contract.list.useQuery();
  const { data: proposalsData, isLoading: proposalsLoading } = trpc.proposal.list.useQuery();
  const { data: clientsData } = trpc.client.list.useQuery();
  const { data: filesData, refetch: refetchFiles } = trpc.file.list.useQuery({
    category: activeTab === 'documents' ? 'documents' : undefined,
    clientId: selectedClientId !== 'all' ? selectedClientId : undefined,
  });
  const { data: serviceTemplatesData } = trpc.serviceTemplate.list.useQuery({
    includeInactive: false,
  });
  const createFile = trpc.file.create.useMutation({
    onSuccess: () => {
      refetchFiles();
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadDescription('');
    },
  });
  const updateFile = trpc.file.update.useMutation({
    onSuccess: () => {
      refetchFiles();
    },
  });
  const deleteFile = trpc.file.delete.useMutation({
    onSuccess: () => {
      refetchFiles();
    },
  });

  // Transform contracts for display
  const contracts = useMemo(() => {
    if (!contractsData) return [];

    return contractsData.map(contract => ({
      id: contract.id,
      name: contract.contractNumber,
      client: contract.client?.organization || contract.lead?.organization || 'Unknown Client',
      status: contract.status.toLowerCase(),
      date: new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));
  }, [contractsData]);

  // Transform proposals for display
  const proposals = useMemo(() => {
    if (!proposalsData) return [];

    return proposalsData.map(proposal => ({
      id: proposal.id,
      name: `${proposal.lead?.organization || 'Unknown'}_Proposal`,
      amount: `$${proposal.totalAmount.toLocaleString()}`,
      status: proposal.status === 'SUBMITTED' ? `Sent ${new Date(proposal.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` :
              proposal.status === 'REVIEWING' ? 'Under Review' :
              proposal.status === 'ACCEPTED' ? 'Accepted' :
              proposal.status === 'REJECTED' ? 'Rejected' :
              proposal.status,
    }));
  }, [proposalsData]);

  // Transform files from backend
  const documents = useMemo(() => {
    if (!filesData) return [];

    return filesData.map(file => {
      const fileSizeNum = Number(file.fileSize);
      const sizeInMB = fileSizeNum / (1024 * 1024);
      const sizeInKB = fileSizeNum / 1024;
      const size = sizeInMB >= 1
        ? `${sizeInMB.toFixed(1)} MB`
        : `${Math.round(sizeInKB)} KB`;

      const icon = file.fileType.includes('pdf') ? '📄'
        : file.fileType.includes('sheet') || file.fileName.endsWith('.xlsx') ? '📊'
        : file.fileType.includes('image') ? '🖼️'
        : '📄';

      return {
        id: file.id,
        icon,
        name: file.fileName,
        size,
        date: new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    });
  }, [filesData]);

  const livestreams = [
    {
      id: '1',
      title: 'EMPWR Dance Experience - Dec 6',
      streamKey: 'live-abc123',
      rtmpUrl: 'rtmp://vimeo.com/live',
      embedCode: '<iframe src="...">',
    },
    {
      id: '2',
      title: 'Glow Dance Competition - Dec 10',
      streamKey: 'live-xyz789',
      rtmpUrl: 'rtmp://vimeo.com/live',
      embedCode: '<iframe src="...">',
    },
  ];

  const services = [
    { id: 'multi-camera', name: 'Multi-Camera Coverage', description: 'Professional 3-camera setup with switching', price: 2500 },
    { id: 'highlight-reel', name: 'Highlight Reel', description: '3-5 minute edited highlight video', price: 800 },
    { id: 'livestream', name: 'Livestream', description: 'Live streaming to Vimeo or YouTube', price: 1200 },
    { id: 'raw-footage', name: 'Raw Footage Delivery', description: 'All raw footage via Google Drive', price: 400 },
  ];

  // Transform service templates from backend
  const serviceLibraryTemplates = useMemo(() => {
    if (!serviceTemplatesData) return [];

    return serviceTemplatesData.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      price: `$${Number(template.defaultPrice).toLocaleString()}`,
    }));
  }, [serviceTemplatesData]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Import Supabase client
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // Generate unique file path
      const timestamp = Date.now();
      const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${uploadCategory}/${timestamp}-${sanitizedFileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(storagePath);

      // Save file metadata to database
      createFile.mutate({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        filePath: urlData.publicUrl,
        fileSize: selectedFile.size,
        category: uploadCategory,
        description: uploadDescription || undefined,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!serviceFormData.name || !serviceFormData.description || !serviceFormData.price) return;

    const newService = {
      id: Date.now().toString(),
      name: serviceFormData.name,
      description: serviceFormData.description,
      price: serviceFormData.price,
    };

    setCustomServices([...customServices, newService]);
    setShowAddServiceModal(false);
    setServiceFormData({ name: '', description: '', price: '' });
  };

  // File action handlers
  const handleDownload = (file: any) => {
    // Open file URL in new tab to trigger download
    window.open(file.filePath, '_blank');
  };

  const handleRename = (file: any) => {
    setSelectedFileForAction(file);
    setShowRenameModal(true);
  };

  const handleDelete = (file: any) => {
    setSelectedFileForAction(file);
    setShowDeleteModal(true);
  };

  const handleEditMetadata = (file: any) => {
    setSelectedFileForAction(file);
    setShowMetadataModal(true);
  };

  const handleRenameSubmit = async (fileId: string, newName: string) => {
    await updateFile.mutateAsync({ id: fileId, fileName: newName });
    setShowRenameModal(false);
    setSelectedFileForAction(null);
  };

  const handleDeleteSubmit = async (fileId: string) => {
    await deleteFile.mutateAsync({ id: fileId });
    setShowDeleteModal(false);
    setSelectedFileForAction(null);
  };

  const handleMetadataSubmit = async (
    fileId: string,
    data: { description?: string; category?: string }
  ) => {
    await updateFile.mutateAsync({ id: fileId, ...data });
    setShowMetadataModal(false);
    setSelectedFileForAction(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/10 border-b border-green-500/30 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📄</div>
            <h1 className="text-3xl font-bold tactical-heading">
              Files & Assets
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 bg-slate-700/30 text-slate-300 border border-slate-700/50 rounded-lg font-semibold hover:bg-slate-700/50 transition-all">
              📁 Open Google Drive
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
            >
              ⬆️ Upload File
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700/30">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'documents'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📄 Documents
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'contracts'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📝 Contracts
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'proposals'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            💼 Proposals
          </button>
          <button
            onClick={() => setActiveTab('livestreams')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'livestreams'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📡 Livestreams
          </button>
          <button
            onClick={() => setActiveTab('service-library')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'service-library'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📚 Service Library
          </button>
        </div>

        {/* Tab 1: Documents */}
        {activeTab === 'documents' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-green-500">📁 Recent Documents</h2>

              {/* Client Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-300">Filter by Client:</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="all">All Clients</option>
                  {clientsData?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.organization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Documents Grid */}
            {filesData && filesData.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filesData.map((file) => (
                  <div
                    key={file.id}
                    className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 hover:border-green-500/60 hover:-translate-y-1 transition-all relative"
                  >
                    {/* File Actions Menu */}
                    <div className="absolute top-2 right-2">
                      <FileActionsMenu
                        file={{
                          id: file.id,
                          fileName: file.fileName,
                          filePath: file.filePath,
                          fileSize: file.fileSize,
                          fileType: file.fileType,
                          description: file.description,
                          category: file.category,
                        }}
                        onDownload={handleDownload}
                        onRename={handleRename}
                        onDelete={handleDelete}
                        onEditMetadata={handleEditMetadata}
                      />
                    </div>

                    <div className="text-5xl text-center mb-3">📄</div>
                    <div className="text-sm font-semibold text-slate-100 mb-1 truncate">{file.fileName}</div>
                    <div className="text-xs text-slate-500">
                      {(Number(file.fileSize) / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {file.client && (
                      <div className="text-xs text-green-400 mt-1">{file.client.organization}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                No documents found{selectedClientId !== 'all' && ' for selected client'}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contracts */}
        {activeTab === 'contracts' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-500 mb-5">📝 Client Contracts</h2>
            {contractsLoading ? (
              <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                Loading contracts...
              </div>
            ) : contracts.length === 0 ? (
              <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                No contracts yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Contract Name
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Client
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Status
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Date
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-green-500 uppercase tracking-wider border-b border-slate-700/30">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-slate-700/20 hover:bg-green-500/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 text-sm text-slate-300">{contract.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{contract.client}</td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            contract.status === 'signed'
                              ? 'bg-green-500/20 text-green-500'
                              : contract.status === 'sent'
                              ? 'bg-orange-500/20 text-orange-500'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{contract.date}</td>
                      <td className="px-5 py-4 text-sm">
                        <button className="px-4 py-2 bg-slate-700/30 border border-slate-700/50 rounded-md text-slate-300 text-xs hover:bg-slate-700/50 transition-all">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Tab 3: Proposals */}
        {activeTab === 'proposals' && (
          <div>
            {/* Proposal Builder */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-500 mb-5">💼 Proposal Builder</h2>

              {/* Steps */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-slate-700/50'} text-white flex items-center justify-center font-bold`}>
                    1
                  </div>
                  <div className={`text-xs ${currentStep >= 1 ? 'text-green-500' : 'text-slate-500'}`}>Services</div>
                </div>
                <div className={`text-2xl ${currentStep >= 2 ? 'text-green-500' : 'text-slate-600'}`}>→</div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-slate-700/50'} ${currentStep >= 2 ? 'text-white' : 'text-slate-400'} flex items-center justify-center font-bold`}>
                    2
                  </div>
                  <div className={`text-xs ${currentStep >= 2 ? 'text-green-500' : 'text-slate-500'}`}>Pricing</div>
                </div>
                <div className={`text-2xl ${currentStep >= 3 ? 'text-green-500' : 'text-slate-600'}`}>→</div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-slate-700/50'} ${currentStep >= 3 ? 'text-white' : 'text-slate-400'} flex items-center justify-center font-bold`}>
                    3
                  </div>
                  <div className={`text-xs ${currentStep >= 3 ? 'text-green-500' : 'text-slate-500'}`}>Review</div>
                </div>
              </div>

              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="bg-slate-900/60 p-6 rounded-lg">
                  <h3 className="text-lg text-green-500 mb-4">Select Services</h3>

                  <div className="flex flex-col gap-3 mb-5">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/30 rounded-lg cursor-pointer hover:border-green-500/50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="text-base font-semibold text-slate-100 mb-1">{service.name}</div>
                          <div className="text-sm text-slate-500">{service.description}</div>
                        </div>
                        <div className="text-xl font-bold text-slate-100">${service.price.toLocaleString()}</div>
                      </label>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-5 bg-green-500/10 rounded-lg mb-6">
                    <div className="text-lg font-semibold text-slate-400">Estimated Total:</div>
                    <div className="text-3xl font-bold text-green-500">${calculateTotal().toLocaleString()}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      disabled
                      className="px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-500 font-semibold cursor-not-allowed opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={selectedServices.length === 0}
                      className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Pricing →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Terms */}
              {currentStep === 2 && (
                <div className="bg-slate-900/60 p-6 rounded-lg">
                  <h3 className="text-lg text-green-500 mb-4">Pricing & Terms</h3>

                  {/* Pricing Summary */}
                  <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-5 mb-5">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Selected Services</h4>
                    {services
                      .filter(s => selectedServices.includes(s.id))
                      .map(service => (
                        <div key={service.id} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-0">
                          <span className="text-slate-300">{service.name}</span>
                          <span className="text-slate-100 font-semibold">${service.price.toLocaleString()}</span>
                        </div>
                      ))}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-700/50">
                      <span className="text-slate-400 font-semibold">Subtotal</span>
                      <span className="text-xl text-slate-100 font-bold">${calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={proposalPricing.discount}
                      onChange={(e) => setProposalPricing({ ...proposalPricing, discount: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Final Total */}
                  <div className="flex justify-between items-center p-5 bg-green-500/10 rounded-lg mb-5">
                    <div className="text-lg font-semibold text-slate-400">Final Total:</div>
                    <div className="text-3xl font-bold text-green-500">
                      ${(calculateTotal() * (1 - proposalPricing.discount / 100)).toLocaleString()}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={proposalPricing.notes}
                      onChange={(e) => setProposalPricing({ ...proposalPricing, notes: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                      rows={3}
                      placeholder="Any special notes or customizations for this proposal..."
                    />
                  </div>

                  {/* Payment Terms */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Payment Terms
                    </label>
                    <textarea
                      value={proposalPricing.terms}
                      onChange={(e) => setProposalPricing({ ...proposalPricing, terms: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                      rows={3}
                      placeholder="e.g., 50% deposit upon booking, 50% due 7 days before event..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-all"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all"
                    >
                      Next: Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Generate */}
              {currentStep === 3 && (
                <div className="bg-slate-900/60 p-6 rounded-lg">
                  <h3 className="text-lg text-green-500 mb-4">Review & Generate Proposal</h3>

                  {/* Summary */}
                  <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-5 mb-5">
                    <h4 className="text-sm font-semibold text-green-500 mb-3">📋 Proposal Summary</h4>

                    {/* Services */}
                    <div className="mb-4">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Services Included</p>
                      <ul className="space-y-1">
                        {services
                          .filter(s => selectedServices.includes(s.id))
                          .map(service => (
                            <li key={service.id} className="text-slate-300 flex justify-between">
                              <span>• {service.name}</span>
                              <span className="text-slate-400">${service.price.toLocaleString()}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-slate-700/50 pt-3 mb-4">
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Subtotal</span>
                        <span>${calculateTotal().toLocaleString()}</span>
                      </div>
                      {proposalPricing.discount > 0 && (
                        <div className="flex justify-between text-green-400 mb-1">
                          <span>Discount ({proposalPricing.discount}%)</span>
                          <span>-${(calculateTotal() * proposalPricing.discount / 100).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold text-green-500 pt-2 border-t border-slate-700/50">
                        <span>Total</span>
                        <span>${(calculateTotal() * (1 - proposalPricing.discount / 100)).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Notes & Terms */}
                    {proposalPricing.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Additional Notes</p>
                        <p className="text-sm text-slate-300">{proposalPricing.notes}</p>
                      </div>
                    )}
                    {proposalPricing.terms && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Payment Terms</p>
                        <p className="text-sm text-slate-300">{proposalPricing.terms}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-all"
                    >
                      ← Previous
                    </button>
                    <button className="ml-auto px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-all">
                      💾 Save Draft
                    </button>
                    <button className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all">
                      📄 Generate HTML Proposal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Proposals */}
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-green-500 mb-5">📋 Recent Proposals</h2>
              {proposalsLoading ? (
                <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                  Loading proposals...
                </div>
              ) : proposals.length === 0 ? (
                <div className="bg-slate-900/60 p-12 rounded-lg text-center text-slate-400">
                  No proposals yet
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-green-500/60 hover:-translate-y-1 transition-all"
                    >
                      <div className="text-5xl text-center mb-3">📊</div>
                      <div className="text-sm font-semibold text-slate-100 mb-1 truncate">{proposal.name}</div>
                      <div className="text-xs text-slate-500">{proposal.amount} • {proposal.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Livestreams */}
        {activeTab === 'livestreams' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-500 mb-5">📡 Vimeo Livestreams</h2>
            <div className="flex flex-col gap-4">
              {livestreams.map((stream) => (
                <div
                  key={stream.id}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-5 flex gap-5 items-center"
                >
                  <div className="w-48 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-5xl">
                    🎥
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-100 mb-2">{stream.title}</h3>
                    <div className="text-sm text-slate-400 mb-3">
                      <strong>Stream Key:</strong> {stream.streamKey} • <strong>RTMP URL:</strong> {stream.rtmpUrl}
                      <br />
                      <strong>Embed Code:</strong> {stream.embedCode}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500/15 border border-green-500/30 rounded-md text-green-500 text-xs hover:bg-green-500/25 transition-all">
                        📋 Copy Stream Key
                      </button>
                      <button className="px-4 py-2 bg-green-500/15 border border-green-500/30 rounded-md text-green-500 text-xs hover:bg-green-500/25 transition-all">
                        🔗 Copy RTMP URL
                      </button>
                      <button className="px-4 py-2 bg-green-500/15 border border-green-500/30 rounded-md text-green-500 text-xs hover:bg-green-500/25 transition-all">
                        📺 View on Vimeo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Service Library */}
        {activeTab === 'service-library' && (
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-green-500">📚 Service Templates Library</h2>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all"
              >
                ➕ Add Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Default Templates */}
              {serviceLibraryTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-5 cursor-pointer hover:border-green-500/60 hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-base font-bold text-slate-100 mb-3">{template.name}</h3>
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{template.description}</p>
                  <div className="text-2xl font-bold text-green-500">{template.price}</div>
                </div>
              ))}
              {/* Custom Services */}
              {customServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-slate-900/60 border border-green-500/50 rounded-lg p-5 cursor-pointer hover:border-green-500/80 hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold text-slate-100">{service.name}</h3>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Custom</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{service.description}</p>
                  <div className="text-2xl font-bold text-green-500">{service.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-500 mb-5">Upload File</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white file:cursor-pointer hover:file:bg-green-600"
                />
                {selectedFile && (
                  <p className="text-sm text-slate-400 mt-2">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="documents">Documents</option>
                  <option value="contracts">Contracts</option>
                  <option value="proposals">Proposals</option>
                  <option value="livestreams">Livestreams</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Add a description for this file..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadDescription('');
                  }}
                  className="flex-1 px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || createFile.isPending}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createFile.isPending ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-green-500 mb-5">Add New Service Template</h2>

            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                  placeholder="e.g., Dance Recital Package"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  placeholder="Describe what's included in this service package..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Base Price *
                </label>
                <input
                  type="text"
                  value={serviceFormData.price}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                  placeholder="e.g., $5,500"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddServiceModal(false);
                    setServiceFormData({ name: '', description: '', price: '' });
                  }}
                  className="flex-1 px-5 py-3 bg-slate-700/30 border border-slate-700/50 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Rename Modal */}
      {selectedFileForAction && (
        <FileRenameModal
          file={selectedFileForAction}
          isOpen={showRenameModal}
          onClose={() => {
            setShowRenameModal(false);
            setSelectedFileForAction(null);
          }}
          onRename={handleRenameSubmit}
        />
      )}

      {/* File Delete Modal */}
      {selectedFileForAction && (
        <FileDeleteModal
          file={selectedFileForAction}
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedFileForAction(null);
          }}
          onDelete={handleDeleteSubmit}
        />
      )}

      {/* File Metadata Modal */}
      {selectedFileForAction && (
        <FileMetadataModal
          file={selectedFileForAction}
          isOpen={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setSelectedFileForAction(null);
          }}
          onUpdate={handleMetadataSubmit}
        />
      )}
    </div>
  );
}
