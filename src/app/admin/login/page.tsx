"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { emailOrUsername: email, password });
      
      if (res.data.role === 'Customer') {
        toast.error("Customers cannot access the Admin portal.");
        await api.post('/auth/logout'); // force logout if they got a customer token
        setIsLoading(false);
        return;
      }

      if (res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
      }
      login(res.data);
      toast.success("Welcome to the Admin Portal");
      window.location.href = '/admin';
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="w-full max-w-sm p-8 bg-card text-card-foreground rounded-2xl border border-sidebar-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight text-primary">Factory CMS</h1>
          <p className="text-sm text-muted-foreground">Staff & Administrator Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@factory.com"
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full mt-4 h-11 text-base" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Access Portal"}
          </Button>
        </form>
      </div>
    </div>
  );
}
