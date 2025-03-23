
import React, { createContext, useContext, useState } from "react";
import { medications, suppliers, transactions, alerts, dashboardStats, users } from "@/lib/mock-data";
import { 
  Medication, 
  Supplier, 
  Transaction, 
  Alert, 
  DashboardStats,
  TransactionItem,
  User,
  Role
} from "@/types";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PharmacyContextType {
  // Data
  medications: Medication[];
  suppliers: Supplier[];
  transactions: Transaction[];
  alerts: Alert[];
  dashboardStats: DashboardStats;
  users: User[];
  
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
  
  // User functions
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Check permissions
  hasPermission: (requiredRole: Role) => boolean;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export function PharmacyProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [medsState, setMedications] = useState<Medication[]>(medications);
  const [suppliersState, setSuppliers] = useState<Supplier[]>(suppliers);
  const [transactionsState, setTransactions] = useState<Transaction[]>(transactions);
  const [alertsState, setAlerts] = useState<Alert[]>(alerts);
  const [statsState, setDashboardStats] = useState<DashboardStats>(dashboardStats);
  const [usersState, setUsers] = useState<User[]>(users);

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
    
    // Create alert if stock is low
    if (newMedication.stock <= 10) {
      createLowStockAlert(newMedication);
    }
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => {
      const updatedMeds = prev.map(med => {
        if (med.id === id) {
          const updatedMed = { 
            ...med, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          
          // Check if stock was updated and is now low
          if (updates.stock !== undefined && updates.stock <= 10 && med.stock > 10) {
            createLowStockAlert(updatedMed);
          }
          
          return updatedMed;
        }
        return med;
      });
      
      return updatedMeds;
    });
    
    toast({
      title: "Medication Updated",
      description: "The medication has been successfully updated.",
    });
  };

  const createLowStockAlert = (medication: Medication) => {
    const newAlert: Alert = {
      id: generateId("a"),
      title: "Low Stock Alert",
      message: `${medication.name} is running low on stock (${medication.stock} remaining).`,
      type: "lowStock",
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId: medication.id
    };
    
    setAlerts(prev => [newAlert, ...prev]);
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
        const medication = medsState.find(m => m.id === item.medicationId);
        if (medication) {
          const newStock = medication.stock - item.quantity;
          updateMedication(item.medicationId, { stock: newStock });
        }
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
  
  // User functions
  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: generateId("u"),
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
  };
  
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, ...updates } 
          : user
      )
    );
    
    toast({
      title: "User Updated",
      description: "The user has been successfully updated.",
    });
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    toast({
      title: "User Deleted",
      description: "The user has been removed from the system.",
    });
  };
  
  // Permission checker based on user role
  const hasPermission = (requiredRole: Role): boolean => {
    // This would normally check the currently logged-in user
    // For now, we'll assume admin role for testing
    return true;
  };

  return (
    <PharmacyContext.Provider value={{
      medications: medsState,
      suppliers: suppliersState,
      transactions: transactionsState,
      alerts: alertsState,
      dashboardStats: statsState,
      users: usersState,
      addMedication,
      updateMedication,
      deleteMedication,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addTransaction,
      markAlertAsRead,
      clearAlert,
      addUser,
      updateUser,
      deleteUser,
      hasPermission
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
