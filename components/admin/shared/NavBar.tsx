"use client"

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, ChevronDown, LogOut, User, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/helper";

export default function NavBar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center gap-4 border-b border-sidebar-border bg-sidebar px-4 lg:px-6">
      <SidebarTrigger />

      <div className="hidden sm:flex items-center gap-1.5 text-sm text-sidebar-foreground/60">
        <Link href="/admin" className="hover:text-sidebar-foreground transition-colors">
          Admin
        </Link>
        <span>/</span>
        <span className="text-sidebar-foreground font-medium">Dashboard</span>
      </div>

      <div className="flex-1" />

      <div className="relative hidden md:block max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
        <input
          type="text"
          placeholder="Search admin..."
          className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-4 text-sm text-sidebar-foreground placeholder-sidebar-foreground/40 outline-none focus:border-sidebar-ring focus:ring-1 focus:ring-sidebar-ring transition-colors"
        />
      </div>

      <button className="relative rounded-lg p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            { getInitials(user?.fullName) }
          </div>
          <div className="hidden lg:block text-left text-sm">
            <p className="font-medium text-sidebar-foreground leading-tight">{user?.fullName}</p>
            <p className="text-xs text-sidebar-foreground/50 leading-tight">{user?.role}</p>
          </div>
          <ChevronDown className="hidden lg:block w-4 h-4 text-sidebar-foreground/40" />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-sidebar-border bg-sidebar p-1 shadow-lg">
              <p className="px-3 py-2 text-xs font-medium text-sidebar-foreground/50">My Account</p>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="my-1 border-t border-sidebar-border" />
              <Link
                href="/"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <ExternalLink className="w-4 h-4" />
                Back to Store
              </Link>
              <div className="my-1 border-t border-sidebar-border" />
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
