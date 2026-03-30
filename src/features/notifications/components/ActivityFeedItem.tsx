import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  Award, 
  User, 
  Megaphone, 
  Star,
  ChevronRight
} from "lucide-react";
import { Activity, ActivityType } from "../types";

interface ActivityFeedItemProps {
  activity: Activity;
  onClose?: () => void;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'article_published':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'recognition_posted':
      return <Award className="w-4 h-4 text-amber-500" />;
    case 'ceo_message_published':
      return <User className="w-4 h-4 text-purple-500" />;
    case 'announcement_published':
      return <Megaphone className="w-4 h-4 text-emerald-500" />;
    case 'spotlight_published':
      return <Star className="w-4 h-4 text-rose-500" />;
    default:
      return <FileText className="w-4 h-4 text-zinc-400" />;
  }
};

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ activity, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (activity.url) {
      navigate(activity.url);
    } else if (activity.entitySlug) {
      if (activity.type === 'article_published' || activity.type === 'ceo_message_published') {
        navigate(`/posts/${activity.entitySlug}`);
      }
    } else if (activity.type === 'recognition_posted') {
      navigate('/recognition');
    }
    
    if (onClose) onClose();
  };

  const formattedDate = activity.createdAt?.toDate 
    ? formatDistanceToNow(activity.createdAt.toDate(), { addSuffix: true })
    : 'Just now';

  return (
    <div 
      onClick={handleNavigate}
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-100 last:border-0"
    >
      <div className="mt-1 p-1.5 rounded-full bg-white border border-zinc-100 shadow-sm">
        {getActivityIcon(activity.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-950 truncate">
          {activity.title}
        </h4>
        
        {activity.message && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
            {activity.message}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-1.5">
          {activity.metadata?.category && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
              {activity.metadata.category}
            </span>
          )}
          
          {activity.metadata?.authorName && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="text-[10px] text-zinc-500">
                By {activity.metadata.authorName}
              </span>
            </>
          )}
          
          {activity.metadata?.recognitionValue && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="text-[10px] text-zinc-500">
                {activity.metadata.recognitionValue}
              </span>
            </>
          )}
          
          <span className="text-zinc-300 ml-auto">•</span>
          <span className="text-[10px] text-zinc-400 whitespace-nowrap">
            {formattedDate}
          </span>
        </div>
      </div>
      
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3 text-zinc-400" />
      </div>
    </div>
  );
};
