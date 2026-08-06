"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  FileText,
  Users,
  Wallet,
  Buildings,
  GearSix,
  SignOut,
  Airplane,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/requests", label: "Travel Requests", icon: FileText, badge: "5" },
  { href: "/clients", label: "Corporate Clients", icon: Buildings },
  { href: "/finance", label: "Finance & Cash Flow", icon: Wallet },
  { href: "/suppliers", label: "Suppliers", icon: Users },
];

const bottomNavItems = [
  { href: "/dashboard", label: "Home", icon: SquaresFour },
  { href: "/requests", label: "Requests", icon: FileText, badge: "5" },
  { href: "/clients", label: "Clients", icon: Buildings },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/settings", label: "Settings", icon: GearSix },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col bg-black/55 backdrop-blur-2xl border-r border-white/[0.06]">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
        <div className="w-9 h-9 bg-slate-800/80 border border-white/[0.09] rounded-xl flex items-center justify-center flex-shrink-0">
          <Airplane className="w-4 h-4 text-white/70" weight="fill" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight tracking-wide">Travelio</p>
          <p className="text-[9px] text-white/30 leading-tight uppercase tracking-[0.15em]">Operations</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white/[0.08] text-white border border-white/[0.06]"
                  : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-white/85" : "text-white/30 group-hover:text-white/55"
                )}
                weight={active ? "fill" : "regular"}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-white/[0.10] text-white/60 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {active && <CaretRight className="w-3 h-3 text-white/30" />}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-white/[0.06] mt-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-all"
          >
            <GearSix className="w-4 h-4 flex-shrink-0 text-white/30" />
            Settings
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06]">
          <div className="w-8 h-8 rounded-full bg-slate-700/80 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white/70">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/70 truncate">Priya Sharma</p>
            <p className="text-[10px] text-white/30 truncate">Owner</p>
          </div>
          <Link href="/login">
            <SignOut className="w-3.5 h-3.5 text-white/20 hover:text-white/50 transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-2xl border-t border-white/[0.07]">
      <div className="flex items-stretch">
        {bottomNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all relative",
                active ? "text-white" : "text-white/28 hover:text-white/50"
              )}
            >
              <div className="relative">
                <item.icon
                  className="w-5 h-5"
                  weight={active ? "fill" : "regular"}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-bold bg-white/15 text-white/70 w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none",
                active ? "text-white/85" : "text-white/28"
              )}>
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/40 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
