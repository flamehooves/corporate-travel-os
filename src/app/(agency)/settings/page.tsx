"use client";

import { Buildings, Bell, Shield, Users, Globe, CaretRight } from "@phosphor-icons/react";

const sections = [
  { icon: Buildings, title: "Agency Profile", description: "Name, contact, branding", iconBg: "bg-slate-100", iconColor: "text-slate-600" },
  { icon: Users, title: "Team Members", description: "Consultants, roles, permissions", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  { icon: Bell, title: "Notifications", description: "Alerts, reminders, escalations", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { icon: Globe, title: "Client Portals", description: "Links, branding, access", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { icon: Shield, title: "Security", description: "Password, 2FA, sessions", iconBg: "bg-red-50", iconColor: "text-red-600" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10 max-w-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] mb-2">
            Agency Configuration
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight leading-none">
            Settings
          </h1>
        </div>

        <div className="space-y-2.5">
          {sections.map((s) => (
            <button
              key={s.title}
              className="w-full flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[18px] shadow-sm hover:shadow-md hover:border-gray-200 transition-all group text-left"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} weight="fill" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1e1b4b]">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
              </div>
              <CaretRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
