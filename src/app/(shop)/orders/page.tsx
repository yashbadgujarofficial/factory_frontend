"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function QuotationCartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/customers/cart');
      return res.data;
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await api.delete(`/customers/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Item removed from quotation");
    }
  });

  const [address, setAddress] = useState("");

  const submitMutation = useMutation({
    mutationFn: async (shippingAddress: string) => {
      return await api.post('/customers/orders', { address: shippingAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Quotation request submitted successfully!");
      router.push('/profile'); // Redirect to profile to see order status
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit request");
    }
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 md:px-6 py-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold">Quotation Request</h1>
            <p className="text-muted-foreground text-sm mt-1">Review your selected products before submitting to the factory.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
             <Skeleton className="h-32 w-full rounded-2xl" />
             <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : !cart || cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border border-dashed">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShoppingBag size={32} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-heading font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">Browse our catalog to add products for your custom B2B quotation.</p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-xl px-8 shadow-md">Explore Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-4">
              {cart.map((item: any) => {
                const p = item.productId;
                if (!p) return null;
                const img = p.media?.images?.[0]?.url || "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=200&auto=format&fit=crop";
                
                return (
                  <div key={p._id} className="flex gap-4 p-4 bg-card border rounded-2xl shadow-sm relative group">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 bg-muted">
                      <Image src={img} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <Link href={`/product/${p.productId}`} className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                        {p.name}
                      </Link>
                      <p className="text-sm text-muted-foreground font-mono mb-2">{p.sku}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-auto">
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">{p.material}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">{p.color}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-sm font-medium">Qty: {item.quantity} {p.unit}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeMutation.mutate(p._id)}
                      disabled={removeMutation.isPending}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )
              })}
            </div>
            
            <div className="w-full lg:w-1/3">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-6 sticky top-28">
                <h3 className="font-heading font-semibold text-xl mb-4">Request Summary</h3>
                
                <div className="flex justify-between items-center py-3 border-b border-primary/10">
                  <span className="text-muted-foreground">Total Products</span>
                  <span className="font-semibold text-lg">{cart.length}</span>
                </div>
                
                <div className="py-4 border-b border-primary/10">
                  <label className="block text-sm font-medium mb-2 text-foreground">Shipping Address</label>
                  <textarea 
                    className="w-full h-24 p-3 text-sm rounded-xl border bg-background/50 focus:bg-background focus:ring-1 focus:ring-primary/50 outline-none" 
                    placeholder="Enter your complete delivery address (optional if saved in profile)..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="py-4 text-sm text-muted-foreground leading-relaxed">
                  Submitting this request will send your selected items directly to our factory team. We will review your requirements and provide a detailed quotation including volume discounts and shipping logistics within 24 hours.
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full h-14 mt-4 rounded-2xl text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
                  onClick={() => submitMutation.mutate(address)}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting Request..." : "Submit Quotation Request"} <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
