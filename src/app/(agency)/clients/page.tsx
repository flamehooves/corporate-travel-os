"use client";

import Link from "next/link";
import { Plus, ExternalLink, Building2, TrendingUp } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";

export default function ClientsPage() {
  const totalOutstanding = mockClients.reduce((s, c) => s + (c.outstanding_balance || 0), 0);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Corporate Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockClients.length} clients · {formatCurrency(totalOutstanding)} total outstanding
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockClients.map((client) => {
          const utilizationPct = client.outstanding_balance
            ? Math.round((client.outstanding_balance / client.credit_limit) * 100)
            : 0;

          return (
            <div
              key={client.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-border/60 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {client.company_name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{client.contact_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/portal/${client.portal_token}`}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title="Open client portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Credit utilization */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-muted-foreground">Credit Utilization</p>
                  <p className="text-xs font-medium text-foreground">{utilizationPct}%</p>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      utilizationPct > 80
                        ? "bg-red-500"
                        : utilizationPct > 50
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(client.outstanding_balance || 0)} outstanding
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(client.credit_limit)} limit
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Requests</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{client.total_requests}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Credit</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{client.credit_days}d</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Balance</p>
                  <p className={`text-sm font-semibold mt-0.5 ${
                    (client.outstanding_balance || 0) > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {(client.outstanding_balance || 0) > 0
                      ? formatCurrency(client.outstanding_balance!)
                      : "Clear"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/requests?client=${client.id}`}
                  className="flex-1 text-center py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  View Requests
                </Link>
                <Link
                  href={`/portal/${client.portal_token}`}
                  className="flex-1 text-center py-1.5 bg-primary/8 border border-primary/20 rounded-lg text-xs text-primary font-medium hover:bg-primary/15 transition-colors"
                >
                  Open Portal
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
