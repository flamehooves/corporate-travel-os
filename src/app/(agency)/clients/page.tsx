"use client";

import Link from "next/link";
import { Plus, ExternalLink, Building2 } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";

export default function ClientsPage() {
  const totalOutstanding = mockClients.reduce((s, c) => s + (c.outstanding_balance || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              {mockClients.length} clients · {formatCurrency(totalOutstanding)} outstanding
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Corporate Clients
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 shadow-lg shadow-violet-900/50">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Client</span>
          </button>
        </div>

        {/* Client cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockClients.map((client) => {
            const utilizationPct = client.outstanding_balance
              ? Math.round((client.outstanding_balance / client.credit_limit) * 100)
              : 0;

            return (
              <div
                key={client.id}
                className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.09] hover:border-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/40 to-indigo-600/40 border border-violet-400/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-violet-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/90 leading-tight">
                        {client.company_name}
                      </h3>
                      <p className="text-xs text-white/40">{client.contact_name}</p>
                    </div>
                  </div>
                  <Link
                    href={`/portal/${client.portal_token}`}
                    className="p-1.5 rounded-lg border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
                    title="Open client portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Credit utilization */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-white/35">Credit Utilization</p>
                    <p className="text-xs font-bold text-white/65">{utilizationPct}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilizationPct > 80
                          ? "bg-rose-400"
                          : utilizationPct > 50
                          ? "bg-amber-400"
                          : "bg-violet-400"
                      }`}
                      style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-white/30">
                      {formatCurrency(client.outstanding_balance || 0)} outstanding
                    </p>
                    <p className="text-[10px] text-white/30">
                      {formatCurrency(client.credit_limit)} limit
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.07]">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Requests</p>
                    <p className="text-sm font-bold text-white/80 mt-0.5">{client.total_requests}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Credit</p>
                    <p className="text-sm font-bold text-white/80 mt-0.5">{client.credit_days}d</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide">Balance</p>
                    <p className={`text-sm font-bold mt-0.5 ${
                      (client.outstanding_balance || 0) > 0
                        ? "text-amber-300"
                        : "text-emerald-300"
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
                    className="flex-1 text-center py-2 border border-white/10 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors"
                  >
                    View Requests
                  </Link>
                  <Link
                    href={`/portal/${client.portal_token}`}
                    className="flex-1 text-center py-2 bg-violet-500/20 border border-violet-400/25 rounded-xl text-xs text-violet-300 font-bold hover:bg-violet-500/30 transition-colors"
                  >
                    Open Portal
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
