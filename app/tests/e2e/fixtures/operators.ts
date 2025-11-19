/**
 * Test Fixtures: Operators
 * Sample operator data for E2E testing
 */

export const testOperators = [
  {
    id: 'operator-jd',
    initials: 'JD',
    name: 'John Davis',
    email: 'john.davis@example.com',
    role: 'Lead Videographer',
    skills: ['Multi-Camera', 'Livestream', 'Audio', 'Drone'],
    rating: 4.8,
    event_count: 45,
    availability: [
      {
        date: '2025-12-06',
        status: 'booked' // EMPWR Dance event
      },
      {
        date: '2025-12-15',
        status: 'booked' // Glow Dance event
      },
      {
        date: '2025-12-10',
        status: 'unavailable',
        reason: 'Vacation'
      }
    ]
  },
  {
    id: 'operator-st',
    initials: 'ST',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    role: 'Videographer',
    skills: ['Multi-Camera', 'Editing', 'Color Grading'],
    rating: 4.6,
    event_count: 32,
    availability: [
      {
        date: '2025-12-06',
        status: 'booked' // EMPWR Dance event
      },
      {
        date: '2025-11-25',
        status: 'booked' // ABC Dance event
      }
    ]
  },
  {
    id: 'operator-mk',
    initials: 'MK',
    name: 'Michael Kim',
    email: 'michael.kim@example.com',
    role: 'Audio Specialist',
    skills: ['Audio', 'Livestream', 'Multi-Camera'],
    rating: 4.9,
    event_count: 52,
    availability: [
      {
        date: '2025-12-15',
        status: 'booked' // Glow Dance event
      }
    ]
  }
];

export const testAvailabilityStatuses = [
  {
    status: 'available',
    label: 'Available',
    color: 'green'
  },
  {
    status: 'partial',
    label: 'Partial Day',
    color: 'orange'
  },
  {
    status: 'unavailable',
    label: 'Unavailable',
    color: 'red'
  },
  {
    status: 'booked',
    label: 'Booked',
    color: 'blue'
  }
];
