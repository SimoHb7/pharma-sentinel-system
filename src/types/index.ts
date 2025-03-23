
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'pharmacist' | 'staff';
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  expiryDate: string;
  manufacturer: string;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale';
  items: TransactionItem[];
  total: number;
  customerId?: string;
  customerName?: string;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface TransactionItem {
  medicationId: string;
  medicationName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Alert {
  id: string;
  type: 'low-stock' | 'expiry';
  medicationId: string;
  medicationName: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalMedications: number;
  lowStockCount: number;
  expiringCount: number;
  totalSalesToday: number;
  recentTransactions: Transaction[];
  topSelling: { name: string; count: number }[];
}
