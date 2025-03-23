
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
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  CreditCard, 
  Printer,
  Save, 
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // General settings
  const [pharmacyName, setPharmacyName] = useState("PharmSentinel");
  const [pharmacyAddress, setPharmacyAddress] = useState("123 Pharmacy Street, Medical City");
  const [pharmacyPhone, setPharmacyPhone] = useState("(555) 123-4567");
  const [pharmacyEmail, setPharmacyEmail] = useState("contact@pharmsentinel.com");
  const [timezone, setTimezone] = useState("UTC-5");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [stockThreshold, setStockThreshold] = useState("10");
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [expiryDays, setExpiryDays] = useState("30");
  
  // Receipt settings
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxId, setShowTaxId] = useState(true);
  const [taxId, setTaxId] = useState("12-3456789");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for your purchase!");
  const [receiptCopies, setReceiptCopies] = useState("1");
  
  // User settings
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // User role management (mock data in a real app, this would be fetched from backend)
  const [users, setUsers] = useState([
    { id: "u1", name: "Admin User", email: "admin@example.com", role: "admin" },
    { id: "u2", name: "Pharmacist One", email: "pharmacist1@example.com", role: "pharmacist" },
    { id: "u3", name: "Staff Member", email: "staff@example.com", role: "staff" }
  ]);
  
  const handleSaveSettings = (type: string) => {
    // In a real app, this would save to backend
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
    
    // In a real app, this would verify and update the password
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`
    });
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
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
              <Button onClick={() => handleSaveSettings("general")}>
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
              <Button onClick={() => handleSaveSettings("notification")}>
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
              <Button onClick={() => handleSaveSettings("receipt")}>
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
                <Shield className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-4 bg-muted p-3 rounded-t-md font-medium text-sm">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div className="text-right">Actions</div>
                </div>
                
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    className="grid grid-cols-4 p-3 items-center border-t first:border-t-0"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm">{user.email}</div>
                    <div>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUpdateRole(user.id, value)}
                        disabled={user.id === "u1"} // Don't allow changing the admin role
                      >
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="pharmacist">Pharmacist</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" title="This feature is not available in the demo">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        disabled={user.id === "u1"} // Don't allow removing the admin
                        title={user.id === "u1" ? "Cannot remove admin user" : "This feature is not available in the demo"}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">Invite New User</h3>
                    <p className="text-sm text-muted-foreground">
                      Send an invitation to a new team member
                    </p>
                  </div>
                  <Button variant="default" title="This feature is not available in the demo">
                    Add User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
