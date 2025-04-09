
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define user roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Define user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
  department?: string;
  rollNo?: string;
  program?: 'BTech' | 'MTech';
  branch?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  github?: string;
  linkedin?: string;
  phone?: string;
  address?: string;
  profilePic?: string;
}

// Sample users for development
const SAMPLE_USERS = {
  admin: {
    id: 'rishil',
    name: 'Rishil (Admin)',
    role: 'admin' as UserRole,
    password: 'rishil12', // Fixed admin password
  },
  teacher1: {
    id: 'teacher1',
    name: 'Dr. Sugawara',
    role: 'teacher' as UserRole,
    department: 'Computer Science',
    gender: 'male',
    password: 'password123',
    email: 'sugawara@svu.edu',
    phone: '9876543210',
  },
  student1: {
    id: 'student1',
    name: 'Hinata Shoyo',
    role: 'student' as UserRole,
    rollNo: 'CS2021001',
    program: 'BTech' as 'BTech',
    branch: 'Computer Science',
    password: 'password123',
    email: 'hinata@svu.edu',
    github: 'github.com/hinata',
  },
};

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
    const storedUsers = localStorage.getItem('svu_users');
    return storedUsers ? JSON.parse(storedUsers) : [
      SAMPLE_USERS.admin,
      SAMPLE_USERS.teacher1,
      SAMPLE_USERS.student1,
    ];
  });
  
  const [user, setUser] = useState<User | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('svu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('svu_users', JSON.stringify(users));
  }, [users]);

  const login = (id: string, password: string, role: UserRole): boolean => {
    // Always log to console for debugging
    console.log(`Attempting login with id: ${id}, role: ${role}`);
    console.log('Available users:', users);
    
    // Admin authentication - always use the fixed credentials
    if (role === 'admin' && id === 'rishil' && password === 'rishil12') {
      console.log('Admin login successful');
      setUser(SAMPLE_USERS.admin);
      localStorage.setItem('svu_user', JSON.stringify(SAMPLE_USERS.admin));
      toast.success("Welcome, Admin!");
      return true;
    }
    
    // Other users authentication
    const foundUser = users.find(u => u.id === id && u.role === role);
    console.log('Found user:', foundUser);
    
    if (foundUser && foundUser.password === password) {
      console.log('User login successful');
      setUser(foundUser);
      localStorage.setItem('svu_user', JSON.stringify(foundUser));
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
    };
    
    console.log('Creating new user:', newUser);
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    localStorage.setItem('svu_users', JSON.stringify(newUsers));
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
    localStorage.setItem('svu_users', JSON.stringify(updatedUsers));
    
    // If the current user is updating their own password, update the stored user too
    if (user && user.id === userId) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem('svu_user', JSON.stringify(updatedUser));
    }
    
    toast.success("Password updated successfully.");
    return true;
  };

  // Add deleteUser function
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
    localStorage.setItem('svu_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  // Add updateUserProfile function
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
    localStorage.setItem('svu_users', JSON.stringify(updatedUsers));
    
    // If the current user is updating their own profile, update the stored user too
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('svu_user', JSON.stringify(updatedUser));
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
