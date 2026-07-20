"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { User, Building, MapPin, Mail, Phone, Calendar, Clock, Download, FileText, CheckCircle2, Package, Search } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function OrdersTab({ type = "orders" }: { type?: "orders" | "quotations" }) {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ['customerItems', type],
    queryFn: async () => {
      // Re-using the same endpoint, but we can filter on frontend or backend
      // It's cleaner to filter on frontend here if the backend doesn't have a split customer endpoint
      const res = await api.get('/customers/orders');
      const orderStatuses = [
        'Quotation Accepted', 'Pending Order', 'Approved', 'Rejected', 
        'In Production', 'Quality Check', 'Packed', 'Dispatched', 'Delivered', 
        'Completed', 'Cancelled', 'Confirmed'
      ];
      
      const quotationStatuses = [
        'Draft', 'Pending Review', 'Awaiting Customer Response', 
        'Quotation Sent', 'Quotation Provided'
      ];

      return res.data.filter((item: any) => 
        type === "orders" ? orderStatuses.includes(item.status) : quotationStatuses.includes(item.status)
      );
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await api.put(`/customers/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ['customerItems'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  });

  if (isLoading) return <div className="py-10 text-center">Loading...</div>;
  if (!items || items.length === 0) return <div className="py-10 text-center text-muted-foreground">No {type} found.</div>;

  return (
    <div className="space-y-6">
      {items.map((item: any) => (
        <div key={item._id} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-heading font-bold">{item.orderNumber}</h3>
              <p className="text-sm text-muted-foreground">{format(new Date(item.createdAt), 'dd MMM yyyy')}</p>
            </div>
            <Badge variant="outline" className={
              item.status === 'Quotation Provided' ? 'bg-primary/10 text-primary border-primary/20' : 
              item.status === 'Pending Review' ? 'bg-warning/10 text-warning border-warning/20' : 
              item.status === 'Accepted' || item.status === 'Confirmed Order' || item.status === 'Pending Order' ? 'bg-success/10 text-success border-success/20' : 
              'bg-muted'
            }>
              {item.status}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {item.items.map((prod: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{prod.quantity} x {prod.productCode || prod.sku}</span>
              </div>
            ))}
          </div>

          {item.status === 'Quotation Provided' && (
            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quoted Amount</p>
                <p className="text-2xl font-bold">₹{item.totalAmount}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateStatus.mutate({ id: item._id, status: 'Rejected' })}>Reject</Button>
                <Button className="bg-success hover:bg-success/90" onClick={() => updateStatus.mutate({ id: item._id, status: 'Accepted' })}>Accept & Place Order</Button>
              </div>
            </div>
          )}

          {(item.status === 'Pending Order' || item.status === 'Confirmed' || item.status === 'Quotation Accepted') && item.totalAmount && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">₹{item.totalAmount}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InvoicesTab() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['customerInvoices'],
    queryFn: async () => {
      const res = await api.get('/invoices/customer');
      return res.data;
    }
  });

  if (isLoading) return <div className="py-10 text-center">Loading invoices...</div>;
  if (!invoices || invoices.length === 0) return <div className="py-10 text-center text-muted-foreground">No invoices found.</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {invoices.map((invoice: any) => (
        <div key={invoice._id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Invoice No.</p>
              <h3 className="text-xl font-heading font-bold">{invoice.invoiceNumber}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-medium">{format(new Date(invoice.date), 'dd MMM yyyy')}</p>
            </div>
          </div>
          
          {invoice.images && invoice.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {invoice.images.map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
                  <Image src={img} alt={`Invoice ${i+1}`} fill className="object-cover" />
                  <a href={img} download target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 w-8 h-8 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                    <Download size={14} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-8 bg-muted/30 rounded-xl mb-6 flex items-center justify-center border border-dashed">
                <span className="text-muted-foreground text-sm">No images attached</span>
             </div>
          )}
          
          <div className="mt-auto">
            <Button variant="outline" className="w-full gap-2" asChild>
              <a href={invoice.images?.[0]} target="_blank" rel="noreferrer">
                <FileText size={16} /> View First Document
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CustomerProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        
        {/* Profile Header */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-sidebar">
          <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-end gap-8">
            <FadeIn>
              <div className="w-32 h-32 rounded-[2rem] bg-primary flex items-center justify-center text-primary-foreground text-5xl font-heading font-bold shadow-2xl border-4 border-sidebar">
                {user.name.charAt(0)}
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-sidebar-foreground tracking-tight">{user.name}</h1>
                {user.status === 'Active' && (
                  <span className="flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-success/20 text-success border border-success/30 backdrop-blur-md">
                    <CheckCircle2 size={14} /> Active
                  </span>
                )}
              </div>
              <p className="text-xl text-sidebar-foreground/70 font-light flex items-center gap-2">
                <Building size={20} className="text-accent" />
                {user.companyName || "Independent Client"} 
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 md:px-6 py-12 -mt-16 relative z-20">
          <Tabs defaultValue="orders" className="w-full">
            <div className="bg-card p-2 rounded-2xl border shadow-sm w-max mb-8 inline-block">
              <TabsList className="bg-transparent h-auto p-0 gap-2">
                <TabsTrigger value="orders" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">
                  <Package className="w-4 h-4 mr-2" /> Orders
                </TabsTrigger>
                <TabsTrigger value="quotations" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">
                  <FileText className="w-4 h-4 mr-2" /> Quotations
                </TabsTrigger>
                <TabsTrigger value="invoices" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">
                  <FileText className="w-4 h-4 mr-2" /> Invoices
                </TabsTrigger>
                <TabsTrigger value="details" className="px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">
                  <User className="w-4 h-4 mr-2" /> Profile Details
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="orders" className="mt-0">
              <SlideUp>
                <OrdersTab type="orders" />
              </SlideUp>
            </TabsContent>

            <TabsContent value="quotations" className="mt-0">
              <SlideUp>
                <OrdersTab type="quotations" />
              </SlideUp>
            </TabsContent>

            <TabsContent value="invoices" className="mt-0">
              <SlideUp>
                <InvoicesTab />
              </SlideUp>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <div className="grid md:grid-cols-2 gap-8">
                <SlideUp delay={0.1}>
                  <div className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
                    <h3 className="text-xl font-heading font-bold flex items-center gap-2 mb-6">
                      <User size={20} className="text-primary" /> Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Mail size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                          <p className="font-medium text-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Phone size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium text-foreground">{user.mobile || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideUp>

                <SlideUp delay={0.2}>
                  <div className="bg-card rounded-3xl p-8 border shadow-sm">
                    <h3 className="text-xl font-heading font-bold flex items-center gap-2 mb-6">
                      <MapPin size={20} className="text-primary" /> Billing Address
                    </h3>
                    
                    {user.billingAddress ? (
                      <div className="space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground mb-2">{user.billingAddress.address}</p>
                        <p>{user.billingAddress.city}, {user.billingAddress.state}</p>
                        <p>{user.billingAddress.country} - {user.billingAddress.pin}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No billing address saved.</p>
                    )}
                  </div>
                </SlideUp>
              </div>
            </TabsContent>
          </Tabs>
        </section>

      </div>
    </ProtectedRoute>
  );
}
