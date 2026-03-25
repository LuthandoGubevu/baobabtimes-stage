/**
 * Global Types for The Baobab Times
 */

export type UserRole = "VIEWER" | "CONTRIBUTOR" | "CEO" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type ArticleStatus = "DRAFT" | "SUBMITTED" | "PUBLISHED";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  categoryId: string;
  status: ArticleStatus;
  imageUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export type RecognitionCategory = "TEAMWORK" | "INNOVATION" | "EXCELLENCE";
export type RecognitionStatus = "PENDING" | "APPROVED";

export interface Recognition {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  category: RecognitionCategory;
  status: RecognitionStatus;
  createdAt: string;
}

export type QuestionStatus = "PENDING" | "MODERATED" | "ANSWERED";

export interface Question {
  id: string;
  userId: string;
  text: string;
  status: QuestionStatus;
  createdAt: string;
  answer?: Answer;
}

export interface Answer {
  id: string;
  questionId: string;
  ceoUserId: string;
  answerText: string;
  publishedAt: string;
}
