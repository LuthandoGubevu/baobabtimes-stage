import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  serverTimestamp, 
  orderBy,
  increment,
  arrayUnion,
  arrayRemove,
  doc,
  runTransaction
} from "firebase/firestore";
import { db } from "../../../firebase";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";
import { RECOGNITION_VALUES } from "../constants/recognitionValues";

/**
 * Helper to get current month key (YYYY-MM)
 */
const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const recognitionService = {
  /**
   * Update user stats for recognition activity
   * @param {string} senderId 
   * @param {string} recipientId 
   * @param {Object} senderData { name, avatar }
   * @param {Object} recipientData { name, avatar }
   */
  trackUserStats: async (senderId, recipientId, senderData, recipientData) => {
    const currentMonth = getMonthKey();
    
    try {
      await runTransaction(db, async (transaction) => {
        const senderRef = doc(db, "user_stats", senderId);
        const recipientRef = doc(db, "user_stats", recipientId);
        
        const senderDoc = await transaction.get(senderRef);
        const recipientDoc = await transaction.get(recipientRef);
        
        // Update Sender Stats
        if (!senderDoc.exists() || senderDoc.data().monthKey !== currentMonth) {
          transaction.set(senderRef, {
            userId: senderId,
            displayName: senderData.name,
            photoURL: senderData.avatar,
            monthlyGiven: 1,
            monthlyReceived: senderDoc.exists() ? senderDoc.data().monthlyReceived : 0,
            allTimeGiven: increment(1),
            allTimeReceived: senderDoc.exists() ? senderDoc.data().allTimeReceived : 0,
            monthKey: currentMonth,
            lastUpdated: serverTimestamp()
          }, { merge: true });
        } else {
          transaction.update(senderRef, {
            monthlyGiven: increment(1),
            allTimeGiven: increment(1),
            lastUpdated: serverTimestamp()
          });
        }
        
        // Update Recipient Stats
        if (!recipientDoc.exists() || recipientDoc.data().monthKey !== currentMonth) {
          transaction.set(recipientRef, {
            userId: recipientId,
            displayName: recipientData.name,
            photoURL: recipientData.avatar,
            monthlyReceived: 1,
            monthlyGiven: recipientDoc.exists() ? recipientDoc.data().monthlyGiven : 0,
            allTimeReceived: increment(1),
            allTimeGiven: recipientDoc.exists() ? recipientDoc.data().allTimeGiven : 0,
            monthKey: currentMonth,
            lastUpdated: serverTimestamp()
          }, { merge: true });
        } else {
          transaction.update(recipientRef, {
            monthlyReceived: increment(1),
            allTimeReceived: increment(1),
            lastUpdated: serverTimestamp()
          });
        }
      });
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  },

  /**
   * Fetch top performers for the spotlight
   * @returns {Promise<Object>}
   */
  getSpotlightData: async () => {
    const currentMonth = getMonthKey();
    const path = "user_stats";
    
    try {
      // Fetch all stats for the current month
      // We sort in-memory to avoid requiring composite indexes in Firestore
      const q = query(
        collection(db, path),
        where("monthKey", "==", currentMonth)
      );
      
      const snapshot = await getDocs(q);
      const allStats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort for Top Recognizers — return full list; UI slices to top 3
      const topRecognizers = [...allStats]
        .filter(s => (s.monthlyGiven || 0) > 0)
        .sort((a, b) => (b.monthlyGiven || 0) - (a.monthlyGiven || 0));

      // Sort for Most Appreciated — return full list; UI slices to top 3
      const mostAppreciated = [...allStats]
        .filter(s => (s.monthlyReceived || 0) > 0)
        .sort((a, b) => (b.monthlyReceived || 0) - (a.monthlyReceived || 0));
      
      return {
        topRecognizers,
        mostAppreciated
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return { topRecognizers: [], mostAppreciated: [] };
    }
  },

  /**
   * Toggle like on a recognition
   * @param {string} recognitionId 
   * @param {string} userId
   * @param {boolean} isNowLiking - true = user is liking, false = user is unliking
   */
  toggleLike: async (recognitionId, userId, isNowLiking) => {
    const path = `recognitions/${recognitionId}`;
    try {
      const docRef = doc(db, "recognitions", recognitionId);
      await updateDoc(docRef, {
        likes: increment(isNowLiking ? 1 : -1),
        likedBy: isNowLiking ? arrayUnion(userId) : arrayRemove(userId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  /**
   * Fetch all approved recognitions
   * @returns {Promise<Array>}
   */
  getApprovedRecognitions: async () => {
    const path = "recognitions";
    try {
      const q = query(
        collection(db, path), 
        where("status", "==", "APPROVED")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Fetch recognition stats
   * @returns {Promise<Object>}
   */
  getRecognitionStats: async () => {
    const path = "recognitions";
    try {
      const q = query(
        collection(db, path),
        where("status", "==", "APPROVED")
      );
      const snapshot = await getDocs(q);
      
      // Initialize stats for all defined recognition values
      const stats = {};
      Object.keys(RECOGNITION_VALUES).forEach(key => {
        stats[key] = 0;
      });
      stats.total = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const cats = data.categories || (data.category ? [data.category] : []);
        
        cats.forEach(cat => {
          if (stats.hasOwnProperty(cat)) {
            stats[cat]++;
          }
        });
        stats.total++;
      });

      return stats;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      // Return 0 for all values on error
      const defaultStats = {};
      Object.keys(RECOGNITION_VALUES).forEach(key => {
        defaultStats[key] = 0;
      });
      defaultStats.total = 0;
      return defaultStats;
    }
  },

  /**
   * Create a new recognition
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  createRecognition: async (data) => {
    const path = "recognitions";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        status: "APPROVED", // Default to APPROVED for now, can be changed to PENDING for moderation
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      });

      // Track stats for the spotlight feature
      // Only track if we have a real user ID for sender/recipient
      if (data.fromId && data.fromId !== "anonymous") {
        await recognitionService.trackUserStats(
          data.fromId, 
          data.toId || "external", 
          { name: data.fromName, avatar: data.fromAvatar },
          { name: data.toName, avatar: data.toAvatar }
        );
      }

      return { id: docRef.id, ...data, likes: 0, likedBy: [] };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }
};
