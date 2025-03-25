import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { mockUsers } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  allUsers: User[];
}

// Define permissions based on role
export type Permission = 
  | 'manage-users'
  | 'manage-medications'
  | 'manage-suppliers'
  | 'manage-transactions'
  | 'view-reports'
  | 'manage-settings'
  | 'view-dashboard';

// Role-based permissions mapping
const rolePermissions: Record<User['role'], Permission[]> = {
  'admin': [
    'manage-users',
    'manage-medications', 
    'manage-suppliers', 
    'manage-transactions',
    'view-reports',
    'manage-settings',
    'view-dashboard'
  ],
  'pharmacist': [
    'manage-medications',
    'manage-transactions',
    'view-reports',
    'view-dashboard'
  ],
  'staff': [
    'manage-transactions',
    'view-dashboard'
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("pharmacy-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    // For now, just simulate a login with mock data
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation - in real app would check password too
      const foundUser = allUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("pharmacy-user", JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pharmacy-user");
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(permission);
  };

  // Add a new user
  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setAllUsers(prevUsers => [...prevUsers, newUser]);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`
    });
  };

  // Update existing user
  const updateUser = (id: string, data: Partial<User>) => {
    setAllUsers(prevUsers => 
      prevUsers.map(u => u.id === id ? { ...u, ...data } : u)
    );
    
    // If the current user was updated, update the local state and localStorage
    if (user && user.id === id) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("pharmacy-user", JSON.stringify(updatedUser));
    }
    
    toast({
      title: "User Updated",
      description: "User information has been updated successfully."
    });
  };

  // Delete a user
  const deleteUser = (id: string) => {
    // Prevent deleting yourself
    if (user && user.id === id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }
    
    setAllUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system."
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      hasPermission,
      addUser,
      updateUser,
      deleteUser,
      allUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
