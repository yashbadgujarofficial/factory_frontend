"use client";

import { AdminSidebar } from "@/components/shared/AdminSidebar";
import { AdminTopbar } from "@/components/shared/AdminTopbar";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, AuthProvider } from "@/providers/AuthProvider";
import { useEffect } from "react";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!user) {
        // Redirect unauthorized users to the universal home page to keep the admin portal secret
        router.push("/");
      } else if (user.role === 'Customer') {
        router.push("/home");
      }
    }
  }, [user, isLoading, isLoginPage, router]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background">Loading...</div>;
  }

  // If on login page, or not authorized for dashboard, just render children (the login form)
  if (isLoginPage || (!user && !isLoginPage) || (user && user.role === 'Customer' && !isLoginPage)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider authType="admin">
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
