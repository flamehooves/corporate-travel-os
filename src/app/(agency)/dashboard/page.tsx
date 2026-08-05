"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Wallet,
  Building2,
  Bell,
  RefreshCw,
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { RequestStatusBadge, TripTypesBadge } from "@/components/status-badge";
import { mockRequests, mockInvoices, dashboardMetrics } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateTime, timeAgo } from "@/lib/utils";

const urgentItems = [
  {
    id: 1,
    type: "overdue_invoice",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/30",
    title: "Invoice overdue — Infosys Limited",
    description: "INV-2026-0231 · ₹4,54,300 · 5 days overdue",
    action: "View Invoice",
    href: "/finance",
  },
  {
    id: 2,
    type: "pending_approval",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    title: "Options shared, awaiting client approval",
    description: "REQ-2026-0847 · Vikram Anand · Mumbai → Delhi · Due Aug 7",
    action: "View Request",
    href: "/requests/r1",
  },
  {
    id: 3,
    type: "new_request",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    title: "New request needs attention — TCS",
    description: "REQ-2026-0846 · Rohit Sharma · Bangalore → Singapore · Business class",
    action: "Review Now",
    href: "/requests/r2",
  },
  {
    id: 4,
    type: "supplier_payment",
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    title: "Supplier payment due this week",
    description: "Travel Boutique Online · ₹85,000 · Due Aug 8",
    action: "View Finance",
    href: "/finance",
  },
];

export default function DashboardPage() {
  const activeRequests = mockRequests.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  );
  const recentRequests = mockRequests.slice(0, 5);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tuesday, 5 August 2026 · Travelio Operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 border border-border rounded-lg">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="relative p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Active Requests"
          value={dashboardMetrics.activeRequests}
          subtitle={`${dashboardMetrics.pendingApprovals} awaiting approval`}
          icon={FileText}
          trend={{ value: "2 new today", positive: true }}
        />
        <MetricCard
          title="Revenue This Month"
          value={formatCurrency(dashboardMetrics.totalRevenue)}
          subtitle="14 bookings completed"
          icon={TrendingUp}
          trend={{ value: "12% vs last month", positive: true }}
        />
        <MetricCard
          title="Outstanding Receivables"
          value={formatCurrency(dashboardMetrics.outstandingReceivables)}
          subtitle="Across 4 clients"
          icon={Wallet}
          alert={dashboardMetrics.overdueInvoices > 0}
          trend={{ value: "1 invoice overdue", positive: false }}
        />
        <MetricCard
          title="Supplier Payables Due"
          value={formatCurrency(dashboardMetrics.supplierPayablesDue)}
          subtitle="Due this week"
          icon={Building2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Needs Your Attention</h2>
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
              {urgentItems.length} items
            </span>
          </div>
          <div className="space-y-2.5">
            {urgentItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${item.bg}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
                    >
                      {item.action}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Requests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Active Requests</h2>
            <Link
              href="/requests"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Request</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Travel</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <Link href={`/requests/${req.id}`} className="block">
                        <p className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                          {req.request_number}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{req.traveler_name}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-foreground">{req.client?.company_name}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-sm text-foreground">{req.origin} → {req.destination}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(req.departure_date)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <RequestStatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-primary">
                            {req.assignee?.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{req.assignee?.name.split(" ")[0]}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Travel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Departures</h2>
          </div>
          <div className="space-y-2">
            {mockRequests
              .filter((r) => ["booked", "approved"].includes(r.status))
              .map((req) => (
                <div key={req.id} className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 text-center">
                    <p className="text-lg font-semibold text-foreground leading-none">
                      {new Date(req.departure_date).getDate()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(req.departure_date).toLocaleString("en", { month: "short" })}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{req.traveler_name}</p>
                    <p className="text-xs text-muted-foreground">{req.origin} → {req.destination} · {req.client?.company_name}</p>
                  </div>
                  <TripTypesBadge types={req.trip_types} />
                  <RequestStatusBadge status={req.status} />
                </div>
              ))}
          </div>
        </div>

        {/* Receivables Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Receivables by Client</h2>
            <Link href="/finance" className="text-xs text-primary hover:underline font-medium">
              Full report
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {mockInvoices
              .filter((inv) => inv.status !== "paid")
              .slice(0, 4)
              .map((inv, i, arr) => (
                <div
                  key={inv.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{inv.client?.company_name}</p>
                    <p className="text-xs text-muted-foreground">{inv.invoice_number} · Due {formatDate(inv.due_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(inv.total_amount - inv.paid_amount)}
                    </p>
                    <div className="flex justify-end mt-0.5">
                      {inv.status === "overdue" && (
                        <span className="text-[10px] font-medium text-red-600 dark:text-red-400">OVERDUE</span>
                      )}
                      {inv.status === "partial" && (
                        <span className="text-[10px] font-medium text-amber-600">PARTIAL</span>
                      )}
                      {inv.status === "sent" && (
                        <span className="text-[10px] font-medium text-blue-600">SENT</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "Booking confirmed — Suresh Kumar, DEL → London (BKG-2026-0412)", time: mockRequests[3].submitted_at },
            { icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30", text: "Options shared with Infosys — REQ-2026-0847 (2 flights + 1 hotel)", time: "2026-08-05T11:30:00Z" },
            { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", text: "New request received from TCS — Rohit Sharma, BLR → Singapore", time: mockRequests[1].submitted_at },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${item.bg}`}>
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <p className="text-sm text-foreground flex-1">{item.text}</p>
              <p className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
