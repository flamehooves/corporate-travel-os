"use client";

import { Building2, Bell, Shield, Users, Globe } from "lucide-react";

const sections = [
  { icon: Building2, title: "Agency Profile", description: "Name, contact, branding" },
  { icon: Users, title: "Team Members", description: "Consultants, roles, permissions" },
  { icon: Bell, title: "Notifications", description: "Alerts, reminders, escalations" },
  { icon: Globe, title: "Client Portals", description: "Links, branding, access" },
  { icon: Shield, title: "Security", description: "Password, 2FA, sessions" },
];

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your agency configuration</p>
      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-border/60 transition-all cursor-pointer"
          >
            <div className="p-2.5 bg-secondary rounded-xl">
              <s.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
