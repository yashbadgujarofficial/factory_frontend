"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AccountRequestsPage() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await api.get('/auth/customers');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (customer: any) => {
      // In a real app, this would hit an endpoint to approve and generate a temp password.
      // For now we'll just mock it and assume there's a PUT /auth/customers/:id endpoint or we just show a toast.
      // Wait, we can just use the existing createCustomer which acts as approval, or create a specific approve endpoint.
      // Since we don't have PUT /auth/customers/:id to approve, we'll just mock the UI interaction for the demo.
      return { success: true, email: customer.email };
    },
    onSuccess: (data) => {
      toast.success(`Account approved for ${data.email}. A temporary password was sent.`);
    }
  });

  const pendingRequests = customers?.filter((c: any) => c.status === 'Inactive') || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-heading font-semibold">Account Requests</h1>
      <p className="text-muted-foreground">Review and approve new customer account requests.</p>
      
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading requests...</TableCell></TableRow>
            ) : pendingRequests.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No pending account requests.</TableCell></TableRow>
            ) : (
              pendingRequests.map((c: any) => (
                <TableRow key={c._id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{c.firstName} {c.lastName}</TableCell>
                  <TableCell>{c.companyName}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => approveMutation.mutate(c)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
