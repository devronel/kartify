import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ProfileNavBar from "@/components/profile/profile-navbar";
import ProfileSidebar from "@/components/profile/profile-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset>
        <ProfileNavBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}