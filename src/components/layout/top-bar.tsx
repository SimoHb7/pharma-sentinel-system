
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/types";

export function TopBar() {
  const { alerts, markAlertAsRead } = usePharmacy();
  const navigate = useNavigate();
  
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  
  const handleAlertClick = (alert: Alert) => {
    markAlertAsRead(alert.id);
    
    // Navigate to relevant section based on alert type
    if (alert.type === 'low-stock' || alert.type === 'expiry') {
      navigate(`/medications`);
    }
  };
  
  return (
    <div className="flex h-16 items-center px-4 border-b bg-card">
      <div className="flex-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search medications, suppliers..."
            className="rounded-full bg-background pl-8 pr-4 focus-visible:ring-offset-0"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No alerts to display
              </div>
            ) : (
              <div className="max-h-[300px] overflow-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <DropdownMenuItem
                    key={alert.id}
                    className="cursor-pointer p-3 focus:bg-accent"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              alert.type === "low-stock"
                                ? "destructive"
                                : "outline"
                            }
                            className="h-1.5 w-1.5 rounded-full p-0"
                          />
                          <span className="font-medium">
                            {alert.medicationName}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(alert.createdAt)}
                        </div>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {alert.type === "low-stock"
                            ? "Low Stock"
                            : "Expiring Soon"}
                        </Badge>
                        {!alert.isRead && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px] px-1 py-0"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            {alerts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  className="w-full justify-center rounded-sm text-sm font-medium"
                  onClick={() => navigate("/alerts")}
                >
                  View all alerts
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
