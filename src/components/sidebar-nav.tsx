"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wallet,
  Building2,
  Settings,
  LogOut,
  Plane,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/requests", label: "Travel Requests", icon: FileText, badge: "5" },
  { href: "/clients", label: "Corporate Clients", icon: Building2 },
  { href: "/finance", label: "Finance & Cash Flow", icon: Wallet },
  { href: "/suppliers", label: "Suppliers", icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 flex-shrink-0 transition-colors",
                active ? "text-white" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
              )} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold bg-primary text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-sidebar-border mt-4">
          <Link
            href="/settings"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="w-4 h-4 flex-shrink-0 text-sidebar-foreground/50" />
            Settings
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent/40">
          <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">Priya Sharma</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">Owner</p>
          </div>
          <Link href="/login">
            <LogOut className="w-3.5 h-3.5 text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
}

export function SidebarNav() {
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Plane className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight">Travelio</p>
          <p className="text-[10px] text-sidebar-foreground/50 leading-tight">Operations Platform</p>
        </div>
      </div>
      <NavLinks />
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar — mobile only */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Plane className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">Travelio</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col bg-sidebar transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">Travelio</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <NavLinks onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}
