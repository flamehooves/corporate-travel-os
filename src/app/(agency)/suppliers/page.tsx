"use client";

import { Plus, Globe, Mail, Phone } from "lucide-react";
import { mockSuppliers } from "@/lib/mock-data";
import { formatCurrencyFull } from "@/lib/utils";

const typeColors: Record<string, string> = {
  "GDS / Flights + Hotels": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
  "Rail": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900",
  "Airline": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900",
  "Hotel Partner": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
  "Visa Services": "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export default function SuppliersPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockSuppliers.length} suppliers · Your booking partner network
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-border/60 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{supplier.name}</h3>
                <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[supplier.type] || "bg-secondary text-secondary-foreground border-border"}`}>
                  {supplier.type}
                </span>
              </div>
              {supplier.credit_balance > 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Credit Balance</p>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                    {formatCurrencyFull(supplier.credit_balance)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {supplier.contact_name && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{supplier.contact_name}</span>
                </div>
              )}
              {supplier.contact_email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`mailto:${supplier.contact_email}`} className="hover:text-foreground transition-colors truncate">
                    {supplier.contact_email}
                  </a>
                </div>
              )}
              {supplier.portal_url && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                  <a
                    href={supplier.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors truncate"
                  >
                    {supplier.portal_url.replace("https://", "").replace("http://", "")}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              <button className="flex-1 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                View Bookings
              </button>
              {supplier.portal_url && (
                <a
                  href={supplier.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 bg-primary/8 border border-primary/20 rounded-lg text-xs text-primary font-medium hover:bg-primary/15 transition-colors text-center"
                >
                  Open Portal
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
