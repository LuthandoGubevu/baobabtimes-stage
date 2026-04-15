import React from "react";
import { Trophy, Star, Heart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * SpotlightCard component for highlighting top performers
 * @param {Object} props
 * @param {string} props.type - "recognizer" or "appreciated"
 * @param {Object} props.user - User data { displayName, photoURL, monthlyGiven, monthlyReceived }
 * @param {number} props.rank - Rank (1, 2, or 3)
 */
export const SpotlightCard = ({ type, user, rank = 1 }) => {
  const isRecognizer = type === "recognizer";
  const count = isRecognizer ? user.monthlyGiven : user.monthlyReceived;
  const label = isRecognizer ? "Appreciation Champion" : "Rising Star";
  const subLabel = isRecognizer ? "Recognitions Given" : "Recognitions Received";
  const Icon = isRecognizer ? Trophy : Star;

  // Rank-based styling
  const rankStyles = {
    1: {
      card: "bg-white border-stone-200 shadow-xl scale-105 z-10",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "text-amber-500",
      glow: "from-amber-100/50 to-transparent"
    },
    2: {
      card: "bg-white/80 border-stone-100 shadow-md",
      badge: "bg-stone-100 text-stone-600 border-stone-200",
      icon: "text-stone-400",
      glow: "from-stone-100/30 to-transparent"
    },
    3: {
      card: "bg-white/80 border-stone-100 shadow-md",
      badge: "bg-stone-100 text-stone-600 border-stone-200",
      icon: "text-stone-400",
      glow: "from-stone-100/30 to-transparent"
    }
  };

  const style = rankStyles[rank] || rankStyles[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={cn(
        "relative flex flex-col items-center p-8 rounded-[3rem] border transition-all duration-500 group overflow-hidden",
        style.card
      )}
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b -z-10 opacity-50",
        style.glow
      )} />

      {/* Rank Badge */}
      <div className={cn(
        "absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
        style.badge
      )}>
        #{rank}
      </div>

      {/* Avatar with Aura */}
      <div className="relative mb-6">
        <div className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500",
          isRecognizer ? "bg-amber-400" : "bg-blue-400"
        )} />
        <AvatarPlaceholder name={user.displayName} size="xl" className="relative z-10" />
        {rank === 1 && (
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-stone-100 z-20">
            <Icon className={cn("w-5 h-5", style.icon)} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center space-y-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            {label}
          </p>
          <h3 className="text-xl font-serif font-bold text-stone-900 italic">
            {user.displayName}
          </h3>
        </div>
        
        <div className="pt-2">
          <span className="text-2xl font-serif font-bold text-stone-900">
            {count}
          </span>
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
            {subLabel}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
