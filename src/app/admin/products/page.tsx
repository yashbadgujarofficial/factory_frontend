"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash, X } from "lucide-react";
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

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCodeEdited, setIsCodeEdited] = useState(false);

  const queryClient = useQueryClient();

  const emptyForm = {
    name: "",
    productCode: "",
    category: "",
    description: "",
    material: "",
    finish: "",
    color: "",
    size: "",
    moq: 10,
    unit: "Piece",
    productionTime: "15-20 days",
    packagingType: "Standard",
    images: [] as {url: string, publicId: string}[]
  };

  const [formData, setFormData] = useState<any>(emptyForm);
  const [uploading, setUploading] = useState(false);

  // Auto-suggest product code
  useEffect(() => {
    if (!isEditMode && !isCodeEdited && formData.name) {
      const suggested = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '-').substring(0, 8);
      setFormData((prev: any) => ({ ...prev, productCode: suggested ? `${suggested}-001` : '' }));
    }
  }, [formData.name, isEditMode, isCodeEdited]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      return await api.post('/products', newProduct);
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProduct: any) => {
      return await api.put(`/products/${selectedProduct._id}`, updatedProduct);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      media: {
        images: formData.images
      }
    };
    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setIsEditMode(false);
    setIsCodeEdited(false);
    setOpen(true);
  };

  const openEdit = (product: any) => {
    setFormData({
      ...product,
      images: product.media?.images || []
    });
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsCodeEdited(true); // Don't auto-suggest on edit
    setOpen(true);
  };

  const openView = (product: any) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">Products</h1>
        
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* New/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 sm:col-span-1">
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label>Product Code</Label>
              <Input 
                value={formData.productCode} 
                onChange={e => {
                  setFormData({...formData, productCode: e.target.value});
                  setIsCodeEdited(true);
                }} 
                required 
                placeholder="e.g. CHR-001" 
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            </div>
            <div>
              <Label>Material</Label>
              <Input value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} required />
            </div>
            <div>
              <Label>Color</Label>
              <Input value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} required />
            </div>
            <div>
              <Label>Size</Label>
              <Input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} required />
            </div>
            <div>
              <Label>Finish</Label>
              <Input value={formData.finish} onChange={e => setFormData({...formData, finish: e.target.value})} required />
            </div>
            <div>
              <Label>MOQ</Label>
              <Input type="number" value={formData.moq || ''} onChange={e => setFormData({...formData, moq: e.target.value === '' ? '' : parseInt(e.target.value)})} required />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            
            <div className="col-span-2">
              <Label>Product Images (Select multiple)</Label>
              <div className="mt-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    
                    setUploading(true);
                    
                    for(let i=0; i<files.length; i++) {
                      const fd = new FormData();
                      fd.append('image', files[i]);
                      try {
                        const res = await api.post('/upload', fd, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        setFormData((prev: any) => ({
                          ...prev, 
                          images: [...prev.images, { url: res.data.url, publicId: res.data.publicId }]
                        }));
                      } catch (error: any) {
                        toast.error("One or more images failed to upload");
                      }
                    }
                    setUploading(false);
                    // Reset input so the same files can be selected again if needed
                    e.target.value = '';
                  }} 
                  disabled={uploading}
                />
                {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading images...</p>}
              </div>
              
              {formData.images?.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.images.map((img: any, idx: number) => (
                    <div key={idx} className="relative group p-2 border rounded bg-muted/30 aspect-square flex items-center justify-center">
                      <img src={img.url} alt="Preview" className="max-h-full object-contain rounded" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{selectedProduct.productCode} • {selectedProduct.sku}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Material</p>
                  <p className="font-medium">{selectedProduct.material}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Finish</p>
                  <p className="font-medium">{selectedProduct.finish}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Color & Size</p>
                  <p className="font-medium">{selectedProduct.color} • {selectedProduct.size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">MOQ</p>
                  <p className="font-medium">{selectedProduct.moq} {selectedProduct.unit}s</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Description</p>
                  <p className="font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Product Images</h3>
                {selectedProduct.media?.images?.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {selectedProduct.media.images.map((img: any, idx: number) => (
                      <div key={idx} className="border rounded bg-muted/30 aspect-square flex items-center justify-center p-2">
                         <img src={img.url} alt="Product" className="max-h-full object-contain rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No images available for this product.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, SKU..." 
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
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>MOQ</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading products...</TableCell></TableRow>
            ) : products?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No products found. Add one!</TableCell></TableRow>
            ) : (
              products?.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())).map((p: any) => (
                <TableRow key={p._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.material}</TableCell>
                  <TableCell>{p.moq} {p.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openView(p)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => openEdit(p)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                        if(window.confirm('Are you sure you want to delete this product?')) deleteMutation.mutate(p._id);
                      }}>
                        <Trash size={16} />
                      </Button>
                    </div>
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
