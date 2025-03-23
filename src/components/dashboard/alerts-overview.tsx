
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AlertsOverview() {
  const { alerts, markAlertAsRead } = usePharmacy();
  const navigate = useNavigate();
  
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Recent Alerts</CardTitle>
          <CardDescription>Medications requiring attention</CardDescription>
        </div>
        {unreadAlerts.length > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {unreadAlerts.length} new
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-secondary p-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No alerts</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              All medications are at healthy stock levels and not near expiration.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <Badge
                    variant={alert.type === "lowStock" ? "destructive" : "outline"}
                    className="h-2 w-2 rounded-full p-0 mr-2 mt-2"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(alert.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0"
                    >
                      {alert.type === "lowStock" ? "Low Stock" : "Expiring Soon"}
                    </Badge>
                    {!alert.isRead && (
                      <Button 
                        variant="ghost" 
                        className="h-7 px-2 text-xs" 
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length > 5 && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/alerts")}
              >
                View all alerts
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
