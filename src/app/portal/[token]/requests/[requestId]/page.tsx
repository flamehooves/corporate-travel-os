"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Check,
  X,
  Send,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { mockRequests, mockClients } from "@/lib/mock-data";
import { RequestStatusBadge } from "@/components/status-badge";
import { formatDate, formatCurrencyFull, timeAgo } from "@/lib/utils";
import type { RequestOption } from "@/lib/types";

export default function PortalRequestPage({
  params,
}: {
  params: Promise<{ token: string; requestId: string }>;
}) {
  const { token, requestId } = use(params);
  const client = mockClients.find((c) => c.portal_token === token);
  const request = mockRequests.find((r) => r.id === requestId);
  const [message, setMessage] = useState("");
  const [expandedOption, setExpandedOption] = useState<string | null>("opt1");
  const [approvedOption, setApprovedOption] = useState<string | null>(null);

  if (!client || !request) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Request not found.</p>
        <Link href={`/portal/${token}`} className="text-primary text-sm mt-2 inline-block hover:underline">
          Back to portal
        </Link>
      </div>
    );
  }

  const messages = request.messages || [];
  const options = request.options || [];

  return (
    <div>
      <Link
        href={`/portal/${token}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-foreground">{request.request_number}</h1>
            <RequestStatusBadge status={request.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {request.traveler_name} · Submitted {timeAgo(request.submitted_at)}
          </p>
        </div>
      </div>

      {/* Trip summary */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{request.origin}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">{request.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(request.departure_date)}
            {request.return_date && ` – ${formatDate(request.return_date)}`}
          </div>
          <div className="text-sm text-muted-foreground">{request.purpose}</div>
        </div>
      </div>

      {/* Options to review */}
      {options.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Options from Your Consultant
            </h2>
            <p className="text-xs text-muted-foreground">
              {options.length} recommendation{options.length > 1 ? "s" : ""}
            </p>
          </div>

          {request.status === "options_shared" && !approvedOption && (
            <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 animate-pulse" />
              <p className="text-xs text-foreground">
                Please review the options below and approve your preferred choice to proceed.
              </p>
            </div>
          )}

          {approvedOption && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                You&apos;ve approved an option. Your consultant will confirm the booking shortly.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {options.map((opt) => (
              <ClientOptionCard
                key={opt.id}
                option={opt}
                expanded={expandedOption === opt.id}
                onToggle={() =>
                  setExpandedOption(expandedOption === opt.id ? null : opt.id)
                }
                approved={approvedOption === opt.id}
                onApprove={() => setApprovedOption(opt.id)}
                canApprove={request.status === "options_shared" && !approvedOption}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discussion */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Conversation with Consultant
        </h2>

        <div className="space-y-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No messages yet. Ask your consultant anything.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender_type === "client" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {msg.sender_name.charAt(0)}
                  </span>
                </div>
                <div
                  className={`flex-1 max-w-[85%] flex flex-col ${
                    msg.sender_type === "client" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-xl px-4 py-3 text-sm ${
                      msg.sender_type === "client"
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

        <div className="flex gap-2 items-end">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question or leave a note for your consultant..."
            rows={2}
            className="flex-1 px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
          <button
            disabled={!message.trim()}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientOptionCard({
  option,
  expanded,
  onToggle,
  approved,
  onApprove,
  canApprove,
}: {
  option: RequestOption;
  expanded: boolean;
  onToggle: () => void;
  approved: boolean;
  onApprove: () => void;
  canApprove: boolean;
}) {
  const details = option.details as Record<string, string>;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${
      approved
        ? "border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-200 dark:ring-emerald-900"
        : option.is_recommended
        ? "border-primary/30 ring-1 ring-primary/10"
        : "border-border"
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
                Consultant Pick
              </span>
            )}
            {approved && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                <Check className="w-2.5 h-2.5" />
                Approved
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-semibold text-foreground">
            {formatCurrencyFull(option.client_price)}
          </p>
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

          <div className="flex gap-2 pt-3 border-t border-border">
            {canApprove && (
              <button
                onClick={onApprove}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve This Option
              </button>
            )}
            <button className="px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              Ask a Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
