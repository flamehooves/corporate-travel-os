"use client";

import { cn } from "@/lib/utils";
import {
  AirplaneTakeoff,
  Train,
  Buildings,
  IdentificationCard,
  Dot,
} from "@phosphor-icons/react";
import type { RequestStatus, InvoiceStatus, TripType } from "@/lib/types";

const requestStatusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  },
  in_review: {
    label: "In Review",
    className: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  },
  options_shared: {
    label: "Options Shared",
    className: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  },
  booked: {
    label: "Booked",
    className: "bg-indigo-400/15 text-indigo-300 border-indigo-400/30",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-400/15 text-slate-300 border-slate-400/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-400/15 text-rose-300 border-rose-400/30",
  },
};

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-slate-400/15 text-slate-300 border-slate-400/30",
  },
  sent: {
    label: "Sent",
    className: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  },
  partial: {
    label: "Partial",
    className: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-400/15 text-rose-300 border-rose-400/30",
  },
};

const tripTypeIconMap: Record<string, React.ComponentType<{ className?: string; weight?: string }>> = {
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
    <span className="inline-flex items-center gap-1 text-xs text-white/40">
      <Icon className="w-3 h-3" weight="fill" />
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
          <span key={type} className="inline-flex items-center gap-1 text-xs text-white/40">
            <Icon className="w-3 h-3" weight="fill" />
            <span className="capitalize">{type}</span>
          </span>
        );
      })}
    </span>
  );
}
