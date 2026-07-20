"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowLeft, User, ShoppingBag, Heart, ShoppingCart, FileText, Plus, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

function InvoicesTab({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    totalAmount: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentOption: "Full",
    images: [] as string[]
  });
  const [imageUrl, setImageUrl] = useState("");

  const queryClient = useQueryClient();
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['adminInvoices'],
    queryFn: async () => {
      const res = await api.get('/invoices');
      return res.data.filter((inv: any) => inv.customerId?._id === customerId || inv.customerId === customerId);
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post('/invoices', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInvoices'] });
      setOpen(false);
      toast.success("Invoice created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      customerId,
      totalAmount: Number(formData.totalAmount)
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      toast.success("Image uploaded successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to upload image");
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-lg flex items-center gap-2"><FileText size={18} /> Invoices</h3>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <div className="inline-flex items-center justify-center rounded-lg h-9 px-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium transition-colors cursor-pointer">
              <Plus size={16} /> Generate Invoice
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-1">
                <Label>Invoice Number</Label>
                <Input required value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} placeholder="INV-2026-001" />
              </div>
              <div className="col-span-1">
                <Label>Invoice Date</Label>
                <Input type="date" required value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} />
              </div>
              <div className="col-span-1">
                <Label>Amount (₹)</Label>
                <Input type="number" required value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: e.target.value})} placeholder="0.00" />
              </div>
              <div className="col-span-1">
                <Label>Payment Option</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.paymentOption}
                  onChange={(e) => setFormData({...formData, paymentOption: e.target.value})}
                >
                  <option value="Full">Full Payment</option>
                  <option value="Advance">Advance</option>
                  <option value="Half">Half</option>
                </select>
              </div>
              
              <div className="col-span-2 mt-2">
                <Label>Upload Invoice Image</Label>
                <div className="flex gap-2 mt-1 items-center">
                  <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploadMutation.isPending} />
                  {uploadMutation.isPending && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
                </div>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden group border">
                        <Image src={img} alt="Invoice img" fill className="object-cover" />
                        <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create Invoice"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading invoices...</div>
      ) : invoices && invoices.length > 0 ? (
        <div className="space-y-4">
          {invoices.map((inv: any) => (
            <div key={inv._id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold">{inv.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">{new Date(inv.invoiceDate).toLocaleDateString()} • {inv.paymentOption} Payment</p>
                <p className="text-sm mt-1">Amount: ₹{inv.totalAmount}</p>
              </div>
              <div className="flex gap-2">
                {inv.images?.length > 0 && (
                   <span className="text-xs bg-muted px-2 py-1 rounded-md">{inv.images.length} Images attached</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
           <FileText className="mx-auto h-12 w-12 opacity-50 mb-4" />
           <p>No invoices generated for this customer.</p>
        </div>
      )}
    </div>
  );
}

export default function CustomerCRMPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("profile");

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await api.get(`/auth/customers/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 animate-pulse text-center text-muted-foreground">Loading CRM Data...</div>;
  if (!customer) return <div className="p-8 text-center text-destructive">Customer not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-semibold flex items-center gap-2">
            {customer.name}
            <Badge variant={customer.status === "Active" ? "default" : "outline"} className={customer.status === "Active" ? "bg-success hover:bg-success" : ""}>
              {customer.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">{customer.customerId} • {customer.companyName}</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border/50 pb-2">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><User size={16}/> Profile</div>
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><ShoppingBag size={16}/> Order History</div>
        </button>
        <button 
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${activeTab === "activity" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><Heart size={16}/> Activity & Cart</div>
        </button>
        <button 
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[9px] ${activeTab === "invoices" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <div className="flex items-center gap-2"><FileText size={16}/> Invoices</div>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-lg mb-4 border-b pb-2">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Email:</span> <span className="col-span-2 font-medium">{customer.email}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Phone:</span> <span className="col-span-2 font-medium">{customer.mobile}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Contact Person:</span> <span className="col-span-2 font-medium">{customer.contactPerson}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Joined:</span> <span className="col-span-2 font-medium">{new Date(customer.customerSince).toLocaleDateString()}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Last Login:</span> <span className="col-span-2 font-medium">{customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'Never'}</span></div>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-lg mb-4 border-b pb-2">Business Details</h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Company:</span> <span className="col-span-2 font-medium">{customer.companyName}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Type:</span> <span className="col-span-2 font-medium">{customer.businessType}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Customer Tier:</span> <span className="col-span-2 font-medium">{customer.customerType}</span></div>
                <div className="grid grid-cols-3"><span className="text-muted-foreground">Tags:</span> 
                  <div className="col-span-2 flex gap-1 flex-wrap">
                    {customer.tags && customer.tags.length > 0 ? customer.tags.map((t: string) => (
                      <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                    )) : <span className="text-muted-foreground italic">None</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6 shadow-sm col-span-1 md:col-span-2">
              <h3 className="font-heading font-semibold text-lg mb-4 border-b pb-2">Billing Address</h3>
              <div className="text-sm">
                <p className="font-medium">{customer.billingAddress?.receiverName}</p>
                <p>{customer.billingAddress?.address}</p>
                <p>{customer.billingAddress?.city}, {customer.billingAddress?.state} {customer.billingAddress?.pin}</p>
                <p>{customer.billingAddress?.country}</p>
                <p className="mt-2 text-muted-foreground">Phone: {customer.billingAddress?.mobile}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Order History</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">This customer has not submitted any order requests or quotations yet. Once they do, they will appear here in detail.</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-lg mb-4 border-b pb-2 flex items-center gap-2"><ShoppingCart size={18} /> Active Cart</h3>
              {customer.cart && customer.cart.length > 0 ? (
                <div className="space-y-4">
                  {customer.cart.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-center border-b pb-3 last:border-0 last:pb-0">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <ShoppingBag size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productId?.name || 'Unknown Product'}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 italic">Cart is currently empty.</p>
              )}
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-lg mb-4 border-b pb-2 flex items-center gap-2"><Heart size={18} /> Favorites Wishlist</h3>
              {customer.favorites && customer.favorites.length > 0 ? (
                <div className="space-y-4">
                  {customer.favorites.map((fav: any, i: number) => (
                    <div key={i} className="flex gap-4 items-center border-b pb-3 last:border-0 last:pb-0">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Heart size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{fav.name || 'Unknown Product'}</p>
                        <p className="text-xs text-muted-foreground">{fav.sku}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 italic">No favorited items yet.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === "invoices" && (
          <InvoicesTab customerId={id} />
        )}
      </div>
    </div>
  );
}
