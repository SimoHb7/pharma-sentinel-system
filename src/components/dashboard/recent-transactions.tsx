
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentTransactions() {
  const { transactions } = usePharmacy();
  const navigate = useNavigate();
  
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <CardDescription>Latest sales and purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={transaction.type === "sale" ? "default" : "secondary"}>
                    {transaction.type === "sale" ? "Sale" : "Purchase"}
                  </Badge>
                  {transaction.customerName && (
                    <span className="text-sm">{transaction.customerName}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatCurrency(transaction.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {transaction.items.length} item{transaction.items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate("/sales")}
          >
            View all transactions
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
