"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Plane,
} from "lucide-react";
import { mockClients, mockRequests } from "@/lib/mock-data";
import { RequestStatusBadge, TripTypesBadge } from "@/components/status-badge";
import { formatDate, timeAgo } from "@/lib/utils";

export default function PortalHomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const client = mockClients.find((c) => c.portal_token === token);

  const clientRequests = mockRequests.filter(
    (r) => client && r.client_id === client.id
  );

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">This portal link is invalid or has expired.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Contact your travel consultant for a new link.
        </p>
      </div>
    );
  }

  const active = clientRequests.filter(
    (r) => !["completed", "cancelled"].includes(r.status)
  );
  const completed = clientRequests.filter((r) => r.status === "completed");
  const awaitingApproval = clientRequests.filter(
    (r) => r.status === "options_shared"
  );

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {client.contact_name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {client.company_name} · Travel workspace
        </p>
      </div>

      {/* Awaiting approval banner */}
      {awaitingApproval.length > 0 && (
        <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="p-2.5 bg-primary/15 rounded-lg flex-shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {awaitingApproval.length === 1
                ? "Options are ready for your review"
                : `${awaitingApproval.length} requests have options ready`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your travel consultant has shared recommendations — please review and approve to proceed.
            </p>
          </div>
          <Link
            href={`/portal/${token}/requests/${awaitingApproval[0].id}`}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            Review Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Active Requests</p>
          <p className="text-2xl font-semibold text-foreground">{active.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Awaiting Review</p>
          <p className={`text-2xl font-semibold ${awaitingApproval.length > 0 ? "text-primary" : "text-foreground"}`}>
            {awaitingApproval.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-semibold text-foreground">{completed.length}</p>
        </div>
      </div>

      {/* Requests */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Your Travel Requests</h2>
        <Link
          href={`/portal/${token}/requests/new`}
          className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      <div className="space-y-3">
        {clientRequests.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
            <Plane className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No travel requests yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Submit a request and your travel consultant will share curated options for you to review.
            </p>
            <Link
              href={`/portal/${token}/requests/new`}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Request
            </Link>
          </div>
        ) : (
          clientRequests.map((req) => (
            <Link
              key={req.id}
              href={`/portal/${token}/requests/${req.id}`}
              className="block bg-card border border-border rounded-xl p-4 hover:border-border/60 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <p className="text-sm font-medium text-foreground">{req.request_number}</p>
                    <RequestStatusBadge status={req.status} />
                  </div>
                  <p className="text-base font-medium text-foreground mb-2">{req.traveler_name}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {req.origin} → {req.destination}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(req.departure_date)}
                    </div>
                    <TripTypesBadge types={req.trip_types} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {req.options && req.options.length > 0 && (
                    <span className="text-xs text-primary font-medium">
                      {req.options.length} option{req.options.length > 1 ? "s" : ""} to review
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground">{timeAgo(req.submitted_at)}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
