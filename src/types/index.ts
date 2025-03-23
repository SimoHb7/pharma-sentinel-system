
export type Role = "admin" | "pharmacist" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
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
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  medicationId: string;
  medicationName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  type: "sale" | "purchase";
  items: TransactionItem[];
  total: number;
  customerName: string;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: "lowStock" | "expiringSoon" | "system";
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface DashboardStats {
  totalSalesToday: number;
  totalSalesWeek: number;
  totalSalesMonth: number;
  totalMedications: number;
  lowStockItems: number;
  expiringItems: number;
  recentTransactions: Transaction[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  lastPurchase?: string;
  totalSpent: number;
  notes?: string;
}
