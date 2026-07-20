"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await api.get('/customers/favorites');
      return res.data;
    }
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 md:px-6 py-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <Heart size={24} className="fill-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold">Your Favorites</h1>
            <p className="text-muted-foreground text-sm mt-1">Products you've saved for later consideration.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border border-dashed">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Heart size={32} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-heading font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">Browse our catalog and tap the heart icon to save products you love.</p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-xl px-8 shadow-md">Explore Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
