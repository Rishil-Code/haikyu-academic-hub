import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { User, UserRole } from '@/types/user';
import { getSampleUsers } from '@/utils/sampleData';
import { storeUser, retrieveUser, storeUsers, retrieveUsers } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  login: (id: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  createUser: (userData: Omit<User, 'id'> & { id: string, password: string }) => void;
  users: User[];
  updateUserPassword: (userId: string, newPassword: string) => boolean;
  deleteUser: (userId: string) => boolean;
  updateUserProfile: (userId: string, updatedData: Partial<User>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize users from localStorage or use default sample users
  const [users, setUsers] = useState<User[]>(() => {
    return retrieveUsers() || getSampleUsers();
  });
  
  const [user, setUser] = useState<User | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = retrieveUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    storeUsers(users);
  }, [users]);

  const login = (id: string, password: string, role: UserRole): boolean => {
    console.log(`Attempting login with id: ${id}, role: ${role}`);
    console.log('Available users:', users);
    
    // Admin authentication
    const adminUser = users.find(u => u.id === 'rishil' && u.role === 'admin');
    if (role === 'admin' && id === 'rishil' && password === 'rishil12') {
      console.log('Admin login successful');
      setUser(adminUser!);
      storeUser(adminUser!);
      toast.success("Welcome, Admin!");
      return true;
    }
    
    // Other users authentication
    const foundUser = users.find(u => u.id === id && u.role === role);
    console.log('Found user:', foundUser);
    
    if (foundUser && foundUser.password === password) {
      console.log('User login successful');
      setUser(foundUser);
      storeUser(foundUser);
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    }
    
    console.log('Login failed - invalid credentials');
    toast.error("Invalid credentials. Please try again.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('svu_user');
    toast.info("You have been logged out.");
  };

  const createUser = (userData: Omit<User, 'id'> & { id: string, password: string }) => {
    // Check if user already exists
    if (users.some(u => u.id === userData.id)) {
      toast.error("User ID already exists. Please choose another.");
      return;
    }
    
    // Create new user with all required fields
    const newUser = {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      password: userData.password,
      ...(userData.role === "teacher" ? {
        department: userData.department || "",
        gender: userData.gender as "male" | "female" | "other" || "other",
      } : {}),
      ...(userData.role === "student" ? {
        rollNo: userData.rollNo || "",
        program: userData.program as "BTech" | "MTech" || "BTech",
        branch: userData.branch || "",
      } : {}),
      email: userData.email || "",
      github: userData.github || "",
      linkedin: userData.linkedin || "",
      phone: userData.phone || "",
      address: userData.address || "",
      profilePic: userData.profilePic || "",
    };
    
    console.log('Creating new user:', newUser);
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    storeUsers(newUsers);
    toast.success(`New ${userData.role} account created successfully!`);
  };

  const updateUserPassword = (userId: string, newPassword: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    // If the current user is updating their own password, update the stored user too
    if (user && user.id === userId) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
    
    toast.success("Password updated successfully.");
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    // Prevent deleting admin account
    if (userId === 'rishil') {
      toast.error("Cannot delete the admin account.");
      return false;
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    toast.success("User deleted successfully.");
    return true;
  };

  const updateUserProfile = (userId: string, updatedData: Partial<User>): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updatedData
    };

    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    // If the current user is updating their own profile, update the stored user too
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
    
    toast.success("Profile updated successfully.");
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      createUser, 
      users,
      updateUserPassword,
      deleteUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
