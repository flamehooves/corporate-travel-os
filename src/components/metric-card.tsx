"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  alert?: boolean;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  alert,
  className,
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-card border border-border rounded-xl p-5 transition-all duration-150",
        onClick && "cursor-pointer hover:border-primary/30 hover:shadow-sm",
        alert && "border-red-200 dark:border-red-900/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium leading-snug">{title}</p>
          <p className={cn(
            "text-2xl font-semibold mt-1 tracking-tight",
            alert && "text-red-600 dark:text-red-400"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "hidden sm:flex flex-shrink-0 p-2.5 rounded-lg",
            alert ? "bg-red-50 dark:bg-red-950/30" : "bg-primary/8 dark:bg-primary/10"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              alert ? "text-red-600 dark:text-red-400" : "text-primary"
            )} />
          </div>
        )}
      </div>
      {alert && (
        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </div>
  );
}
