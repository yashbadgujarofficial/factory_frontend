import { Navbar } from "@/components/shared/Navbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { AuthProvider } from "@/providers/AuthProvider";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider authType="customer">
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </AuthProvider>
  );
}
