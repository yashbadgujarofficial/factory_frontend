"use client";

import { useAuth } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { FadeIn, SlideUp, HoverLift, StaggerContainer, StaggerItem } from "@/components/animations/MotionWrappers";
import { ShoppingBag, FileText, User, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        
        {/* Welcome Section */}
        <section className="bg-sidebar pt-16 pb-24 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-sidebar-foreground mb-4">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-sidebar-foreground/70 text-lg max-w-2xl">
                Manage your orders, view quotations, and discover new products in our catalog.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Quick Links */}
        <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-10">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <HoverLift className="bg-card rounded-2xl p-6 shadow-sm border h-full flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">My Orders</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">Track your active orders and view your purchase history.</p>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/profile">View Orders <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </HoverLift>
            </StaggerItem>
            
            <StaggerItem>
              <HoverLift className="bg-card rounded-2xl p-6 shadow-sm border h-full flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">Quotations</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">Check the status of your pricing requests and accept quotes.</p>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/profile">View Quotations <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift className="bg-card rounded-2xl p-6 shadow-sm border h-full flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-6">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">Product Catalog</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">Browse our latest collection and build your next order.</p>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/catalog">Explore Catalog <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift className="bg-card rounded-2xl p-6 shadow-sm border h-full flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center mb-6">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">Account Settings</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">Update your billing address, contact info, and profile details.</p>
                <Button variant="ghost" className="w-full justify-between" asChild>
                  <Link href="/profile">Manage Account <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </HoverLift>
            </StaggerItem>
          </StaggerContainer>
        </section>

      </div>
    </ProtectedRoute>
  );
}
