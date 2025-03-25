import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Switch
} from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  CreditCard, 
  Printer,
  Save, 
  AlertTriangle,
  UserPlus,
  Edit,
  Trash,
  Lock
} from "lucide-react";
import { User as UserType } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { user, hasPermission, allUsers, addUser, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "staff" as const,
    password: "password123"
  });
  
  const [pharmacyName, setPharmacyName] = useState("PharmSentinel");
  const [pharmacyAddress, setPharmacyAddress] = useState("123 Pharmacy Street, Medical City");
  const [pharmacyPhone, setPharmacyPhone] = useState("(555) 123-4567");
  const [pharmacyEmail, setPharmacyEmail] = useState("contact@pharmsentinel.com");
  const [timezone, setTimezone] = useState("UTC-5");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [stockThreshold, setStockThreshold] = useState("10");
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [expiryDays, setExpiryDays] = useState("30");
  
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxId, setShowTaxId] = useState(true);
  const [taxId, setTaxId] = useState("12-3456789");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for your purchase!");
  const [receiptCopies, setReceiptCopies] = useState("1");
  
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSaveSettings = (type: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${type} settings have been updated successfully.`
    });
  };
  
  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addUser({
      ...newUser,
      role: newUser.role as 'admin' | 'pharmacist' | 'staff',
    });
    
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "staff",
    });
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
  };
  
  const handleEditUser = () => {
    if (!currentUser) return;
    
    updateUser(currentUser.id, {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role
    });
    
    setIsEditUserDialogOpen(false);
  };
  
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    deleteUser(currentUser.id);
    setIsDeleteUserDialogOpen(false);
  };
  
  const getRoleDisplayName = (role: UserType['role']) => {
    const roles = {
      admin: "Administrator",
      pharmacist: "Pharmacist",
      staff: "Staff Member"
    };
    return roles[role];
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and system settings
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto sm:h-10">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <SettingsIcon className="h-4 w-4 mr-2" />
            <span className="sm:inline hidden">General</span>
          </TabsTrigger>
          <TabsTrigger value="notification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            <span className="sm:inline hidden">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="receipt" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Printer className="h-4 w-4 mr-2" />
            <span className="sm:inline hidden">Receipts</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            <span className="sm:inline hidden">Account</span>
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={!hasPermission('manage-users')}
          >
            <Shield className="h-4 w-4 mr-2" />
            <span className="sm:inline hidden">Users</span>
          </TabsTrigger>
        </TabsList>
        
        
        
        <TabsContent value="general" className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your pharmacy's general information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                  <Input 
                    id="pharmacy-name" 
                    value={pharmacyName} 
                    onChange={(e) => setPharmacyName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-phone">Phone Number</Label>
                  <Input 
                    id="pharmacy-phone" 
                    value={pharmacyPhone} 
                    onChange={(e) => setPharmacyPhone(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-email">Email Address</Label>
                  <Input 
                    id="pharmacy-email" 
                    type="email"
                    value={pharmacyEmail} 
                    onChange={(e) => setPharmacyEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-address">Address</Label>
                  <Input 
                    id="pharmacy-address" 
                    value={pharmacyAddress} 
                    onChange={(e) => setPharmacyAddress(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("general")}
                disabled={!hasPermission('manage-settings')}
              >
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notification" className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you want to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts and system notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive urgent alerts via SMS
                      </p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={smsNotifications} 
                      onCheckedChange={setSmsNotifications} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stock-alerts">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory levels are low
                      </p>
                    </div>
                    <Switch 
                      id="stock-alerts" 
                      checked={stockAlerts} 
                      onCheckedChange={setStockAlerts} 
                    />
                  </div>
                  
                  {stockAlerts && (
                    <div className="pl-6 border-l-2 border-muted space-y-2">
                      <Label htmlFor="stock-threshold">Stock Threshold</Label>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-muted-foreground">Alert when stock falls below</span>
                        <Input 
                          id="stock-threshold" 
                          value={stockThreshold} 
                          onChange={(e) => setStockThreshold(e.target.value)} 
                          className="w-20"
                          type="number"
                          min="0"
                        />
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="expiry-alerts">Expiration Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when medications are approaching expiry
                      </p>
                    </div>
                    <Switch 
                      id="expiry-alerts" 
                      checked={expiryAlerts} 
                      onCheckedChange={setExpiryAlerts} 
                    />
                  </div>
                  
                  {expiryAlerts && (
                    <div className="pl-6 border-l-2 border-muted space-y-2">
                      <Label htmlFor="expiry-days">Days Before Expiry</Label>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-muted-foreground">Alert</span>
                        <Input 
                          id="expiry-days" 
                          value={expiryDays} 
                          onChange={(e) => setExpiryDays(e.target.value)} 
                          className="w-20"
                          type="number"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground">days before expiry date</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("notification")}
                disabled={!hasPermission('manage-settings')}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="receipt" className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>Receipt & Invoice Settings</CardTitle>
              <CardDescription>
                Customize how your pharmacy receipts and invoices appear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-logo">Show Logo on Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your pharmacy logo on printed receipts
                    </p>
                  </div>
                  <Switch 
                    id="show-logo" 
                    checked={showLogo} 
                    onCheckedChange={setShowLogo} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-tax-id">Show Tax ID on Receipts</Label>
                    <p className="text-sm text-muted-foreground">
                      Include your tax ID number on receipts
                    </p>
                  </div>
                  <Switch 
                    id="show-tax-id" 
                    checked={showTaxId} 
                    onCheckedChange={setShowTaxId} 
                  />
                </div>
                
                {showTaxId && (
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID Number</Label>
                    <Input 
                      id="tax-id" 
                      value={taxId} 
                      onChange={(e) => setTaxId(e.target.value)} 
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="receipt-footer">Receipt Footer Message</Label>
                  <Input 
                    id="receipt-footer" 
                    value={receiptFooter} 
                    onChange={(e) => setReceiptFooter(e.target.value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will appear at the bottom of all receipts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receipt-copies">Number of Receipt Copies</Label>
                  <Input 
                    id="receipt-copies" 
                    type="number"
                    min="1"
                    max="3"
                    value={receiptCopies} 
                    onChange={(e) => setReceiptCopies(e.target.value)} 
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("receipt")}
                disabled={!hasPermission('manage-settings')}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Receipt Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input 
                    id="user-name" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email Address</Label>
                  <Input 
                    id="user-email" 
                    type="email"
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button onClick={() => handleSaveSettings("account")}>
                <Save className="h-4 w-4 mr-2" />
                Save Account Settings
              </Button>
              <Button 
                variant="outline" 
                onClick={handleUpdatePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-4 bg-muted p-3 rounded-t-md font-medium text-sm">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div className="text-right">Actions</div>
                </div>
                
                {allUsers.map((usr) => (
                  <div 
                    key={usr.id} 
                    className="grid grid-cols-4 p-3 items-center border-t first:border-t-0"
                  >
                    <div className="font-medium">{usr.name}</div>
                    <div className="text-sm">{usr.email}</div>
                    <div>
                      <Badge variant={
                        usr.role === 'admin' ? 'default' : 
                        usr.role === 'pharmacist' ? 'secondary' : 'outline'
                      }>
                        {getRoleDisplayName(usr.role)}
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentUser(usr);
                          setIsEditUserDialogOpen(true);
                        }}
                        disabled={user?.id === usr.id}
                        title={user?.id === usr.id ? "Cannot edit your own account from here" : "Edit user"}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => {
                          setCurrentUser(usr);
                          setIsDeleteUserDialogOpen(true);
                        }}
                        disabled={user?.id === usr.id}
                        title={user?.id === usr.id ? "Cannot delete your own account" : "Delete user"}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate access level
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Full Name</Label>
              <Input
                id="new-user-name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-email">Email Address</Label>
              <Input
                id="new-user-email"
                type="email"
                placeholder="john@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: "admin" | "pharmacist" | "staff") => 
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger id="new-user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-password">Temporary Password</Label>
              <Input
                id="new-user-password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                The user will be required to change this on first login
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {currentUser && (
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and access level
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">Full Name</Label>
                <Input
                  id="edit-user-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-email">Email Address</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={(value: "admin" | "pharmacist" | "staff") => 
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger id="edit-user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="staff">Staff Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {currentUser && (
        <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex items-center gap-4 border rounded-md p-4">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <p className="text-sm text-muted-foreground">Role: {getRoleDisplayName(currentUser.role)}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
