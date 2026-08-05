import { SidebarNav } from "@/components/sidebar-nav";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <main
        className="flex-1 ml-60 overflow-y-auto"
        style={{
          background: "linear-gradient(160deg, #f0f9ff 0%, #f8fbff 40%, #fffdf7 100%)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
