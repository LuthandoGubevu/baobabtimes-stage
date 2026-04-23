import { useArticles } from "../hooks/useArticles";
import ArticleCard from "../components/ArticleCard";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { cn } from "../../../utils/cn";

import { CATEGORIES } from "../../../constants/categories";

/**
 * ArticlesPage component for displaying the article feed
 */
export default function ArticlesPage() {
  const { data: articles, isLoading, error } = useArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleCategoryChange = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
    setSelectedCategory(cat);
  };

  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">The Newsroom</h1>
          <p className="text-stone-500 text-lg font-light">
            Stay informed with the latest updates, stories, and strategic insights from across the organization.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-stone-900 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES.map(c => c.name)].map((cat) => (
          <button 
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border transition-all",
              selectedCategory === cat 
                ? "bg-stone-900 text-white border-stone-900" 
                : "border-stone-200 text-stone-500 hover:bg-stone-900 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
        {/* Main Feed */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="py-20 text-center">Loading articles...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">Error loading articles.</div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} className="" />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-stone-500">No articles found matching your search.</div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10 sticky top-8">
          {/* HD Feature Video */}
          <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm group">
            <div className="aspect-[9/16] w-full bg-stone-100 flex items-center justify-center relative shadow-inner">
              <video 
                src="/FamilyFiestaPortraitVideo.mp4" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>

          {/* Ask CEO Widget */}
          <div className="bg-stone-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-serif font-bold mb-3 italic">Ask the CEO</h3>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                Have a question for our leadership? Get direct answers and strategic clarity here.
              </p>
              <Link 
                to="/ask-ceo"
                className="w-full py-4 bg-white text-stone-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-all text-center block shadow-xl"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
