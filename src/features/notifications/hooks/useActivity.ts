import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { activityService } from "../services/activityService";
import { Activity } from "../types";

function resolveActivityUrl(activity: Activity): string {
  if (activity.url) return activity.url;
  if (activity.entitySlug) return `/articles/${activity.entitySlug}`;
  if (activity.type === 'recognition_posted') return '/recognition';
  if (activity.type === 'ceo_message_published') return '/ask-ceo';
  return '/';
}

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

  // Browser notification for new activity items (authenticated users only)
  const isFirstSnapshotRef = useRef(true);
  useEffect(() => {
    if (isPublicOnly) return;

    isFirstSnapshotRef.current = true;

    const q = query(
      collection(db, 'activity'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the initial snapshot — we only want genuinely new docs
      if (isFirstSnapshotRef.current) {
        isFirstSnapshotRef.current = false;
        return;
      }

      const added = snapshot.docChanges().filter(c => c.type === 'added');
      if (added.length === 0) return;

      const activity = { id: added[0].doc.id, ...added[0].doc.data() } as Activity;

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const notif = new Notification(activity.title, {
          body: activity.message || '',
          icon: '/icons/android-chrome-192x192.png',
          tag: activity.id
        });
        const url = resolveActivityUrl(activity);
        notif.onclick = () => {
          window.focus();
          window.location.pathname = url;
        };
      }
    });

    return () => unsubscribe();
  }, [isPublicOnly]);

  // Use real-time data if available, otherwise fallback to initial fetch
  const activities = realtimeActivities.length > 0 ? realtimeActivities : (initialActivities || []);

  return {
    activities,
    isLoading: isLoading && realtimeActivities.length === 0,
    error,
    refetch
  };
}
