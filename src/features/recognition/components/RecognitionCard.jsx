import { format } from "date-fns";
import { Award } from "lucide-react";
import { cn } from "../../../utils/cn";
import { RecognitionBadge } from "./RecognitionBadge";
import { LikeButton } from "./LikeButton";
import { getRecognitionValue } from "../constants/recognitionValues";
import { useAuth } from "../../../hooks/useAuth";
import { recognitionService } from "../services/recognitionService";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * RecognitionCard component for displaying peer recognition
 * @param {Object} props
 * @param {Object} props.recognition
 * @param {string} props.className
 */
export default function RecognitionCard({ recognition, className }) {
  const { user } = useAuth();
  const { 
    id, 
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
    likes = 0,
    likedBy = []
  } = recognition;

  const displayCategories = categories || (category ? [category] : []);
  
  // Use the first category's config or default
  const primaryValue = displayCategories[0] || "Excellence";
  const config = getRecognitionValue(primaryValue);
  const Icon = config.icon;

  const isLiked = user ? likedBy.includes(user.uid) : false;

  const handleLike = async () => {
    if (!user) {
      console.warn("User must be logged in to like.");
      return;
    }
    await recognitionService.toggleLike(id, user.uid, isLiked);
  };

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

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-4">
          <AvatarPlaceholder name={isAnonymous ? "?" : fromName} size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-900 leading-none mb-1">
              {fromName || (isAnonymous ? "Anonymous" : "Someone")}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">From</span>
          </div>
        </div>

        <RecognitionBadge 
          value={primaryValue} 
          className="rotate-3 group-hover:rotate-0" 
        />

        <div className="flex items-center space-x-4 text-right">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-stone-900 leading-none mb-1">{toName}</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">To</span>
          </div>
          <AvatarPlaceholder name={toName} size="md" />
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

      <div className="flex justify-between items-center relative z-10 pt-4 border-t border-stone-100">
        <LikeButton 
          initialLiked={isLiked} 
          initialCount={likes} 
          onLike={handleLike}
        />
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
