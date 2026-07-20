"use client";

import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { HoverLift } from "@/components/animations/MotionWrappers";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await api.get('/settings/homepage');
      return res.data;
    }
  });
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <HoverLift>
            <Link href={user ? "/home" : "/"} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-lg group-hover:scale-105 transition-transform">
                {(settings?.companyName || "F")[0]}
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-foreground">{settings?.companyName || "Factory"}</span>
            </Link>
          </HoverLift>
          
          <nav className="hidden md:flex gap-8 ml-8">
            <Link href={user ? "/home" : "/"} className="text-sm font-medium hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/collections" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:block group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="search" 
              placeholder="Search products..." 
              className="w-full sm:w-[200px] pl-9 h-9 rounded-full bg-muted/50 border-none outline-none focus:bg-background focus:ring-1 focus:ring-primary/50 text-sm transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                   window.location.href = `/catalog?search=${encodeURIComponent(e.currentTarget.value)}`;
                }
              }}
            />
          </div>
          <HoverLift className="md:hidden">
            <Link href="/catalog">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </HoverLift>
          
          {user ? (
            <>
              <HoverLift>
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              </HoverLift>
              <HoverLift>
                <Link href="/orders">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </Link>
              </HoverLift>
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-primary/10 text-primary border border-primary/20 bg-primary/5 transition-all outline-none">
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 shadow-xl p-2 bg-card/95 backdrop-blur-xl">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem className="p-0">
                    <Link href="/profile" className="w-full flex items-center p-2 rounded-lg cursor-pointer hover:bg-muted">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">Log in</Button>
              </Link>
              <Link href="/login">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">Request Catalog</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
