"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { mockRequests } from "@/lib/mock-data";
import { RequestStatusBadge, TripTypesBadge } from "@/components/status-badge";
import { formatDate, formatCurrency, timeAgo } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

const statusFilters: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Review", value: "in_review" },
  { label: "Options Shared", value: "options_shared" },
  { label: "Approved", value: "approved" },
  { label: "Booked", value: "booked" },
  { label: "Completed", value: "completed" },
];

export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockRequests.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch =
      !search ||
      r.request_number.toLowerCase().includes(search.toLowerCase()) ||
      r.traveler_name.toLowerCase().includes(search.toLowerCase()) ||
      r.client?.company_name.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = mockRequests.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  ).length;

  return (
    <div className="min-h-screen relative">
      {/* Navy backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg,#020617 0%,#0a1628 22%,#0f2240 50%,#1a3a5c 78%,#1e4d6e 100%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Grid / route network */}
          {[15, 35, 55, 75, 95].map((x) =>
            [20, 40, 60, 80].map((y) => (
              <circle key={`${x}-${y}`} cx={`${x}%`} cy={`${y}%`}
                r="1.2" fill="white" opacity="0.06" />
            ))
          )}
          <path d="M 10% 90% L 30% 40% L 60% 65% L 90% 20%"
            stroke="white" strokeWidth="0.6" fill="none" opacity="0.07" strokeDasharray="8 4" />
          <path d="M 5% 50% L 40% 20% L 70% 55% L 95% 35%"
            stroke="white" strokeWidth="0.5" fill="none" opacity="0.05" strokeDasharray="6 3" />
          {/* Location pin dots */}
          {[[10,90],[30,40],[60,65],[90,20],[40,20],[70,55],[5,50],[95,35]].map(([cx,cy],i) => (
            <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="3" fill="none"
              stroke="white" strokeWidth="0.8" opacity="0.12" />
          ))}
        </svg>
      </div>

      <div className="relative z-10">
        {/* Dark header */}
        <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-0">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.22em] mb-1.5">
                {activeCount} active &middot; {mockRequests.length} total
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                Travel Requests
              </h1>
            </div>
            <button className="flex items-center gap-2 bg-white/12 hover:bg-white/22 border border-white/20 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0 shadow-lg">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>

          {/* Status filter chips on dark bg */}
          <div className="flex items-center gap-2 overflow-x-auto pb-5 scrollbar-none">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === f.value
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-white/10 text-white/60 hover:bg-white/18 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* White panel */}
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-24px_64px_rgba(0,0,0,0.45)] min-h-[70vh]">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 bg-gray-200 rounded-full" />
          </div>
          <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">

            {/* Search + filter row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search requests, travelers, clients..."
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors bg-gray-50 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">Filter</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Request</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Client · Traveler</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Route · Date</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Budget</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Assignee</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((req) => (
                    <tr key={req.id} className="group hover:bg-violet-50/40 transition-colors">
                      <td className="px-4 py-4">
                        <Link href={`/requests/${req.id}`} className="block">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                            {req.request_number}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{req.purpose}</p>
                          <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                            {req.client?.company_name} · {req.traveler_name}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <p className="text-sm font-semibold text-gray-900">{req.client?.company_name}</p>
                        <p className="text-xs text-gray-400">{req.traveler_name}</p>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-900">{req.origin} → {req.destination}</p>
                        <p className="text-xs text-gray-400">{formatDate(req.departure_date)}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <TripTypesBadge types={req.trip_types} />
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        {req.budget ? (
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(req.budget)}</p>
                        ) : (
                          <p className="text-xs text-gray-300">—</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <RequestStatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {req.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-violet-600">
                                {req.assignee.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">{req.assignee.name.split(" ")[0]}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-xs text-gray-400">{timeAgo(req.submitted_at)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-gray-400 text-sm">No requests match your filters</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
