import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../../../utils/cn";
import AuthorMeta from "./AuthorMeta";
import { ImagePlaceholder } from "../../../components/ui/GenericPlaceholder";
import { ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { articleService } from "../services/articleService";

/**
 * ArticleCard component for displaying article summaries
 * @param {Object} props
 * @param {Object} props.article
 * @param {string} props.className
 */
export default function ArticleCard({ article, className }) {
  const { user, login } = useAuth();
  const { 
    id, title, slug, category, author, authorName, authorId, 
    createdAt, imageUrl, excerpt, likes, commentsCount, views, likedBy 
  } = article;

  const [localLikes, setLocalLikes] = useState(likes || 0);
  const [isLiked, setIsLiked] = useState(user && likedBy?.includes(user.uid));

  const formatDate = (date) => {
    if (!date) return "Draft";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return login();

    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLocalLikes(prev => newLikedState ? prev + 1 : prev - 1);
      
      await articleService.toggleArticleLike(id, user.uid, newLikedState);
    } catch (error) {
      console.error("Failed to like article from card:", error);
      // Revert if failed
      setIsLiked(!isLiked);
      setLocalLikes(likes || 0);
    }
  };

  const articleSlug = slug || id;

  // Use the new author object or fallback to existing authorName/authorId
  const authorData = author || { id: authorId, name: authorName };

  return (
    <Link 
      to={`/posts/${articleSlug}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-400 transition-all duration-300",
        className
      )}
    >
      <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <ImagePlaceholder className="group-hover:scale-105 transition-transform duration-700" />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 py-0.5 bg-stone-50 rounded border border-stone-100">
            {category === "From the Desk" ? "👉 From the Desk" : category}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-stone-600 transition-colors leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="text-stone-500 text-sm line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
          <AuthorMeta author={authorData} size="sm" />
          <div className="flex items-center space-x-3 text-stone-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{commentsCount || 0}</span>
            </div>
            <button 
              onClick={handleLikeClick}
              className={cn(
                "flex items-center space-x-1 transition-colors hover:text-stone-900",
                isLiked ? "text-red-500 hover:text-red-600" : "text-stone-400"
              )}
            >
              <ThumbsUp className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
              <span className="text-[10px] font-bold">{localLikes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
