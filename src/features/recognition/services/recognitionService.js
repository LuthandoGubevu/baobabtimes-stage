import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../../../firebase";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

export const recognitionService = {
  /**
   * Fetch all approved recognitions
   * @returns {Promise<Array>}
   */
  getApprovedRecognitions: async () => {
    const path = "recognitions";
    try {
      const q = query(
        collection(db, path), 
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(rec => rec.status === "APPROVED");
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
      
      const stats = {
        Smart: 0,
        Communication: 0,
        Impact: 0,
        Transforming: 0,
        Innovation: 0,
        Courage: 0,
        Passion: 0,
        Authentic: 0,
        Selflessness: 0,
        Heart: 0,
        Teamwork: 0, // Legacy
        Excellence: 0, // Legacy
        total: 0
      };

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
      return { total: 0 };
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
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }
};
