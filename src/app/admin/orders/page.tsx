"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await api.put(`/orders/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  });

  const handleUpdateStatus = (order: any, newStatus: string) => {
    updateMutation.mutate({ id: order._id, status: newStatus });
  };

  if (isLoading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage confirmed customer orders.</p>
      </div>

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order._id} className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h3 className="text-xl font-heading font-bold">{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  Customer: {order.customerId?.name} ({order.customerId?.companyName}) - {format(new Date(order.createdAt), 'dd MMM yyyy')}
                </p>
                {order.shippingAddress && (
                   <p className="text-xs text-muted-foreground mt-1">
                      Shipping to: {order.shippingAddress.address || order.shippingAddress}
                   </p>
                )}
              </div>
              <Badge variant="outline" className={
                order.status === 'Confirmed' || order.status === 'Quotation Accepted' || order.status === 'Pending Order' ? 'bg-success/10 text-success border-success/20' : 
                order.status === 'Dispatched' || order.status === 'Delivered' ? 'bg-primary/10 text-primary border-primary/20' :
                'bg-muted'
              }>
                {order.status}
              </Badge>
            </div>
            
            <div className="space-y-3 mb-6">
              {order.items.map((item: any, i: number) => (
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
               {order.totalAmount && (
                  <p className="font-semibold mb-4 text-lg">Total Amount: ₹{order.totalAmount}</p>
               )}

               <div className="flex gap-2 flex-wrap">
                  {(order.status === 'Quotation Accepted' || order.status === 'Pending Order') && (
                    <Button 
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleUpdateStatus(order, 'Confirmed')}
                      disabled={updateMutation.isPending}
                    >
                       Confirm Order
                    </Button>
                  )}
                  {order.status === 'Confirmed' && (
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateStatus(order, 'In Production')}
                      disabled={updateMutation.isPending}
                    >
                       Mark In Production
                    </Button>
                  )}
                  {order.status === 'In Production' && (
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateStatus(order, 'Dispatched')}
                      disabled={updateMutation.isPending}
                    >
                       Mark Dispatched
                    </Button>
                  )}
                  {order.status === 'Dispatched' && (
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleUpdateStatus(order, 'Delivered')}
                      disabled={updateMutation.isPending}
                    >
                       Mark Delivered
                    </Button>
                  )}
               </div>
            </div>
          </div>
        ))}
        {(!orders || orders.length === 0) && (
           <div className="text-center py-20 text-muted-foreground">No orders found.</div>
        )}
      </div>
    </div>
  );
}
