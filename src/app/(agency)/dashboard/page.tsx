"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { mockRequests, dashboardMetrics } from "@/lib/mock-data";
import { RequestStatusBadge, TripTypesBadge } from "@/components/status-badge";
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
      (r) =>
        ["booked", "approved"].includes(r.status) && r.departure_date > today
    )
    .slice(0, 4);

  const metrics = [
    { emoji: "⚡", label: "Active", value: String(dashboardMetrics.activeRequests) },
    { emoji: "💰", label: "Revenue MTD", value: formatCurrency(dashboardMetrics.totalRevenue) },
    { emoji: "📋", label: "Receivables", value: formatCurrency(dashboardMetrics.outstandingReceivables) },
    { emoji: "🏦", label: "Payables Due", value: formatCurrency(dashboardMetrics.supplierPayablesDue) },
  ];

  const pulseItems = [
    {
      emoji: "✈️", count: departingToday.length, label: "Departing",
      gradient: "from-sky-500/25 to-blue-600/20", border: "border-sky-400/25",
      items: departingToday,
    },
    {
      emoji: "🏨", count: stayingToday.length, label: "Staying",
      gradient: "from-violet-500/25 to-purple-600/20", border: "border-violet-400/25",
      items: stayingToday,
    },
    {
      emoji: "🔄", count: returningToday.length, label: "Returning",
      gradient: "from-emerald-500/25 to-teal-600/20", border: "border-emerald-400/25",
      items: returningToday,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Travel backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg,#020617 0%,#0f0d35 18%,#1e1065 42%,#3b0f8a 68%,#5b21b6 88%,#7c3aed 100%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[
            [8,12],[15,35],[23,8],[32,55],[41,22],[52,41],[61,15],[74,68],
            [83,30],[91,50],[5,70],[18,85],[29,60],[47,78],[66,45],[79,88],
            [88,65],[95,20],[38,92],[57,5],[12,48],[70,25],[44,12],[85,78],
            [3,40],[25,90],[58,28],[72,55],[96,75],[35,18],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={`${cx}%`} cy={`${cy}%`}
              r={i % 5 === 0 ? "1.8" : "1"} fill="white"
              opacity={0.15 + (i % 6) * 0.07}
            />
          ))}
          <path d="M 5% 85% Q 38% 18% 95% 52%" stroke="white" strokeWidth="0.8"
            fill="none" opacity="0.09" strokeDasharray="10 5" />
          <path d="M 12% 72% Q 55% 12% 88% 78%" stroke="white" strokeWidth="0.5"
            fill="none" opacity="0.06" strokeDasharray="7 4" />
        </svg>
        <svg className="absolute right-2 top-8 lg:right-12 lg:top-14 opacity-[0.055] rotate-12"
          width="260" height="150" viewBox="0 0 56 32" fill="white">
          <path d="M54 16L2 2l3.5 14L2 30 54 16Z" />
          <path d="M14 16L1 10l2 6-2 6 13-6Z" />
          <path d="M42 16l-7-6 1.5 6-1.5 6 7-6Z" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Dark header */}
        <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
          <div className="flex items-start justify-between gap-3 mb-7">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.22em] mb-1.5">
                Travelio Operations
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                Dashboard
              </h1>
              <p className="text-white/45 text-sm mt-2">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <Link
              href="/requests"
              className="flex items-center gap-2 bg-white/12 hover:bg-white/22 border border-white/20 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
            </Link>
          </div>

          {/* Today's Pulse */}
          <p className="text-white/38 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
            Today&apos;s Pulse &middot;{" "}
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pb-7">
            {pulseItems.map((item) => (
              <div
                key={item.label}
                className={`bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-2xl p-3 sm:p-4 text-center`}
              >
                <div className="text-xl sm:text-2xl mb-1.5 leading-none">{item.emoji}</div>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">{item.count}</p>
                <p className="text-white/55 text-[10px] sm:text-xs mt-1.5 font-semibold">{item.label}</p>
                {item.count > 0 && (
                  <p className="text-white/38 text-[9px] mt-0.5 truncate">
                    {item.items[0].traveler_name}{item.count > 1 ? ` +${item.count - 1}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* White slide-up panel */}
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-24px_64px_rgba(0,0,0,0.45)] min-h-[65vh]">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">

            {/* Quick metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {metrics.map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
                  <span className="text-xl leading-none">{m.emoji}</span>
                  <p className="text-lg sm:text-2xl font-black text-gray-900 mt-2 leading-none">{m.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-semibold">{m.label}</p>
                </div>
              ))}
            </div>

            {/* New Requests */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  ⚡ New Requests
                  {newRequests.length > 0 && (
                    <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {newRequests.length}
                    </span>
                  )}
                </h2>
                <Link href="/requests" className="text-violet-600 text-xs font-bold hover:underline flex items-center gap-0.5">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {newRequests.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">All caught up — no new requests.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {newRequests.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 rounded-2xl transition-all group">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/30">
                        <span className="text-white text-[10px] font-black">
                          {req.destination.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {req.traveler_name}
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">{req.request_number}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {req.origin} → {req.destination} · {req.client?.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RequestStatusBadge status={req.status} />
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Pending Work */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  🔧 Needs Your Work
                  {pendingWork.length > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                      {pendingWork.length}
                    </span>
                  )}
                </h2>
              </div>
              <div className="space-y-2">
                {pendingWork.map((req) => (
                  <Link key={req.id} href={`/requests/${req.id}`}
                    className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-amber-50/60 border border-gray-100 hover:border-amber-200 rounded-2xl transition-all group">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      req.status === "options_shared" ? "bg-purple-400" :
                      req.status === "in_review" ? "bg-blue-400" : "bg-emerald-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {req.request_number}
                        <span className="text-gray-400 font-normal ml-1.5 text-xs">{req.traveler_name}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {req.origin} → {req.destination} · {formatDate(req.departure_date)} · {req.client?.company_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <RequestStatusBadge status={req.status} />
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Upcoming Departures */}
            {upcomingDepartures.length > 0 && (
              <section>
                <h2 className="text-base sm:text-lg font-black text-gray-900 mb-4">
                  🛫 Upcoming Departures
                </h2>
                <div className="space-y-2">
                  {upcomingDepartures.map((req) => (
                    <Link key={req.id} href={`/requests/${req.id}`}
                      className="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all">
                      <div className="text-center flex-shrink-0 w-9">
                        <p className="text-sm font-black text-gray-900 leading-none">
                          {new Date(req.departure_date).getDate()}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase font-bold mt-0.5">
                          {new Date(req.departure_date).toLocaleString("en", { month: "short" })}
                        </p>
                      </div>
                      <div className="w-px h-7 bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                          {req.traveler_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {req.origin} → {req.destination} · {req.client?.company_name}
                        </p>
                      </div>
                      <TripTypesBadge types={req.trip_types} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
