"use client";

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any>(null);
  
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "Retailer",
    tags: "",
    username: "",
    tempPassword: "",
  });

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const { data: customers, isLoading } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/auth/customers');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (customerData: any) => {
      return await api.put(`/auth/customers/${customerData._id}`, customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      setEditCustomer(null);
      toast.success("Customer updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
    }
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    updateMutation.mutate({
      _id: editCustomer._id,
      name: editCustomer.name,
      companyName: editCustomer.companyName,
      companyType: editCustomer.companyType || editCustomer.businessType,
      email: editCustomer.email,
      phone: editCustomer.phone || editCustomer.mobile,
      status: editCustomer.status,
      tags: editCustomer.tags ? (Array.isArray(editCustomer.tags) ? editCustomer.tags : editCustomer.tags.split(',').map((t: string) => t.trim())) : []
    });
  };

  const createMutation = useMutation({
    mutationFn: async (newCustomer: any) => {
      return await api.post('/auth/customers', newCustomer);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      setAddOpen(false);
      toast.success(`Customer created! Temp Password: ${res.data.tempPassword}`);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", companyName: "", companyType: "Retailer", tags: "", username: "", tempPassword: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    };
    createMutation.mutate(payload);
  };

  const filteredCustomers = customers?.filter((c: any) => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">Customers</h1>
        
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus size={16} /> Add Customer
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label>First Name</Label>
                <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => {
                    const newEmail = e.target.value;
                    setFormData(prev => ({
                      ...prev, 
                      email: newEmail,
                      // Auto-suggest username if it was empty or matched the old email
                      username: (!prev.username || prev.username === prev.email) ? newEmail : prev.username,
                      // Auto-suggest a password if empty
                      tempPassword: !prev.tempPassword ? generatePassword() : prev.tempPassword
                    }));
                  }} 
                  required 
                />
              </div>
              <div className="col-span-1">
                <Label>Username</Label>
                <Input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required placeholder="Auto-generated from email" />
              </div>
              <div className="col-span-1">
                <Label>Temporary Password</Label>
                <div className="flex gap-2">
                  <Input value={formData.tempPassword} onChange={e => setFormData({...formData, tempPassword: e.target.value})} required />
                  <Button type="button" variant="outline" onClick={() => setFormData({...formData, tempPassword: generatePassword()})}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <Label>Phone</Label>
                <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
              </div>
              <div>
                <Label>Business Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.companyType} 
                  onChange={e => setFormData({...formData, companyType: e.target.value})} 
                  required
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Corporate Buyer">Corporate Buyer</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="VIP, International, Priority" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Create Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, company, email..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={7} className="text-center py-8">Loading customers...</TableCell></TableRow>
            ) : filteredCustomers.length === 0 ? (
               <TableRow><TableCell colSpan={7} className="text-center py-8">No customers found.</TableCell></TableRow>
            ) : (
              filteredCustomers.map((c: any) => (
                <TableRow key={c._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                      {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.companyName}</TableCell>
                  <TableCell>{c.companyType}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Active" ? "default" : "outline"} className={c.status === "Active" ? "bg-success hover:bg-success" : ""}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => router.push(`/admin/customers/${c._id}`)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => setEditCustomer({...c, companyType: c.businessType, phone: c.mobile, tags: c.tags?.join(', ')})}>
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={(open) => !open && setEditCustomer(null)}>
        {editCustomer && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Customer: {editCustomer.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input value={editCustomer.name} onChange={e => setEditCustomer({...editCustomer, name: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <Input type="email" value={editCustomer.email} onChange={e => setEditCustomer({...editCustomer, email: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <Label>Phone</Label>
                <Input type="tel" value={editCustomer.phone} onChange={e => setEditCustomer({...editCustomer, phone: e.target.value})} required />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input value={editCustomer.companyName} onChange={e => setEditCustomer({...editCustomer, companyName: e.target.value})} required />
              </div>
              <div>
                <Label>Business Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={editCustomer.companyType} 
                  onChange={e => setEditCustomer({...editCustomer, companyType: e.target.value})} 
                  required
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Corporate Buyer">Corporate Buyer</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={editCustomer.status} 
                  onChange={e => setEditCustomer({...editCustomer, status: e.target.value})} 
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input value={editCustomer.tags} onChange={e => setEditCustomer({...editCustomer, tags: e.target.value})} placeholder="VIP, International, Priority" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
}
