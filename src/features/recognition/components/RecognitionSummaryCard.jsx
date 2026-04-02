import React from "react";
import { cn } from "../../../utils/cn";
import { getRecognitionValue } from "../constants/recognitionValues";

/**
 * RecognitionSummaryCard component for displaying a stat card in the summary section
 * @param {Object} props
 * @param {string} props.label - The recognition value name (e.g., "Innovation")
 * @param {number} props.count - The total count for this value
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.className - Additional CSS classes
 */
export const RecognitionSummaryCard = ({ label, count = 0, isLoading = false, className }) => {
  const config = getRecognitionValue(label);
  const Icon = config.icon;

  return (
    <div className={cn(
      "bg-white p-2.5 sm:p-3 pr-4 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3 hover:shadow-md transition-all duration-300 group min-w-[140px] sm:min-w-[160px] flex-shrink-0",
      className
    )}>
      <div className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
        config.bg,
        config.color
      )}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-0.5 truncate">
          {label}
        </p>
        <p className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-none">
          {isLoading ? (
            <span className="inline-block w-6 h-4 bg-stone-50 animate-pulse rounded" />
          ) : (
            count
          )}
        </p>
      </div>
    </div>
  );
};

export default RecognitionSummaryCard;
