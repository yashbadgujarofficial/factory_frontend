"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  businessType?: string;
  gstNumber?: string;
  mobile?: string;
  status?: string;
  customerSince?: string;
  lastLogin?: string;
  customerId?: string;
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    country: string;
    pin: string;
  };
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children, authType = 'customer' }: { children: React.ReactNode, authType?: 'admin' | 'customer' }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = authType === 'admin' ? '/auth/admin/me' : '/auth/me';
        const res = await api.get(endpoint);
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [authType]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      window.location.href = authType === 'admin' ? '/admin/login' : '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
