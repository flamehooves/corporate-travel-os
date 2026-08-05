"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  MessageSquare,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { mockRequests } from "@/lib/mock-data";
import { RequestStatusBadge, TripTypeBadge } from "@/components/status-badge";
import { formatDate, formatDateTime, formatCurrencyFull, timeAgo } from "@/lib/utils";
import type { RequestOption } from "@/lib/types";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const request = mockRequests.find((r) => r.id === id);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"options" | "discussion" | "details">("options");
  const [expandedOption, setExpandedOption] = useState<string | null>("opt1");

  if (!request) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Request not found.</p>
        <Link href="/requests" className="text-primary text-sm mt-2 inline-block hover:underline">
          Back to requests
        </Link>
      </div>
    );
  }

  const options = request.options || [];
  const messages = request.messages || [];

  return (
    <div className="flex h-full">
      {/* Main panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-3xl">
          {/* Back + header */}
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Requests
          </Link>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{request.request_number}</h1>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {request.client?.company_name} · {request.traveler_name} · Submitted {timeAgo(request.submitted_at)}
              </p>
            </div>
            {request.status === "approved" && (
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <BookOpen className="w-4 h-4" />
                Confirm Booking
              </button>
            )}
            {request.status === "options_shared" && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Awaiting client approval</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {request.due_at ? `Due ${formatDate(request.due_at)}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Trip summary card */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Route</p>
                <p className="text-sm font-medium text-foreground">
                  {request.origin} → {request.destination}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dates</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(request.departure_date)}
                  {request.return_date && ` – ${formatDate(request.return_date)}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <TripTypeBadge type={request.trip_type} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-sm font-medium text-foreground">
                  {request.budget ? formatCurrencyFull(request.budget) : "Not specified"}
                </p>
              </div>
            </div>
            {request.special_instructions && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Special Instructions</p>
                <p className="text-sm text-foreground">{request.special_instructions}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg mb-5 w-fit">
            {(["options", "discussion", "details"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {tab === "options" && options.length > 0 && (
                  <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {options.length}
                  </span>
                )}
                {tab === "discussion" && messages.length > 0 && (
                  <span className="ml-1.5 text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">
                    {messages.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Options tab */}
          {activeTab === "options" && (
            <div className="space-y-3">
              {options.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No options added yet</p>
                  <button className="text-sm text-primary hover:underline">
                    Add your first recommendation
                  </button>
                </div>
              ) : (
                options.map((opt) => (
                  <OptionCard
                    key={opt.id}
                    option={opt}
                    expanded={expandedOption === opt.id}
                    onToggle={() =>
                      setExpandedOption(expandedOption === opt.id ? null : opt.id)
                    }
                  />
                ))
              )}

              <button className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
                + Add another option
              </button>
            </div>
          )}

          {/* Discussion tab */}
          {activeTab === "discussion" && (
            <div>
              <div className="space-y-4 mb-5">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender_type === "agency" ? "flex-row-reverse" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {msg.sender_name.charAt(0)}
                        </span>
                      </div>
                      <div
                        className={`flex-1 max-w-[85%] ${
                          msg.sender_type === "agency" ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-xl px-4 py-3 text-sm ${
                            msg.sender_type === "agency"
                              ? "bg-primary text-white rounded-tr-sm"
                              : "bg-secondary text-foreground rounded-tl-sm"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {msg.sender_name} · {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message input */}
              <div className="flex gap-2 items-end">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to the client..."
                  rows={2}
                  className="flex-1 px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
                <button
                  disabled={!message.trim()}
                  className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Details tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Traveler Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: User, label: "Name", value: request.traveler_name },
                    { icon: Briefcase, label: "Company", value: request.client?.company_name },
                    { icon: MapPin, label: "Preferred Class", value: request.preferred_class || "Not specified" },
                    { icon: DollarSign, label: "Budget", value: request.budget ? formatCurrencyFull(request.budget) : "Not specified" },
                    { icon: Calendar, label: "Departure", value: formatDate(request.departure_date) },
                    { icon: Calendar, label: "Return", value: request.return_date ? formatDate(request.return_date) : "One way" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                      <p className="text-sm text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Assignment</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {request.assignee?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.assignee?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{request.assignee?.role}</p>
                  </div>
                  <button className="ml-auto text-xs text-primary hover:underline">Reassign</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar — client context */}
      <div className="w-72 border-l border-border bg-card/50 p-5 overflow-y-auto hidden xl:block">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Client Context
        </h3>

        {request.client && (
          <div className="space-y-4">
            <div className="bg-background border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground">{request.client.company_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{request.client.contact_name}</p>
              <p className="text-xs text-muted-foreground">{request.client.contact_email}</p>
              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Outstanding</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {formatCurrencyFull(request.client.outstanding_balance || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Credit Days</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{request.client.credit_days}d</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Portal Access</p>
              <div className="bg-background border border-border rounded-lg px-3 py-2 flex items-center justify-between">
                <p className="text-xs text-foreground font-mono truncate">
                  /portal/{request.client.portal_token}
                </p>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-1" />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Request Timeline</p>
              <div className="space-y-2">
                {[
                  { label: "Submitted", time: request.submitted_at, done: true },
                  { label: "In Review", time: request.submitted_at, done: ["in_review", "options_shared", "approved", "booked", "completed"].includes(request.status) },
                  { label: "Options Shared", time: request.submitted_at, done: ["options_shared", "approved", "booked", "completed"].includes(request.status) },
                  { label: "Client Approved", time: request.approved_at || null, done: !!request.approved_at },
                  { label: "Booking Confirmed", time: null, done: ["booked", "completed"].includes(request.status) },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done ? "bg-primary" : "bg-border"
                    }`}>
                      {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {step.time && step.done && (
                        <p className="text-[10px] text-muted-foreground">{timeAgo(step.time)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  option,
  expanded,
  onToggle,
}: {
  option: RequestOption;
  expanded: boolean;
  onToggle: () => void;
}) {
  const details = option.details as Record<string, string>;
  const margin = option.client_price - option.supplier_cost;
  const marginPct = ((margin / option.client_price) * 100).toFixed(1);

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${
      option.is_recommended ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
    }`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">{option.option_number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{option.provider}</p>
            {option.is_recommended && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5" />
                Recommended
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-foreground">
            {formatCurrencyFull(option.client_price)}
          </p>
          <p className="text-[10px] text-muted-foreground">via {option.supplier_system}</p>
        </div>
        <div className="ml-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {Object.entries(details).map(([key, val]) => (
              <div key={key}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide capitalize">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-foreground mt-0.5">{val as string}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Supplier Cost</p>
                <p className="text-sm font-medium text-foreground">{formatCurrencyFull(option.supplier_cost)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Client Price</p>
                <p className="text-sm font-medium text-foreground">{formatCurrencyFull(option.client_price)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Margin</p>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyFull(margin)} ({marginPct}%)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                Edit
              </button>
              {option.status === "approved" ? (
                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                  Book Now
                </button>
              ) : (
                <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-600/90 transition-colors">
                  Mark Approved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
