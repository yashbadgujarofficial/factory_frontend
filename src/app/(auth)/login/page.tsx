"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Request Account State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "Retailer"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { emailOrUsername: email, password });
      login(res.data);
      toast.success("Welcome back!");
      window.location.href = res.data.role === 'Customer' ? '/home' : '/admin';
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/request-account', formData);
      toast.success(res.data.message);
      setIsLogin(true); // Switch back to login
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl border shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading font-bold text-2xl tracking-tight text-primary">Factory</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold mb-2">
            {isLogin ? "Welcome Back" : "Request an Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Sign in to your account to view our catalog" : "Fill out the form below to request access"}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2">Sign In</Button>
          </form>
        ) : (
          <form onSubmit={handleRequest} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
            </div>
            <Button type="submit" className="w-full mt-2">Submit Request</Button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          {isLogin ? (
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-primary font-medium hover:underline">
                Request one
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-primary font-medium hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
