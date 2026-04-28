import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  where
} from "firebase/firestore";
import { db } from "../../../firebase";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

export const amaService = {
  /**
   * Fetch all approved and answered questions
   * @returns {Promise<Array>}
   */
  getQuestions: async () => {
    const path = "ama_questions";
    try {
      const q = query(
        collection(db, path),
        where("status", "in", ["APPROVED", "ANSWERED"])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Submit a new question
   * @param {Object} questionData 
   * @returns {Promise<Object>}
   */
  submitQuestion: async (questionData) => {
    const path = "ama_questions";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...questionData,
        createdAt: serverTimestamp(),
        upvotes: 0,
        status: "PENDING",
        reactions: {
          helpful: [],
          insightful: [],
          more_detail: []
        }
      });
      return { id: docRef.id, ...questionData };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      throw err;
    }
  },

  /**
   * Toggle a reaction on an answer
   * @param {string} questionId 
   * @param {string} userId 
   * @param {string} reactionType - 'helpful', 'insightful', 'more_detail'
   * @param {boolean} isReacted - Current state
   */
  toggleReaction: async (questionId, userId, reactionType, isReacted) => {
    if (!questionId) {
      console.error("toggleReaction: Missing questionId");
      return;
    }
    const path = `ama_questions/${questionId}`;
    try {
      const docRef = doc(db, "ama_questions", questionId);
      const field = `reactions.${reactionType}`;
      
      await updateDoc(docRef, {
        [field]: isReacted ? arrayRemove(userId) : arrayUnion(userId)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
      throw err;
    }
  }
};
