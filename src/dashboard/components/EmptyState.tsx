import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-zinc-200",
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mb-6">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-zinc-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="flex items-center px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          <Plus size={18} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
