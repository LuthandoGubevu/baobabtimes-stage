import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "../services/activityService";
import { Activity } from "../types";

/**
 * Hook to fetch and manage recent activity items
 * @param isPublicOnly - If true, only fetch public items
 * @param limitCount - Max number of items to fetch
 */
export function useActivity(isPublicOnly: boolean = false, limitCount: number = 10) {
  const [realtimeActivities, setRealtimeActivities] = useState<Activity[]>([]);

  // Fetch initial data with React Query
  const { data: initialActivities, isLoading, error, refetch } = useQuery({
    queryKey: ['activity', isPublicOnly, limitCount],
    queryFn: () => activityService.getRecentActivity(isPublicOnly, limitCount),
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = activityService.subscribeToRecentActivity(
      (activities) => {
        setRealtimeActivities(activities);
      },
      isPublicOnly,
      limitCount
    );

    return () => unsubscribe();
  }, [isPublicOnly, limitCount]);

  // Use real-time data if available, otherwise fallback to initial fetch
  const activities = realtimeActivities.length > 0 ? realtimeActivities : (initialActivities || []);

  return {
    activities,
    isLoading: isLoading && realtimeActivities.length === 0,
    error,
    refetch
  };
}
