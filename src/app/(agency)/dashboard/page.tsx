"use client";

import {
  Plus,
  Lightning,
  Wrench,
  AirplaneTakeoff,
  AirplaneLanding,
  Buildings,
  FileText,
  TrendUp,
  Clock,
  Warning,
  ArrowRight,
} from "@phosphor-icons/react";
import { mockRequests, mockBookings, dashboardMetrics } from "@/lib/mock-data";
import { RequestStatusBadge } from "@/components/status-badge";
import Link from "next/link";

const TODAY = "2026-08-06";

function fmtLakhs(n: number): string {
  const L = n / 100000;
  return `₹${L >= 100 ? (L / 100).toFixed(1) + "Cr" : L.toFixed(1) + "L"}`;
}

const statusDot: Record<string, string> = {
  options_shared: "bg-[#6366f1]",
  approved: "bg-[#16a34a]",
  in_review: "bg-amber-400",
  pending: "bg-orange-400",
  booked: "bg-blue-400",
};

export default function DashboardPage() {
  const newRequests = mockRequests.filter((r) => r.status === "pending");
  const needsWork = mockRequests.filter((r) =>
    ["in_review", "options_shared", "approved"].includes(r.status)
  );
  const activeCount = mockRequests.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  ).length;

  const departing = mockRequests.filter(
    (r) => r.departure_date?.startsWith(TODAY) && r.status === "booked"
  );
  const returning = mockRequests.filter(
    (r) => r.return_date?.startsWith(TODAY) && r.status === "booked"
  );
  const staying = mockRequests.filter(
    (r) =>
      r.departure_date &&
      r.return_date &&
      r.departure_date < TODAY &&
      r.return_date > TODAY &&
      r.status === "booked"
  );

  const revenueMTD = mockBookings.reduce((s, b) => s + b.client_price, 0);
  const receivables = dashboardMetrics.outstandingReceivables;
  const payables = dashboardMetrics.supplierPayablesDue;
  const firstNew = newRequests[0];

  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-8 lg:px-10 pt-7 pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">

            {/* Greeting row */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-0.5">Welcome back,</p>
                <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight leading-none">
                  Priya Sharma
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400 hidden sm:block">Thursday, 6 August 2026</p>
                <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-indigo-200">
                  <Plus className="w-4 h-4" weight="bold" />
                  New Request
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#6366f1]" weight="fill" />
                  </div>
                </div>
                <p className="text-3xl font-black text-[#1e1b4b] leading-none">{mockRequests.length}</p>
                <p className="text-xs text-slate-400 mt-2">{activeCount} active</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue MTD</p>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <TrendUp className="w-4 h-4 text-[#16a34a]" weight="bold" />
                  </div>
                </div>
                <p className="text-3xl font-black text-[#1e1b4b] leading-none">{fmtLakhs(revenueMTD)}</p>
                <p className="text-xs text-slate-400 mt-2">this month</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receivables</p>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-500" weight="fill" />
                  </div>
                </div>
                <p className="text-3xl font-black text-[#1e1b4b] leading-none">{fmtLakhs(receivables)}</p>
                <p className="text-xs text-slate-400 mt-2">outstanding</p>
              </div>

              <div className="bg-red-50/50 border border-red-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Payables Due</p>
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Warning className="w-4 h-4 text-[#ef4444]" weight="fill" />
                  </div>
                </div>
                <p className="text-3xl font-black text-[#ef4444] leading-none">{fmtLakhs(payables)}</p>
                <p className="text-xs text-red-400 mt-2">overdue warning</p>
              </div>
            </div>

            {/* New Requests + Needs Your Work */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* New Requests */}
              <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lightning className="w-4 h-4 text-amber-500" weight="fill" />
                    <p className="text-sm font-bold text-[#1e1b4b]">New Requests</p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                    {newRequests.length}
                  </span>
                </div>

                {!firstNew ? (
                  <p className="text-sm text-slate-400 py-6 text-center">All caught up!</p>
                ) : (
                  <div className="border border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[11px] font-bold text-[#6366f1]">{firstNew.request_number}</p>
                      <p className="text-[10px] text-slate-400 shrink-0 truncate max-w-[110px]">
                        {firstNew.client?.company_name}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#1e1b4b]">{firstNew.traveler_name}</p>

                    {/* Dashed route */}
                    <div className="flex items-center gap-2 my-3.5">
                      <p className="text-xs font-black text-[#1e1b4b] shrink-0">
                        {firstNew.origin?.slice(0, 3).toUpperCase()}
                      </p>
                      <div className="flex-1 flex items-center">
                        <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                        <AirplaneTakeoff className="w-3.5 h-3.5 text-[#6366f1] mx-1.5 shrink-0" weight="fill" />
                        <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                      </div>
                      <p className="text-xs font-black text-[#1e1b4b] shrink-0">
                        {firstNew.destination?.slice(0, 3).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-bold transition-colors">
                        Review
                      </button>
                      <button className="flex-1 py-2 border border-gray-200 text-slate-500 hover:border-gray-300 hover:text-slate-700 rounded-xl text-xs font-semibold transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {newRequests.length > 1 && (
                  <Link
                    href="/requests"
                    className="flex items-center justify-center gap-1 mt-3 text-xs text-slate-400 hover:text-[#6366f1] transition-colors"
                  >
                    +{newRequests.length - 1} more <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Needs Your Work */}
              <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-400" weight="fill" />
                    <p className="text-sm font-bold text-[#1e1b4b]">Needs Your Work</p>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                    {needsWork.length}
                  </span>
                </div>

                {needsWork.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">Nothing pending</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {needsWork.slice(0, 4).map((req) => (
                      <Link
                        key={req.id}
                        href={`/requests/${req.id}`}
                        className="flex items-center gap-3 py-3 hover:bg-gray-50/80 rounded-xl px-1.5 -mx-1.5 transition-colors group"
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${statusDot[req.status] ?? "bg-slate-300"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[#1e1b4b] truncate">
                              {req.request_number}
                            </p>
                            <p className="text-xs text-slate-400 truncate hidden sm:block">
                              · {req.traveler_name}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {req.origin} → {req.destination}
                          </p>
                        </div>
                        <RequestStatusBadge status={req.status} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL 280px ── */}
          <div className="flex flex-col gap-4">

            {/* Finance Summary */}
            <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Finance Summary
              </p>
              <div className="space-y-2.5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-emerald-600 mb-1">Receivables</p>
                  <p className="text-2xl font-black text-emerald-700 leading-none">{fmtLakhs(receivables)}</p>
                  <p className="text-[10px] text-emerald-500 mt-1.5">across all clients</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-red-500 mb-1">Payables</p>
                  <p className="text-2xl font-black text-[#ef4444] leading-none">{fmtLakhs(payables)}</p>
                  <p className="text-[10px] text-red-400 mt-1.5">to suppliers</p>
                </div>
              </div>
            </div>

            {/* Today's Pulse */}
            <div className="bg-white border border-gray-100 rounded-[18px] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Today's Pulse
                </p>
                <p className="text-xs text-slate-400">6 Aug</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <AirplaneTakeoff className="w-4 h-4 text-[#6366f1]" weight="fill" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Departing · {departing.length}
                    </p>
                    <p className="text-sm font-bold text-[#1e1b4b]">
                      {departing[0]?.traveler_name ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Buildings className="w-4 h-4 text-amber-500" weight="fill" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Staying · {staying.length}
                    </p>
                    <p className="text-sm font-bold text-[#1e1b4b]">
                      {staying[0]?.traveler_name ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <AirplaneLanding className="w-4 h-4 text-[#16a34a]" weight="fill" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Returning · {returning.length}
                    </p>
                    <p className="text-sm font-bold text-[#1e1b4b]">
                      {returning[0]?.traveler_name ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-[#1e1b4b] rounded-[18px] p-5">
              <FileText className="w-8 h-8 text-white/25 mb-3" weight="fill" />
              <p className="text-sm font-semibold text-white leading-snug mb-5">
                Generate a statement to share with clients
              </p>
              <button className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 rounded-xl font-bold text-sm transition-colors">
                Generate Statement
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
