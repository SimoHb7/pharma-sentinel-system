import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Clock, 
  Package,
  Calendar,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const { alerts, markAlertAsRead, clearAlert, medications } = usePharmacy();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "low-stock" | "expiry">("all");
  
  const filteredAlerts = alerts.filter(alert => {
    // First apply search filter
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply category filter
    if (filter === "all") return matchesSearch;
    if (filter === "unread") return matchesSearch && !alert.isRead;
    if (filter === "low-stock") return matchesSearch && alert.type === "lowStock";
    if (filter === "expiry") return matchesSearch && alert.type === "expiringSoon";
    
    return matchesSearch;
  }).sort((a, b) => {
    // Sort by read status (unread first) then by date (newest first)
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const lowStockCount = alerts.filter(alert => alert.type === "lowStock").length;
  const expiryCount = alerts.filter(alert => alert.type === "expiringSoon").length;
  
  const handleMarkAsRead = (id: string) => {
    markAlertAsRead(id);
    toast({
      title: "Alert marked as read",
      description: "The alert has been marked as read."
    });
  };
  
  const handleClearAlert = (id: string) => {
    clearAlert(id);
    toast({
      title: "Alert dismissed",
      description: "The alert has been dismissed from your list."
    });
  };
  
  const handleMarkAllAsRead = () => {
    filteredAlerts.forEach(alert => {
      if (!alert.isRead) markAlertAsRead(alert.id);
    });
    
    toast({
      title: "All alerts marked as read",
      description: "All alerts have been marked as read."
    });
  };
  
  const handleView = (medicationId?: string) => {
    navigate("/medications");
    // In a real app, this would navigate to a specific medication detail page
  };
  
  // Get the medication data for each alert to show current stock and expiry
  const getMedicationData = (medicationId?: string) => {
    if (!medicationId) return null;
    return medications.find(med => med.id === medicationId);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Manage inventory alerts and notifications
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${filter === "unread" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter("unread")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>Unread Alerts</span>
              <Badge variant="secondary">{unreadCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bell className="h-8 w-8 mr-2 text-blue-500" />
              <div className="text-sm">
                {unreadCount === 0 ? (
                  <p>No unread alerts</p>
                ) : (
                  <p>You have <span className="font-bold">{unreadCount}</span> unread alert{unreadCount !== 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${filter === "low-stock" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter("low-stock")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>Low Stock Alerts</span>
              <Badge variant="secondary">{lowStockCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 mr-2 text-amber-500" />
              <div className="text-sm">
                {lowStockCount === 0 ? (
                  <p>No low stock alerts</p>
                ) : (
                  <p><span className="font-bold">{lowStockCount}</span> medication{lowStockCount !== 1 ? 's' : ''} running low</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${filter === "expiry" ? "ring-2 ring-primary" : ""}`} onClick={() => setFilter("expiry")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>Expiration Alerts</span>
              <Badge variant="secondary">{expiryCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-2 text-red-500" />
              <div className="text-sm">
                {expiryCount === 0 ? (
                  <p>No expiration alerts</p>
                ) : (
                  <p><span className="font-bold">{expiryCount}</span> medication{expiryCount !== 1 ? 's' : ''} expiring soon</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-muted" : ""}
          >
            All Alerts
          </Button>
          <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>
      
      {filteredAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No alerts found</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchTerm 
              ? "No alerts match your search criteria." 
              : filter !== "all" 
                ? `No ${filter === "unread" ? "unread" : filter === "low-stock" ? "low stock" : "expiry"} alerts found.`
                : "You don't have any active alerts at the moment."}
          </p>
          {(searchTerm || filter !== "all") && (
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const medication = getMedicationData(alert.relatedId);
            
            return (
              <Card 
                key={alert.id} 
                className={`hover:shadow-md transition-shadow ${!alert.isRead ? "bg-primary/5 border-primary/20" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start p-4 sm:p-6">
                    <div className="rounded-full p-2 mr-4 mt-1">
                      {alert.type === "lowStock" ? (
                        <Package className="h-8 w-8 text-amber-500" />
                      ) : (
                        <Calendar className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {alert.type === "lowStock" ? "Low Stock Alert" : "Expiration Alert"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(alert.createdAt), "MMM dd, yyyy h:mm a")}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm">{alert.message}</p>
                      
                      {medication && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">Category:</span>
                            <span>{medication.category}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">Current Stock:</span>
                            <span className={medication.stock <= 10 ? "text-red-500 font-medium" : ""}>
                              {medication.stock} units
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">SKU:</span>
                            <span>{medication.sku}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">Expiry Date:</span>
                            <span className={
                              new Date(medication.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "text-red-500 font-medium"
                                : ""
                            }>
                              {format(new Date(medication.expiryDate), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                        <Button size="sm" onClick={() => handleView(alert.relatedId)}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Medication
                        </Button>
                        
                        {!alert.isRead && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="ml-auto" onClick={() => handleClearAlert(alert.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
