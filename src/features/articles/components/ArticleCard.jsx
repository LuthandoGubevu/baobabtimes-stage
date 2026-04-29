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
    createdAt, imageUrl, excerpt, content, likes, commentsCount, views, likedBy 
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

  // Helper to strip markdown and get a plain text snippet
  const getPreviewText = (text) => {
    if (!text) return "";
    
    // 1. Remove markdown syntax
    let cleanText = text
      .replace(/[#*`_~[\]()]/g, "") // Remove common markdown chars
      .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
      .replace(/\[.*?\]\(.*?\)/g, "$1") // Keep link text, remove URL
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // 2. Try to get the first 180 characters, breaking at a sentence end if possible
    if (cleanText.length <= 180) return cleanText;
    
    const truncated = cleanText.substring(0, 180);
    const lastPunctuation = Math.max(
      truncated.lastIndexOf("."),
      truncated.lastIndexOf("?"),
      truncated.lastIndexOf("!")
    );

    if (lastPunctuation > 80) {
      return cleanText.substring(0, lastPunctuation + 1);
    }

    return truncated + "...";
  };

  // The user specifically wants to pull from the "story" element (which is the main article content/body)
  // We prioritize the content field over the excerpt for the card preview to ensure actual sentences are shown.
  const storyPreview = getPreviewText(content);
  
  // Final decision: If storyPreview exists and isn't just the author/title, use it.
  // Otherwise try excerpt, then default.
  let finalPreview = "Read the latest update from our team and stay connected with our community insights.";
  
  if (storyPreview && storyPreview.length > 20) {
    finalPreview = storyPreview;
  } else if (excerpt && excerpt.length > 20 && excerpt.toLowerCase() !== authorName?.toLowerCase()) {
    finalPreview = excerpt;
  }

  return (
    <Link 
      to={`/posts/${articleSlug}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-400 transition-all duration-300",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 py-0.5 bg-stone-50 rounded border border-stone-100">
            {category === "From the Desk" ? "👉 From the Desk" : category}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-stone-600 transition-colors leading-tight">
          {title}
        </h3>
        
        <div className="mb-4">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
            {authorName || "Editorial Team"}
          </p>
        </div>

        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6">
          {finalPreview}
        </p>

        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
            Read Full Article
            <svg 
              className="ml-2 w-3.5 h-3.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="pt-5 border-t border-stone-50 flex items-center justify-between">
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
