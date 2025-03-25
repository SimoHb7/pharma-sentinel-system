
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  Medication, 
  Supplier, 
  Transaction, 
  Alert, 
  DashboardStats 
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@pharmsentinel.com',
    role: 'admin',
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 'user-2',
    name: 'Pharmacist User',
    email: 'pharmacist@pharmsentinel.com',
    role: 'pharmacist',
    createdAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: 'user-3',
    name: 'Staff User',
    email: 'staff@pharmsentinel.com',
    role: 'staff',
    createdAt: new Date(2023, 4, 5).toISOString()
  }
];

// Mock Medications
export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    description: 'Pain reliever and fever reducer',
    sku: 'PARA-500',
    category: 'Pain Relief',
    price: 9.99,
    costPrice: 5.50,
    stock: 150,
    expiryDate: new Date(2024, 11, 31).toISOString(),
    manufacturer: 'PharmaCorp',
    supplierId: 'sup-1',
    createdAt: new Date(2023, 0, 10).toISOString(),
    updatedAt: new Date(2023, 0, 10).toISOString()
  },
  {
    id: 'med-2',
    name: 'Amoxicillin',
    description: 'Antibiotic used to treat bacterial infections',
    sku: 'AMOX-250',
    category: 'Antibiotics',
    price: 14.99,
    costPrice: 7.25,
    stock: 75,
    expiryDate: new Date(2024, 9, 15).toISOString(),
    manufacturer: 'MediPharm',
    supplierId: 'sup-2',
    createdAt: new Date(2023, 1, 5).toISOString(),
    updatedAt: new Date(2023, 1, 5).toISOString()
  },
  {
    id: 'med-3',
    name: 'Loratadine',
    description: 'Antihistamine for allergy relief',
    sku: 'LORA-10',
    category: 'Allergy',
    price: 11.99,
    costPrice: 6.00,
    stock: 8,
    expiryDate: new Date(2024, 8, 30).toISOString(),
    manufacturer: 'AllerCare',
    supplierId: 'sup-1',
    createdAt: new Date(2023, 2, 15).toISOString(),
    updatedAt: new Date(2023, 2, 15).toISOString()
  },
  {
    id: 'med-4',
    name: 'Ibuprofen',
    description: 'Nonsteroidal anti-inflammatory drug',
    sku: 'IBUP-400',
    category: 'Pain Relief',
    price: 8.99,
    costPrice: 4.50,
    stock: 120,
    expiryDate: new Date(2025, 1, 28).toISOString(),
    manufacturer: 'PharmaCorp',
    supplierId: 'sup-3',
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 3, 10).toISOString()
  },
  {
    id: 'med-5',
    name: 'Salbutamol',
    description: 'Bronchodilator for asthma',
    sku: 'SALB-100',
    category: 'Respiratory',
    price: 19.99,
    costPrice: 10.75,
    stock: 5,
    expiryDate: new Date(2024, 6, 15).toISOString(),
    manufacturer: 'RespiCare',
    supplierId: 'sup-2',
    createdAt: new Date(2023, 4, 20).toISOString(),
    updatedAt: new Date(2023, 4, 20).toISOString()
  }
];

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'PharmaCorp Supplies',
    email: 'contact@pharmacorp.com',
    phone: '+1-555-123-4567',
    address: '123 Supplier St, Pharma City, PC 12345',
    contactName: 'John Smith',
    status: 'active',
    createdAt: new Date(2022, 11, 10).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: 'sup-2',
    name: 'MediPharm Distributors',
    email: 'sales@medipharm.com',
    phone: '+1-555-987-6543',
    address: '456 Distribution Ave, Med Town, MT 67890',
    contactName: 'Sarah Johnson',
    status: 'active',
    createdAt: new Date(2023, 0, 5).toISOString(),
    updatedAt: new Date(2023, 0, 5).toISOString()
  },
  {
    id: 'sup-3',
    name: 'Global Health Solutions',
    email: 'info@globalhealthsolutions.com',
    phone: '+1-555-789-0123',
    address: '789 Global Blvd, Health City, HC 54321',
    contactName: 'Michael Brown',
    status: 'inactive',
    createdAt: new Date(2022, 9, 20).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString()
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    type: 'sale',
    items: [
      {
        medicationId: 'med-1',
        medicationName: 'Paracetamol',
        quantity: 3,
        unitPrice: 9.99,
        subtotal: 29.97
      }
    ],
    total: 29.97,
    customerId: 'cust-1',
    customerName: 'Jane Doe',
    paymentMethod: 'cash',
    status: 'completed',
    notes: 'Regular customer',
    createdAt: new Date(2023, 5, 12, 10, 30).toISOString()
  },
  {
    id: 'trans-2',
    type: 'purchase',
    items: [
      {
        medicationId: 'med-2',
        medicationName: 'Amoxicillin',
        quantity: 50,
        unitPrice: 7.25,
        subtotal: 362.50
      },
      {
        medicationId: 'med-3',
        medicationName: 'Loratadine',
        quantity: 30,
        unitPrice: 6.00,
        subtotal: 180.00
      }
    ],
    total: 542.50,
    paymentMethod: 'card',
    status: 'completed',
    notes: 'Stock replenishment',
    createdAt: new Date(2023, 5, 10, 14, 45).toISOString()
  },
  {
    id: 'trans-3',
    type: 'sale',
    items: [
      {
        medicationId: 'med-4',
        medicationName: 'Ibuprofen',
        quantity: 2,
        unitPrice: 8.99,
        subtotal: 17.98
      },
      {
        medicationId: 'med-5',
        medicationName: 'Salbutamol',
        quantity: 1,
        unitPrice: 19.99,
        subtotal: 19.99
      }
    ],
    total: 37.97,
    customerId: 'cust-2',
    customerName: 'Robert Johnson',
    paymentMethod: 'insurance',
    status: 'completed',
    notes: '',
    createdAt: new Date(2023, 5, 11, 16, 20).toISOString()
  },
  {
    id: 'trans-4',
    type: 'sale',
    items: [
      {
        medicationId: 'med-1',
        medicationName: 'Paracetamol',
        quantity: 1,
        unitPrice: 9.99,
        subtotal: 9.99
      }
    ],
    total: 9.99,
    customerId: 'cust-3',
    customerName: 'Alice Smith',
    paymentMethod: 'cash',
    status: 'completed',
    notes: 'First-time customer',
    createdAt: new Date(2023, 5, 12, 9, 15).toISOString()
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'low-stock',
    medicationId: 'med-3',
    medicationName: 'Loratadine',
    message: 'Low stock alert: Loratadine has only 8 units left.',
    severity: 'medium',
    isRead: false,
    createdAt: new Date(2023, 5, 11, 8, 30).toISOString()
  },
  {
    id: 'alert-2',
    type: 'low-stock',
    medicationId: 'med-5',
    medicationName: 'Salbutamol',
    message: 'Low stock alert: Salbutamol has only 5 units left.',
    severity: 'high',
    isRead: false,
    createdAt: new Date(2023, 5, 12, 10, 0).toISOString()
  },
  {
    id: 'alert-3',
    type: 'expiry',
    medicationId: 'med-5',
    medicationName: 'Salbutamol',
    message: 'Expiration alert: Salbutamol will expire in 25 days.',
    severity: 'medium',
    isRead: true,
    createdAt: new Date(2023, 5, 10, 9, 45).toISOString()
  },
  {
    id: 'alert-4',
    type: 'system',
    message: 'System maintenance scheduled for tonight at 2 AM.',
    severity: 'low',
    isRead: false,
    createdAt: new Date(2023, 5, 12, 11, 15).toISOString()
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalMedications: 5,
  lowStockCount: 2,
  expiringCount: 1,
  totalSalesToday: 39.96,
  recentTransactions: [
    mockTransactions[0],
    mockTransactions[2],
    mockTransactions[3]
  ],
  topSelling: [
    { name: 'Paracetamol', count: 120 },
    { name: 'Ibuprofen', count: 95 },
    { name: 'Amoxicillin', count: 80 },
    { name: 'Loratadine', count: 65 },
    { name: 'Salbutamol', count: 40 }
  ]
};

// Helper to generate a unique ID
export const generateId = (prefix: string) => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};
