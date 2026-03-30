import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Activity, ActivityType, ActivityMetadata } from "../types";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

const COLLECTION_NAME = 'activity';

export const activityService = {
  /**
   * Fetch recent activity items
   * @param isPublicOnly - If true, only fetch public items
   * @param limitCount - Max number of items to fetch
   */
  async getRecentActivity(isPublicOnly: boolean = false, limitCount: number = 10): Promise<Activity[]> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (isPublicOnly) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      return [];
    }
  },

  /**
   * Subscribe to recent activity items
   */
  subscribeToRecentActivity(
    callback: (activities: Activity[]) => void,
    isPublicOnly: boolean = false,
    limitCount: number = 10
  ) {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (isPublicOnly) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      callback(activities);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    });
  },

  /**
   * Create a new activity item
   */
  async createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...activity,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
      return null;
    }
  }
};
