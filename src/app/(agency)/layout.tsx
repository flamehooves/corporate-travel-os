import { SidebarNav, MobileHeader } from "@/components/sidebar-nav";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <MobileHeader />
        <main
          className="flex-1 overflow-y-auto pt-14 lg:pt-0"
          style={{
            background: "linear-gradient(160deg, #f0f9ff 0%, #f8fbff 40%, #fffdf7 100%)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
