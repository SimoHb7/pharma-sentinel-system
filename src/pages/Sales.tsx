import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { 
  ShoppingCart, 
  Package, 
  Plus, 
  Minus, 
  Trash,
  AlertCircle
} from "lucide-react";

export default function Sales() {
  const { medications, transactions, addTransaction } = usePharmacy();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("sale");
  const [transactionItems, setTransactionItems] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const transactionTotal = transactionItems.reduce((total, item) => total + item.subtotal, 0);

  const handleAddItem = () => {
    if (!selectedMedication) {
      toast({
        title: "No medication selected",
        description: "Please select a medication to add to the transaction.",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const existingItemIndex = transactionItems.findIndex(item => item.medicationId === selectedMedication.id);

    if (existingItemIndex > -1) {
      const updatedItems = [...transactionItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        subtotal: (updatedItems[existingItemIndex].quantity + quantity) * selectedMedication.price,
      };
      setTransactionItems(updatedItems);
    } else {
      const newItem = {
        medicationId: selectedMedication.id,
        medicationName: selectedMedication.name,
        quantity: quantity,
        unitPrice: selectedMedication.price,
        subtotal: quantity * selectedMedication.price,
      };
      setTransactionItems([...transactionItems, newItem]);
    }

    setSelectedMedication(null);
    setQuantity(1);
  };

  const handleRemoveItem = (medicationId) => {
    setTransactionItems(transactionItems.filter(item => item.medicationId !== medicationId));
  };

  const handleQuantityChange = (medicationId, newQuantity) => {
    if (newQuantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const updatedItems = transactionItems.map(item => {
      if (item.medicationId === medicationId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unitPrice,
        };
      }
      return item;
    });

    setTransactionItems(updatedItems);
  };

  const handleAddTransaction = () => {
    if (transactionItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the transaction.",
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      type: transactionType as 'purchase' | 'sale',
      items: transactionItems,
      total: transactionTotal,
      customerName: customerName,
      paymentMethod: paymentMethod as 'cash' | 'card' | 'insurance',
      status: "completed" as const,
      notes: notes,
    };

    addTransaction(newTransaction);
    
    toast({
      title: "Transaction Added",
      description: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} transaction of ${formatCurrency(transactionTotal)} has been recorded.`,
    });
    
    // Reset form
    setTransactionType("sale");
    setTransactionItems([]);
    setCustomerName("");
    setPaymentMethod("cash");
    setNotes("");
    setIsAddDialogOpen(false);
    setSelectedMedication(null);
    setQuantity(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales & Transactions</h1>
        <p className="text-muted-foreground">
          Record and manage pharmacy sales and purchase transactions
        </p>
      </div>

      <Button onClick={() => setIsAddDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Medication</Label>
                <Select onValueChange={(value) => setSelectedMedication(medications.find(med => med.id === value) || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {medications.map((medication) => (
                      <SelectItem key={medication.id} value={medication.id}>
                        {medication.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddItem} size="sm">
                  Add Item
                </Button>
              </div>
            </div>

            {transactionItems.length > 0 && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionItems.map((item) => (
                      <TableRow key={item.medicationId}>
                        <TableCell>{item.medicationName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.medicationId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              className="w-16 text-center"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value);
                                if (!isNaN(newQuantity)) {
                                  handleQuantityChange(item.medicationId, newQuantity);
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.medicationId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.medicationId)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 text-right font-bold">
                  Total: {formatCurrency(transactionTotal)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Transaction notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction History */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No transactions recorded</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            Add transactions to see them here.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.customerName || "N/A"}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
