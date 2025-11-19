/**
 * Test Fixtures: Clients (Pipeline)
 * Sample client data for E2E testing
 */

export const testClients = [
  {
    id: 'client-1',
    name: 'EMPWR Dance Experience',
    status: 'hot_lead',
    last_contacted: '2025-11-10',
    next_follow_up: '2025-11-20',
    contact_frequency: 'Weekly',
    products: [
      {
        id: 'product-1',
        name: 'Dance Recital Package',
        interested: true,
        status: 'won',
        revenue: 8500,
        notes: 'Booked for Dec 6, 2025'
      },
      {
        id: 'product-2',
        name: 'Competition Software',
        interested: true,
        status: 'proposal',
        revenue: 12000,
        notes: 'Proposal sent Nov 5'
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Glow Dance Competition',
    status: 'warm_lead',
    last_contacted: '2025-11-08',
    next_follow_up: '2025-11-18',
    contact_frequency: 'Bi-weekly',
    products: [
      {
        id: 'product-3',
        name: 'Competition Software',
        interested: true,
        status: 'won',
        revenue: 26600,
        notes: 'Annual license'
      }
    ]
  },
  {
    id: 'client-3',
    name: 'ABC Dance Studio',
    status: 'cold_lead',
    last_contacted: '2025-11-05',
    next_follow_up: '2025-12-01',
    contact_frequency: 'Monthly',
    products: [
      {
        id: 'product-4',
        name: 'Core Video Production Services',
        interested: true,
        status: 'discussing',
        revenue: 7300,
        notes: 'Waiting for contract signature'
      }
    ]
  }
];

export const testProducts = [
  {
    id: 'product-chatbot',
    name: 'Studio Sage Chatbot'
  },
  {
    id: 'product-recital',
    name: 'Dance Recital Package'
  },
  {
    id: 'product-software',
    name: 'Competition Software'
  },
  {
    id: 'product-video',
    name: 'Core Video Production Services'
  }
];
