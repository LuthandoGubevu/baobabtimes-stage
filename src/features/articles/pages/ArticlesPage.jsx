import { useArticles } from "../hooks/useArticles";
import ArticleCard from "../components/ArticleCard";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center">Loading articles...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-500">Error loading articles.</div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} className="" />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-stone-500">No articles found matching your search.</div>
      )}
    </div>
  );
}
