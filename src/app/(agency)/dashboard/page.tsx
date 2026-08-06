"use client";

import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Lightning,
  TrendUp,
  WarningCircle,
  Money,
  Wrench,
  AirplaneTakeoff,
  Buildings,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { mockRequests, dashboardMetrics } from "@/lib/mock-data";
import { RequestStatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const departingToday = mockRequests.filter(
    (r) => r.departure_date === today && r.status === "booked"
  );
  const stayingToday = mockRequests.filter(
    (r) =>
      r.status === "booked" &&
      r.trip_types.includes("hotel") &&
      r.departure_date < today &&
      !!r.return_date &&
      r.return_date > today
  );
  const returningToday = mockRequests.filter(
    (r) => r.status === "booked" && !!r.return_date && r.return_date === today
  );

  const newRequests = mockRequests.filter((r) => r.status === "pending");
  const pendingWork = mockRequests.filter((r) =>
    ["in_review", "approved", "options_shared"].includes(r.status)
  );
  const upcomingDepartures = mockRequests
    .filter(
      (r) => ["booked", "approved"].includes(r.status) && r.departure_date > today
    )
    .slice(0, 4);

  const pulseItems = [
    { icon: AirplaneTakeoff, count: departingToday.length, label: "Departing", color: "text-sky-300", items: departingToday },
    { icon: Buildings, count: stayingToday.length, label: "Staying", color: "text-slate-300", items: stayingToday },
    { icon: ArrowsClockwise, count: returningToday.length, label: "Returning", color: "text-emerald-300", items: returningToday },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              Travelio · Operations
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Dashboard
            </h1>
            <p className="text-white/35 text-sm mt-2">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/requests"
            className="flex items-center gap-2 bg-white/[0.09] hover:bg-white/[0.15] border border-white/[0.11] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">New Request</span>
          </Link>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-blue-500/[0.08] backdrop-blur-xl border border-blue-400/[0.13] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-blue-300/55 text-[10px] font-bold uppercase tracking-wider">Active</p>
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Lightning className="w-3.5 h-3.5 text-blue-300" weight="fill" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{dashboardMetrics.activeRequests}</p>
            <p className="text-white/25 text-xs mt-1.5">requests in progress</p>
          </div>

          <div className="bg-emerald-500/[0.08] backdrop-blur-xl border border-emerald-400/[0.12] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-emerald-300/55 text-[10px] font-bold uppercase tracking-wider">Revenue MTD</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendUp className="w-3.5 h-3.5 text-emerald-300" weight="fill" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.totalRevenue)}</p>
            <p className="text-white/25 text-xs mt-1.5">this month</p>
          </div>

          <div className="bg-amber-500/[0.08] backdrop-blur-xl border border-amber-400/[0.12] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-amber-300/55 text-[10px] font-bold uppercase tracking-wider">Receivables</p>
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <WarningCircle className="w-3.5 h-3.5 text-amber-300" weight="fill" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.outstandingReceivables)}</p>
            <p className="text-white/25 text-xs mt-1.5">outstanding</p>
          </div>

          <div className="bg-rose-500/[0.07] backdrop-blur-xl border border-rose-400/[0.10] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-rose-300/55 text-[10px] font-bold uppercase tracking-wider">Payables Due</p>
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Money className="w-3.5 h-3.5 text-rose-300" weight="fill" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.supplierPayablesDue)}</p>
            <p className="text-white/25 text-xs mt-1.5">to suppliers</p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — 2/3 */}
          <div className="lg:col-span-2 space-y-4">

            {/* New Requests */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightning className="w-3.5 h-3.5 text-white/50" weight="fill" />
                  <h2 className="text-xs font-black text-white/70 uppercase tracking-widest">New Requests</h2>
                  {newRequests.length > 0 && (
                    <span className="bg-white/[0.09] text-white/60 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {newRequests.length}
                    </span>
                  )}
                </div>
                <Link href="/requests" className="text-white/30 hover:text-white/60 text-xs font-semibold flex items-center gap-0.5 transition-colors">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {newRequests.length === 0 ? (
                <div className="rounded-xl p-6 text-center border border-dashed border-white/[0.08]">
                  <p className="text-white/25 text-sm">All caught up — no new requests.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {newRequests.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 p-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all group">
                      <div className="w-9 h-9 rounded-xl bg-slate-700/60 border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                        <span className="text-white/55 text-[10px] font-black">
                          {req.destination.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white/80 leading-tight">
                          {req.traveler_name}
                          <span className="text-white/25 font-normal ml-1.5 text-xs">{req.request_number}</span>
                        </p>
                        <p className="text-xs text-white/30 mt-0.5 truncate">
                          {req.origin} → {req.destination} · {req.client?.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RequestStatusBadge status={req.status} />
                        <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/45 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Needs Work */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-3.5 h-3.5 text-white/50" weight="fill" />
                <h2 className="text-xs font-black text-white/70 uppercase tracking-widest">Needs Your Work</h2>
                {pendingWork.length > 0 && (
                  <span className="bg-amber-500/30 text-amber-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                    {pendingWork.length}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {pendingWork.map((req) => (
                  <Link key={req.id} href={`/requests/${req.id}`}
                    className="flex items-center gap-3 p-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all group">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      req.status === "options_shared"
                        ? "bg-blue-400"
                        : req.status === "in_review"
                        ? "bg-sky-400"
                        : "bg-emerald-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/80 leading-tight">
                        {req.request_number}
                        <span className="text-white/25 font-normal ml-1.5 text-xs">{req.traveler_name}</span>
                      </p>
                      <p className="text-xs text-white/30 mt-0.5 truncate">
                        {req.origin} → {req.destination} · {formatDate(req.departure_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <RequestStatusBadge status={req.status} />
                      <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/45 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right — 1/3 */}
          <div className="space-y-4">

            {/* Today's Pulse */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4">
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
                Today&apos;s Pulse ·{" "}
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {pulseItems.map((item) => (
                  <div key={item.label} className="bg-white/[0.03] rounded-xl py-3 text-center">
                    <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} weight="fill" />
                    <p className={`text-xl font-black leading-none ${item.color}`}>{item.count}</p>
                    <p className="text-white/25 text-[9px] mt-1 font-semibold uppercase tracking-wide">{item.label}</p>
                  </div>
                ))}
              </div>
              {(departingToday.length + stayingToday.length + returningToday.length) > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1.5">
                  {departingToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/35 truncate">{r.traveler_name} → {r.destination}</p>
                  ))}
                  {stayingToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/35 truncate">{r.traveler_name} in {r.destination}</p>
                  ))}
                  {returningToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/35 truncate">{r.traveler_name} from {r.destination}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            {upcomingDepartures.length > 0 && (
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AirplaneTakeoff className="w-3.5 h-3.5 text-white/40" weight="fill" />
                  <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.18em]">Upcoming</p>
                </div>
                <div className="space-y-3">
                  {upcomingDepartures.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 hover:opacity-75 transition-opacity">
                      <div className="text-center flex-shrink-0 w-9">
                        <p className="text-sm font-black text-white/75 leading-none">
                          {new Date(req.departure_date).getDate()}
                        </p>
                        <p className="text-[9px] text-white/25 uppercase font-bold mt-0.5">
                          {new Date(req.departure_date).toLocaleString("en", { month: "short" })}
                        </p>
                      </div>
                      <div className="w-px h-6 bg-white/[0.07] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/65 leading-tight truncate">
                          {req.traveler_name}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5 truncate">
                          {req.origin} → {req.destination}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
