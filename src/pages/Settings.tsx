
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";

export default function Settings() {
  const { user, allUsers, addUser, updateUser, deleteUser, hasPermission } = useAuth();
  const canManageUsers = hasPermission('manage-users');
  
  // Fix the type error by properly typing newUser with a type that matches User['role']
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: User['role']; // This ensures role can only be one of the allowed values
    password: string;
  }>({
    name: "",
    email: "",
    role: "staff",
    password: ""
  });
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
      
      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "staff",
        password: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add user. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and system settings
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {canManageUsers && <TabsTrigger value="users">Users</TabsTrigger>}
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={user?.name} 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email} 
                      disabled 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="p-2 rounded bg-muted">
                    <p className="text-sm font-medium capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button>Change Password</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {canManageUsers && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove users from the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Add New User</h3>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newUserName">Name</Label>
                        <Input 
                          id="newUserName" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserEmail">Email</Label>
                        <Input 
                          id="newUserEmail" 
                          type="email" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <RadioGroup 
                        value={newUser.role} 
                        onValueChange={(value: User['role']) => 
                          setNewUser({
                            ...newUser, 
                            role: value
                          })
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pharmacist" id="pharmacist" />
                          <Label htmlFor="pharmacist">Pharmacist</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="staff" id="staff" />
                          <Label htmlFor="staff">Staff</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newUserPassword">Password</Label>
                      <Input 
                        id="newUserPassword" 
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button type="submit">Add User</Button>
                  </form>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-lg font-medium mb-4">Existing Users</h3>
                  <div className="space-y-2">
                    {allUsers.map((u) => (
                      <div 
                        key={u.id} 
                        className="p-4 rounded border border-border flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs mt-1 capitalize">{u.role}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // In a real app, this would open an edit modal or page
                              alert("Edit user functionality would go here");
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={user?.id === u.id}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Theme settings would go here in a real application
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Notification settings would go here in a real application
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">System Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">May 31, 2023</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
