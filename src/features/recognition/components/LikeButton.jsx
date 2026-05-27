import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../utils/cn";

/**
 * LikeButton component with optimistic UI and pop animation
 * @param {Object} props
 * @param {boolean} props.initialLiked - Initial liked state
 * @param {number} props.initialCount - Initial like count
 * @param {Function} props.onLike - Async function to handle the like/unlike action
 * @param {string} props.className - Additional CSS classes
 */
export const LikeButton = ({ initialLiked = false, initialCount = 0, onLike, className }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Sync with initial props if they change (e.g. after a full data refresh)
  // Only sync when there isn't a pending optimistic update in flight.
  useEffect(() => {
    if (!isPending) {
      setIsLiked(initialLiked);
      setCount(initialCount);
    }
    // Intentionally do not include isPending in deps to avoid the parent
    // overwriting optimistic UI while a toggle is inflight. We only want
    // to respond to fresh prop values when not pending.
  }, [initialLiked, initialCount]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    // Capture current state for rollback if needed
    const prevLiked = isLiked;
    const prevCount = count;

    // Optimistic UI update
    const newLikedState = !prevLiked;
    const newCount = newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1);

    setIsLiked(newLikedState);
    setCount(newCount);
    setIsAnimating(true);
    setIsPending(true);

    try {
      if (onLike) {
        // Pass the previous state so the handler can toggle server-side
        await onLike(prevLiked);
      }
    } catch (error) {
      // Rollback on error using captured previous values
      setIsLiked(prevLiked);
      setCount(prevCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setIsPending(false);
      // Animation settles after a short delay
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center space-x-1.5 group transition-colors duration-200",
        isLiked ? "text-red-500" : "text-stone-400 hover:text-stone-600",
        className
      )}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.4, 1],
            rotate: [0, 15, -15, 0]
          } : { scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isLiked ? "fill-current" : "fill-transparent"
            )}
          />
        </motion.div>
        
        {/* Subtle pulse effect on like */}
        <AnimatePresence>
          {isLiked && isAnimating && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-red-400 rounded-full -z-10"
            />
          )}
        </AnimatePresence>
      </div>
      
      <span className={cn(
        "text-xs font-bold tabular-nums transition-all duration-300",
        isLiked ? "text-red-600" : "text-stone-500"
      )}>
        {count}
      </span>
    </button>
  );
};

export default LikeButton;
