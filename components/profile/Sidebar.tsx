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
  BookUser,
  MapPin,
  UserLock
} from "lucide-react";

const mainItems = [
  { label: "Personal Information", href: "/profile", icon: BookUser },
  { label: "Address", href: "/profile/address", icon: MapPin },
  { label: "Account", href: "/profile/account", icon: UserLock },
];

const managementItems = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Sales", href: "/admin/sales", icon: CircleDollarSign },
  { label: "Discounts", href: "/admin/discounts", icon: Tags },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
];

export function ProfileSidebar() {
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
