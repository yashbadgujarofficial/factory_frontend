"use client";

import { useState, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useSearchParams } from "next/navigation";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");

  const [search, setSearch] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    }
  });

  // Dynamically compute categories and materials from products
  const { categories, materials } = useMemo(() => {
    if (!products) return { categories: [], materials: [] };
    
    const catMap = new Map<string, number>();
    const matSet = new Set<string>();

    products.forEach((p: any) => {
      if (p.category) {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      }
      if (p.material) {
        matSet.add(p.material);
      }
    });

    return {
      categories: Array.from(catMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name)),
      materials: Array.from(matSet).sort()
    };
  }, [products]);

  const filteredProducts = products?.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          p.material.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 md:px-6 py-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Our Catalog</h1>
          <p className="text-muted-foreground">Showing {filteredProducts.length} handcrafted products</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 h-10 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          <Button variant="outline" className="h-10 rounded-xl gap-2">
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6 hidden md:block">
          <div>
            <h3 className="font-heading font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li 
                className={`font-medium flex justify-between cursor-pointer transition-colors ${selectedCategory === null ? 'text-primary' : 'hover:text-foreground'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <span>All Products</span> 
                <span>{products?.length || 0}</span>
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.name}
                  className={`transition-colors flex justify-between cursor-pointer ${selectedCategory === cat.name ? 'text-primary font-medium' : 'hover:text-foreground'}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.name}</span> 
                  <span>{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-6">
            <h3 className="font-heading font-semibold mb-3">Materials</h3>
            <div className="flex flex-wrap gap-2">
              {materials.map(mat => (
                <div key={mat} className="px-3 py-1.5 rounded-full border text-xs text-muted-foreground cursor-pointer hover:bg-muted hover:text-foreground transition-colors">
                  {mat}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed">
              <h3 className="text-xl font-heading font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
              <Button variant="outline" onClick={() => { setSearch(""); setSelectedCategory(null); }}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted-foreground">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
