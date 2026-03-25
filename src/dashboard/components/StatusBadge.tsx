import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'PUBLISHED' | 'DRAFT' | 'SUBMITTED' | 'ARCHIVED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ANSWERED' | 'UNANSWERED';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles: Record<StatusType, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200",
    SUBMITTED: "bg-amber-50 text-amber-700 border-amber-100",
    ARCHIVED: "bg-red-50 text-red-700 border-red-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
    ANSWERED: "bg-blue-50 text-blue-700 border-blue-100",
    UNANSWERED: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
      styles[status] || styles.DRAFT,
      className
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};
