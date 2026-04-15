import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articleService } from "../services/articleService";
import { format } from "date-fns";
import { Loader2, ArrowLeft, BookOpen, User } from "lucide-react";
import AuthorMeta from "../components/AuthorMeta";
import { ImagePlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * CeoArchivePage component
 * Displays a list of all published CEO articles
 */
export default function CeoArchivePage() {
  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ["articles", "ceo-archive"],
    queryFn: articleService.getCeoArticles,
  });

  const formatDate = (date) => {
    if (!date) return "";
    let d;
    if (date.toDate) d = date.toDate();
    else d = new Date(date);
    return format(d, "MMMM d, yyyy");
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-stone-300 animate-spin" />
        <p className="text-stone-400 font-serif italic">Opening the CEO archive...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      {/* Header */}
      <header className="space-y-8 border-b border-stone-200 pb-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="inline-block px-4 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
            Leadership Archive
          </div>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight text-stone-900">
            From The CEO
          </h1>
          <p className="text-stone-500 text-xl font-light max-w-2xl leading-relaxed">
            A chronological library of strategic updates, leadership insights, and vision statements from our CEO.
          </p>
        </div>
      </header>

      {/* Articles List */}
      <div className="space-y-12">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <article 
              key={article.id} 
              className="group grid grid-cols-1 md:grid-cols-[1fr_250px] gap-12 items-start pb-12 border-b border-stone-100 last:border-0"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <AuthorMeta 
                    author={article.author || { id: article.authorId, name: article.authorName }} 
                    date={formatDate(article.publishedAt || article.createdAt)} 
                    size="sm"
                  />
                  {index === 0 && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-100">
                      Latest Message
                    </span>
                  )}
                </div>

                <Link to={`/posts/${article.slug || article.id}`} className="block space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-stone-600 leading-relaxed line-clamp-3 font-serif italic">
                    {article.excerpt || (article.content ? article.content.substring(0, 250) + "..." : "")}
                  </p>
                </Link>

                <Link 
                  to={`/posts/${article.slug || article.id}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-900 hover:translate-x-2 transition-transform"
                >
                  Read Full Message
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Thumbnail */}
              <Link 
                to={`/posts/${article.slug || article.id}`}
                className="hidden md:block aspect-square overflow-hidden rounded-2xl shadow-lg"
              >
                <ImagePlaceholder icon={User} className="group-hover:scale-105 transition-all duration-700" />
              </Link>
            </article>
          ))
        ) : (
          <div className="py-24 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
            <BookOpen className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-serif italic text-lg">No archived messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
