import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction, TransactionItem } from "@/types";
import { Search, Plus, ShoppingCart, FileText } from "lucide-react";

export default function Sales() {
  const { medications, transactions, addTransaction } = usePharmacy();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const [selectedItems, setSelectedItems] = useState<TransactionItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    medicationId: "",
    medicationName: "",
    quantity: 1,
    price: 0,
    subtotal: 0,
  });
  
  const [newSale, setNewSale] = useState({
    customerName: "",
    paymentMethod: "cash",
    status: "completed",
    notes: "",
  });
  
  const filteredTransactions = transactions
    .filter(t => t.type === 'sale')
    .filter(transaction => 
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.items.some(item => 
        item.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleAddItem = () => {
    if (!currentItem.medicationId || currentItem.quantity <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please select a medication and enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }
    
    const medication = medications.find(m => m.id === currentItem.medicationId);
    
    if (!medication) {
      toast({
        title: "Medication Not Found",
        description: "The selected medication could not be found.",
        variant: "destructive",
      });
      return;
    }
    
    if (medication.stock < currentItem.quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${medication.stock} units of ${medication.name} available.`,
        variant: "destructive",
      });
      return;
    }
    
    const subtotal = medication.price * currentItem.quantity;
    
    const newItem: TransactionItem = {
      medicationId: medication.id,
      medicationName: medication.name,
      quantity: currentItem.quantity,
      price: medication.price,
      subtotal: subtotal,
    };
    
    setSelectedItems([...selectedItems, newItem]);
    
    setCurrentItem({
      medicationId: "",
      medicationName: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
    });
    
    toast({
      title: "Item Added",
      description: `${medication.name} added to the sale.`,
    });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.subtotal, 0);
  };
  
  const handleCreateSale = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Empty Sale",
        description: "Please add at least one item to the sale.",
        variant: "destructive",
      });
      return;
    }
    
    const sale = {
      type: "sale" as "sale" | "purchase",
      items: selectedItems,
      total: calculateTotal(),
      customerName: newSale.customerName || "Walk-in Customer",
      paymentMethod: newSale.paymentMethod,
      status: newSale.status,
      notes: newSale.notes,
    };
    
    addTransaction(sale);
    
    setIsNewSaleDialogOpen(false);
    setSelectedItems([]);
    setNewSale({
      customerName: "",
      paymentMethod: "cash",
      status: "completed",
      notes: "",
    });
    
    toast({
      title: "Sale Completed",
      description: `Sale of ${formatCurrency(calculateTotal())} has been recorded.`,
    });
  };
  
  const viewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptDialogOpen(true);
  };
  
  const handleMedicationSelect = (medicationId: string) => {
    const medication = medications.find(m => m.id === medicationId);
    if (medication) {
      setCurrentItem({
        medicationId: medication.id,
        medicationName: medication.name,
        quantity: 1,
        price: medication.price,
        subtotal: medication.price,
      });
    }
  };
  
  const handleQuantityChange = (quantity: number) => {
    const medication = medications.find(m => m.id === currentItem.medicationId);
    if (medication) {
      setCurrentItem({
        ...currentItem,
        quantity,
        subtotal: medication.price * quantity,
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          Manage and track all sales transactions
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsNewSaleDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No sales found</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchTerm ? "No sales match your search criteria." : "Record your first sale to see it here."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell>{transaction.items.length} items</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell>
                    <span className="capitalize">{transaction.paymentMethod}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => viewReceipt(transaction)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isNewSaleDialogOpen} onOpenChange={setIsNewSaleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Walk-in Customer"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={newSale.paymentMethod} 
                  onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Add Items</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-4">
                <div className="flex gap-3">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="medication">Medication</Label>
                    <Select 
                      value={currentItem.medicationId} 
                      onValueChange={handleMedicationSelect}
                    >
                      <SelectTrigger id="medication">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map((med) => (
                          <SelectItem key={med.id} value={med.id} disabled={med.stock <= 0}>
                            {med.name} - {formatCurrency(med.price)} ({med.stock} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-24">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="self-end">
                    <Button onClick={handleAddItem}>Add</Button>
                  </div>
                </div>
                
                {selectedItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Selected Items</h4>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.medicationName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => removeItem(index)}
                                >
                                  &times;
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end font-medium mt-2">
                      Total: {formatCurrency(calculateTotal())}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this sale"
                value={newSale.notes}
                onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSaleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSale}>
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedTransaction && (
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Pharmacy Management</h3>
                <p className="text-sm text-muted-foreground">123 Medical Street, Healthcare City</p>
                <p className="text-sm text-muted-foreground">Tel: (123) 456-7890</p>
              </div>
              
              <div className="border-t border-b py-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm">Date:</span>
                  <span className="text-sm">{formatDate(selectedTransaction.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Receipt No:</span>
                  <span className="text-sm">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Customer:</span>
                  <span className="text-sm">{selectedTransaction.customerName}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-bold mb-2">Items</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-1">Item</th>
                      <th className="text-right pb-1">Qty</th>
                      <th className="text-right pb-1">Price</th>
                      <th className="text-right pb-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTransaction.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-1">{item.medicationName}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">{formatCurrency(item.price)}</td>
                        <td className="py-1 text-right">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right pt-2 font-bold">Total:</td>
                      <td className="text-right pt-2 font-bold">{formatCurrency(selectedTransaction.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method:</span>
                  <span className="text-sm capitalize">{selectedTransaction.paymentMethod}</span>
                </div>
                {selectedTransaction.notes && (
                  <div className="mt-2">
                    <span className="text-sm font-bold">Notes:</span>
                    <p className="text-sm">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm">Thank you for your business!</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>
                Close
              </Button>
              <Button>Print Receipt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
