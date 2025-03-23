
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  CreditCard, 
  DollarSign, 
  Inbox,
  User,
  Calendar,
  Receipt,
  ArrowRight,
  ArrowLeft,
  X,
  Printer,
  Download
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default function Sales() {
  const { transactions, medications, addTransaction } = usePharmacy();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // New sale state
  const [newSale, setNewSale] = useState({
    type: 'sale',
    items: [],
    total: 0,
    customerName: "",
    paymentMethod: 'cash',
    status: 'completed',
    notes: ""
  });
  const [searchMed, setSearchMed] = useState("");
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.type === 'sale' &&
      (transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredMeds = medications.filter(med => 
    med.name.toLowerCase().includes(searchMed.toLowerCase()) ||
    med.sku.toLowerCase().includes(searchMed.toLowerCase())
  );

  const handleAddToSale = () => {
    if (!selectedMed) return;
    
    const existingItemIndex = newSale.items.findIndex(
      (item) => item.medicationId === selectedMed.id
    );

    let updatedItems = [...newSale.items];
    
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        subtotal: (updatedItems[existingItemIndex].quantity + quantity) * selectedMed.price
      };
    } else {
      // Add new item
      updatedItems.push({
        medicationId: selectedMed.id,
        medicationName: selectedMed.name,
        quantity,
        unitPrice: selectedMed.price,
        subtotal: quantity * selectedMed.price
      });
    }
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: newTotal
    });
    
    setSelectedMed(null);
    setSearchMed("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: newTotal
    });
  };

  const handleCreateSale = () => {
    if (newSale.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the sale.",
        variant: "destructive"
      });
      return;
    }
    
    addTransaction(newSale);
    setIsNewSaleDialogOpen(false);
    
    toast({
      title: "Sale Completed",
      description: `Transaction of ${formatCurrency(newSale.total)} has been recorded.`,
    });
    
    // Reset form
    setNewSale({
      type: 'sale',
      items: [],
      total: 0,
      customerName: "",
      paymentMethod: 'cash',
      status: 'completed',
      notes: ""
    });
  };

  const viewReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsReceiptDialogOpen(true);
  };

  const printReceipt = () => {
    window.print();
  };

  const downloadReceipt = () => {
    // In a real app, this would generate a PDF download
    toast({
      title: "Receipt Downloaded",
      description: "The receipt has been downloaded as a PDF."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          Record and manage pharmacy sales and transactions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
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
          <h3 className="font-medium text-lg mb-1">No transactions found</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchTerm ? "No sales match your search criteria." : "Record a sale to see transaction history here."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      {format(new Date(transaction.createdAt), "MMM dd, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{transaction.customerName || "Walk-in Customer"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.paymentMethod === 'cash' ? (
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-1 text-blue-600" />
                        )}
                        {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'default'
                            : transaction.status === 'pending'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(transaction.total)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReceipt(transaction)}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* New Sale Dialog */}
      <Dialog open={isNewSaleDialogOpen} onOpenChange={setIsNewSaleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>New Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-auto p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                  placeholder="Walk-in Customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={newSale.paymentMethod}
                  onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                >
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
              <Label>Add Medications</Label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medications..."
                    className="pl-8 w-full"
                    value={searchMed}
                    onChange={(e) => setSearchMed(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-20"
                    placeholder="Qty"
                  />
                  <Button onClick={handleAddToSale} disabled={!selectedMed}>
                    Add
                  </Button>
                </div>
              </div>

              {searchMed && filteredMeds.length > 0 && (
                <Card className="mt-2">
                  <CardContent className="p-2 max-h-40 overflow-auto">
                    {filteredMeds.map((med) => (
                      <div
                        key={med.id}
                        className={`flex justify-between items-center p-2 rounded hover:bg-muted cursor-pointer ${
                          selectedMed?.id === med.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedMed(med)}
                      >
                        <div>
                          <div className="font-medium">{med.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {med.sku} - {med.stock} in stock
                          </div>
                        </div>
                        <div className="font-medium">{formatCurrency(med.price)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Items</Label>
                <div className="text-sm text-muted-foreground">
                  {newSale.items.length} item(s)
                </div>
              </div>
              
              {newSale.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-muted/20">
                  <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No items added</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for medications and add them to this sale.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newSale.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.medicationName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newSale.notes}
                onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                placeholder="Any additional notes"
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(newSale.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSaleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSale} disabled={newSale.items.length === 0}>
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      {selectedTransaction && (
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" id="receipt-to-print">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-lg">PharmSentinel</h3>
                <p className="text-sm text-muted-foreground">Pharmacy Management System</p>
                <p className="text-xs">123 Pharmacy Street, Medical City</p>
                <p className="text-xs">Tel: (555) 123-4567</p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Receipt No:</span>
                  <span>{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Date:</span>
                  <span>{format(new Date(selectedTransaction.createdAt), "MMM dd, yyyy h:mm a")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Customer:</span>
                  <span>{selectedTransaction.customerName || "Walk-in Customer"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Payment Method:</span>
                  <span>{selectedTransaction.paymentMethod.charAt(0).toUpperCase() + selectedTransaction.paymentMethod.slice(1)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Items:</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransaction.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.medicationName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedTransaction.total)}</span>
                </div>
                {selectedTransaction.notes && (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Notes: </span>
                    <span>{selectedTransaction.notes}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-4 text-xs text-muted-foreground">
                <p>Thank you for your purchase!</p>
                <p>Please retain this receipt for returns or exchanges.</p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={printReceipt}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={downloadReceipt}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <Button variant="default" onClick={() => setIsReceiptDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
