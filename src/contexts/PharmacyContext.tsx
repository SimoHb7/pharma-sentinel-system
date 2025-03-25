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
import { generateId, uuidv4 } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
  updateStock: (id: string, newStock: number, reason?: string) => void;
  
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

  // Stock threshold for low stock alerts
  const LOW_STOCK_THRESHOLD = 10;

  // Check if medication is low on stock
  const isLowStock = (stock: number) => stock <= LOW_STOCK_THRESHOLD;

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
    
    // Create alert if new medication is low on stock
    if (isLowStock(newMedication.stock)) {
      createLowStockAlert(newMedication);
    }
    
    toast({
      title: "Medication Added",
      description: `${newMedication.name} has been added to inventory.`
    });
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    let updatedMedication: Medication | undefined;
    
    setMedications(prev => {
      const updated = prev.map(med => {
        if (med.id === id) {
          updatedMedication = { 
            ...med, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          };
          return updatedMedication;
        }
        return med;
      });
      return updated;
    });
    
    // If stock was updated, check if we need to create or remove low stock alerts
    if (updatedMedication && 'stock' in updates) {
      handleStockUpdate(updatedMedication);
    }
  };
  
  // Dedicated function to update stock with tracking
  const updateStock = (id: string, newStock: number, reason?: string) => {
    const medication = medsState.find(med => med.id === id);
    if (!medication) return;
    
    const oldStock = medication.stock;
    const stockChange = newStock - oldStock;
    
    updateMedication(id, { stock: newStock });
    
    // Log stock change
    toast({
      title: stockChange > 0 ? "Stock Increased" : "Stock Decreased",
      description: `${medication.name}: ${Math.abs(stockChange)} units ${stockChange > 0 ? 'added to' : 'removed from'} inventory. ${reason ? `Reason: ${reason}` : ''}`
    });
    
    // Update low stock count in dashboard if needed
    const wasLowStock = isLowStock(oldStock);
    const isNowLowStock = isLowStock(newStock);
    
    if (!wasLowStock && isNowLowStock) {
      setDashboardStats(prev => ({
        ...prev,
        lowStockCount: prev.lowStockCount + 1
      }));
    } else if (wasLowStock && !isNowLowStock) {
      setDashboardStats(prev => ({
        ...prev,
        lowStockCount: Math.max(0, prev.lowStockCount - 1)
      }));
    }
  };

  const handleStockUpdate = (medication: Medication) => {
    // Check if this medication already has a low stock alert
    const existingAlertIndex = alertsState.findIndex(
      alert => alert.type === "lowStock" && alert.relatedId === medication.id
    );
    
    // If stock is low and there's no alert, create one
    if (isLowStock(medication.stock) && existingAlertIndex === -1) {
      createLowStockAlert(medication);
    } 
    // If stock is now sufficient and there was an alert, remove it
    else if (!isLowStock(medication.stock) && existingAlertIndex !== -1) {
      // Create a copy of alerts and remove the low stock alert
      const updatedAlerts = [...alertsState];
      updatedAlerts.splice(existingAlertIndex, 1);
      setAlerts(updatedAlerts);
    }
  };

  const createLowStockAlert = (medication: Medication) => {
    const newAlert: Alert = {
      id: generateId("a"),
      type: "lowStock",
      title: "Low Stock Alert",
      relatedId: medication.id,
      message: `${medication.name} is running low on stock (${medication.stock} units remaining).`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  const deleteMedication = (id: string) => {
    const medication = medsState.find(med => med.id === id);
    if (!medication) return;
    
    setMedications(prev => prev.filter(med => med.id !== id));
    
    // Remove any alerts associated with this medication
    setAlerts(prev => prev.filter(alert => alert.relatedId !== id));
    
    setDashboardStats(prev => ({
      ...prev,
      totalMedications: prev.totalMedications - 1,
      // If it was low on stock, decrease low stock count
      lowStockCount: isLowStock(medication.stock) 
        ? Math.max(0, prev.lowStockCount - 1)
        : prev.lowStockCount
    }));
    
    toast({
      title: "Medication Deleted",
      description: `${medication.name} has been removed from inventory.`
    });
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
    
    toast({
      title: "Supplier Added",
      description: `${newSupplier.name} has been added to your suppliers.`
    });
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === id 
          ? { ...supplier, ...updates, updatedAt: new Date().toISOString() } 
          : supplier
      )
    );
    
    toast({
      title: "Supplier Updated",
      description: "Supplier information has been updated successfully."
    });
  };

  const deleteSupplier = (id: string) => {
    const supplier = suppliersState.find(s => s.id === id);
    if (!supplier) return;
    
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    
    toast({
      title: "Supplier Deleted",
      description: `${supplier.name} has been removed from your suppliers.`
    });
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
          updateStock(
            item.medicationId, 
            medication.stock - item.quantity,
            `Sale: Transaction ${newTransaction.id}`
          );
        }
      });
    } else if (transaction.type === 'purchase') {
      // For inventory purchases, increase stock
      transaction.items.forEach((item: TransactionItem) => {
        const medication = medsState.find(m => m.id === item.medicationId);
        if (medication) {
          updateStock(
            item.medicationId, 
            medication.stock + item.quantity,
            `Purchase: Transaction ${newTransaction.id}`
          );
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
    
    toast({
      title: "Transaction Added",
      description: `${transaction.type === 'sale' ? 'Sale' : 'Purchase'} of ${transaction.items.length} items completed.`
    });
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

  const checkLowStockItems = () => {
    const lowStockMeds = medications.filter(med => med.stock <= 10);
    
    lowStockMeds.forEach(med => {
      // Check if there's already a low-stock alert for this medication
      const existingAlert = alerts.find(
        alert => alert.type === "low-stock" && alert.medicationId === med.id
      );
      
      if (!existingAlert) {
        const newAlert: Alert = {
          id: uuidv4(),
          type: "low-stock",
          medicationId: med.id,
          medicationName: med.name,
          message: `Low stock alert: ${med.name} has only ${med.stock} units left.`,
          severity: med.stock <= 5 ? "high" : "medium",
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
      }
    });
  };

  const checkExpiringMedications = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringMeds = medications.filter(med => {
      const expiryDate = new Date(med.expiryDate);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    });
    
    expiringMeds.forEach(med => {
      // Check if there's already an expiry alert for this medication
      const existingAlert = alerts.find(
        alert => alert.type === "expiry" && alert.medicationId === med.id
      );
      
      if (!existingAlert) {
        const expiryDate = new Date(med.expiryDate);
        const differenceInTime = expiryDate.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        
        const newAlert: Alert = {
          id: uuidv4(),
          type: "expiry",
          medicationId: med.id,
          medicationName: med.name,
          message: `Expiration alert: ${med.name} will expire in ${differenceInDays} days.`,
          severity: differenceInDays <= 7 ? "high" : "medium",
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
      }
    });
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
      updateStock,
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
