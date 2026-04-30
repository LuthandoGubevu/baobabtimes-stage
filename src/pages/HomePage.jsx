import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useArticles } from "../features/articles/hooks/useArticles";
import { useQuery } from "@tanstack/react-query";
import { recognitionService } from "../features/recognition/services/recognitionService";
import ArticleCard from "../features/articles/components/ArticleCard";
import FromTheCeoSection from "../features/articles/components/FromTheCeoSection";
import { AvatarPlaceholder, ImagePlaceholder } from "../components/ui/GenericPlaceholder";
import { useRef, useEffect, useState } from "react";
import { CATEGORIES } from "../constants/categories";
import { Search, Filter, Video, ArrowUpRight, Star } from "lucide-react";

/**
 * HomePage component
 * Displays the Hero, CEO Spotlight, and Featured Articles
 */
export default function HomePage() {
  const videoRef = useRef(null);
  const wideVideoRef = useRef(null);
  const { data: articles, isLoading, isError } = useArticles();
  const [searchQuery, setSearchQuery] = useState("");
  const [homeCategory, setHomeCategory] = useState("All");
  
  const { data: recognitions, isLoading: isLoadingRecognitions } = useQuery({
    queryKey: ["recognitions"],
    queryFn: recognitionService.getApprovedRecognitions
  });

  useEffect(() => {
    let isMounted = true;

    const attemptPlay = async (ref, name) => {
      if (ref.current) {
        try {
          await ref.current.play();
        } catch (error) {
          // Only log if the component is still mounted and it's not a normal interruption/abort
          if (isMounted && error.name !== 'AbortError') {
            console.error(`${name} autoplay was prevented:`, error);
          }
        }
      }
    };

    attemptPlay(videoRef, "Sidebar video");
    attemptPlay(wideVideoRef, "Wide video");

    return () => {
      isMounted = false;
    };
  }, []);

  const recentPraise = Array.isArray(recognitions) ? recognitions.slice(0, 3) : [];
  
  // Filter articles based on home search and category
  const featuredArticles = Array.isArray(articles) 
    ? articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = homeCategory === "All" || article.category === homeCategory;
        return matchesSearch && matchesCategory;
      }) 
    : [];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-24 bg-stone-900 text-white rounded-[2rem] overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="/staff-image.jpg" 
            alt="Staff" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 to-stone-900/80"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-fade-in">
            Established 2024
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[0.9] tracking-tighter">
            The Baobab <br />
            <span className="italic text-stone-400">Times</span>
          </h1>
          <p className="text-xl text-stone-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Reimagining internal communication through editorial excellence, 
            strategic clarity, and deep employee engagement.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/articles" 
              className="px-10 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-200 transition-all transform hover:scale-105 shadow-xl"
            >
              Read Latest News
            </Link>
            <Link 
              to="/recognition" 
              className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Recognize a Peer
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles Search & Navigation */}
      <div className="space-y-12 py-10 border-y border-stone-100 bg-white/70 backdrop-blur-md px-6 -mx-6 md:rounded-[2rem]">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-serif font-bold mb-4 italic">Search Articles</h2>
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
                className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all w-64 shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-stone-900 transition-colors shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => setHomeCategory("All")}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-lg ${
              homeCategory === "All" 
                ? "bg-stone-900 text-white shadow-stone-900/10" 
                : "bg-white border border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button 
              key={category.slug}
              onClick={() => setHomeCategory(category.name)}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-sm ${
                homeCategory === category.name
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Panoramic Video Section */}
      <section className="relative w-full aspect-[5/1] bg-stone-900 rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
        <video 
          ref={wideVideoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://times.baobabbrands.com/wp-content/uploads/2026/04/WideVideoLandingPage.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle decorative overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-stone-900/40 to-transparent pointer-events-none"></div>
      </section>

      {/* From The CEO Section */}
      <FromTheCeoSection />

      {/* Separator */}
      <hr className="border-stone-200" />

      {/* Values Header */}
      <div className="space-y-2">
        <h2 className="text-5xl md:text-6xl font-serif font-bold italic tracking-tight text-stone-900">
          Our Values <span className="text-stone-400 not-italic font-sans text-xl ml-4 tracking-widest uppercase align-middle">Video Series</span>
        </h2>
        <p className="text-stone-500 text-lg font-light">Deepening our understanding of the Baobab culture.</p>
      </div>

      {/* Our Values Page Link Card */}
      <section className="bg-brand-500 rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="/HarveyValues.png" 
            alt="Baobab Values" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700/80 via-brand-600/40 to-transparent"></div>
        
        <div className="relative z-10 px-12 py-16 md:py-20 max-w-4xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Star className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">Corporate Culture</span>
          </div>
          
          <p className="text-brand-50 text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed">
            A deeper look into the behavioral competencies and core beliefs that define excellence at The Baobab Times.
          </p>
          
          <Link 
            to="/values" 
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-brand-900 font-bold rounded-full hover:bg-brand-50 transition-all hover:scale-105 shadow-xl group/btn"
          >
            <span>Explore the Series</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </Link>
        </div>
        
        {/* Abstract decorative shape */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
        {/* Featured Stories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="flex justify-between items-end border-b border-stone-200 pb-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-serif font-bold italic tracking-tight">Featured Stories</h2>
              <p className="text-stone-400 text-lg font-light">Hand-picked insights from across the organization.</p>
            </div>
            <Link 
              to="/articles" 
              className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors border-b border-stone-200 hover:border-stone-900 pb-2 mb-1"
            >
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[16/10] bg-stone-100 rounded-2xl"></div>
                  <div className="h-4 bg-stone-100 rounded w-1/4"></div>
                  <div className="h-6 bg-stone-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-20 text-center bg-red-50 rounded-3xl border border-dashed border-red-200">
              <p className="text-red-500 font-serif italic">Failed to load articles. Please check your connection or permissions.</p>
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
              <p className="text-stone-400 font-serif italic">No featured articles available at this time.</p>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Featured Video Placeholder */}
          <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
            <div className="aspect-video w-full bg-stone-100 flex items-center justify-center relative group shadow-inner">
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/FiestaLandingPageVideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* This is me Widget */}
          <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold mb-3 flex items-center">
                <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-lg flex items-center justify-center mr-3 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Video size={16} />
                </div>
                This is me
              </h2>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                Our in-office interview series. Behind the scenes stories and surprise questions with the Baobab team.
              </p>
              <Link 
                to="/this-is-me"
                className="w-full mt-2 py-4 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-all text-center block shadow-lg shadow-stone-900/10"
              >
                Watch Episodes
              </Link>
            </div>
          </div>

          {/* Recognition Widget */}
          <div className="bg-stone-100 p-8 rounded-[2rem] border border-stone-200/50 shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center text-sm mr-3">★</span>
              Recent Praise
            </h2>
            <div className="space-y-6">
              {isLoadingRecognitions ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-white p-5 rounded-2xl border border-stone-200/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-stone-200 rounded w-24"></div>
                        <div className="h-2 bg-stone-100 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-stone-50 rounded w-full"></div>
                  </div>
                ))
              ) : recentPraise.length > 0 ? (
                recentPraise.map((rec) => (
                  <div key={rec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/30 hover:shadow-md transition-shadow cursor-default">
                    <div className="flex items-center space-x-3 mb-3">
                      <AvatarPlaceholder name={rec.fromName} size="md" />
                      <div>
                        <p className="text-sm font-bold text-stone-900">
                          {rec.fromName || (rec.isAnonymous ? "Anonymous" : "Someone")}
                        </p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                          To: {rec.toName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 italic leading-relaxed line-clamp-3">
                      "{rec.content}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center bg-white/50 rounded-2xl border border-dashed border-stone-200">
                  <p className="text-stone-400 text-sm font-serif italic">No recent praise yet.</p>
                </div>
              )}
            </div>
            <Link 
              to="/recognition"
              className="w-full mt-8 py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-800 transition-all text-center block shadow-lg shadow-stone-900/10"
            >
              See All Recognition
            </Link>
          </div>

          {/* Ask CEO Widget */}
          <div className="bg-stone-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-2xl font-serif font-bold mb-3 relative z-10">Ask the CEO</h2>
            <p className="text-stone-400 text-sm mb-8 leading-relaxed relative z-10">
              Have a question for our leadership? Get direct answers and strategic clarity here.
            </p>
            <div className="space-y-4 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Latest Question:</p>
                <p className="text-sm font-serif font-bold leading-snug">
                  "What is our policy on remote work for the next quarter?"
                </p>
              </div>
            </div>
            <Link 
              to="/ask-ceo"
              className="w-full mt-8 py-4 bg-white text-stone-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-stone-100 transition-all text-center block shadow-xl"
            >
              Ask a Question
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
