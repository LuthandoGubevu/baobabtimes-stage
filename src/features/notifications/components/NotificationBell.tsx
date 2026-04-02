import React, { useState, useRef, useEffect } from "react";
import { Bell, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActivity } from "../hooks/useActivity";
import { ActivityFeedList } from "./ActivityFeedList";
import { useAuth } from "../../../hooks/useAuth";

interface NotificationBellProps {
  isPublicOnly?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ isPublicOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use public only if specified or if user is not logged in
  const effectivePublicOnly = isPublicOnly || !user;
  
  const { activities, isLoading, error } = useActivity(effectivePublicOnly, 15);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${
          isOpen 
            ? "bg-zinc-100 text-zinc-900" 
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {activities.length > 0 && !effectivePublicOnly && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed sm:absolute top-20 sm:top-full left-4 right-4 sm:left-auto sm:right-0 sm:mt-2 sm:w-[380px] bg-white rounded-xl shadow-2xl border border-zinc-200 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900">Recent Activity</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600">
                  {activities.length}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              <ActivityFeedList 
                activities={activities} 
                isLoading={isLoading} 
                error={error}
                onClose={() => setIsOpen(false)}
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                {effectivePublicOnly ? "Public Feed" : "Activity Center"}
              </p>
              <button className="text-[10px] font-bold text-zinc-900 hover:underline flex items-center gap-1">
                View All <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
