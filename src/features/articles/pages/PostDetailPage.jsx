import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { articleService } from "../services/articleService";
import { Loader2, Calendar, MessageCircle, ChevronRight, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import AuthorMeta from "../components/AuthorMeta";

export default function PostDetailPage() {
  const { slug } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-stone-300 animate-spin" />
        <p className="text-stone-500 font-medium animate-pulse">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Article Not Found</h2>
        <p className="text-stone-600 mb-8">The article you are looking for might have been moved or deleted.</p>
        <Link 
          to="/articles" 
          className="inline-flex items-center px-6 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-colors"
        >
          Back to Articles
        </Link>
      </div>
    );
  }

  const { title, category, author, authorName, authorId, createdAt, imageUrl, content, excerpt } = article;

  const formatDate = (date) => {
    if (!date) return "";
    if (date.toDate) return format(date.toDate(), "MMMM d, yyyy");
    return format(new Date(date), "MMMM d, yyyy");
  };

  const authorData = author || { id: authorId, name: authorName };

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Breadcrumbs */}
      <nav className="max-w-4xl mx-auto px-4 py-6 flex items-center space-x-2 text-sm text-stone-500">
        <Link to="/" className="hover:text-stone-900 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/articles" className="hover:text-stone-900 uppercase tracking-wider font-bold">
          {category || "News"}
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="aspect-[21/9] w-full bg-stone-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img 
            src={imageUrl || `https://picsum.photos/seed/post-${article.id}/1200/600`} 
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-6">
          <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em]">
            {category}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-stone-100 pb-8">
            <AuthorMeta author={authorData} date={formatDate(createdAt)} size="md" />
            
            <div className="flex items-center space-x-4 text-stone-400 text-sm">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Article Body */}
        <div className="prose prose-stone max-w-none">
            {/* Intro/Excerpt */}
            {excerpt && (
              <p className="text-xl md:text-2xl font-medium text-sky-500 leading-relaxed mb-8">
                {excerpt}
              </p>
            )}

            {/* Main Content */}
            <div className="markdown-body text-stone-700 leading-loose text-lg space-y-6">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-3xl font-serif font-bold mt-12 mb-6 text-stone-900" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-serif font-bold mt-8 mb-4 text-stone-900" {...props} />,
                  p: ({node, ...props}) => <p className="mb-6" {...props} />,
                  img: ({node, ...props}) => (
                    <div className="my-10 rounded-xl overflow-hidden shadow-lg">
                      <img className="w-full h-auto" {...props} referrerPolicy="no-referrer" />
                    </div>
                  ),
                  a: ({node, ...props}) => <a className="text-sky-600 underline hover:text-sky-800" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Example Inline Banner (as requested) */}
            <div className="my-12 p-1 bg-stone-100 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://picsum.photos/seed/banner/1200/300" 
                alt="Promotion" 
                className="w-full h-auto rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-stone-500">
                <span>Bottomless Buckets - Competition</span>
                <span>17 March - 20 April 2026</span>
              </div>
            </div>
        </div>
      </div>
    </article>
  );
}
