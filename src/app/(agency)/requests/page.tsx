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

        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] mb-2">
              {activeCount} active &middot; {mockRequests.length} total
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight leading-none">
              Travel Requests
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shrink-0 shadow-sm shadow-indigo-200">
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
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f.value
                  ? "bg-[#1e1b4b] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests, travelers, clients..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:border-gray-300 transition-all shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-[18px] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Client · Traveler</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Route · Date</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Budget</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Assignee</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <Link href={`/requests/${req.id}`} className="block">
                      <p className="text-sm font-bold text-[#1e1b4b] group-hover:text-[#6366f1] transition-colors">
                        {req.request_number}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{req.purpose}</p>
                      <p className="text-xs text-slate-400 sm:hidden mt-0.5">
                        {req.client?.company_name} · {req.traveler_name}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-sm font-semibold text-slate-700">{req.client?.company_name}</p>
                    <p className="text-xs text-slate-400">{req.traveler_name}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-slate-600">{req.origin} → {req.destination}</p>
                    <p className="text-xs text-slate-400">{formatDate(req.departure_date)}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <TripTypesBadge types={req.trip_types} />
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    {req.budget ? (
                      <p className="text-sm font-semibold text-slate-600">{formatCurrency(req.budget)}</p>
                    ) : (
                      <p className="text-xs text-slate-300">—</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <RequestStatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    {req.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-indigo-600">
                            {req.assignee.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">{req.assignee.name.split(" ")[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-xs text-slate-400">{timeAgo(req.submitted_at)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-sm">No requests match your filters</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
