
import { StatCard } from "@/components/ui/stat-card";
import { AlertsOverview } from "@/components/dashboard/alerts-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { InventoryStatus } from "@/components/dashboard/inventory-status";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pills, AlertTriangle, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { medications, alerts, dashboardStats } = usePharmacy();
  
  const lowStockMeds = medications.filter(med => med.stock <= 10).length;
  const expiringMeds = medications.filter(med => {
    const expiry = new Date(med.expiryDate);
    const today = new Date();
    const differenceInTime = expiry.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays <= 30 && differenceInDays > 0;
  }).length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your pharmacy management dashboard
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Medications"
          value={medications.length}
          description="Total products in inventory"
          icon={<Pills className="h-4 w-4" />}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockMeds}
          description="Medications needing restock"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={lowStockMeds > 0 ? "up" : "neutral"}
          trendValue={lowStockMeds > 0 ? `${lowStockMeds}` : "0"}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringMeds}
          description="Medications expiring in 30 days"
          icon={<PieChart className="h-4 w-4" />}
          trend={expiringMeds > 0 ? "up" : "neutral"}
          trendValue={expiringMeds > 0 ? `${expiringMeds}` : "0"}
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(dashboardStats.totalSalesToday)}
          description="Total revenue today"
          icon={<CreditCard className="h-4 w-4" />}
          trend="up"
          trendValue="8.2%"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <AlertsOverview />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <InventoryStatus />
        <RecentTransactions />
      </div>
    </div>
  );
}
