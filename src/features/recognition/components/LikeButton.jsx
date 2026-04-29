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
  useEffect(() => {
    if (!isPending) {
      setIsLiked(initialLiked);
      setCount(initialCount);
    }
  }, [initialLiked, initialCount, isPending]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    // Optimistic UI update
    const newLikedState = !isLiked;
    const newCount = newLikedState ? count + 1 : Math.max(0, count - 1);

    setIsLiked(newLikedState);
    setCount(newCount);
    setIsAnimating(true);
    setIsPending(true);

    try {
      if (onLike) {
        await onLike(isLiked); // Pass old state to toggle
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(isLiked);
      setCount(count);
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
