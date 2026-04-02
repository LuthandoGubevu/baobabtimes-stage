import React from "react";
import { cn } from "../../../utils/cn";
import { getRecognitionValue } from "../constants/recognitionValues";

/**
 * RecognitionBadge component for displaying a colorful badge for a recognition value
 * @param {Object} props
 * @param {string} props.value - The recognition value name (e.g., "Innovation")
 * @param {string} props.size - Size of the badge ("sm", "md", "lg")
 * @param {string} props.className - Additional CSS classes
 */
export const RecognitionBadge = ({ value, size = "md", className }) => {
  const config = getRecognitionValue(value);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-16 h-16 rounded-3xl"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn(
      "flex items-center justify-center shadow-sm transition-transform duration-300",
      config.bg,
      config.color,
      config.border,
      "border",
      sizeClasses[size],
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  );
};

export default RecognitionBadge;
