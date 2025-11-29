'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc/client';
import { Upload, FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

type EntityType = 'operators' | 'gear' | 'clients' | 'events';

interface ParsedData {
  valid: any[];
  errors: { row: number; field: string; message: string }[];
}

export default function QuickOnboardPage() {
  const [activeTab, setActiveTab] = useState<EntityType>('operators');
  const [pastedData, setPastedData] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number; skipped?: number } | null>(null);

  // Mutations
  const importOperators = trpc.operator.batchCreate.useMutation();
  const importGear = trpc.gear.batchCreate.useMutation();
  const importClients = trpc.client.batchCreate.useMutation();
  const importEvents = trpc.event.batchCreate.useMutation();

  // CSV Templates
  const templates = {
    operators: [
      ['name', 'email', 'phone', 'primaryRole', 'hourlyRate', 'bio', 'portfolioUrl'],
      ['John Smith', 'john@example.com', '555-0100', 'Videographer', '75', 'Experienced videographer', ''],
    ],
    gear: [
      ['name', 'category', 'type', 'manufacturer', 'model', 'serialNumber', 'purchasePrice', 'notes'],
      ['Canon C300', 'CAMERA', 'Cinema Camera', 'Canon', 'C300 Mark III', 'SN123456', '15000', ''],
    ],
    clients: [
      ['organization', 'contactName', 'email', 'phone', 'website', 'industry', 'city', 'province', 'notes'],
      ['Acme Corp', 'Jane Doe', 'jane@acme.com', '555-0200', 'https://acme.com', 'Technology', 'Toronto', 'ON', ''],
    ],
    events: [
      ['eventName', 'eventType', 'venueName', 'venueAddress', 'clientOrganization', 'loadInTime', 'loadOutTime', 'revenueAmount', 'status', 'notes'],
      ['Annual Gala', 'CORPORATE', 'Convention Center', '123 Main St', 'Acme Corp', '2025-12-01T09:00:00', '2025-12-01T22:00:00', '5000', 'CONFIRMED', ''],
    ],
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse(templates[activeTab]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        parseData(results.data as any[]);
      },
    });
  };

  const handlePaste = () => {
    if (!pastedData.trim()) return;

    Papa.parse(pastedData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        parseData(results.data as any[]);
      },
    });
  };

  const parseData = (data: any[]) => {
    const errors: { row: number; field: string; message: string }[] = [];
    const valid: any[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 for header row and 0-index
      let isValid = true;

      // Validate based on entity type
      if (activeTab === 'operators') {
        if (!row.name || !row.email || !row.hourlyRate) {
          errors.push({ row: rowNum, field: 'required', message: 'Missing required fields (name, email, hourlyRate)' });
          isValid = false;
        }
        if (row.email && !row.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          errors.push({ row: rowNum, field: 'email', message: 'Invalid email format' });
          isValid = false;
        }
        if (isValid) {
          valid.push({
            name: row.name,
            email: row.email,
            phone: row.phone || '',
            primaryRole: row.primaryRole || '',
            hourlyRate: parseFloat(row.hourlyRate) || 0,
            bio: row.bio || '',
            portfolioUrl: row.portfolioUrl || '',
          });
        }
      } else if (activeTab === 'gear') {
        if (!row.name || !row.category || !row.type) {
          errors.push({ row: rowNum, field: 'required', message: 'Missing required fields (name, category, type)' });
          isValid = false;
        }
        if (isValid) {
          valid.push({
            name: row.name,
            category: row.category,
            type: row.type,
            manufacturer: row.manufacturer || '',
            model: row.model || '',
            serialNumber: row.serialNumber || '',
            purchasePrice: row.purchasePrice ? parseFloat(row.purchasePrice) : undefined,
            notes: row.notes || '',
          });
        }
      } else if (activeTab === 'clients') {
        if (!row.organization || !row.email) {
          errors.push({ row: rowNum, field: 'required', message: 'Missing required fields (organization, email)' });
          isValid = false;
        }
        if (row.email && !row.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          errors.push({ row: rowNum, field: 'email', message: 'Invalid email format' });
          isValid = false;
        }
        if (isValid) {
          valid.push({
            organization: row.organization,
            contactName: row.contactName || '',
            email: row.email,
            phone: row.phone || '',
            website: row.website || '',
            industry: row.industry || '',
            city: row.city || '',
            province: row.province || '',
            notes: row.notes || '',
          });
        }
      } else if (activeTab === 'events') {
        if (!row.eventName || !row.eventType || !row.venueName || !row.venueAddress || !row.clientOrganization || !row.loadInTime || !row.loadOutTime) {
          errors.push({ row: rowNum, field: 'required', message: 'Missing required fields' });
          isValid = false;
        }
        if (isValid) {
          valid.push({
            eventName: row.eventName,
            eventType: row.eventType,
            venueName: row.venueName,
            venueAddress: row.venueAddress,
            clientOrganization: row.clientOrganization,
            loadInTime: new Date(row.loadInTime),
            loadOutTime: new Date(row.loadOutTime),
            revenueAmount: row.revenueAmount ? parseFloat(row.revenueAmount) : undefined,
            status: row.status || 'CONFIRMED',
            notes: row.notes || '',
          });
        }
      }
    });

    setParsedData({ valid, errors });
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.valid.length === 0) return;

    setImporting(true);
    setImportResult(null);

    try {
      let result;
      if (activeTab === 'operators') {
        result = await importOperators.mutateAsync({ operators: parsedData.valid });
      } else if (activeTab === 'gear') {
        result = await importGear.mutateAsync({ gear: parsedData.valid });
      } else if (activeTab === 'clients') {
        result = await importClients.mutateAsync({ clients: parsedData.valid });
      } else if (activeTab === 'events') {
        result = await importEvents.mutateAsync({ events: parsedData.valid });
      }
      setImportResult(result!);
      setParsedData(null);
      setPastedData('');
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const tabs = [
    { id: 'operators' as EntityType, label: 'Operators', icon: '👥' },
    { id: 'gear' as EntityType, label: 'Gear', icon: '🎥' },
    { id: 'clients' as EntityType, label: 'Clients', icon: '🏢' },
    { id: 'events' as EntityType, label: 'Events', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Quick Onboard</h1>
          </div>
          <p className="text-slate-400">Bulk import operators, gear, clients, and events from CSV or spreadsheet</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setParsedData(null);
                setPastedData('');
                setImportResult(null);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Import Result */}
        {importResult && (
          <Card padding="large" className="mb-6 bg-green-900/20 border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-semibold">
                  Successfully imported {importResult.count} {activeTab}
                </p>
                {importResult.skipped && importResult.skipped > 0 && (
                  <p className="text-yellow-400 text-sm">Skipped {importResult.skipped} invalid records</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Template Download */}
        <Card padding="large" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">1. Download Template</h3>
              <p className="text-slate-400 text-sm">Get the CSV template with correct headers and example data</p>
            </div>
            <Button onClick={downloadTemplate} variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </Card>

        {/* Upload / Paste */}
        <Card padding="large" className="mb-6">
          <h3 className="text-white font-semibold mb-4">2. Upload CSV or Paste Data</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Upload CSV File</label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Click to upload CSV file</p>
                </label>
              </div>
            </div>

            {/* Paste Area */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Or Paste from Spreadsheet</label>
              <textarea
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                placeholder="Paste data from Excel or Google Sheets..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
              />
              <Button onClick={handlePaste} className="mt-2 w-full" disabled={!pastedData.trim()}>
                Parse Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Table */}
        {parsedData && (
          <Card padding="large" className="mb-6">
            <h3 className="text-white font-semibold mb-4">3. Preview & Import</h3>

            {/* Errors */}
            {parsedData.errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 font-semibold">{parsedData.errors.length} Validation Errors</p>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {parsedData.errors.slice(0, 10).map((error, i) => (
                    <p key={i} className="text-red-300 text-sm">
                      Row {error.row}: {error.message}
                    </p>
                  ))}
                  {parsedData.errors.length > 10 && (
                    <p className="text-red-400 text-sm italic">+ {parsedData.errors.length - 10} more errors</p>
                  )}
                </div>
              </div>
            )}

            {/* Valid Records */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-green-400 font-semibold">{parsedData.valid.length} Valid Records Ready to Import</p>
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto bg-slate-800 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-900">
                  <tr>
                    {parsedData.valid.length > 0 &&
                      Object.keys(parsedData.valid[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-slate-300 font-medium">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {parsedData.valid.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-4 py-2 text-white">
                          {val?.toString() || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.valid.length > 10 && (
                <div className="p-3 text-center text-slate-400 text-sm border-t border-slate-700">
                  + {parsedData.valid.length - 10} more rows (showing first 10)
                </div>
              )}
            </div>

            {/* Import Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleImport}
                disabled={parsedData.valid.length === 0 || importing}
                className="bg-gradient-to-r from-green-600 to-green-500"
              >
                {importing ? 'Importing...' : `Import ${parsedData.valid.length} ${activeTab}`}
              </Button>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card padding="large" className="bg-slate-800/50">
          <h3 className="text-white font-semibold mb-3">How to Use</h3>
          <ol className="space-y-2 text-slate-300 text-sm">
            <li>1. Download the CSV template for your entity type</li>
            <li>2. Fill in your data in Excel or Google Sheets</li>
            <li>3. Either upload the CSV file OR copy and paste the data</li>
            <li>4. Review the preview and fix any validation errors</li>
            <li>5. Click Import to bulk create records</li>
          </ol>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Important Notes:</p>
            <ul className="space-y-1 text-slate-400 text-sm">
              <li>• Events require clients to exist first (use Client Organization name)</li>
              <li>• Duplicates will be automatically skipped</li>
              <li>• Required fields: see template for each entity type</li>
              <li>• Dates must be in ISO format (YYYY-MM-DDTHH:mm:ss)</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
