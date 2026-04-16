import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc,
  writeBatch,
  serverTimestamp, 
  orderBy,
  limit
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
      const q = query(
        collection(db, path), 
        where("status", "==", "PUBLISHED")
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
   * Create a new article
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  createArticle: async (data) => {
    const path = "articles";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...data,
        status: data.status || "DRAFT",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Send Push Notification if published
      if (data.status === "PUBLISHED") {
        try {
          await fetch('/api/notifications/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `New Article: ${data.title}`,
              body: data.excerpt || "Read the latest news on The Baobab Times",
              url: `/articles/${docRef.id}`
            })
          });
        } catch (err) {
          console.error('Failed to send push notification:', err);
        }
      }

      return { id: docRef.id, ...data };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  },

  /**
   * Publish a CEO message and deactivate the previous one
   * @param {string} id 
   * @param {Object} data 
   * @param {Object} user 
   */
  publishCeoMessage: async (id, data, user) => {
    const path = "articles";
    try {
      const batch = writeBatch(db);
      
      // 1. Find the currently active CEO message
      const activeQuery = query(
        collection(db, path),
        where("category", "==", "From the CEO"),
        where("isHomepageActive", "==", true)
      );
      const activeSnapshot = await getDocs(activeQuery);
      
      // 2. Deactivate existing active messages
      activeSnapshot.forEach((activeDoc) => {
        if (activeDoc.id !== id) {
          batch.update(activeDoc.ref, { 
            isHomepageActive: false,
            updatedAt: serverTimestamp()
          });
        }
      });

      // 3. Prepare the new/updated message
      const messageData = {
        ...data,
        category: "From the CEO",
        contentType: "from_ceo",
        status: "PUBLISHED",
        isHomepageActive: true,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (id) {
        batch.update(doc(db, path, id), messageData);
      } else {
        const newDocRef = doc(collection(db, path));
        batch.set(newDocRef, {
          ...messageData,
          author: {
            id: user.uid,
            name: user.displayName || "CEO",
            avatar: user.photoURL || "",
            role: "CEO"
          },
          authorId: user.uid,
          authorName: user.displayName || "CEO",
          views: 0,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit();

      // Send Push Notification
      try {
        await fetch('/api/notifications/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `New Message from the CEO`,
            body: data.title,
            url: `/from-the-ceo`
          })
        });
      } catch (err) {
        console.error('Failed to send push notification:', err);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  /**
   * Archive a CEO message (remove from homepage)
   * @param {string} id 
   */
  archiveCeoMessage: async (id) => {
    const path = `articles/${id}`;
    try {
      await updateDoc(doc(db, "articles", id), {
        status: "ARCHIVED",
        isHomepageActive: false,
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  /**
   * Fetch a single article by Slug
   * @param {string} slug 
   * @returns {Promise<Object>}
   */
  getArticleBySlug: async (slug) => {
    const path = "articles";
    try {
      const q = query(
        collection(db, path), 
        where("slug", "==", slug),
        where("status", "==", "PUBLISHED")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  /**
   * Fetch the active CEO article for the homepage
   * @returns {Promise<Object>}
   */
  getLatestCeoArticle: async () => {
    const path = "articles";
    try {
      // Query specifically for the active homepage message
      const q = query(
        collection(db, path),
        where("category", "==", "From the CEO"),
        where("status", "==", "PUBLISHED"),
        where("isHomepageActive", "==", true),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }

      // Fallback: Get the latest published if no "active" flag is found
      const fallbackQ = query(
        collection(db, path),
        where("category", "==", "From the CEO"),
        where("status", "==", "PUBLISHED")
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      const articles = fallbackSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.publishedAt?.toDate?.() || new Date(a.publishedAt || 0);
          const dateB = b.publishedAt?.toDate?.() || new Date(b.publishedAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      return articles.length > 0 ? articles[0] : null;
    } catch (error) {
      console.error("Error fetching CEO article:", error);
      return null;
    }
  },

  /**
   * Fetch all published CEO articles for the archive
   * @returns {Promise<Array>}
   */
  getCeoArticles: async () => {
    const path = "articles";
    try {
      const q = query(
        collection(db, path),
        where("category", "==", "From the CEO"),
        where("status", "==", "PUBLISHED")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.publishedAt?.toDate?.() || new Date(a.publishedAt || 0);
          const dateB = b.publishedAt?.toDate?.() || new Date(b.publishedAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};
