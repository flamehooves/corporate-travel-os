"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
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
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Finance & Cash Flow</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Receivables, payables, and margin visibility
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Outstanding Receivables"
          value={formatCurrency(totalReceivable)}
          subtitle="Across all clients"
          icon={Clock}
          alert={overdueAmount > 0}
        />
        <MetricCard
          title="Overdue Amount"
          value={formatCurrency(overdueAmount)}
          subtitle="Requires immediate action"
          icon={AlertTriangle}
          alert={overdueAmount > 0}
        />
        <MetricCard
          title="Supplier Payables"
          value={formatCurrency(supplierPayables)}
          subtitle="Credit balances due"
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Margin (MTD)"
          value={formatCurrency(totalMargin)}
          subtitle="Across confirmed bookings"
          icon={CheckCircle2}
          trend={{ value: "vs last month", positive: true }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Receivables */}
      {tab === "Receivables" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/20">
            <div className="grid grid-cols-6 gap-4">
              <p className="text-xs font-medium text-muted-foreground col-span-2">Invoice</p>
              <p className="text-xs font-medium text-muted-foreground">Client</p>
              <p className="text-xs font-medium text-muted-foreground">Amount</p>
              <p className="text-xs font-medium text-muted-foreground">Due Date</p>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
            </div>
          </div>
          {mockInvoices.map((inv) => {
            const outstanding = inv.total_amount - inv.paid_amount;
            return (
              <div
                key={inv.id}
                className={`px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors ${
                  inv.status === "overdue" ? "bg-red-50/50 dark:bg-red-950/10" : ""
                }`}
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-foreground">{inv.invoice_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Issued {formatDate(inv.issued_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{inv.client?.company_name}</p>
                    <p className="text-xs text-muted-foreground">{inv.notes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatCurrencyFull(outstanding)}</p>
                    {inv.paid_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrencyFull(inv.paid_amount)} paid
                      </p>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${isOverdue(inv.due_date) && inv.status !== "paid" ? "text-red-600 dark:text-red-400 font-medium" : "text-foreground"}`}>
                      {formatDate(inv.due_date)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <InvoiceStatusBadge status={inv.status} />
                    {inv.status !== "paid" && (
                      <button className="text-xs text-primary hover:underline ml-2">
                        Record Payment
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
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/20">
            <div className="grid grid-cols-5 gap-4">
              <p className="text-xs font-medium text-muted-foreground col-span-2">Supplier</p>
              <p className="text-xs font-medium text-muted-foreground">Type</p>
              <p className="text-xs font-medium text-muted-foreground">Credit Balance</p>
              <p className="text-xs font-medium text-muted-foreground">Action</p>
            </div>
          </div>
          {mockSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
            >
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">{sup.name}</p>
                  {sup.contact_email && (
                    <p className="text-xs text-muted-foreground">{sup.contact_email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{sup.type}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    sup.credit_balance > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground"
                  }`}>
                    {sup.credit_balance > 0
                      ? formatCurrencyFull(sup.credit_balance)
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {sup.portal_url && (
                    <a
                      href={sup.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Open Portal
                    </a>
                  )}
                  {sup.credit_balance > 0 && (
                    <button className="text-xs text-muted-foreground border border-border rounded px-2 py-1 hover:text-foreground transition-colors">
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
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/20">
            <div className="grid grid-cols-6 gap-4">
              <p className="text-xs font-medium text-muted-foreground">Booking</p>
              <p className="text-xs font-medium text-muted-foreground col-span-2">Request</p>
              <p className="text-xs font-medium text-muted-foreground">Supplier Cost</p>
              <p className="text-xs font-medium text-muted-foreground">Client Price</p>
              <p className="text-xs font-medium text-muted-foreground">Margin</p>
            </div>
          </div>
          {mockBookings.map((bkg) => (
            <div
              key={bkg.id}
              className="px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">{bkg.booking_number}</p>
                  <p className="text-xs text-muted-foreground">{bkg.supplier_system}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-foreground">
                    {bkg.request?.traveler_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {bkg.request?.origin} → {bkg.request?.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground">{formatCurrencyFull(bkg.supplier_cost)}</p>
                  <p className={`text-xs mt-0.5 ${bkg.supplier_paid ? "text-emerald-600" : "text-amber-600"}`}>
                    {bkg.supplier_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground">{formatCurrencyFull(bkg.client_price)}</p>
                  <p className={`text-xs mt-0.5 ${bkg.client_paid ? "text-emerald-600" : "text-amber-600"}`}>
                    {bkg.client_paid ? "Collected" : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyFull(bkg.margin)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((bkg.margin / bkg.client_price) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
