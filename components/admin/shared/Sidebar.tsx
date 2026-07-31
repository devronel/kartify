"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  CircleDollarSign,
  Tags,
  Truck,
  ChevronRight,
  Boxes,
  SquarePlus,
  FolderTree,
  PackageCheck,
} from "lucide-react";

const mainItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

const productSubItems = [
  { label: "Product List", href: "/admin/products", icon: Boxes },
  { label: "Create Product", href: "/admin/products/create", icon: SquarePlus },
  { label: "Categories", href: "/admin/products/categories", icon: FolderTree },
  { label: "Stock", href: "/admin/products/stock", icon: PackageCheck },
];

const managementItems = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Sales", href: "/admin/sales", icon: CircleDollarSign },
  { label: "Discounts", href: "/admin/discounts", icon: Tags },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(
    pathname.startsWith("/admin/products")
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <span className="text-base font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Kartify
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setProductsOpen(!productsOpen)}
                  isActive={pathname === "/admin/products" || pathname.startsWith("/admin/products/")}
                  tooltip="Products"
                >
                  <Package />
                  <span>Products</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 ${
                      productsOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
                {productsOpen && (
                  <SidebarMenuSub>
                    {productSubItems.map((item) => (
                      <SidebarMenuSubItem key={item.href}>
                        <SidebarMenuSubButton
                          render={<Link href={item.href} />}
                          isActive={pathname === item.href}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
