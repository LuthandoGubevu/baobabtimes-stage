import React, { useState } from "react";
import { Trophy, Star, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";
import { cn } from "../../../utils/cn";

/**
 * A single compact leaderboard row
 */
function LeaderboardRow({ rank, name, count, label, isTop = false }) {
  const rankColors = {
    1: "bg-amber-50 text-amber-700 border-amber-200",
    2: "bg-stone-100 text-stone-600 border-stone-200",
    3: "bg-stone-100 text-stone-500 border-stone-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: rank * 0.06 }}
      className={cn(
        "flex items-center gap-3 py-2.5 px-3 rounded-2xl transition-colors",
        isTop && rank === 1
          ? "bg-amber-50/60"
          : "hover:bg-stone-50"
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0",
          rankColors[rank] || "bg-stone-50 text-stone-400 border-stone-100"
        )}
      >
        {rank}
      </span>

      {/* Avatar */}
      <AvatarPlaceholder name={name} size="sm" className="shrink-0" />

      {/* Name */}
      <p className="flex-1 text-sm font-semibold text-stone-900 truncate">
        {name}
      </p>

      {/* Count + label */}
      <div className="text-right shrink-0">
        <span className="text-sm font-bold text-stone-900">{count}</span>
        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 leading-none mt-0.5">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Full leaderboard modal
 */
function LeaderboardModal({ isOpen, onClose, title, icon: Icon, iconBg, items, countKey, countLabel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-[10vh] bottom-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">{title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Full Leaderboard
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {items.length === 0 ? (
                <p className="text-center text-stone-400 font-serif italic py-10">
                  No data available yet.
                </p>
              ) : (
                items.map((item, index) => (
                  <LeaderboardRow
                    key={item.id || item.userId || index}
                    rank={index + 1}
                    name={item.displayName || item.name || "Unknown"}
                    count={item[countKey] || 0}
                    label={countLabel}
                    isTop={index < 3}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * LeaderboardPanel — compact top-3 panel with "View full leaderboard" expansion
 *
 * @param {Object} props
 * @param {string}   props.title       - Panel heading
 * @param {string}   props.subtitle    - Small descriptive text
 * @param {React.ElementType} props.icon
 * @param {string}   props.iconBg      - Tailwind bg + text classes for the icon container
 * @param {Array}    props.items       - Full sorted array from the service
 * @param {string}   props.countKey    - Which field holds the count ("monthlyGiven" | "monthlyReceived")
 * @param {string}   props.countLabel  - Short label shown next to the count
 * @param {boolean}  props.isLoading
 */
export function LeaderboardPanel({
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-stone-100 text-stone-600",
  items = [],
  countKey,
  countLabel,
  isLoading = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const top3 = items.slice(0, 3);

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-[1.75rem] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Panel header */}
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-serif font-bold text-stone-900 leading-tight">{title}</h3>
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 leading-none mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-0.5">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-3 animate-pulse"
              >
                <div className="w-6 h-6 rounded-full bg-stone-100 shrink-0" />
                <div className="w-6 h-6 rounded-full bg-stone-100 shrink-0" />
                <div className="flex-1 h-3 bg-stone-100 rounded-full" />
                <div className="w-8 h-3 bg-stone-50 rounded-full" />
              </div>
            ))
          ) : top3.length === 0 ? (
            <p className="text-center text-stone-400 text-xs font-serif italic py-4">
              No activity yet this month.
            </p>
          ) : (
            top3.map((item, index) => (
              <LeaderboardRow
                key={item.id || item.userId || index}
                rank={index + 1}
                name={item.displayName || item.name || "Unknown"}
                count={item[countKey] || 0}
                label={countLabel}
                isTop
              />
            ))
          )}
        </div>

        {/* View full leaderboard */}
        {items.length > 3 && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-between w-full pt-3 border-t border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors group"
          >
            <span>View full leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <LeaderboardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        icon={Icon}
        iconBg={iconBg}
        items={items}
        countKey={countKey}
        countLabel={countLabel}
      />
    </>
  );
}

export default LeaderboardPanel;
