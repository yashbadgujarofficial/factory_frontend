"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    }
  });

  const collections = useMemo(() => {
    if (!products) return [];
    const catMap = new Map<string, { count: number, image: string }>();

    products.forEach((p: any) => {
      if (p.category) {
        const existing = catMap.get(p.category);
        const img = p.media?.images?.[0]?.url;
        if (existing) {
          existing.count += 1;
          if (!existing.image && img) existing.image = img;
        } else {
          catMap.set(p.category, { count: 1, image: img || "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600&auto=format&fit=crop" });
        }
      }
    });

    return Array.from(catMap.entries()).map(([name, data]) => ({ name, ...data }));
  }, [products]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 md:px-6 py-12 animate-in fade-in duration-500">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Curated Collections</h1>
          <p className="text-muted-foreground text-lg">
            Explore our beautifully crafted B2B collections organized by category. From handcrafted furniture to delicate decor, find exactly what your business needs.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[300px] w-full rounded-[2rem]" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No collections found. Add products with categories to populate this page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col, idx) => (
              <Link 
                key={idx} 
                href={`/catalog?category=${encodeURIComponent(col.name)}`} 
                className="group flex flex-col relative overflow-hidden rounded-[2rem] bg-card border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
                  <Image 
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col items-center text-center transform transition-transform duration-500">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">{col.name}</h2>
                    <p className="text-white/80 text-sm font-medium mb-6">{col.count} Products</p>
                    <div className="inline-flex items-center gap-2 text-white font-medium opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Explore Collection <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
