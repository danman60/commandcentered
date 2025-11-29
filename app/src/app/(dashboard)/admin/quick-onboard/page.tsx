'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc/client';
import { Upload, FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

type EntityType = 'operators' | 'gear' | 'clients' | 'events' | 'all';

interface ParsedData {
  valid: any[];
  errors: { row: number; field: string; message: string }[];
}

interface AllInOneData {
  operators: { valid: any[]; errors: any[] };
  gear: { valid: any[]; errors: any[] };
  clients: { valid: any[]; errors: any[] };
  events: { valid: any[]; errors: any[] };
}

export default function QuickOnboardPage() {
  const [activeTab, setActiveTab] = useState<EntityType>('all');
  const [pastedData, setPastedData] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [allInOneData, setAllInOneData] = useState<AllInOneData | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    operators?: number;
    gear?: number;
    clients?: number;
    events?: number;
    total?: number;
  } | null>(null);

  // Mutations
  const importOperators = trpc.operator.batchCreate.useMutation();
  const importGear = trpc.gear.batchCreate.useMutation();
  const importClients = trpc.client.batchCreate.useMutation();
  const importEvents = trpc.event.batchCreate.useMutation();

  // CSV Templates
  const templates = {
    all: `[CLIENTS]
organization,contactName,email,phone,website,industry,city,province,notes
Acme Corp,Jane Doe,jane@acme.com,555-0200,https://acme.com,Technology,Toronto,ON,Premier client
Tech Studios,Bob Smith,bob@techstudios.com,555-0201,https://techstudios.com,Media,Vancouver,BC,

[OPERATORS]
name,email,phone,primaryRole,hourlyRate,bio,portfolioUrl
John Smith,john@example.com,555-0100,Videographer,75,Experienced videographer,https://johnsmith.com
Sarah Jones,sarah@example.com,555-0101,Audio Tech,65,Sound specialist,

[GEAR]
name,category,type,serialNumber,purchasePrice,notes
Canon C300,CAMERA,Cinema Camera,SN123456,15000,Main camera
Rode NTG3,AUDIO,Shotgun Mic,SN789,700,

[EVENTS]
eventName,eventType,venueName,venueAddress,clientOrganization,loadInTime,loadOutTime,revenueAmount,status,notes
Acme Annual Gala,CORPORATE,Convention Center,123 Main St,Acme Corp,2025-12-01T09:00:00,2025-12-01T22:00:00,5000,CONFIRMED,
Tech Studios Launch,CORPORATE,Tech Hub,456 Tech Ave,Tech Studios,2025-12-15T10:00:00,2025-12-15T18:00:00,3500,CONFIRMED,
`,
    operators: [
      ['name', 'email', 'phone', 'primaryRole', 'hourlyRate', 'bio', 'portfolioUrl'],
      ['John Smith', 'john@example.com', '555-0100', 'Videographer', '75', 'Experienced videographer', ''],
    ],
    gear: [
      ['name', 'category', 'type', 'serialNumber', 'purchasePrice', 'notes'],
      ['Canon C300', 'CAMERA', 'Cinema Camera', 'SN123456', '15000', ''],
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
    const template = templates[activeTab];
    const csv = typeof template === 'string' ? template : Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab === 'all' ? 'bulk_onboard' : activeTab}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (activeTab === 'all') {
        parseAllInOne(text);
      } else {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            parseData(results.data as any[]);
          },
        });
      }
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    if (!pastedData.trim()) return;

    if (activeTab === 'all') {
      parseAllInOne(pastedData);
    } else {
      Papa.parse(pastedData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          parseData(results.data as any[]);
        },
      });
    }
  };

  const parseAllInOne = (csvText: string) => {
    const sections = { clients: '', operators: '', gear: '', events: '' };
    const lines = csvText.split('\n');
    let currentSection: keyof typeof sections | null = null;

    // Split into sections
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '[CLIENTS]') {
        currentSection = 'clients';
        continue;
      } else if (trimmed === '[OPERATORS]') {
        currentSection = 'operators';
        continue;
      } else if (trimmed === '[GEAR]') {
        currentSection = 'gear';
        continue;
      } else if (trimmed === '[EVENTS]') {
        currentSection = 'events';
        continue;
      }

      if (currentSection && trimmed) {
        sections[currentSection] += line + '\n';
      }
    }

    // Parse each section
    const allData: AllInOneData = {
      clients: { valid: [], errors: [] },
      operators: { valid: [], errors: [] },
      gear: { valid: [], errors: [] },
      events: { valid: [], errors: [] },
    };

    // Parse clients
    if (sections.clients) {
      Papa.parse(sections.clients, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          data.forEach((row, index) => {
            const rowNum = index + 2;
            if (!row.organization || !row.email) {
              allData.clients.errors.push({ row: rowNum, field: 'required', message: 'Missing organization or email' });
            } else if (!row.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              allData.clients.errors.push({ row: rowNum, field: 'email', message: 'Invalid email' });
            } else {
              allData.clients.valid.push({
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
          });
        },
      });
    }

    // Parse operators
    if (sections.operators) {
      Papa.parse(sections.operators, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          data.forEach((row, index) => {
            const rowNum = index + 2;
            if (!row.name || !row.email || !row.hourlyRate) {
              allData.operators.errors.push({ row: rowNum, field: 'required', message: 'Missing name, email, or hourlyRate' });
            } else {
              allData.operators.valid.push({
                name: row.name,
                email: row.email,
                phone: row.phone || '',
                primaryRole: row.primaryRole || '',
                hourlyRate: parseFloat(row.hourlyRate) || 0,
                bio: row.bio || '',
                portfolioUrl: row.portfolioUrl || '',
              });
            }
          });
        },
      });
    }

    // Parse gear
    if (sections.gear) {
      Papa.parse(sections.gear, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          data.forEach((row, index) => {
            const rowNum = index + 2;
            if (!row.name || !row.category || !row.type) {
              allData.gear.errors.push({ row: rowNum, field: 'required', message: 'Missing name, category, or type' });
            } else {
              allData.gear.valid.push({
                name: row.name,
                category: row.category,
                type: row.type,
                serialNumber: row.serialNumber || '',
                purchasePrice: row.purchasePrice ? parseFloat(row.purchasePrice) : undefined,
                notes: row.notes || '',
              });
            }
          });
        },
      });
    }

    // Parse events
    if (sections.events) {
      Papa.parse(sections.events, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          data.forEach((row, index) => {
            const rowNum = index + 2;
            if (!row.eventName || !row.eventType || !row.venueName || !row.clientOrganization || !row.loadInTime || !row.loadOutTime) {
              allData.events.errors.push({ row: rowNum, field: 'required', message: 'Missing required fields' });
            } else {
              allData.events.valid.push({
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
          });
        },
      });
    }

    setAllInOneData(allData);
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
    if (activeTab === 'all') {
      // Handle all-in-one import
      if (!allInOneData) return;

      setImporting(true);
      setImportResult(null);

      try {
        // Import in sequence: clients first, then operators/gear in parallel, then events
        let clientsCount = 0;
        let operatorsCount = 0;
        let gearCount = 0;
        let eventsCount = 0;

        // 1. Import clients first (events depend on them)
        if (allInOneData.clients.valid.length > 0) {
          const clientResult = await importClients.mutateAsync({ clients: allInOneData.clients.valid });
          clientsCount = clientResult.count;
        }

        // 2. Import operators and gear in parallel (no dependencies)
        const parallelImports = [];
        if (allInOneData.operators.valid.length > 0) {
          parallelImports.push(importOperators.mutateAsync({ operators: allInOneData.operators.valid }));
        }
        if (allInOneData.gear.valid.length > 0) {
          parallelImports.push(importGear.mutateAsync({ gear: allInOneData.gear.valid }));
        }

        if (parallelImports.length > 0) {
          const results = await Promise.all(parallelImports);
          if (allInOneData.operators.valid.length > 0) operatorsCount = results[0].count;
          if (allInOneData.gear.valid.length > 0) gearCount = results[allInOneData.operators.valid.length > 0 ? 1 : 0].count;
        }

        // 3. Import events last (depends on clients)
        if (allInOneData.events.valid.length > 0) {
          const eventResult = await importEvents.mutateAsync({ events: allInOneData.events.valid });
          eventsCount = eventResult.count;
        }

        setImportResult({
          clients: clientsCount,
          operators: operatorsCount,
          gear: gearCount,
          events: eventsCount,
          total: clientsCount + operatorsCount + gearCount + eventsCount,
        });
        setAllInOneData(null);
        setPastedData('');
      } catch (error: any) {
        alert(`Import failed: ${error.message}`);
      } finally {
        setImporting(false);
      }
    } else {
      // Handle individual entity import
      if (!parsedData || parsedData.valid.length === 0) return;

      setImporting(true);
      setImportResult(null);

      try {
        let result;
        if (activeTab === 'operators') {
          result = await importOperators.mutateAsync({ operators: parsedData.valid });
          setImportResult({ operators: result.count });
        } else if (activeTab === 'gear') {
          result = await importGear.mutateAsync({ gear: parsedData.valid });
          setImportResult({ gear: result.count });
        } else if (activeTab === 'clients') {
          result = await importClients.mutateAsync({ clients: parsedData.valid });
          setImportResult({ clients: result.count });
        } else if (activeTab === 'events') {
          result = await importEvents.mutateAsync({ events: parsedData.valid });
          setImportResult({ events: result.count });
        }
        setParsedData(null);
        setPastedData('');
      } catch (error: any) {
        alert(`Import failed: ${error.message}`);
      } finally {
        setImporting(false);
      }
    }
  };

  const tabs = [
    { id: 'all' as EntityType, label: 'All-in-One', icon: '⚡' },
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
                setAllInOneData(null);
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
              <div className="flex-1">
                {activeTab === 'all' ? (
                  <>
                    <p className="text-white font-semibold mb-2">
                      Successfully imported {importResult.total} records
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {importResult.clients !== undefined && importResult.clients > 0 && (
                        <div className="text-green-300">🏢 {importResult.clients} clients</div>
                      )}
                      {importResult.operators !== undefined && importResult.operators > 0 && (
                        <div className="text-green-300">👥 {importResult.operators} operators</div>
                      )}
                      {importResult.gear !== undefined && importResult.gear > 0 && (
                        <div className="text-green-300">🎥 {importResult.gear} gear</div>
                      )}
                      {importResult.events !== undefined && importResult.events > 0 && (
                        <div className="text-green-300">📅 {importResult.events} events</div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-white font-semibold">
                      Successfully imported{' '}
                      {importResult.operators || importResult.gear || importResult.clients || importResult.events || 0}{' '}
                      {activeTab}
                    </p>
                  </>
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

        {/* Preview Table - All-in-One Mode */}
        {activeTab === 'all' && allInOneData && (
          <Card padding="large" className="mb-6">
            <h3 className="text-white font-semibold mb-4">3. Preview & Import</h3>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">🏢 Clients</div>
                <div className="text-white text-2xl font-bold">{allInOneData.clients.valid.length}</div>
                {allInOneData.clients.errors.length > 0 && (
                  <div className="text-red-400 text-xs mt-1">{allInOneData.clients.errors.length} errors</div>
                )}
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">👥 Operators</div>
                <div className="text-white text-2xl font-bold">{allInOneData.operators.valid.length}</div>
                {allInOneData.operators.errors.length > 0 && (
                  <div className="text-red-400 text-xs mt-1">{allInOneData.operators.errors.length} errors</div>
                )}
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">🎥 Gear</div>
                <div className="text-white text-2xl font-bold">{allInOneData.gear.valid.length}</div>
                {allInOneData.gear.errors.length > 0 && (
                  <div className="text-red-400 text-xs mt-1">{allInOneData.gear.errors.length} errors</div>
                )}
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">📅 Events</div>
                <div className="text-white text-2xl font-bold">{allInOneData.events.valid.length}</div>
                {allInOneData.events.errors.length > 0 && (
                  <div className="text-red-400 text-xs mt-1">{allInOneData.events.errors.length} errors</div>
                )}
              </div>
            </div>

            {/* All Errors */}
            {(allInOneData.clients.errors.length > 0 ||
              allInOneData.operators.errors.length > 0 ||
              allInOneData.gear.errors.length > 0 ||
              allInOneData.events.errors.length > 0) && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 font-semibold">Validation Errors</p>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allInOneData.clients.errors.length > 0 && (
                    <div>
                      <p className="text-red-300 text-sm font-semibold">Clients:</p>
                      {allInOneData.clients.errors.slice(0, 5).map((error, i) => (
                        <p key={i} className="text-red-300 text-sm ml-2">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  )}
                  {allInOneData.operators.errors.length > 0 && (
                    <div>
                      <p className="text-red-300 text-sm font-semibold">Operators:</p>
                      {allInOneData.operators.errors.slice(0, 5).map((error, i) => (
                        <p key={i} className="text-red-300 text-sm ml-2">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  )}
                  {allInOneData.gear.errors.length > 0 && (
                    <div>
                      <p className="text-red-300 text-sm font-semibold">Gear:</p>
                      {allInOneData.gear.errors.slice(0, 5).map((error, i) => (
                        <p key={i} className="text-red-300 text-sm ml-2">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  )}
                  {allInOneData.events.errors.length > 0 && (
                    <div>
                      <p className="text-red-300 text-sm font-semibold">Events:</p>
                      {allInOneData.events.errors.slice(0, 5).map((error, i) => (
                        <p key={i} className="text-red-300 text-sm ml-2">
                          Row {error.row}: {error.message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleImport}
                disabled={
                  (allInOneData.clients.valid.length === 0 &&
                    allInOneData.operators.valid.length === 0 &&
                    allInOneData.gear.valid.length === 0 &&
                    allInOneData.events.valid.length === 0) ||
                  importing
                }
                className="bg-gradient-to-r from-green-600 to-green-500"
              >
                {importing
                  ? 'Importing...'
                  : `Import ${
                      allInOneData.clients.valid.length +
                      allInOneData.operators.valid.length +
                      allInOneData.gear.valid.length +
                      allInOneData.events.valid.length
                    } records`}
              </Button>
            </div>
          </Card>
        )}

        {/* Preview Table - Individual Mode */}
        {activeTab !== 'all' && parsedData && (
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
