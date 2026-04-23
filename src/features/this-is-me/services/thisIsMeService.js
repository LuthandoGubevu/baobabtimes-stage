import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError } from '@/lib/firestore-errors';

const COLLECTION_NAME = 'this_is_me';

export const thisIsMeService = {
  /**
   * Get all published videos for the public page
   */
  async getPublishedVideos() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'PUBLISHED'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw handleFirestoreError(error, 'list', COLLECTION_NAME);
    }
  },

  /**
   * Get all videos for the admin dashboard
   */
  async getAllVideos() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw handleFirestoreError(error, 'list', COLLECTION_NAME);
    }
  },

  /**
   * Get a single video by ID
   */
  async getVideoById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw handleFirestoreError(error, 'get', `${COLLECTION_NAME}/${id}`);
    }
  },

  /**
   * Create a new video entry
   */
  async createVideo(videoData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...videoData,
        likes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw handleFirestoreError(error, 'create', COLLECTION_NAME);
    }
  },

  /**
   * Update an existing video
   */
  async updateVideo(id, videoData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...videoData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw handleFirestoreError(error, 'update', `${COLLECTION_NAME}/${id}`);
    }
  },

  /**
   * Delete a video
   */
  async deleteVideo(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw handleFirestoreError(error, 'delete', `${COLLECTION_NAME}/${id}`);
    }
  },

  /**
   * Helper to extract YouTube video ID and generate thumbnail
   */
  getYoutubeMetadata(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (videoId) {
      return {
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
      };
    }
    return null;
  }
};
