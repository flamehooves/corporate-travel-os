"use client";

import { Buildings, Bell, Shield, Users, Globe, CaretRight } from "@phosphor-icons/react";

const sections = [
  { icon: Buildings, title: "Agency Profile", description: "Name, contact, branding", accent: "text-slate-300 bg-slate-500/20 border-slate-500/25" },
  { icon: Users, title: "Team Members", description: "Consultants, roles, permissions", accent: "text-sky-300 bg-sky-500/20 border-sky-500/25" },
  { icon: Bell, title: "Notifications", description: "Alerts, reminders, escalations", accent: "text-amber-300 bg-amber-500/20 border-amber-500/25" },
  { icon: Globe, title: "Client Portals", description: "Links, branding, access", accent: "text-emerald-300 bg-emerald-500/20 border-emerald-500/25" },
  { icon: Shield, title: "Security", description: "Password, 2FA, sessions", accent: "text-rose-300 bg-rose-500/20 border-rose-500/25" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10 max-w-3xl">
        <div className="mb-8">
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
            Agency Configuration
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Settings
          </h1>
        </div>

        <div className="space-y-2.5">
          {sections.map((s) => (
            <button
              key={s.title}
              className="w-full flex items-center gap-4 p-5 bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] hover:border-white/[0.12] transition-all group text-left"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.accent}`}>
                <s.icon className="w-5 h-5" weight="fill" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white/80">{s.title}</p>
                <p className="text-xs text-white/35 mt-0.5">{s.description}</p>
              </div>
              <CaretRight className="w-4 h-4 text-white/18 group-hover:text-white/40 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
