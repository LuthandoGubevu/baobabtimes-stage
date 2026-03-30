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
  const { id, fromName, fromAvatar, toName, toAvatar, content, createdAt, category, categories, isAnonymous, dateString } = recognition;

  const displayCategories = categories || (category ? [category] : []);

  const icons = {
    "Teamwork": Heart,
    "Innovation": Star,
    "Excellence": Award,
    "Smart": Star,
    "Communication": Award,
    "Impact": Heart,
    "Transforming": Star,
    "Courage": Award,
    "Passion": Heart,
    "Authentic": Award,
    "Selflessness": Heart,
    "Heart": Heart,
  };
  
  // Use the first category's icon or default to Award
  const Icon = icons[displayCategories[0]] || Award;

  const formatDate = (date) => {
    if (dateString) return dateString;
    if (!date) return "Recently";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className={cn(
      "bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden",
      className
    )}>
      {/* Category Icon Background Decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-12 h-12 text-stone-100" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-100">
            {isAnonymous ? (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <span className="text-stone-400 text-xs font-bold">?</span>
              </div>
            ) : (
              <img 
                src={fromAvatar || `https://i.pravatar.cc/150?u=${fromName}`} 
                alt={fromName} 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-900 leading-none mb-1">
              {fromName || (isAnonymous ? "Anonymous" : "Someone")}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">From</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex items-center space-x-4 text-right">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-stone-900 leading-none mb-1">{toName}</span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">To</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-100">
            <img 
              src={toAvatar || `https://i.pravatar.cc/150?u=${toName}`} 
              alt={toName} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 italic text-stone-700 text-base leading-relaxed mb-6 relative z-10 font-serif">
        <span className="text-stone-300 text-4xl absolute -top-2 -left-1 font-serif opacity-50">"</span>
        {content}
        <span className="text-stone-300 text-4xl absolute -bottom-6 -right-1 font-serif opacity-50">"</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        {displayCategories.map((cat, idx) => (
          <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-stone-200">
            {cat}
          </span>
        ))}
      </div>

      <div className="flex justify-end items-center relative z-10">
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
