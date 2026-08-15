import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfileSidebar } from "@/components/profile/Sidebar";
import AdminNavBar from "@/components/admin/shared/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset>
        <AdminNavBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}