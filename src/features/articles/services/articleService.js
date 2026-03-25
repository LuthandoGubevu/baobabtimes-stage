import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  serverTimestamp, 
  orderBy 
} from "firebase/firestore";
import { db } from "../../../firebase";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

export const articleService = {
  /**
   * Fetch all published articles
   * @returns {Promise<Array>}
   */
  getPublishedArticles: async () => {
    const path = "articles";
    try {
      // Fetch all articles and filter in memory to avoid index requirement
      const q = query(
        collection(db, path), 
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(article => article.status === "PUBLISHED");
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Fetch a single article by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  getArticleById: async (id) => {
    const path = `articles/${id}`;
    try {
      const docRef = doc(db, "articles", id);
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
   * Create a new article draft
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  createArticle: async (data) => {
    const path = "articles";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        status: "DRAFT",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }
};
