"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Star, BookOpen, User, Building, HeartHandshake, Globe, Palette } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FadeIn, SlideUp, SlideInLeft, StaggerContainer, StaggerItem, HoverLift } from "@/components/animations/MotionWrappers";

export default function LandingPage() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await api.get('/settings/homepage');
      return res.data;
    }
  });

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[95vh] flex items-center justify-center bg-sidebar overflow-hidden">
        {/* Animated Particles & Texture Background */}
        <div className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url('${settings?.heroImageUrl || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop'}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/60 via-sidebar/80 to-background z-10"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-20 container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="flex-1 flex flex-col items-start space-y-6">
            <SlideInLeft>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-ping"></span>
                <span className="text-sm font-medium text-accent">{settings?.landingBadgeText || "Trusted Worldwide B2B Exporter"}</span>
              </div>
            </SlideInLeft>
            
            <FadeIn delay={0.2} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-sidebar-foreground leading-[1.1]">
                {settings?.heroTitle || "Crafted by Hand. Designed to Inspire. Trusted Worldwide."}
              </h1>
              <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-xl font-light">
                {settings?.heroSubtitle || "Discover handcrafted collections created by skilled artisans. Browse thousands of premium products, create collections, and connect directly with our factory."}
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/catalog">
                <Button size="lg" className="h-14 px-8 text-base rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground">
                  {settings?.landingHeroCta1 || "Explore Collection"}
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent backdrop-blur-md gap-2">
                  <Play size={18} /> {settings?.landingHeroCta2 || "Watch Factory Tour"}
                </Button>
              </Link>
            </FadeIn>
          </div>

          {/* Right Floating Glass Cards */}
          <FadeIn delay={0.5} className="flex-1 w-full relative h-[500px] hidden md:block">
             <HoverLift className="absolute top-10 right-10 w-64 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl text-sidebar-foreground">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Building className="text-accent" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white">5000+</div>
                </div>
                <p className="font-heading font-medium text-lg">Products</p>
                <p className="text-sm text-sidebar-foreground/60">Premium items across 35+ categories.</p>
             </HoverLift>

             <HoverLift delay={0.1} className="absolute bottom-20 left-10 w-64 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl text-sidebar-foreground">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Globe className="text-accent" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white">15+</div>
                </div>
                <p className="font-heading font-medium text-lg">Countries Served</p>
                <p className="text-sm text-sidebar-foreground/60">Over 250+ Business Clients worldwide.</p>
             </HoverLift>
          </FadeIn>
        </div>
      </section>



      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <SlideUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">{settings?.landingFeaturesTitle || "Why Partner With Us?"}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{settings?.landingFeaturesSubtitle || "We combine traditional craftsmanship with modern B2B manufacturing capabilities to deliver unmatched quality at scale."}</p>
            </SlideUp>
          </div>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "100% Handmade", icon: <User />, desc: "Skilled artisans crafting unique pieces." },
              { title: "Premium Quality", icon: <Star />, desc: "Rigorous multi-stage quality control." },
              { title: "Bulk Manufacturing", icon: <Building />, desc: "Capacity to handle large scale orders." },
              { title: "Customization Available", icon: <Palette />, desc: "Tailored to your exact specifications." },
              { title: "Export Support", icon: <Globe />, desc: "Full documentation and compliance." },
              { title: "Dedicated Business Team", icon: <HeartHandshake />, desc: "24/7 account manager support." }
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <HoverLift className="h-full p-8 rounded-3xl bg-card border shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>



      {/* 5. HOW IT WORKS */}
      <section className="py-24 bg-card border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <SlideUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">{settings?.landingWorkflowTitle || "Seamless B2B Experience"}</h2>
              <p className="text-muted-foreground text-lg">{settings?.landingWorkflowSubtitle || "From browsing to bulk delivery, our process is optimized for you."}</p>
            </SlideUp>
          </div>

          <div className="relative max-w-4xl mx-auto">
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block"></div>
             <StaggerContainer className="space-y-12 md:space-y-0">
               {[
                 { step: "01", title: "Browse & Save", desc: "Explore thousands of products and save your favorites to custom collections." },
                 { step: "02", title: "Request Order", desc: "Submit your collections for bulk quotation or order requests with one click." },
                 { step: "03", title: "Admin Review", desc: "Our team reviews your requirements and provides a detailed quotation." },
                 { step: "04", title: "Production & Delivery", desc: "We manufacture with precision and dispatch globally to your address." },
               ].map((item, i) => (
                 <StaggerItem key={i} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                   <div className={`flex-1 w-full text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                     <h3 className="text-2xl font-heading font-bold mb-2">{item.title}</h3>
                     <p className="text-muted-foreground">{item.desc}</p>
                   </div>
                   <div className="w-16 h-16 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-mono font-bold text-xl relative z-10 shadow-[0_0_0_8px_var(--background)]">
                     {item.step}
                   </div>
                   <div className="flex-1 hidden md:block"></div>
                 </StaggerItem>
               ))}
             </StaggerContainer>
          </div>
        </div>
      </section>



      {/* 7. DOWNLOAD CATALOG & CTA */}
      <section className="py-24 relative overflow-hidden bg-sidebar">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl">
            <BookOpen className="w-16 h-16 text-accent mx-auto" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-sidebar-foreground">{settings?.landingCtaTitle || "Looking for our complete collection?"}</h2>
            <p className="text-xl text-sidebar-foreground/70 max-w-2xl mx-auto font-light">
              {settings?.landingCtaSubtitle || "Download our comprehensive PDF catalog or request a physical premium printed copy for your showroom."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Button size="lg" className="h-14 px-8 text-base rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground">
                Download PDF
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
                Request Printed Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
