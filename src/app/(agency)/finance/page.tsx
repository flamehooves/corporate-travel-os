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

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              Receivables · Payables · Margin
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Finance
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.11] border border-white/[0.09] text-white/55 hover:text-white/80 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0">
            <Download className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-amber-500/[0.08] backdrop-blur-xl border border-amber-400/[0.12] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-amber-300/55 text-[10px] font-bold uppercase tracking-wider">Receivables</p>
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-300" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-white leading-none">{formatCurrency(totalReceivable)}</p>
            <p className="text-white/25 text-xs mt-1.5">across all clients</p>
          </div>

          <div className="bg-rose-500/[0.07] backdrop-blur-xl border border-rose-400/[0.10] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-rose-300/55 text-[10px] font-bold uppercase tracking-wider">Overdue</p>
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Warning className="w-3.5 h-3.5 text-rose-300" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-white leading-none">{formatCurrency(overdueAmount)}</p>
            <p className="text-white/25 text-xs mt-1.5">requires action</p>
          </div>

          <div className="bg-sky-500/[0.08] backdrop-blur-xl border border-sky-400/[0.12] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sky-300/55 text-[10px] font-bold uppercase tracking-wider">Payables</p>
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <TrendUp className="w-3.5 h-3.5 text-sky-300" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-white leading-none">{formatCurrency(supplierPayables)}</p>
            <p className="text-white/25 text-xs mt-1.5">credit balances due</p>
          </div>

          <div className="bg-emerald-500/[0.08] backdrop-blur-xl border border-emerald-400/[0.12] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-emerald-300/55 text-[10px] font-bold uppercase tracking-wider">Margin MTD</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" weight="fill" />
              </div>
            </div>
            <p className="text-2xl font-black text-white leading-none">{formatCurrency(totalMargin)}</p>
            <p className="text-white/25 text-xs mt-1.5">confirmed bookings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl p-1 rounded-xl mb-5 w-fit">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                tab === t
                  ? "bg-white/[0.12] text-white border border-white/[0.08]"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Receivables */}
        {tab === "Receivables" && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-6 gap-4">
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider col-span-2">Invoice</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Client</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Amount</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Due Date</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Status</p>
              </div>
            </div>
            {mockInvoices.map((inv) => {
              const outstanding = inv.total_amount - inv.paid_amount;
              return (
                <div
                  key={inv.id}
                  className={`px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors ${
                    inv.status === "overdue" ? "bg-rose-500/[0.04]" : ""
                  }`}
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="text-sm font-bold text-white/80">{inv.invoice_number}</p>
                      <p className="text-xs text-white/28 mt-0.5">Issued {formatDate(inv.issued_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{inv.client?.company_name}</p>
                      <p className="text-xs text-white/28">{inv.notes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/75">{formatCurrencyFull(outstanding)}</p>
                      {inv.paid_amount > 0 && (
                        <p className="text-xs text-white/28">{formatCurrencyFull(inv.paid_amount)} paid</p>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${
                        isOverdue(inv.due_date) && inv.status !== "paid"
                          ? "text-rose-300 font-bold"
                          : "text-white/55"
                      }`}>
                        {formatDate(inv.due_date)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <InvoiceStatusBadge status={inv.status} />
                      {inv.status !== "paid" && (
                        <button className="text-xs text-white/35 hover:text-white/60 transition-colors ml-2">
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
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-5 gap-4">
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider col-span-2">Supplier</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Type</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Credit Balance</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Action</p>
              </div>
            </div>
            {mockSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-white/80">{sup.name}</p>
                    {sup.contact_email && (
                      <p className="text-xs text-white/28">{sup.contact_email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white/40">{sup.type}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${
                      sup.credit_balance > 0 ? "text-amber-300" : "text-white/25"
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
                        className="text-xs text-white/40 hover:text-white/65 transition-colors"
                      >
                        Portal
                      </a>
                    )}
                    {sup.credit_balance > 0 && (
                      <button className="text-xs text-white/30 border border-white/[0.08] rounded-lg px-2.5 py-1 hover:text-white/55 hover:bg-white/[0.05] transition-colors">
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
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="grid grid-cols-6 gap-4">
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Booking</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider col-span-2">Request</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Supplier Cost</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Client Price</p>
                <p className="text-[10px] font-bold text-white/22 uppercase tracking-wider">Margin</p>
              </div>
            </div>
            {mockBookings.map((bkg) => (
              <div
                key={bkg.id}
                className="px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm font-bold text-white/80">{bkg.booking_number}</p>
                    <p className="text-xs text-white/28">{bkg.supplier_system}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-white/60">{bkg.request?.traveler_name}</p>
                    <p className="text-xs text-white/28">
                      {bkg.request?.origin} → {bkg.request?.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/55">{formatCurrencyFull(bkg.supplier_cost)}</p>
                    <p className={`text-xs mt-0.5 ${bkg.supplier_paid ? "text-emerald-300" : "text-amber-300"}`}>
                      {bkg.supplier_paid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/55">{formatCurrencyFull(bkg.client_price)}</p>
                    <p className={`text-xs mt-0.5 ${bkg.client_paid ? "text-emerald-300" : "text-amber-300"}`}>
                      {bkg.client_paid ? "Collected" : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-300">
                      {formatCurrencyFull(bkg.margin)}
                    </p>
                    <p className="text-xs text-white/28">
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
