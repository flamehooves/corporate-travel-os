import { SidebarNav } from "@/components/sidebar-nav";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <main className="flex-1 ml-60 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
