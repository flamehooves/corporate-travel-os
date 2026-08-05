"use client";

import { cn } from "@/lib/utils";
import type { RequestStatus, InvoiceStatus, TripType } from "@/lib/types";

const requestStatusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900" },
  in_review: { label: "In Review", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900" },
  options_shared: { label: "Options Shared", className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900" },
  booked: { label: "Booked", className: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900" },
  completed: { label: "Completed", className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900" },
};

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600 border-slate-200" },
  sent: { label: "Sent", className: "bg-blue-50 text-blue-700 border-blue-200" },
  partial: { label: "Partial", className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 border-red-200" },
};

const tripTypeIcons: Record<string, string> = {
  flight: "✈",
  train: "🚄",
  hotel: "🏨",
  visa: "📋",
  other: "•",
};

interface RequestStatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const config = requestStatusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const config = invoiceStatusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

export function TripTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span>{tripTypeIcons[type] || "•"}</span>
      <span className="capitalize">{type}</span>
    </span>
  );
}

export function TripTypesBadge({ types, className }: { types: TripType[]; className?: string }) {
  if (!types || types.length === 0) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 flex-wrap", className)}>
      {types.map((type) => (
        <span key={type} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <span>{tripTypeIcons[type] || "•"}</span>
          <span className="capitalize">{type}</span>
        </span>
      ))}
    </span>
  );
}
