import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export const userService = {
  /**
   * Fetch all users
   * @returns {Promise<Array>}
   */
  getAllUsers: async () => {
    const path = "users";
    try {
      const q = query(collection(db, path), orderBy("displayName", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Fetch user by ID
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  getUserById: async (userId) => {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  updateUser: async (userId, data) => {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return false;
    }
  }
};
