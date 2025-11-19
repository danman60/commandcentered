/**
 * Test Fixtures: Kits & Gear
 * Sample kit and gear data for E2E testing
 */

export const testKits = [
  {
    id: 'kit-recital-1',
    name: 'Recital Kit 1',
    event_type: 'Dance Recital',
    items_count: 12,
    status: 'in_use',
    assigned_event: 'EMPWR Dance Experience',
    gear_items: [
      'Sony A7S III #1',
      'Sony A7S III #2',
      'Sigma 24-70mm #1',
      'Sigma 24-70mm #2',
      'Battery Pack (x4)',
      'SD Card 128GB (x4)',
      'Audio Recorder',
      'Wireless Mic Kit',
      'Tripod #1',
      'Tripod #2',
      'LED Panel (x2)'
    ]
  },
  {
    id: 'kit-competition-1',
    name: 'Competition Kit 1',
    event_type: 'Competition',
    items_count: 15,
    status: 'available',
    gear_items: [
      'Sony A7S III #3',
      'Sony FX3 #1',
      'Sigma 24-70mm #3',
      'Sony 70-200mm #1',
      'Battery Pack (x6)',
      'SD Card 256GB (x4)',
      'Audio Recorder',
      'Wireless Mic Kit',
      'Shotgun Mic',
      'Tripod #3',
      'Tripod #4',
      'LED Panel (x4)',
      'Camera Slider'
    ]
  },
  {
    id: 'kit-small-1',
    name: 'Small Kit 1',
    event_type: 'Corporate',
    items_count: 6,
    status: 'available',
    gear_items: [
      'Sony FX3 #2',
      'Sigma 24-70mm #4',
      'Battery Pack (x2)',
      'SD Card 128GB (x2)',
      'Wireless Mic Kit',
      'Tripod #5'
    ]
  }
];

export const testGearCategories = [
  {
    id: 'cameras',
    name: 'Cameras',
    icon: 'camera'
  },
  {
    id: 'lenses',
    name: 'Lenses',
    icon: 'lens'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'tool'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'mic'
  },
  {
    id: 'rigging',
    name: 'Rigging',
    icon: 'crane'
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: 'lightbulb'
  },
  {
    id: 'stabilizers',
    name: 'Stabilizers',
    icon: 'balance'
  },
  {
    id: 'drones',
    name: 'Drones',
    icon: 'drone'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    icon: 'monitor'
  }
];

export const testGearItems = [
  {
    id: 'gear-1',
    name: 'Sony A7S III',
    serial_number: 'CAM001',
    category: 'cameras',
    status: 'in_use',
    current_event: 'EMPWR Dance Experience',
    purchase_date: '2023-01-15',
    value: 3500,
    dependencies: ['Lens', 'Battery', 'SD Card'],
    suggested_accessories: ['Battery Pack', 'SD Card 128GB', 'Camera Cage']
  },
  {
    id: 'gear-2',
    name: 'Sony FX3',
    serial_number: 'CAM002',
    category: 'cameras',
    status: 'available',
    purchase_date: '2023-03-20',
    value: 4000,
    dependencies: ['Lens', 'Battery', 'SD Card'],
    suggested_accessories: ['Battery Pack', 'SD Card 256GB', 'Camera Cage']
  },
  {
    id: 'gear-3',
    name: 'Sigma 24-70mm f/2.8',
    serial_number: 'LENS001',
    category: 'lenses',
    status: 'in_use',
    current_event: 'EMPWR Dance Experience',
    purchase_date: '2023-01-20',
    value: 1200
  },
  {
    id: 'gear-4',
    name: 'Sony 70-200mm f/2.8',
    serial_number: 'LENS002',
    category: 'lenses',
    status: 'available',
    purchase_date: '2023-05-10',
    value: 2800
  },
  {
    id: 'gear-5',
    name: 'Wireless Mic Kit',
    serial_number: 'AUDIO001',
    category: 'audio',
    status: 'maintenance',
    purchase_date: '2022-11-05',
    value: 800,
    maintenance_notes: 'Battery replacement scheduled'
  }
];
