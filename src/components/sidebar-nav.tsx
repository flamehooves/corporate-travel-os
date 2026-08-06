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
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col bg-white border-r border-gray-100">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
        <div className="w-9 h-9 bg-[#1e1b4b] rounded-xl flex items-center justify-center flex-shrink-0">
          <Airplane className="w-4 h-4 text-white" weight="fill" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1e1b4b] leading-tight tracking-wide">Travelio</p>
          <p className="text-[9px] text-slate-400 leading-tight uppercase tracking-[0.15em]">Operations</p>
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
                  ? "bg-[#1e1b4b] text-white"
                  : "text-slate-500 hover:bg-gray-50 hover:text-[#1e1b4b]"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-white" : "text-slate-400 group-hover:text-[#1e1b4b]"
                )}
                weight={active ? "fill" : "regular"}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  active ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-gray-100 mt-4">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname === "/settings"
                ? "bg-[#1e1b4b] text-white"
                : "text-slate-500 hover:bg-gray-50 hover:text-[#1e1b4b]"
            )}
          >
            <GearSix
              className={cn("w-4 h-4 flex-shrink-0", pathname === "/settings" ? "text-white" : "text-slate-400")}
              weight={pathname === "/settings" ? "fill" : "regular"}
            />
            Settings
          </Link>
        </div>
      </nav>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#1e1b4b] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Priya Sharma</p>
            <p className="text-[10px] text-slate-400 truncate">Owner</p>
          </div>
          <Link href="/login">
            <SignOut className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100">
      <div className="flex items-stretch">
        {bottomNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all relative",
                active ? "text-[#6366f1]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className="relative">
                <item.icon
                  className="w-5 h-5"
                  weight={active ? "fill" : "regular"}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-bold bg-indigo-100 text-indigo-600 w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none",
                active ? "text-[#6366f1]" : "text-slate-400"
              )}>
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#6366f1] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
