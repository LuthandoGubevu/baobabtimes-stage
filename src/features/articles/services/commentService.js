import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp, 
  orderBy,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "../../../firebase";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

export const commentService = {
  /**
   * Fetch all comments for a specific article
   * @param {string} articleId 
   * @returns {Promise<Array>}
   */
  getComments: async (articleId) => {
    const path = `articles/${articleId}/comments`;
    try {
      const q = query(
        collection(db, "articles", articleId, "comments"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Subscribe to comments for a specific article
   * @param {string} articleId 
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  subscribeToComments: (articleId, callback) => {
    const q = query(
      collection(db, "articles", articleId, "comments"),
      orderBy("createdAt", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(comments);
    }, (error) => {
      console.error("Comments subscription error:", error);
    });
  },

  /**
   * Post a new comment or reply
   * @param {string} articleId 
   * @param {Object} userData 
   * @param {string} content 
   * @param {string|null} parentId - If provided, this is a reply to another comment
   */
  postComment: async (articleId, userData, content, parentId = null) => {
    const path = `articles/${articleId}/comments`;
    try {
      const commentData = {
        content,
        authorId: userData.uid,
        authorName: userData.displayName || "Anonymous",
        authorAvatar: userData.photoURL || "",
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        parentId: parentId, // Will be null for top-level comments
      };
      
      const docRef = await addDoc(collection(db, "articles", articleId, "comments"), commentData);
      
      // If it's a reply, we could also update the parent comment's reply count if we had one
      
      return { id: docRef.id, ...commentData };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  /**
   * Like or unlike a comment
   * @param {string} articleId 
   * @param {string} commentId 
   * @param {string} userId 
   * @param {boolean} isLiking 
   */
  toggleLike: async (articleId, commentId, userId, isLiking) => {
    const path = `articles/${articleId}/comments/${commentId}`;
    try {
      const commentRef = doc(db, "articles", articleId, "comments", commentId);
      await updateDoc(commentRef, {
        likes: increment(isLiking ? 1 : -1),
        likedBy: isLiking ? arrayUnion(userId) : arrayRemove(userId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  }
};
