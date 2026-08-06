"use client";

import { Building2, Bell, Shield, Users, Globe, ChevronRight } from "lucide-react";

const sections = [
  { icon: Building2, title: "Agency Profile", description: "Name, contact, branding", color: "from-violet-500/40 to-indigo-600/40 border-violet-400/20 text-violet-300" },
  { icon: Users, title: "Team Members", description: "Consultants, roles, permissions", color: "from-sky-500/40 to-blue-600/40 border-sky-400/20 text-sky-300" },
  { icon: Bell, title: "Notifications", description: "Alerts, reminders, escalations", color: "from-amber-500/40 to-orange-600/40 border-amber-400/20 text-amber-300" },
  { icon: Globe, title: "Client Portals", description: "Links, branding, access", color: "from-emerald-500/40 to-teal-600/40 border-emerald-400/20 text-emerald-300" },
  { icon: Shield, title: "Security", description: "Password, 2FA, sessions", color: "from-rose-500/40 to-pink-600/40 border-rose-400/20 text-rose-300" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10 max-w-3xl">
        <div className="mb-8">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
            Agency Configuration
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Settings
          </h1>
        </div>

        <div className="space-y-3">
          {sections.map((s) => (
            <button
              key={s.title}
              className="w-full flex items-center gap-4 p-5 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.09] hover:border-white/15 transition-all group text-left"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white/85">{s.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/45 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
