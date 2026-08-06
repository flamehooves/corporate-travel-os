import { SidebarNav, MobileBottomNav } from "@/components/sidebar-nav";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Subtle dark backdrop — no decorations, just depth */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, #0f172a 0%, #09090f 58%)",
        }}
        aria-hidden
      />

      <SidebarNav />
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
