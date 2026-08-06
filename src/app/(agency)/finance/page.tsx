"use client";

import { useState } from "react";
import { Warning, CheckCircle, Clock, TrendUp, Download } from "@phosphor-icons/react";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { mockInvoices, mockSuppliers, mockBookings } from "@/lib/mock-data";
import { formatCurrency, formatCurrencyFull, formatDate, isOverdue } from "@/lib/utils";

const tabs = ["Receivables", "Supplier Payables", "Bookings"] as const;
type Tab = (typeof tabs)[number];

export default function FinancePage() {
  const [tab, setTab] = useState<Tab>("Receivables");

  const totalReceivable = mockInvoices
    .filter((i) => i.status !== "paid")
    .reduce((s, i) => s + i.total_amount - i.paid_amount, 0);

  const overdueAmount = mockInvoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + i.total_amount - i.paid_amount, 0);

  const supplierPayables = mockSuppliers.reduce((s, sup) => s + sup.credit_balance, 0);
  const totalMargin = mockBookings.reduce((s, b) => s + b.margin, 0);

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] mb-2">
              Receivables · Payables · Margin
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight leading-none">
              Finance
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 hover:border-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0">
            <Download className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-amber-50 border border-amber-100 rounded-[18px] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Receivables</p>
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1e1b4b] leading-none">{formatCurrency(totalReceivable)}</p>
            <p className="text-slate-400 text-xs mt-1.5">across all clients</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-[18px] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Overdue</p>
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                <Warning className="w-3.5 h-3.5 text-[#ef4444]" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#ef4444] leading-none">{formatCurrency(overdueAmount)}</p>
            <p className="text-red-400 text-xs mt-1.5">requires action</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-[18px] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payables</p>
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                <TrendUp className="w-3.5 h-3.5 text-sky-500" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1e1b4b] leading-none">{formatCurrency(supplierPayables)}</p>
            <p className="text-slate-400 text-xs mt-1.5">credit balances due</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[18px] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Margin MTD</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#16a34a] leading-none">{formatCurrency(totalMargin)}</p>
            <p className="text-emerald-500 text-xs mt-1.5">confirmed bookings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 border border-gray-200 p-1 rounded-xl mb-5 w-fit">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                tab === t
                  ? "bg-white text-[#1e1b4b] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Receivables */}
        {tab === "Receivables" && (
          <div className="bg-white border border-gray-100 rounded-[18px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
              <div className="grid grid-cols-6 gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-2">Invoice</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
              </div>
            </div>
            {mockInvoices.map((inv) => {
              const outstanding = inv.total_amount - inv.paid_amount;
              return (
                <div
                  key={inv.id}
                  className={`px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                    inv.status === "overdue" ? "bg-red-50/30" : ""
                  }`}
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-[#1e1b4b]">{inv.invoice_number}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Issued {formatDate(inv.issued_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{inv.client?.company_name}</p>
                      <p className="text-xs text-slate-400">{inv.notes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1e1b4b]">{formatCurrencyFull(outstanding)}</p>
                      {inv.paid_amount > 0 && (
                        <p className="text-xs text-slate-400">{formatCurrencyFull(inv.paid_amount)} paid</p>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${
                        isOverdue(inv.due_date) && inv.status !== "paid"
                          ? "text-[#ef4444] font-bold"
                          : "text-slate-500"
                      }`}>
                        {formatDate(inv.due_date)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <InvoiceStatusBadge status={inv.status} />
                      {inv.status !== "paid" && (
                        <button className="text-xs text-slate-400 hover:text-[#6366f1] transition-colors ml-2">
                          Record
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Supplier Payables */}
        {tab === "Supplier Payables" && (
          <div className="bg-white border border-gray-100 rounded-[18px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
              <div className="grid grid-cols-5 gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-2">Supplier</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credit Balance</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</p>
              </div>
            </div>
            {mockSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-[#1e1b4b]">{sup.name}</p>
                    {sup.contact_email && (
                      <p className="text-xs text-slate-400">{sup.contact_email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{sup.type}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${
                      sup.credit_balance > 0 ? "text-amber-600" : "text-slate-300"
                    }`}>
                      {sup.credit_balance > 0 ? formatCurrencyFull(sup.credit_balance) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sup.portal_url && (
                      <a
                        href={sup.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-[#6366f1] transition-colors"
                      >
                        Portal
                      </a>
                    )}
                    {sup.credit_balance > 0 && (
                      <button className="text-xs text-slate-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:text-[#1e1b4b] hover:border-gray-300 hover:bg-gray-50 transition-colors">
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings */}
        {tab === "Bookings" && (
          <div className="bg-white border border-gray-100 rounded-[18px] overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
              <div className="grid grid-cols-6 gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-2">Request</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplier Cost</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Price</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Margin</p>
              </div>
            </div>
            {mockBookings.map((bkg) => (
              <div
                key={bkg.id}
                className="px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm font-bold text-[#1e1b4b]">{bkg.booking_number}</p>
                    <p className="text-xs text-slate-400">{bkg.supplier_system}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">{bkg.request?.traveler_name}</p>
                    <p className="text-xs text-slate-400">
                      {bkg.request?.origin} → {bkg.request?.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{formatCurrencyFull(bkg.supplier_cost)}</p>
                    <p className={`text-xs mt-0.5 ${bkg.supplier_paid ? "text-[#16a34a]" : "text-amber-600"}`}>
                      {bkg.supplier_paid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{formatCurrencyFull(bkg.client_price)}</p>
                    <p className={`text-xs mt-0.5 ${bkg.client_paid ? "text-[#16a34a]" : "text-amber-600"}`}>
                      {bkg.client_paid ? "Collected" : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#16a34a]">
                      {formatCurrencyFull(bkg.margin)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {((bkg.margin / bkg.client_price) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
