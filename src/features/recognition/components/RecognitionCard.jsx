import { format } from "date-fns";
import { Award, Heart, Star } from "lucide-react";
import { cn } from "../../../utils/cn";

/**
 * RecognitionCard component for displaying peer recognition
 * @param {Object} props
 * @param {Object} props.recognition
 * @param {string} props.className
 */
export default function RecognitionCard({ recognition, className }) {
  const { id, fromId, fromName, toId, toName, content, createdAt, category } = recognition;

  const icons = {
    "Teamwork": Heart,
    "Innovation": Star,
    "Excellence": Award,
  };
  const Icon = icons[category] || Award;

  const formatDate = (date) => {
    if (!date) return "Recently";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className={cn(
      "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <img src={`https://i.pravatar.cc/150?u=${fromId || id}`} alt={fromName} referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-900">{fromName || "Anonymous"}</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">From</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-lg">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-3 text-right">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-stone-900">{toName || "Anonymous"}</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">To</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <img src={`https://i.pravatar.cc/150?u=${toId || id + 100}`} alt={toName} referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
      
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 italic text-stone-700 text-sm leading-relaxed mb-4">
        "{content}"
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {category || "General Recognition"}
        </span>
        <span className="text-[10px] text-stone-400 font-medium">
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
