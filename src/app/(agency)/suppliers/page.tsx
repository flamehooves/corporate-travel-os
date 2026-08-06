"use client";

import { Plus, Globe, Envelope, Phone } from "@phosphor-icons/react";
import { mockSuppliers } from "@/lib/mock-data";
import { formatCurrencyFull } from "@/lib/utils";

const typeColors: Record<string, string> = {
  "GDS / Flights + Hotels": "bg-sky-400/12 text-sky-300 border-sky-400/20",
  "Rail": "bg-emerald-400/12 text-emerald-300 border-emerald-400/20",
  "Airline": "bg-blue-400/12 text-blue-300 border-blue-400/20",
  "Hotel Partner": "bg-amber-400/12 text-amber-300 border-amber-400/20",
  "Visa Services": "bg-slate-400/12 text-slate-300 border-slate-400/20",
};

export default function SuppliersPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              {mockSuppliers.length} partners · Booking network
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Suppliers
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white/[0.09] hover:bg-white/[0.15] border border-white/[0.11] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0">
            <Plus className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Add Supplier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white/85">{supplier.name}</h3>
                  <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    typeColors[supplier.type] ?? "bg-white/[0.07] text-white/45 border-white/[0.10]"
                  }`}>
                    {supplier.type}
                  </span>
                </div>
                {supplier.credit_balance > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] text-white/25 uppercase tracking-wide">Credit Balance</p>
                    <p className="text-sm font-bold text-amber-300 mt-0.5">
                      {formatCurrencyFull(supplier.credit_balance)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {supplier.contact_name && (
                  <div className="flex items-center gap-2 text-xs text-white/35">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/22" weight="fill" />
                    <span>{supplier.contact_name}</span>
                  </div>
                )}
                {supplier.contact_email && (
                  <div className="flex items-center gap-2 text-xs text-white/35">
                    <Envelope className="w-3.5 h-3.5 flex-shrink-0 text-white/22" weight="fill" />
                    <a
                      href={`mailto:${supplier.contact_email}`}
                      className="hover:text-white/60 transition-colors truncate"
                    >
                      {supplier.contact_email}
                    </a>
                  </div>
                )}
                {supplier.portal_url && (
                  <div className="flex items-center gap-2 text-xs text-white/35">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0 text-white/22" weight="fill" />
                    <a
                      href={supplier.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/60 transition-colors truncate"
                    >
                      {supplier.portal_url.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <button className="flex-1 py-2 border border-white/[0.08] rounded-xl text-xs text-white/30 hover:text-white/55 hover:bg-white/[0.04] transition-colors">
                  View Bookings
                </button>
                {supplier.portal_url && (
                  <a
                    href={supplier.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-white/[0.07] border border-white/[0.10] rounded-xl text-xs text-white/55 font-bold hover:bg-white/[0.11] transition-colors text-center"
                  >
                    Open Portal
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
