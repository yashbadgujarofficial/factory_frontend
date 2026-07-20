"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ChevronLeft, ArrowRight, Share2, Ruler, Box, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data;
    }
  });

  const cartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      return await api.post('/customers/cart', {
        productId: product._id,
        quantity: product.moq || 1
      });
    },
    onSuccess: () => toast.success("Added to Quotation Request"),
    onError: () => toast.error("Please login to add to quotation")
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      return await api.post(`/customers/favorites/${product._id}`);
    },
    onSuccess: (res: any) => toast.success(res.data.message || "Updated Favorites ❤️"),
    onError: () => toast.error("Please login to save favorites")
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
           <Skeleton className="h-8 w-32 mb-8" />
           <div className="flex flex-col lg:flex-row gap-12">
             <div className="flex-1 space-y-4">
                <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-xl" />
                  <Skeleton className="w-24 h-24 rounded-xl" />
                </div>
             </div>
             <div className="flex-1 space-y-6 pt-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
             </div>
           </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (isError || !product) {
    return (
      <ProtectedRoute>
         <div className="container mx-auto px-4 py-32 text-center">
            <h2 className="text-3xl font-heading font-semibold mb-3">Product not found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">The product you are looking for might have been removed, its name changed, or is temporarily unavailable.</p>
            <Button size="lg" onClick={() => router.push('/catalog')} className="rounded-full px-8">Back to Catalog</Button>
         </div>
      </ProtectedRoute>
    )
  }

  const images = product.media?.images?.length > 0 ? product.media.images : [{ url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=800&auto=format&fit=crop" }];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl animate-in fade-in duration-500 pb-20">
        
        {/* Breadcrumb / Back button */}
        <Link href="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
          <ChevronLeft size={16} className="mr-1" /> Back to Catalog
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-muted border shadow-sm group">
              <Image 
                src={images[activeImage].url} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                 <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm hover:scale-105">
                   <Share2 size={18} />
                 </button>
                 <button onClick={() => favoriteMutation.mutate()} disabled={favoriteMutation.isPending} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-red-50 transition-all shadow-sm hover:scale-105">
                   <Heart size={18} />
                 </button>
              </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary ring-2 ring-primary/20 ring-offset-2 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95 bg-muted'}`}
                  >
                    <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-[45%] flex flex-col">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary text-primary-foreground font-medium rounded-full px-3 py-1 text-xs">{product.category}</Badge>
                {product.flags?.isBestSeller && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1 rounded-full text-xs">Bestseller</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-4 text-foreground tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground bg-muted/30 w-fit px-4 py-2 rounded-lg border border-border/50">
                <span className="flex items-center gap-2"><span className="text-xs uppercase font-sans tracking-wider font-semibold">Code</span> <span className="text-foreground font-medium">{product.productCode}</span></span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-2"><span className="text-xs uppercase font-sans tracking-wider font-semibold">SKU</span> <span>{product.sku}</span></span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm md:prose-base text-muted-foreground mb-8">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-card border rounded-2xl p-4 flex flex-col justify-center gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center gap-1.5"><Box size={12}/> Material</span>
                <span className="font-semibold text-foreground text-sm">{product.material}</span>
              </div>
              <div className="bg-card border rounded-2xl p-4 flex flex-col justify-center gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center gap-1.5"><Box size={12}/> Finish & Color</span>
                <span className="font-semibold text-foreground text-sm">{product.finish}, {product.color}</span>
              </div>
              <div className="bg-card border rounded-2xl p-4 flex flex-col justify-center gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center gap-1.5"><Ruler size={12}/> Dimensions</span>
                <span className="font-semibold text-foreground text-sm">{product.size}</span>
              </div>
              <div className="bg-card border rounded-2xl p-4 flex flex-col justify-center gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center gap-1.5"><Clock size={12}/> Production Time</span>
                <span className="font-semibold text-foreground text-sm">{product.productionTime}</span>
              </div>
            </div>

            {/* B2B Action Box */}
            <div className="bg-gradient-to-br from-muted/50 to-muted/20 border rounded-3xl p-6 md:p-8 mt-auto shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Minimum Order</p>
                  <p className="text-3xl font-bold flex items-baseline gap-1.5 text-foreground">
                    {product.moq} <span className="text-lg font-medium text-muted-foreground">{product.unit}s</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Packaging</p>
                  <p className="font-semibold text-foreground flex items-center justify-end gap-1">{product.packagingType}</p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 gap-2"
                onClick={() => cartMutation.mutate()}
                disabled={cartMutation.isPending}
              >
                {cartMutation.isPending ? "Adding..." : "Add to Quotation"} <ArrowRight size={18} />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4 px-4 leading-relaxed">
                Prices will be provided in your personalized quotation based on volume and shipping requirements.
              </p>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
