"use client";

import { Plus, Globe, Envelope, Phone } from "@phosphor-icons/react";
import { mockSuppliers } from "@/lib/mock-data";
import { formatCurrencyFull } from "@/lib/utils";

const typeColors: Record<string, string> = {
  "GDS / Flights + Hotels": "bg-sky-50 text-sky-700 border-sky-200",
  "Rail": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Airline": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Hotel Partner": "bg-amber-50 text-amber-700 border-amber-200",
  "Visa Services": "bg-slate-100 text-slate-600 border-slate-200",
};

export default function SuppliersPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] mb-2">
              {mockSuppliers.length} partners · Booking network
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight leading-none">
              Suppliers
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shrink-0 shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Add Supplier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1e1b4b]">{supplier.name}</h3>
                  <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    typeColors[supplier.type] ?? "bg-gray-50 text-slate-500 border-gray-200"
                  }`}>
                    {supplier.type}
                  </span>
                </div>
                {supplier.credit_balance > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Credit Balance</p>
                    <p className="text-sm font-bold text-amber-600 mt-0.5">
                      {formatCurrencyFull(supplier.credit_balance)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {supplier.contact_name && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-slate-300" weight="fill" />
                    <span>{supplier.contact_name}</span>
                  </div>
                )}
                {supplier.contact_email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Envelope className="w-3.5 h-3.5 shrink-0 text-slate-300" weight="fill" />
                    <a
                      href={`mailto:${supplier.contact_email}`}
                      className="hover:text-[#6366f1] transition-colors truncate"
                    >
                      {supplier.contact_email}
                    </a>
                  </div>
                )}
                {supplier.portal_url && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-slate-300" weight="fill" />
                    <a
                      href={supplier.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#6366f1] transition-colors truncate"
                    >
                      {supplier.portal_url.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 py-2 border border-gray-200 rounded-xl text-xs text-slate-500 hover:text-[#1e1b4b] hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  View Bookings
                </button>
                {supplier.portal_url && (
                  <a
                    href={supplier.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-[#6366f1] font-bold hover:bg-indigo-100 transition-colors text-center"
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
