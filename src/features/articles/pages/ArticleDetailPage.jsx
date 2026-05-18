import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticle } from "../hooks/useArticles";
import { format } from "date-fns";
import { ArrowLeft, Share2, Bookmark, MessageCircle, ThumbsUp } from "lucide-react";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";
import CommentsSection from "../components/CommentsSection";
import { articleService } from "../services/articleService";
import { useAuth } from "../../../hooks/useAuth";
import { cn } from "../../../utils/cn";

/**
 * ArticleDetailPage component for displaying a full article
 */
export default function ArticleDetailPage() {
  const { id } = useParams();
  const { user, login } = useAuth();
  const { data: article, isLoading, error } = useArticle(id);
  const [localArticle, setLocalArticle] = useState(null);

  useEffect(() => {
    if (article && !localArticle) {
      // Subsequent article loads (e.g. auth change) still sync local state
      setLocalArticle(article);
    }
  }, [article, localArticle]);

  if (isLoading) return <div className="py-20 text-center">Loading article...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error loading article.</div>;
  if (!article) return <div className="py-20 text-center">Article not found.</div>;

  const { title, category, authorName, authorAvatar, authorId, createdAt, imageUrl, content, excerpt, likes, likedBy, commentsCount } = localArticle || article;
  const isLiked = user && likedBy?.includes(user.uid);

  const formatDate = (date) => {
    if (!date) return "Draft";
    if (date.toDate) return format(date.toDate(), "MMMM d, yyyy");
    return format(new Date(date), "MMMM d, yyyy");
  };

  const handleLike = async () => {
    if (!user) return login();
    try {
      const newIsLiking = !isLiked;
      await articleService.toggleArticleLike(id, user.uid, newIsLiking);
      
      // Update local state for immediate feedback
      setLocalArticle(prev => ({
        ...prev,
        likes: (prev.likes || 0) + (newIsLiking ? 1 : -1),
        likedBy: newIsLiking 
          ? [...(prev.likedBy || []), user.uid]
          : (prev.likedBy || []).filter(uid => uid !== user.uid)
      }));
    } catch (error) {
      console.error("Failed to toggle article like:", error);
    }
  };

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      {/* Back Button */}
      <Link to="/articles" className="inline-flex items-center space-x-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back to Articles</span>
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              {category === "From the Desk" ? "👉 From the Desk" : category}
            </span>
            <span className="text-stone-400 text-xs font-medium">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
          {title}
        </h1>
        <p className="text-xl text-stone-500 font-light italic mb-8 border-l-4 border-stone-200 pl-6 leading-relaxed">
          {excerpt}
        </p>
        <div className="flex items-center justify-between py-6 border-y border-stone-100">
          <div className="flex items-center space-x-4">
            <AvatarPlaceholder name={authorName} src={authorAvatar} size="md" />
            <div>
              <p className="text-sm font-bold text-stone-900">{authorName || "Anonymous"}</p>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Contributor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full border transition-all",
                isLiked 
                  ? "bg-red-50 border-red-100 text-red-500" 
                  : "bg-stone-50 border-stone-100 text-stone-400 hover:text-stone-900"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span className="text-xs font-bold uppercase tracking-widest">{likes || 0}</span>
            </button>
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* Featured Image — only rendered when a URL is actually stored */}
      {imageUrl && (
        <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-stone-100 mb-12 shadow-xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-stone prose-lg max-w-none mb-16 px-4 md:px-0">
        <div className="text-stone-700 leading-relaxed font-serif whitespace-pre-wrap">
          {content || excerpt}
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="pt-12 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-stone-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Comments ({commentsCount || 0})</span>
            </div>
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-2 transition-colors",
                isLiked ? "text-red-500" : "text-stone-500 hover:text-stone-900"
              )}
            >
              <ThumbsUp className={cn("w-5 h-5", isLiked && "fill-current")} />
              <span className="text-sm font-bold">Likes ({likes || 0})</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-widest mr-4 hidden md:inline">Share this story</span>
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-900 hover:text-white cursor-pointer transition-all">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <CommentsSection articleId={id} />
    </article>
  );
}
