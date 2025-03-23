
import React, { createContext, useContext, useState } from "react";
import { medications, suppliers, transactions, alerts, dashboardStats } from "@/lib/mock-data";
import { 
  Medication, 
  Supplier, 
  Transaction, 
  Alert, 
  DashboardStats,
  TransactionItem
} from "@/types";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";

interface PharmacyContextType {
  // Data
  medications: Medication[];
  suppliers: Supplier[];
  transactions: Transaction[];
  alerts: Alert[];
  dashboardStats: DashboardStats;
  
  // Medication functions
  addMedication: (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  
  // Supplier functions
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Transaction functions
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  
  // Alert functions
  markAlertAsRead: (id: string) => void;
  clearAlert: (id: string) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const [medsState, setMedications] = useState<Medication[]>(medications);
  const [suppliersState, setSuppliers] = useState<Supplier[]>(suppliers);
  const [transactionsState, setTransactions] = useState<Transaction[]>(transactions);
  const [alertsState, setAlerts] = useState<Alert[]>(alerts);
  const [statsState, setDashboardStats] = useState<DashboardStats>(dashboardStats);

  // Medication functions
  const addMedication = (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newMedication: Medication = {
      ...medication,
      id: generateId("m"),
      createdAt: now,
      updatedAt: now
    };
    
    setMedications(prev => [...prev, newMedication]);
    setDashboardStats(prev => ({
      ...prev,
      totalMedications: prev.totalMedications + 1
    }));
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, ...updates, updatedAt: new Date().toISOString() } 
          : med
      )
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setDashboardStats(prev => ({
      ...prev,
      totalMedications: prev.totalMedications - 1
    }));
  };

  // Supplier functions
  const addSupplier = (supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId("s"),
      createdAt: now,
      updatedAt: now
    };
    
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === id 
          ? { ...supplier, ...updates, updatedAt: new Date().toISOString() } 
          : supplier
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId("t"),
      createdAt: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update inventory if it's a sale
    if (transaction.type === 'sale') {
      transaction.items.forEach((item: TransactionItem) => {
        updateMedication(item.medicationId, {
          stock: medsState.find(m => m.id === item.medicationId)!.stock - item.quantity
        });
      });
    }
    
    // Update dashboard stats
    if (transaction.type === 'sale' && transaction.status === 'completed') {
      const today = new Date().toISOString().split('T')[0];
      const transactionDate = new Date(newTransaction.createdAt).toISOString().split('T')[0];
      
      if (today === transactionDate) {
        setDashboardStats(prev => ({
          ...prev,
          totalSalesToday: prev.totalSalesToday + transaction.total,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 5)
        }));
      }
    }
  };

  // Alert functions
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, isRead: true } 
          : alert
      )
    );
  };

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <PharmacyContext.Provider value={{
      medications: medsState,
      suppliers: suppliersState,
      transactions: transactionsState,
      alerts: alertsState,
      dashboardStats: statsState,
      addMedication,
      updateMedication,
      deleteMedication,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addTransaction,
      markAlertAsRead,
      clearAlert
    }}>
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error("usePharmacy must be used within a PharmacyProvider");
  }
  return context;
}
