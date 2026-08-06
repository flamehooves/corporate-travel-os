"use client";

import Link from "next/link";
import { Plus, ArrowSquareOut, Buildings } from "@phosphor-icons/react";
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
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              {mockClients.length} clients · {formatCurrency(totalOutstanding)} outstanding
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Corporate Clients
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white/[0.09] hover:bg-white/[0.15] border border-white/[0.11] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0">
            <Plus className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Add Client</span>
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
                className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                      <Buildings className="w-5 h-5 text-white/45" weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/85 leading-tight">
                        {client.company_name}
                      </h3>
                      <p className="text-xs text-white/35">{client.contact_name}</p>
                    </div>
                  </div>
                  <Link
                    href={`/portal/${client.portal_token}`}
                    className="p-1.5 rounded-lg border border-white/[0.08] text-white/25 hover:text-white/55 hover:border-white/[0.15] transition-colors"
                    title="Open client portal"
                  >
                    <ArrowSquareOut className="w-3.5 h-3.5" weight="bold" />
                  </Link>
                </div>

                {/* Credit utilization */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-white/30">Credit Utilization</p>
                    <p className="text-xs font-bold text-white/55">{utilizationPct}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilizationPct > 80
                          ? "bg-rose-400/70"
                          : utilizationPct > 50
                          ? "bg-amber-400/70"
                          : "bg-white/30"
                      }`}
                      style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-white/25">
                      {formatCurrency(client.outstanding_balance || 0)} outstanding
                    </p>
                    <p className="text-[10px] text-white/25">
                      {formatCurrency(client.credit_limit)} limit
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Requests</p>
                    <p className="text-sm font-bold text-white/70 mt-0.5">{client.total_requests}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Credit</p>
                    <p className="text-sm font-bold text-white/70 mt-0.5">{client.credit_days}d</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Balance</p>
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
                    className="flex-1 text-center py-2 border border-white/[0.08] rounded-xl text-xs text-white/35 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
                  >
                    View Requests
                  </Link>
                  <Link
                    href={`/portal/${client.portal_token}`}
                    className="flex-1 text-center py-2 bg-white/[0.07] border border-white/[0.10] rounded-xl text-xs text-white/60 font-bold hover:bg-white/[0.11] transition-colors"
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
