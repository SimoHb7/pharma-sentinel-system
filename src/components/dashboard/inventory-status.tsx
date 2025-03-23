
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, ChevronRight, Package } from "lucide-react";
import { isExpiringSoon, isLowStock } from "@/lib/utils";

export function InventoryStatus() {
  const { medications } = usePharmacy();
  const navigate = useNavigate();
  
  const sortedMeds = [...medications].sort((a, b) => {
    // Sort by low stock first, then by expiring soon
    const aIsLowStock = isLowStock(a.stock);
    const bIsLowStock = isLowStock(b.stock);
    
    if (aIsLowStock && !bIsLowStock) return -1;
    if (!aIsLowStock && bIsLowStock) return 1;
    
    const aIsExpiring = isExpiringSoon(a.expiryDate);
    const bIsExpiring = isExpiringSoon(b.expiryDate);
    
    if (aIsExpiring && !bIsExpiring) return -1;
    if (!aIsExpiring && bIsExpiring) return 1;
    
    return a.name.localeCompare(b.name);
  });
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Inventory Status</CardTitle>
        <CardDescription>Medications by stock level</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
            <span>Medication</span>
            <span>Status</span>
          </div>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {sortedMeds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 px-6 text-center">
              <div className="rounded-full bg-secondary p-3 mb-3">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No medications</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Add medications to your inventory to see their status here.
              </p>
            </div>
          ) : (
            sortedMeds.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{med.name}</span>
                  <span className="text-xs text-muted-foreground">
                    SKU: {med.sku}
                  </span>
                </div>
                <div className="flex gap-2">
                  {isLowStock(med.stock) && (
                    <Badge variant="destructive" className="text-xs">
                      Low Stock: {med.stock}
                    </Badge>
                  )}
                  {isExpiringSoon(med.expiryDate) && (
                    <Badge variant="outline" className="text-xs">
                      Expiring Soon
                    </Badge>
                  )}
                  {!isLowStock(med.stock) && !isExpiringSoon(med.expiryDate) && (
                    <Badge variant="secondary" className="text-xs">
                      {med.stock} in stock
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/medications")}
          >
            Manage inventory
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
