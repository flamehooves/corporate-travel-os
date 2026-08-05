"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { mockRequests } from "@/lib/mock-data";
import { RequestStatusBadge, TripTypeBadge } from "@/components/status-badge";
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

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Travel Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockRequests.filter((r) => !["completed", "cancelled"].includes(r.status)).length} active · {mockRequests.length} total
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests, travelers, clients..."
            className="w-full pl-9 pr-3.5 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground">Request</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground">Client · Traveler</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground hidden lg:table-cell">Route · Date</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Type</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground hidden xl:table-cell">Budget</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Assignee</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((req) => (
              <tr key={req.id} className="group hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/requests/${req.id}`} className="block">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {req.request_number}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{req.purpose}</p>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-foreground">{req.client?.company_name}</p>
                  <p className="text-xs text-muted-foreground">{req.traveler_name}</p>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <p className="text-sm text-foreground">{req.origin} → {req.destination}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(req.departure_date)}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <TripTypeBadge type={req.trip_type} />
                </td>
                <td className="px-5 py-4 hidden xl:table-cell">
                  {req.budget ? (
                    <p className="text-sm text-foreground">{formatCurrency(req.budget)}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <RequestStatusBadge status={req.status} />
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  {req.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-primary">
                          {req.assignee.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{req.assignee.name.split(" ")[0]}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <p className="text-xs text-muted-foreground">{timeAgo(req.submitted_at)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No requests match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
