import React from "react";
import { ActivityFeedItem } from "./ActivityFeedItem";
import { Activity } from "../types";
import { BellOff, Loader2 } from "lucide-react";

interface ActivityFeedListProps {
  activities: Activity[];
  isLoading: boolean;
  error: any;
  onClose?: () => void;
}

export const ActivityFeedList: React.FC<ActivityFeedListProps> = ({ 
  activities, 
  isLoading, 
  error,
  onClose 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin mb-4" />
        <p className="text-sm text-zinc-500 font-medium">Loading recent activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <BellOff className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-sm text-zinc-900 font-semibold mb-1">Failed to load activity</p>
        <p className="text-xs text-zinc-500">Please try again later.</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
          <BellOff className="w-6 h-6 text-zinc-300" />
        </div>
        <p className="text-sm text-zinc-900 font-semibold mb-1">No recent updates yet</p>
        <p className="text-xs text-zinc-500">Check back later for new content and recognitions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2">
      {activities.map((activity) => (
        <ActivityFeedItem 
          key={activity.id} 
          activity={activity} 
          onClose={onClose}
        />
      ))}
    </div>
  );
};
