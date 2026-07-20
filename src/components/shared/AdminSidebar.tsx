"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  BarChart,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  FolderTree,
  FileSpreadsheet
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, section: "MAIN" },
    { name: "Products", href: "/admin/products", icon: Package, section: "CATALOG" },
    { name: "Categories", href: "/admin/categories", icon: FolderTree, section: "CATALOG" },
    { name: "Customers", href: "/admin/customers", icon: Users, section: "CRM" },
    { name: "Order Requests", href: "/admin/orders", icon: ShoppingCart, section: "ORDERS" },
    { name: "Quotations", href: "/admin/quotations", icon: FileText, section: "ORDERS" },
    { name: "Invoices", href: "/admin/invoices", icon: FileSpreadsheet, section: "ORDERS" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart, section: "INSIGHTS" },
    { name: "Settings", href: "/admin/settings", icon: Settings, section: "ADMIN" },
  ];

  return (
    <div
      className={`h-screen bg-sidebar flex flex-col transition-all duration-300 border-r border-sidebar-border ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-heading font-semibold text-lg text-sidebar-foreground">
            Factory CMS
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent p-2 rounded-lg"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-ring"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-semibold">
            SA
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">Super Admin</span>
              <span className="text-xs text-muted-foreground">admin@factory.com</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
