"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function QuotationsPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState<string>("");

  const { data: quotations, isLoading } = useQuery({
    queryKey: ['adminQuotations'],
    queryFn: async () => {
      const res = await api.get('/orders/quotations');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, totalAmount, status }: { id: string, totalAmount?: number, status: string }) => {
      return await api.put(`/orders/${id}`, { totalAmount, status });
    },
    onSuccess: () => {
      toast.success("Quotation updated successfully");
      queryClient.invalidateQueries({ queryKey: ['adminQuotations'] });
      setSelectedOrder(null);
      setAmount("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update quotation");
    }
  });

  const handleProvideQuotation = (quotation: any) => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }
    updateMutation.mutate({ id: quotation._id, totalAmount: Number(amount), status: 'Quotation Provided' });
  };

  const handleReject = (quotation: any) => {
    updateMutation.mutate({ id: quotation._id, status: 'Rejected' });
  };

  if (isLoading) return <div className="p-8">Loading quotations...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Quotations</h1>
        <p className="text-muted-foreground">Manage and respond to customer quotation requests.</p>
      </div>

      <div className="space-y-4">
        {quotations?.map((quotation: any) => (
          <div key={quotation._id} className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h3 className="text-xl font-heading font-bold">{quotation.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  Customer: {quotation.customerId?.name} ({quotation.customerId?.companyName}) - {format(new Date(quotation.createdAt), 'dd MMM yyyy')}
                </p>
                {quotation.shippingAddress && (
                   <p className="text-xs text-muted-foreground mt-1">
                      Shipping to: {quotation.shippingAddress.address || quotation.shippingAddress}
                   </p>
                )}
              </div>
              <Badge variant="outline" className={
                quotation.status === 'Quotation Provided' ? 'bg-primary/10 text-primary border-primary/20' : 
                quotation.status === 'Pending Review' ? 'bg-warning/10 text-warning border-warning/20' : 
                'bg-muted'
              }>
                {quotation.status}
              </Badge>
            </div>
            
            <div className="space-y-3 mb-6">
              {quotation.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm bg-muted/50 p-3 rounded-lg">
                  <span className="font-medium">{item.quantity} x {item.productCode || item.sku}</span>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Mat: {item.material} | Col: {item.color} | Fin: {item.finish}</p>
                    {item.customizationNotes && <p>Notes: {item.customizationNotes}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
               {quotation.totalAmount && (
                  <p className="font-semibold mb-4">Quoted Amount: ₹{quotation.totalAmount}</p>
               )}

               {(quotation.status === 'Pending Review' || quotation.status === 'Draft' || quotation.status === 'Quotation Sent') && (
                 <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <div className="flex-1">
                       <label className="text-sm font-medium mb-1 block">Set Quotation Amount (₹)</label>
                       <Input 
                         type="number" 
                         placeholder="Enter total amount..." 
                         value={selectedOrder === quotation._id ? amount : ""}
                         onChange={(e) => {
                            setSelectedOrder(quotation._id);
                            setAmount(e.target.value);
                         }}
                         className="bg-white"
                       />
                    </div>
                    <Button 
                      className="mt-6"
                      onClick={() => handleProvideQuotation(quotation)}
                      disabled={updateMutation.isPending || selectedOrder !== quotation._id}
                    >
                       Send Quotation
                    </Button>
                    <Button 
                      variant="destructive"
                      className="mt-6"
                      onClick={() => handleReject(quotation)}
                      disabled={updateMutation.isPending}
                    >
                       Reject
                    </Button>
                 </div>
               )}
            </div>
          </div>
        ))}
        {(!quotations || quotations.length === 0) && (
           <div className="text-center py-20 text-muted-foreground">No quotation requests found.</div>
        )}
      </div>
    </div>
  );
}
