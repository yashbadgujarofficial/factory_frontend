"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function HomepageSettingsPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyTagline: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
    dashboardTitle: "",
    dashboardSubtitle: "",
    contactEmail: "",
    contactPhone: "",
    landingBadgeText: "",
    landingHeroCta1: "",
    landingHeroCta2: "",
    landingFeaturesTitle: "",
    landingFeaturesSubtitle: "",
    landingWorkflowTitle: "",
    landingWorkflowSubtitle: "",
    landingCtaTitle: "",
    landingCtaSubtitle: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/homepage');
        setFormData({
          companyName: res.data.companyName || "Factory",
          companyTagline: res.data.companyTagline || "Crafted with heritage. Delivered with precision.",
          heroTitle: res.data.heroTitle || "",
          heroSubtitle: res.data.heroSubtitle || "",
          heroImageUrl: res.data.heroImageUrl || "",
          dashboardTitle: res.data.dashboardTitle || "Welcome back, {name}!",
          dashboardSubtitle: res.data.dashboardSubtitle || "Here are some products recommended for you based on your recent activity.",
          contactEmail: res.data.contactEmail || "",
          contactPhone: res.data.contactPhone || "",
          landingBadgeText: res.data.landingBadgeText || "Trusted Worldwide B2B Exporter",
          landingHeroCta1: res.data.landingHeroCta1 || "Explore Collection",
          landingHeroCta2: res.data.landingHeroCta2 || "Watch Factory Tour",
          landingFeaturesTitle: res.data.landingFeaturesTitle || "Why Partner With Us?",
          landingFeaturesSubtitle: res.data.landingFeaturesSubtitle || "We combine traditional craftsmanship with modern B2B manufacturing capabilities to deliver unmatched quality at scale.",
          landingWorkflowTitle: res.data.landingWorkflowTitle || "Seamless B2B Experience",
          landingWorkflowSubtitle: res.data.landingWorkflowSubtitle || "From browsing to bulk delivery, our process is optimized for you.",
          landingCtaTitle: res.data.landingCtaTitle || "Looking for our complete collection?",
          landingCtaSubtitle: res.data.landingCtaSubtitle || "Download our comprehensive PDF catalog or request a physical premium printed copy for your showroom."
        });
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/homepage', formData);
      toast.success("Homepage settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl animate-in fade-in">
      <h1 className="text-2xl font-heading font-semibold mb-6">Homepage Settings</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-card p-6 rounded-2xl border shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">General Settings</h2>
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              value={formData.companyName} 
              onChange={e => setFormData({...formData, companyName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Company Tagline</Label>
            <Input 
              value={formData.companyTagline} 
              onChange={e => setFormData({...formData, companyTagline: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-medium border-b pb-2">Hero Section</h2>
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input 
              value={formData.heroTitle} 
              onChange={e => setFormData({...formData, heroTitle: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Input 
              value={formData.heroSubtitle} 
              onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Hero Background Image URL</Label>
            <Input 
              value={formData.heroImageUrl} 
              onChange={e => setFormData({...formData, heroImageUrl: e.target.value})} 
            />
            <p className="text-xs text-muted-foreground">Provide a valid image URL for the homepage background.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-2">
              <Label>Top Badge Text</Label>
              <Input 
                value={formData.landingBadgeText} 
                onChange={e => setFormData({...formData, landingBadgeText: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input 
                value={formData.landingHeroCta1} 
                onChange={e => setFormData({...formData, landingHeroCta1: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input 
                value={formData.landingHeroCta2} 
                onChange={e => setFormData({...formData, landingHeroCta2: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-medium border-b pb-2">Landing Page Sections</h2>
          
          <h3 className="text-sm font-semibold text-muted-foreground pt-2">Features Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.landingFeaturesTitle} 
                onChange={e => setFormData({...formData, landingFeaturesTitle: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input 
                value={formData.landingFeaturesSubtitle} 
                onChange={e => setFormData({...formData, landingFeaturesSubtitle: e.target.value})} 
              />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-muted-foreground pt-4">Workflow Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.landingWorkflowTitle} 
                onChange={e => setFormData({...formData, landingWorkflowTitle: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input 
                value={formData.landingWorkflowSubtitle} 
                onChange={e => setFormData({...formData, landingWorkflowSubtitle: e.target.value})} 
              />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-muted-foreground pt-4">Call to Action Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.landingCtaTitle} 
                onChange={e => setFormData({...formData, landingCtaTitle: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input 
                value={formData.landingCtaSubtitle} 
                onChange={e => setFormData({...formData, landingCtaSubtitle: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-medium border-b pb-2">Customer Dashboard (/home)</h2>
          <div className="space-y-2">
            <Label>Dashboard Title</Label>
            <Input 
              value={formData.dashboardTitle} 
              onChange={e => setFormData({...formData, dashboardTitle: e.target.value})} 
              placeholder="e.g. Welcome back, {name}!"
            />
            <p className="text-xs text-muted-foreground">Use {'{name}'} to inject the customer's name dynamically.</p>
          </div>
          <div className="space-y-2">
            <Label>Dashboard Subtitle</Label>
            <Input 
              value={formData.dashboardSubtitle} 
              onChange={e => setFormData({...formData, dashboardSubtitle: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-medium border-b pb-2">Contact Information (Footer)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input 
                value={formData.contactEmail} 
                onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input 
                value={formData.contactPhone} 
                onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
