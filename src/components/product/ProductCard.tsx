import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function ProductCard({ product }: { product: any }) {
  const queryClient = useQueryClient();
  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/customers/favorites');
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });

  const isFavorite = favorites?.some((fav: any) => fav._id === product._id || fav === product._id) || false;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.post(`/customers/favorites/${product._id}`);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      if (!isFavorite) {
        toast.success("Added to Favorites ❤️");
      } else {
        toast.info("Removed from Favorites");
      }
    } catch (err) {
      toast.error("Please login to save favorites.");
    }
  };

  // Use a placeholder if no media is provided
  const imageUrl = product.media?.images?.[0]?.url || "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600&auto=format&fit=crop";

  return (
    <Link href={`/product/${product.productId}`} className="group relative flex flex-col bg-card rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-accent overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.flags?.isNewArrival && (
          <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border-none">New</Badge>
        )}
        {product.flags?.isBestSeller && (
          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border-none">Bestseller</Badge>
        )}
      </div>

      {/* Heart */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shadow-sm"
      >
        <Heart size={16} className={isFavorite ? "fill-destructive text-destructive" : ""} />
      </button>

      {/* Image */}
      <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted">
        <Image 
          src={imageUrl} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-lg line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mb-3">{product.sku}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="text-[10px] bg-secondary/50 font-normal">{product.material}</Badge>
          <Badge variant="outline" className="text-[10px] bg-secondary/50 font-normal">{product.finish}</Badge>
          <Badge variant="outline" className="text-[10px] bg-secondary/50 font-normal">{product.color}</Badge>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-medium">MOQ</span>
            <span className="text-sm font-semibold">{product.moq} {product.unit}</span>
          </div>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
