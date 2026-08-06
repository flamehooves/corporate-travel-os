"use client";

import { cn } from "@/lib/utils";
import {
  AirplaneTakeoff,
  Train,
  Buildings,
  IdentificationCard,
  Dot,
  type Icon,
} from "@phosphor-icons/react";
import type { RequestStatus, InvoiceStatus, TripType } from "@/lib/types";

const requestStatusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_review: {
    label: "In Review",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  options_shared: {
    label: "Options Shared",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  booked: {
    label: "Booked",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
  sent: {
    label: "Sent",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  partial: {
    label: "Partial",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const tripTypeIconMap: Record<string, Icon> = {
  flight: AirplaneTakeoff,
  train: Train,
  hotel: Buildings,
  visa: IdentificationCard,
  other: Dot,
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
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const config = invoiceStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function TripTypeBadge({ type }: { type: string }) {
  const Icon = tripTypeIconMap[type] ?? Dot;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <Icon className="w-3 h-3 text-slate-400" weight="fill" />
      <span className="capitalize">{type}</span>
    </span>
  );
}

export function TripTypesBadge({ types, className }: { types: TripType[]; className?: string }) {
  if (!types || types.length === 0) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 flex-wrap", className)}>
      {types.map((type) => {
        const Icon = tripTypeIconMap[type] ?? Dot;
        return (
          <span key={type} className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Icon className="w-3 h-3 text-slate-400" weight="fill" />
            <span className="capitalize">{type}</span>
          </span>
        );
      })}
    </span>
  );
}
