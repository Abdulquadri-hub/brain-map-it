import React, { createContext, useContext, useState, ReactNode } from "react";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// 
// Replace this context with Inertia's shared data:
// const { auth } = usePage<{ auth: { user: User } }>().props
// 
// For login: router.post('/login', { email, password })
// For logout: router.post('/logout')
// For register: router.post('/register', userData)

export type UserRole = "school_owner" | "instructor" | "parent" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schools?: School[];
}

export interface School {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Laravel Inertia.js Integration:
  // Replace with: router.post('/login', { email, password }, {
  //   onSuccess: () => router.visit('/dashboard'),
  //   onError: (errors) => setErrors(errors)
  // })
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call - replace with Inertia router.post
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock user data - role determined by email prefix for demo
    // In production: will come from usePage().props.auth.user
    let mockUser: User;

    if (email.includes("student")) {
      mockUser = {
        id: "s-1",
        email,
        name: "Chidera Okonkwo",
        role: "student",
        schools: [
          { id: "1", name: "Bright Stars Academy", slug: "brightstars", role: "student" },
        ],
      };
    } else if (email.includes("parent")) {
      mockUser = {
        id: "p-1",
        email,
        name: "Mrs. Ngozi Okonkwo",
        role: "parent",
        schools: [
          { id: "1", name: "Bright Stars Academy", slug: "brightstars", role: "parent" },
        ],
      };
    } else {
      mockUser = {
        id: "1",
        email,
        name: "John Doe",
        role: "instructor",
        schools: [
          { id: "1", name: "Bright Stars Academy", slug: "brightstars", role: "instructor" },
          { id: "2", name: "Excel Learning Center", slug: "excel", role: "instructor" },
        ],
      };
    }
    setUser(mockUser);
    setIsLoading(false);
  };

  // Laravel Inertia.js Integration:
  // Replace with: router.post('/register', data, {
  //   onSuccess: () => router.visit('/dashboard'),
  //   onError: (errors) => setErrors(errors)
  // })
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "1",
      email: data.email,
      name: data.name,
      role: data.role,
    };
    setUser(mockUser);
    setIsLoading(false);
  };

  // Laravel Inertia.js Integration:
  // Replace with: router.post('/logout')
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
