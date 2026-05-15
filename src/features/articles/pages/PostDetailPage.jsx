import { useParams, Navigate } from "react-router-dom";

/**
 * PostDetailPage — legacy route redirect.
 * All article links now use /articles/:id (ArticleDetailPage).
 * This component transparently redirects any old /posts/:slug URLs
 * to the canonical Firestore-ID-based route.
 */
export default function PostDetailPage() {
  const { slug } = useParams();
  return <Navigate to={`/articles/${slug}`} replace />;
}
