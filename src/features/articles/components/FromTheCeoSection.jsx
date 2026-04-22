import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { articleService } from "../services/articleService";
import { MessageSquare, Loader2, ThumbsUp, Eye } from "lucide-react";
import AuthorMeta from "./AuthorMeta";
import { cn } from "../../../utils/cn";
import { ImagePlaceholder } from "../../../components/ui/GenericPlaceholder";
import { useAuth } from "../../../hooks/useAuth";

/**
 * FromTheCeoSection component for the homepage spotlight
 * Styled to match the editorial layout in the provided image
 */
export default function FromTheCeoSection() {
  const { user, login } = useAuth();
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", "latest-ceo"],
    queryFn: articleService.getLatestCeoArticle,
  });

  const [localLikes, setLocalLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (article) {
      setLocalLikes(article.likes || 0);
      setIsLiked(user && article.likedBy?.includes(user.uid));
    }
  }, [article, user]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-stone-50 rounded-3xl flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-stone-300 animate-spin" />
          <p className="text-stone-400 font-serif italic">Fetching CEO's latest message...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return null;
  }

  const { title, slug, id, category, author, authorName, authorId, createdAt, imageUrl, excerpt, content, commentsCount, views } = article;

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
      console.error("Failed to like CEO article:", error);
      setIsLiked(!isLiked);
      setLocalLikes(article.likes || 0);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    let d;
    if (date.toDate) d = date.toDate();
    else d = new Date(date);
    return format(d, "MMMM d, yyyy");
  };

  const articleSlug = slug || id;

  // Extract first two paragraphs for the preview
  const getPreviewParagraphs = (text) => {
    if (!text) return [];
    // Split by double newlines and filter out empty strings
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).slice(0, 2);
  };

  const previewParagraphs = getPreviewParagraphs(content || excerpt);

  const authorData = author || { id: authorId, name: authorName };

  return (
    <section className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-serif font-bold italic tracking-tight text-stone-900">From The CEO</h2>
            <p className="text-stone-400 text-sm">Direct leadership insights and strategic updates.</p>
          </div>
          <Link 
            to="/from-the-ceo" 
            className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors border-b border-stone-200 hover:border-stone-900 pb-2 mb-1"
          >
            View Past Articles
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <AuthorMeta 
            author={authorData} 
            date={formatDate(createdAt)} 
            size="md"
            showAvatar={false}
          />
          <div className="flex items-center space-x-6 text-stone-400">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest">
              <Eye className="w-4 h-4" />
              <span>{views || 0}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest">
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount || 0}</span>
            </div>
            <button 
              onClick={handleLikeClick}
              className={cn(
                "flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest transition-colors hover:text-stone-900",
                isLiked ? "text-red-500 hover:text-red-600" : "text-stone-400"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>{localLikes}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative py-12 border-t border-stone-200">
        <Link 
          to={`/posts/${articleSlug}`}
          className="block group max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Column */}
            <div className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <img 
                src="/Mr-Wheatley.jpg" 
                alt="The CEO"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text Content */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight tracking-tight group-hover:text-stone-600 transition-colors">
                {title}
              </h2>

              {/* Preview Content with Drop Cap */}
              <div className="text-stone-700 text-lg leading-relaxed font-serif max-w-4xl space-y-6">
                {previewParagraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={cn(
                      index === 0 && "first-letter:text-7xl first-letter:font-bold first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1"
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-stone-900 group-hover:translate-x-2 transition-transform">
                  Read more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
