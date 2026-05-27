import { format } from "date-fns";
import { Award } from "lucide-react";
import { cn } from "../../../utils/cn";
import { RecognitionBadge } from "./RecognitionBadge";
import { getRecognitionValue } from "../constants/recognitionValues";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * RecognitionCard component for displaying peer recognition
 * @param {Object} props
 * @param {Object} props.recognition
 * @param {string} props.className
 */
export default function RecognitionCard({ recognition, className }) {
  const {
    fromName,
    fromAvatar,
    toName,
    toAvatar,
    content,
    createdAt,
    category,
    categories,
    isAnonymous,
    dateString,
  } = recognition;

  const displayCategories = categories || (category ? [category] : []);
  
  // Use the first category's config or default
  const primaryValue = displayCategories[0] || "Excellence";
  const config = getRecognitionValue(primaryValue);
  const Icon = config.icon;

  const formatDate = (date) => {
    if (dateString) return dateString;
    if (!date) return "Recently";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className={cn(
      "bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full",
      className
    )}>
      {/* Category Icon Background Decoration */}
      <div className={cn(
        "absolute -top-4 -right-4 w-24 h-24 rounded-full flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500",
        config.bg
      )}>
        <Icon className={cn("w-12 h-12", config.color)} />
      </div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        {/* Badge at top right */}
        <div className="absolute top-0 right-0">
          <RecognitionBadge 
            value={primaryValue} 
            className="rotate-12 group-hover:rotate-0" 
          />
        </div>

        {/* Receiver (To) - Centered & Large */}
        <div className="flex flex-col items-center mb-6 pt-4">
          <AvatarPlaceholder name={toName} size="xl" className="mb-4 border-4 border-stone-50 shadow-md group-hover:scale-105 transition-transform duration-500" />
          <div className="text-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block mb-1">To the recipient</span>
            <h3 className="text-3xl font-black text-stone-900 leading-tight tracking-tight">{toName}</h3>
          </div>
        </div>

        {/* Sender (From) - Below and smaller */}
        <div className="flex items-center space-x-3 text-stone-600 bg-stone-50/80 pl-2 pr-4 py-1.5 rounded-full border border-stone-100 shadow-sm">
          <AvatarPlaceholder name={isAnonymous ? "?" : fromName} size="sm" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">From</span>
            <span className="text-sm font-bold text-stone-800">
              {fromName || (isAnonymous ? "Anonymous" : "Someone")}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 italic text-stone-700 text-base leading-relaxed mb-6 relative z-10 font-serif flex-grow">
        <span className="text-stone-300 text-4xl absolute -top-2 -left-1 font-serif opacity-50">"</span>
        {content}
        <span className="text-stone-300 text-4xl absolute -bottom-6 -right-1 font-serif opacity-50">"</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {displayCategories.map((cat, idx) => {
          const catConfig = getRecognitionValue(cat);
          return (
            <span 
              key={idx} 
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors",
                catConfig.bg,
                catConfig.color,
                catConfig.border
              )}
            >
              {cat}
            </span>
          );
        })}
      </div>

      <div className="flex justify-end items-center relative z-10 pt-4 border-t border-stone-100">
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
