export type ActivityType = 
  | 'article_published' 
  | 'recognition_posted' 
  | 'ceo_message_published' 
  | 'announcement_published' 
  | 'spotlight_published';

export interface ActivityMetadata {
  category?: string;
  authorName?: string;
  recognitionValue?: string;
  fromName?: string;
  toName?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  message?: string;
  entityId?: string;
  entitySlug?: string;
  url?: string;
  metadata?: ActivityMetadata;
  isPublic: boolean;
  createdAt: any; // Firestore Timestamp
}
