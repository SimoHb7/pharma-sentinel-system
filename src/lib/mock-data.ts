
import { format, addDays, subDays } from "date-fns";
import { Medication, Supplier, Transaction, Alert, DashboardStats, Customer, User } from "@/types";

// Users
export const users: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    role: "admin",
    isActive: true,
    avatar: "",
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "u2",
    name: "John Pharmacist",
    email: "john@example.com",
    password: "password",
    role: "pharmacist",
    isActive: true,
    avatar: "",
    createdAt: "2025-01-15T00:00:00Z"
  },
  {
    id: "u3",
    name: "Sarah Staff",
    email: "sarah@example.com",
    password: "password",
    role: "staff",
    isActive: true,
    avatar: "",
    createdAt: "2025-02-01T00:00:00Z"
  }
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "MediPharm Suppliers",
    email: "contact@medipharm.com",
    phone: "+1 (555) 123-4567",
    address: "123 Pharma Street, MediCity, MC 12345",
    contactName: "Michael Johnson",
    status: "active",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z",
  },
  {
    id: "s2",
    name: "Global Medications Inc.",
    email: "info@globalmeds.com",
    phone: "+1 (555) 987-6543",
    address: "456 Health Avenue, Medford, MD 67890",
    contactName: "Emily Rodriguez",
    status: "active",
    createdAt: "2023-02-05T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z",
  },
  {
    id: "s3",
    name: "PharmaTech Solutions",
    email: "support@pharmatech.com",
    phone: "+1 (555) 456-7890",
    address: "789 Medicine Boulevard, Healthville, HV 54321",
    contactName: "Daniel Wilson",
    status: "active",
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-04-25T00:00:00Z",
  },
];

// Mock Medications
export const medications: Medication[] = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    sku: "PARA-500-TAB",
    category: "Pain Relief",
    price: 5.99,
    costPrice: 2.50,
    stock: 120,
    expiryDate: format(addDays(new Date(), 180), "yyyy-MM-dd"),
    manufacturer: "HealthPharm",
    supplierId: "s1",
    createdAt: "2023-01-20T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z",
  },
  {
    id: "m2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic used to treat bacterial infections",
    sku: "AMOX-250-CAP",
    category: "Antibiotics",
    price: 12.99,
    costPrice: 6.25,
    stock: 5,
    expiryDate: format(addDays(new Date(), 20), "yyyy-MM-dd"),
    manufacturer: "MediLabs",
    supplierId: "s2",
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z",
  },
  {
    id: "m3",
    name: "Loratadine 10mg",
    description: "Antihistamine for allergy relief",
    sku: "LORA-10-TAB",
    category: "Allergy",
    price: 8.49,
    costPrice: 3.75,
    stock: 80,
    expiryDate: format(addDays(new Date(), 365), "yyyy-MM-dd"),
    manufacturer: "AllerRelief",
    supplierId: "s3",
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-04-25T00:00:00Z",
  },
  {
    id: "m4",
    name: "Ibuprofen 400mg",
    description: "NSAID for pain and inflammation",
    sku: "IBUP-400-TAB",
    category: "Pain Relief",
    price: 6.99,
    costPrice: 3.00,
    stock: 150,
    expiryDate: format(addDays(new Date(), 240), "yyyy-MM-dd"),
    manufacturer: "PainGone",
    supplierId: "s1",
    createdAt: "2023-01-25T00:00:00Z",
    updatedAt: "2023-04-15T00:00:00Z",
  },
  {
    id: "m5",
    name: "Omeprazole 20mg",
    description: "Proton pump inhibitor for acid reflux",
    sku: "OMEP-20-CAP",
    category: "Digestive Health",
    price: 14.99,
    costPrice: 7.50,
    stock: 3,
    expiryDate: format(addDays(new Date(), 15), "yyyy-MM-dd"),
    manufacturer: "GutHealth",
    supplierId: "s2",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z",
  },
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: "t1",
    type: "sale",
    items: [
      {
        medicationId: "m1",
        medicationName: "Paracetamol 500mg",
        quantity: 2,
        price: 5.99,
        subtotal: 11.98,
      },
      {
        medicationId: "m3",
        medicationName: "Loratadine 10mg",
        quantity: 1,
        price: 8.49,
        subtotal: 8.49,
      },
    ],
    total: 20.47,
    customerName: "John Doe",
    paymentMethod: "cash",
    status: "completed",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: "t2",
    type: "sale",
    items: [
      {
        medicationId: "m2",
        medicationName: "Amoxicillin 250mg",
        quantity: 1,
        price: 12.99,
        subtotal: 12.99,
      },
    ],
    total: 12.99,
    customerName: "Jane Smith",
    paymentMethod: "card",
    status: "completed",
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: "t3",
    type: "purchase",
    items: [
      {
        medicationId: "m1",
        medicationName: "Paracetamol 500mg",
        quantity: 50,
        price: 2.50,
        subtotal: 125.00,
      },
      {
        medicationId: "m4",
        medicationName: "Ibuprofen 400mg",
        quantity: 40,
        price: 3.00,
        subtotal: 120.00,
      },
    ],
    total: 245.00,
    paymentMethod: "card",
    status: "completed",
    notes: "Monthly restock",
    createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
];

// Mock Alerts
export const alerts: Alert[] = [
  {
    id: "a1",
    type: "lowStock",
    title: "Amoxicillin 250mg",
    message: "Stock below threshold (5 units remaining)",
    isRead: false,
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: "a2",
    type: "expiringSoon",
    title: "Omeprazole 20mg",
    message: "Expires in 15 days",
    isRead: false,
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: "a3",
    type: "expiringSoon",
    title: "Amoxicillin 250mg",
    message: "Expires in 20 days",
    isRead: true,
    createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalMedications: medications.length,
  expiringCount: 2,
  totalSalesToday: 350.75,
  recentTransactions: transactions.slice(0, 3),
  topSelling: [
    { name: "Paracetamol 500mg", count: 120 },
    { name: "Ibuprofen 400mg", count: 85 },
    { name: "Loratadine 10mg", count: 42 },
  ],
};
