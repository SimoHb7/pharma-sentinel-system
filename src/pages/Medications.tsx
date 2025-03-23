
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, isExpiringSoon, isLowStock } from "@/lib/utils";
import { 
  Package, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash, 
  Filter, 
  AlertTriangle 
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Medications() {
  const { medications, suppliers, addMedication, updateMedication, deleteMedication } = usePharmacy();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<any>(null);
  const [newMedication, setNewMedication] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    expiryDate: "",
    manufacturer: "",
    supplierId: ""
  });

  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedication = () => {
    addMedication(newMedication);
    setIsAddDialogOpen(false);
    setNewMedication({
      name: "",
      description: "",
      sku: "",
      category: "",
      price: 0,
      costPrice: 0,
      stock: 0,
      expiryDate: "",
      manufacturer: "",
      supplierId: ""
    });
    toast({
      title: "Medication Added",
      description: `${newMedication.name} has been added to inventory.`,
    });
  };

  const handleEditMedication = () => {
    updateMedication(currentMedication.id, currentMedication);
    setIsEditDialogOpen(false);
    toast({
      title: "Medication Updated",
      description: `${currentMedication.name} has been updated.`,
    });
  };

  const handleDeleteMedication = () => {
    deleteMedication(currentMedication.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Medication Deleted",
      description: `${currentMedication.name} has been removed from inventory.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
        <p className="text-muted-foreground">
          Manage your pharmacy's medication inventory
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search medications..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSearchTerm("")}>All Medications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("low stock")}>Low Stock</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchTerm("expiring")}>Expiring Soon</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
      </div>

      {filteredMedications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/20 rounded-lg">
          <div className="rounded-full bg-secondary p-3 mb-3">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No medications found</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchTerm ? "No medications match your search criteria." : "Add medications to your inventory to see them here."}
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
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{medication.sku}</TableCell>
                  <TableCell>{medication.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {medication.stock}
                      {isLowStock(medication.stock) && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(medication.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {new Date(medication.expiryDate).toLocaleDateString()}
                      {isExpiringSoon(medication.expiryDate) && (
                        <Badge variant="outline" className="text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setCurrentMedication(medication);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setCurrentMedication(medication);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Medication Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newMedication.sku}
                  onChange={(e) => setNewMedication({ ...newMedication, sku: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newMedication.description}
                onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newMedication.category}
                  onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newMedication.manufacturer}
                  onChange={(e) => setNewMedication({ ...newMedication, manufacturer: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newMedication.price}
                  onChange={(e) => setNewMedication({ ...newMedication, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price ($)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={newMedication.costPrice}
                  onChange={(e) => setNewMedication({ ...newMedication, costPrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newMedication.stock}
                  onChange={(e) => setNewMedication({ ...newMedication, stock: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newMedication.expiryDate}
                  onChange={(e) => setNewMedication({ ...newMedication, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <select
                id="supplier"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newMedication.supplierId}
                onChange={(e) => setNewMedication({ ...newMedication, supplierId: e.target.value })}
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedication}>Add Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medication Dialog */}
      {currentMedication && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={currentMedication.name}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={currentMedication.sku}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={currentMedication.description}
                  onChange={(e) => setCurrentMedication({ ...currentMedication, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={currentMedication.category}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                  <Input
                    id="edit-manufacturer"
                    value={currentMedication.manufacturer}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, manufacturer: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={currentMedication.price}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-costPrice">Cost Price ($)</Label>
                  <Input
                    id="edit-costPrice"
                    type="number"
                    value={currentMedication.costPrice}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, costPrice: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={currentMedication.stock}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={currentMedication.expiryDate.split('T')[0]}
                    onChange={(e) => setCurrentMedication({ ...currentMedication, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Supplier</Label>
                <select
                  id="edit-supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentMedication.supplierId}
                  onChange={(e) => setCurrentMedication({ ...currentMedication, supplierId: e.target.value })}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditMedication}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {currentMedication && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{currentMedication.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteMedication}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
