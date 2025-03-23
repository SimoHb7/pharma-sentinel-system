
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  LogOut,
  Bell,
  Truck
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { usePharmacy } from "@/contexts/PharmacyContext";

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const { alerts } = usePharmacy();
  const location = useLocation();
  
  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
      active: location.pathname === "/"
    },
    {
      title: "Medications",
      icon: <Pill className="h-5 w-5" />,
      href: "/medications",
      active: location.pathname.startsWith("/medications")
    },
    {
      title: "Suppliers",
      icon: <Truck className="h-5 w-5" />,
      href: "/suppliers",
      active: location.pathname.startsWith("/suppliers")
    },
    {
      title: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/customers",
      active: location.pathname.startsWith("/customers")
    },
    {
      title: "Sales",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/sales",
      active: location.pathname.startsWith("/sales")
    },
    {
      title: "Reports",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/reports",
      active: location.pathname.startsWith("/reports")
    },
    {
      title: "Alerts",
      icon: <Bell className="h-5 w-5" />,
      href: "/alerts",
      active: location.pathname.startsWith("/alerts"),
      badge: unreadAlerts > 0 ? unreadAlerts : undefined
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
      active: location.pathname.startsWith("/settings")
    }
  ];

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="py-4">
        <div className="px-3 py-2">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-semibold tracking-tight mb-1">
              PharmSentinel
            </h2>
            <p className="text-xs text-muted-foreground">
              Pharmacy Management System
            </p>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className="block">
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-x-2",
                    item.active ? "bg-primary" : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-6 absolute bottom-5 left-0 right-0">
        {user && (
          <div className="flex items-center gap-2 rounded-lg border p-3 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-medium text-primary-foreground">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground leading-none mt-1">{user.role}</span>
            </div>
            <Button 
              variant="ghost" 
              className="ml-auto h-8 w-8 p-0" 
              onClick={logout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
