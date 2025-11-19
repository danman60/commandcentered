/**
 * Test Fixtures: Events
 * Sample event data for E2E testing
 */

export const testEvents = [
  {
    id: 'test-event-1',
    client_name: 'EMPWR Dance Experience',
    date: '2025-12-06',
    time: '16:00:00',
    end_time: '21:00:00',
    status: 'confirmed',
    venue: 'Dance Theatre Toronto',
    hotel_info: 'Holiday Inn Downtown - Confirmation #12345',
    operators: ['JD', 'ST'],
    kits: ['Recital Kit 1'],
    shifts: [
      {
        id: 'shift-1',
        name: 'Setup',
        start_time: '16:00:00',
        end_time: '17:00:00',
        operators: ['JD']
      },
      {
        id: 'shift-2',
        name: 'Event',
        start_time: '17:00:00',
        end_time: '20:00:00',
        operators: ['JD', 'ST']
      },
      {
        id: 'shift-3',
        name: 'Teardown',
        start_time: '20:00:00',
        end_time: '21:00:00',
        operators: ['ST']
      }
    ]
  },
  {
    id: 'test-event-2',
    client_name: 'Glow Dance Competition',
    date: '2025-12-15',
    time: '09:00:00',
    end_time: '18:00:00',
    status: 'booked',
    venue: 'Metro Convention Center',
    operators: ['MK', 'JD'],
    kits: ['Competition Kit 1'],
    shifts: [
      {
        id: 'shift-4',
        name: 'Setup',
        start_time: '09:00:00',
        end_time: '10:00:00',
        operators: ['MK']
      },
      {
        id: 'shift-5',
        name: 'Event',
        start_time: '10:00:00',
        end_time: '17:00:00',
        operators: ['MK', 'JD']
      },
      {
        id: 'shift-6',
        name: 'Teardown',
        start_time: '17:00:00',
        end_time: '18:00:00',
        operators: ['JD']
      }
    ]
  },
  {
    id: 'test-event-3',
    client_name: 'ABC Dance Studio',
    date: '2025-11-25',
    time: '14:00:00',
    end_time: '17:00:00',
    status: 'tentative',
    venue: 'ABC Studio',
    operators: ['ST'],
    kits: ['Small Kit 1'],
    shifts: [
      {
        id: 'shift-7',
        name: 'Single Shift',
        start_time: '14:00:00',
        end_time: '17:00:00',
        operators: ['ST']
      }
    ]
  }
];

export const testEventTemplates = [
  {
    id: 'template-recital',
    name: 'Recital',
    shifts: [
      { name: 'Setup', duration_minutes: 60 },
      { name: 'Event', duration_minutes: 180 },
      { name: 'Teardown', duration_minutes: 60 }
    ]
  },
  {
    id: 'template-corporate',
    name: 'Corporate',
    shifts: [
      { name: 'Setup', duration_minutes: 30 },
      { name: 'Event', duration_minutes: 120 },
      { name: 'Teardown', duration_minutes: 30 }
    ]
  },
  {
    id: 'template-custom',
    name: 'Custom',
    shifts: []
  }
];
