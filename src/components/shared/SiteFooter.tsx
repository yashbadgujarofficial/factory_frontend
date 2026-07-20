"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Globe, Camera, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await api.get('/settings/homepage');
      return res.data;
    }
  });

  return (
    <footer className="bg-sidebar text-sidebar-foreground pt-20 pb-10 border-t border-sidebar-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-3xl mb-6 text-primary tracking-tight">
              {settings?.companyName || "Factory"}
            </h3>
            <p className="text-sidebar-foreground/70 mb-8 max-w-sm leading-relaxed font-light">
              {settings?.companyTagline || "Crafted with heritage. Delivered with precision. Premium B2B manufacturing for global brands."}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sidebar-foreground tracking-wide uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sidebar-foreground/70">
              <li><Link href="/catalog" className="hover:text-primary transition-colors">Complete Catalog</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">Curated Collections</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Factory Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sidebar-foreground tracking-wide uppercase text-sm">Categories</h4>
            <ul className="space-y-4 text-sidebar-foreground/70">
              <li><Link href="/catalog?cat=wood" className="hover:text-primary transition-colors">Wood Crafted</Link></li>
              <li><Link href="/catalog?cat=metal" className="hover:text-primary transition-colors">Metal Art</Link></li>
              <li><Link href="/catalog?cat=marble" className="hover:text-primary transition-colors">Marble Decor</Link></li>
              <li><Link href="/catalog?cat=furniture" className="hover:text-primary transition-colors">Furniture</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-sidebar-foreground tracking-wide uppercase text-sm">Contact Support</h4>
            <ul className="space-y-4 text-sidebar-foreground/70">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{settings?.contactEmail || "support@factory.com"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{settings?.contactPhone || "+91 98765 43210"}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>123 Industrial Area, Phase 2, Craft City, 302022</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-sidebar-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} {settings?.companyName || "Factory"}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
