
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  ReceiptText 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// Mock customer data (would come from context in a real app)
const mockCustomers = [
  {
    id: "c1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    lastPurchase: "2023-05-15T10:30:00Z",
    totalSpent: 452.75
  },
  {
    id: "c2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    lastPurchase: "2023-05-10T14:45:00Z",
    totalSpent: 187.20
  },
  {
    id: "c3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "789 Pine Rd, Nowhere, USA",
    lastPurchase: "2023-05-05T09:15:00Z",
    totalSpent: 329.50
  }
];

export default function Customers() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    const customer = {
      ...newCustomer,
      id: `c${customers.length + 1}`,
      lastPurchase: new Date().toISOString(),
      totalSpent: 0
    };
    setCustomers([...customers, customer]);
    setIsAddDialogOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added to your customer database.`,
    });
  };

  const handleEditCustomer = () => {
    setCustomers(customers.map(c => c.id === currentCustomer.id ? currentCustomer : c));
    setIsEditDialogOpen(false);
    toast({
      title: "Customer Updated",
      description: `${currentCustomer.name} has been updated.`,
    });
  };

  const handleDeleteCustomer = () => {
    setCustomers(customers.filter(c => c.id !== currentCustomer.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Customer Deleted",
      description: `${currentCustomer.name} has been removed from your customer database.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your pharmacy's customer database
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No customers found</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchTerm ? "No customers match your search criteria." : "Add customers to see them here."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{customer.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Last purchase: {format(new Date(customer.lastPurchase), "MMM d, yyyy")}
                      </div>
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setCurrentCustomer(customer);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setCurrentCustomer(customer);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="hover:underline">
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                  <div className="flex items-center pt-2 border-t">
                    <ReceiptText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Total Spent: ${customer.totalSpent.toFixed(2)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => navigate(`/sales?customer=${customer.id}`)}
                  >
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      {currentCustomer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentCustomer.email}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={currentCustomer.phone}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={currentCustomer.address}
                  onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCustomer}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {currentCustomer && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{currentCustomer.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCustomer}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
