import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl animate-in fade-in">
      <h1 className="text-2xl font-heading font-semibold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/settings/homepage" className="group block">
          <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Homepage Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Customize the landing page and customer dashboard text, banners, and links.
            </p>
            <div className="mt-auto flex items-center text-sm font-medium text-primary">
              Edit Settings <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
