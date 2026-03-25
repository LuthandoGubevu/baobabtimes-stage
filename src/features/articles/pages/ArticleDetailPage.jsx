import { useParams, Link } from "react-router-dom";
import { useArticle } from "../hooks/useArticles";
import { format } from "date-fns";
import { ArrowLeft, Share2, Bookmark, MessageCircle } from "lucide-react";

/**
 * ArticleDetailPage component for displaying a full article
 */
export default function ArticleDetailPage() {
  const { id } = useParams();
  const { data: article, isLoading, error } = useArticle(id);

  if (isLoading) return <div className="py-20 text-center">Loading article...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error loading article.</div>;
  if (!article) return <div className="py-20 text-center">Article not found.</div>;

  const { title, category, authorName, authorId, createdAt, imageUrl, content, excerpt } = article;

  const formatDate = (date) => {
    if (!date) return "Draft";
    if (date.toDate) return format(date.toDate(), "MMMM d, yyyy");
    return format(new Date(date), "MMMM d, yyyy");
  };

  return (
    <article className="max-w-4xl mx-auto py-12">
      {/* Back Button */}
      <Link to="/articles" className="inline-flex items-center space-x-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back to Articles</span>
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            {category}
          </span>
          <span className="text-stone-400 text-xs font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
          {title}
        </h1>
        <p className="text-xl text-stone-500 font-light italic mb-8 border-l-4 border-stone-200 pl-6">
          {excerpt}
        </p>
        <div className="flex items-center justify-between py-6 border-y border-stone-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm">
              <img src={`https://i.pravatar.cc/150?u=${authorId || id}`} alt={authorName} referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">{authorName || "Anonymous"}</p>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Contributor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-stone-100 mb-12 shadow-xl">
        <img 
          src={imageUrl || `https://picsum.photos/seed/art-hero-${id}/1200/600`} 
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="prose prose-stone prose-lg max-w-none mb-16">
        {/* In a real app, this would be rendered from HTML/Markdown */}
        <p className="text-stone-700 leading-relaxed mb-6">
          {content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
        </p>
        <p className="text-stone-700 leading-relaxed mb-6">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <h2 className="text-2xl font-serif font-bold mt-12 mb-6">The Strategic Vision</h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      {/* Footer Actions */}
      <footer className="pt-12 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Comments (12)</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-widest mr-4">Share this story</span>
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-900 hover:text-white cursor-pointer transition-all">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
