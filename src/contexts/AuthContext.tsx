import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define user roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Define user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string; // For teachers
  rollNo?: string; // For students
  program?: 'BTech' | 'MTech'; // For students
  branch?: string; // For students
  gender?: 'male' | 'female' | 'other'; // For teachers
}

// Sample users for development
const SAMPLE_USERS = {
  admin: {
    id: 'rishil',
    name: 'Rishil (Admin)',
    role: 'admin' as UserRole,
  },
  teacher1: {
    id: 'teacher1',
    name: 'Dr. Sugawara',
    role: 'teacher' as UserRole,
    department: 'Computer Science',
    gender: 'male',
  },
  student1: {
    id: 'student1',
    name: 'Hinata Shoyo',
    role: 'student' as UserRole,
    rollNo: 'CS2021001',
    program: 'BTech' as 'BTech',
    branch: 'Computer Science',
  },
};

interface AuthContextType {
  user: User | null;
  login: (id: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  createUser: (userData: Omit<User, 'id'> & { id: string }) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    SAMPLE_USERS.admin,
    SAMPLE_USERS.teacher1,
    SAMPLE_USERS.student1,
  ]);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('svu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (id: string, password: string, role: UserRole): boolean => {
    // Admin authentication
    if (role === 'admin' && id === 'rishil' && password === 'rishil12') {
      setUser(SAMPLE_USERS.admin);
      localStorage.setItem('svu_user', JSON.stringify(SAMPLE_USERS.admin));
      toast.success("Welcome, Admin!");
      return true;
    }
    
    // Other users authentication
    const foundUser = users.find(u => u.id === id && u.role === role);
    if (foundUser) {
      // In a real app, we would verify the password here
      // For demo, we'll just check if the user exists
      setUser(foundUser);
      localStorage.setItem('svu_user', JSON.stringify(foundUser));
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    }
    
    toast.error("Invalid credentials. Please try again.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('svu_user');
    toast.info("You have been logged out.");
  };

  const createUser = (userData: Omit<User, 'id'> & { id: string }) => {
    // Check if user already exists
    if (users.some(u => u.id === userData.id)) {
      toast.error("User ID already exists. Please choose another.");
      return;
    }
    
    const newUsers = [...users, userData];
    setUsers(newUsers);
    toast.success(`New ${userData.role} account created successfully!`);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createUser, users }}>
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
