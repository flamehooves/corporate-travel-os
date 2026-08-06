"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
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
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
              {activeCount} active &middot; {mockRequests.length} total
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              Travel Requests
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-white/[0.09] hover:bg-white/[0.15] border border-white/[0.11] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0">
            <Plus className="w-4 h-4" weight="bold" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-5 scrollbar-none">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-white/[0.07] text-white/40 hover:bg-white/[0.11] hover:text-white/65"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/22" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests, travelers, clients..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.09] rounded-xl text-white/75 text-sm placeholder-white/22 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/18 focus:bg-white/[0.08] transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.06] border border-white/[0.09] rounded-xl text-sm text-white/30 hover:text-white/55 hover:bg-white/[0.09] transition-all flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Filter</span>
          </button>
        </div>

        {/* Dark glass table */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider">Request</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden sm:table-cell">Client · Traveler</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden lg:table-cell">Route · Date</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden xl:table-cell">Budget</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden sm:table-cell">Assignee</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-white/22 uppercase tracking-wider hidden md:table-cell">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.04] transition-colors group"
                >
                  <td className="px-4 py-4">
                    <Link href={`/requests/${req.id}`} className="block">
                      <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                        {req.request_number}
                      </p>
                      <p className="text-xs text-white/28 mt-0.5">{req.purpose}</p>
                      <p className="text-xs text-white/28 sm:hidden mt-0.5">
                        {req.client?.company_name} · {req.traveler_name}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-sm font-semibold text-white/65">{req.client?.company_name}</p>
                    <p className="text-xs text-white/30">{req.traveler_name}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-white/60">{req.origin} → {req.destination}</p>
                    <p className="text-xs text-white/28">{formatDate(req.departure_date)}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <TripTypesBadge types={req.trip_types} />
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    {req.budget ? (
                      <p className="text-sm font-semibold text-white/60">{formatCurrency(req.budget)}</p>
                    ) : (
                      <p className="text-xs text-white/18">—</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <RequestStatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    {req.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-700/60 border border-white/[0.08] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white/50">
                            {req.assignee.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-white/30">{req.assignee.name.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/18">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-xs text-white/28">{timeAgo(req.submitted_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-white/22 text-sm">No requests match your filters</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
