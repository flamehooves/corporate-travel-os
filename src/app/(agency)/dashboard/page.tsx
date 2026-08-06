"use client";

import Link from "next/link";
import { ArrowRight, Plus, Zap, TrendingUp, AlertCircle, Banknote } from "lucide-react";
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

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              Travelio · Operations
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-2">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/requests"
            className="flex items-center gap-2 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-shrink-0 shadow-lg shadow-violet-900/50"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Request</span>
          </Link>
        </div>

        {/* Metrics strip — 4 vivid glass cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-violet-500/20 backdrop-blur-xl border border-violet-400/25 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-violet-300/60 text-[10px] font-bold uppercase tracking-wider">Active</p>
              <div className="w-7 h-7 rounded-lg bg-violet-500/30 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-violet-300" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{dashboardMetrics.activeRequests}</p>
            <p className="text-white/30 text-xs mt-1.5">requests in progress</p>
          </div>

          <div className="bg-emerald-500/15 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-wider">Revenue MTD</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/25 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.totalRevenue)}</p>
            <p className="text-white/30 text-xs mt-1.5">this month</p>
          </div>

          <div className="bg-amber-500/15 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-amber-300/60 text-[10px] font-bold uppercase tracking-wider">Receivables</p>
              <div className="w-7 h-7 rounded-lg bg-amber-500/25 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.outstandingReceivables)}</p>
            <p className="text-white/30 text-xs mt-1.5">outstanding</p>
          </div>

          <div className="bg-rose-500/10 backdrop-blur-xl border border-rose-400/15 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-rose-300/60 text-[10px] font-bold uppercase tracking-wider">Payables Due</p>
              <div className="w-7 h-7 rounded-lg bg-rose-500/25 flex items-center justify-center">
                <Banknote className="w-3.5 h-3.5 text-rose-300" />
              </div>
            </div>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(dashboardMetrics.supplierPayablesDue)}</p>
            <p className="text-white/30 text-xs mt-1.5">to suppliers</p>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — 2/3 width: New Requests + Needs Work */}
          <div className="lg:col-span-2 space-y-4">

            {/* New Requests */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black text-white uppercase tracking-widest">⚡ New Requests</h2>
                  {newRequests.length > 0 && (
                    <span className="bg-violet-500/60 text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {newRequests.length}
                    </span>
                  )}
                </div>
                <Link href="/requests" className="text-white/35 hover:text-white/65 text-xs font-bold flex items-center gap-0.5 transition-colors">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {newRequests.length === 0 ? (
                <div className="rounded-xl p-6 text-center border border-dashed border-white/10">
                  <p className="text-white/30 text-sm">All caught up — no new requests.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {newRequests.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-violet-400/25 rounded-xl transition-all group">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-700/40">
                        <span className="text-white text-[10px] font-black">
                          {req.destination.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white/90 leading-tight">
                          {req.traveler_name}
                          <span className="text-white/30 font-normal ml-1.5 text-xs">{req.request_number}</span>
                        </p>
                        <p className="text-xs text-white/35 mt-0.5 truncate">
                          {req.origin} → {req.destination} · {req.client?.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RequestStatusBadge status={req.status} />
                        <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-violet-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Needs Work */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xs font-black text-white uppercase tracking-widest">🔧 Needs Your Work</h2>
                {pendingWork.length > 0 && (
                  <span className="bg-amber-500/50 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                    {pendingWork.length}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {pendingWork.map((req) => (
                  <Link key={req.id} href={`/requests/${req.id}`}
                    className="flex items-center gap-3 p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-amber-400/25 rounded-xl transition-all group">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-offset-0 ${
                      req.status === "options_shared"
                        ? "bg-violet-400 ring-violet-400/30"
                        : req.status === "in_review"
                        ? "bg-sky-400 ring-sky-400/30"
                        : "bg-emerald-400 ring-emerald-400/30"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/90 leading-tight">
                        {req.request_number}
                        <span className="text-white/30 font-normal ml-1.5 text-xs">{req.traveler_name}</span>
                      </p>
                      <p className="text-xs text-white/35 mt-0.5 truncate">
                        {req.origin} → {req.destination} · {formatDate(req.departure_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <RequestStatusBadge status={req.status} />
                      <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right — 1/3 width: Today's Pulse + Upcoming */}
          <div className="space-y-4">

            {/* Today's Pulse — compact secondary widget */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
                Today&apos;s Pulse ·{" "}
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { emoji: "✈️", count: departingToday.length, label: "Departing", color: "text-sky-300" },
                  { emoji: "🏨", count: stayingToday.length, label: "Staying", color: "text-violet-300" },
                  { emoji: "🔄", count: returningToday.length, label: "Returning", color: "text-emerald-300" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.04] rounded-xl py-3 text-center">
                    <p className="text-base leading-none mb-1">{item.emoji}</p>
                    <p className={`text-xl font-black leading-none ${item.color}`}>{item.count}</p>
                    <p className="text-white/30 text-[9px] mt-1 font-semibold uppercase tracking-wide">{item.label}</p>
                  </div>
                ))}
              </div>
              {(departingToday.length + stayingToday.length + returningToday.length) > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.07] space-y-1.5">
                  {departingToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/40 truncate">✈️ {r.traveler_name} → {r.destination}</p>
                  ))}
                  {stayingToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/40 truncate">🏨 {r.traveler_name} in {r.destination}</p>
                  ))}
                  {returningToday.slice(0, 1).map((r) => (
                    <p key={r.id} className="text-[11px] text-white/40 truncate">🔄 {r.traveler_name} from {r.destination}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Departures */}
            {upcomingDepartures.length > 0 && (
              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
                  🛫 Upcoming
                </p>
                <div className="space-y-3">
                  {upcomingDepartures.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 hover:opacity-75 transition-opacity">
                      <div className="text-center flex-shrink-0 w-9">
                        <p className="text-sm font-black text-white leading-none">
                          {new Date(req.departure_date).getDate()}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase font-bold mt-0.5">
                          {new Date(req.departure_date).toLocaleString("en", { month: "short" })}
                        </p>
                      </div>
                      <div className="w-px h-6 bg-white/[0.08] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/75 leading-tight truncate">
                          {req.traveler_name}
                        </p>
                        <p className="text-[10px] text-white/35 mt-0.5 truncate">
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
