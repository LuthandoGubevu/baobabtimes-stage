import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Mic2, Users, Heart, Share2, MessageCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { thisIsMeService } from "../features/this-is-me/services/thisIsMeService";
import { cn } from "../utils/cn";

export default function ThisIsMePage() {
  const { data: episodes, isLoading, error } = useQuery({
    queryKey: ["this-is-me", "published"],
    queryFn: thisIsMeService.getPublishedVideos,
  });

  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="space-y-16 py-8">
      {/* Video Modal Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden bg-black shadow-2xl"
          >
            <iframe 
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] rounded-[3rem] overflow-hidden bg-stone-900 group">
        <img 
          src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=2000"
          alt="This Is Me Podcast"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 p-12 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg shadow-red-600/20">
                New Series
              </span>
              <div className="flex items-center space-x-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <Mic2 className="w-4 h-4" />
                <span>Podcast & Video</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tighter italic">
              This Is Me.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-2xl mb-10">
              Go beyond the emails. An in-office series where we interview each other with surprise questions, sharing the human stories behind the desk.
            </p>
            
            {episodes?.length > 0 && (
              <button 
                onClick={() => setActiveVideo(episodes[0])}
                className="flex items-center space-x-4 px-10 py-5 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-all shadow-2xl active:scale-95 group/btn"
              >
                <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white transition-transform group-hover/btn:scale-110">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Watch Latest Episode</span>
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Feature */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-5xl font-serif font-bold italic tracking-tight text-stone-900 leading-tight">
            Humanizing the <br /> Workplace.
          </h2>
          <p className="text-stone-500 font-light text-lg leading-relaxed">
            In our effort to have employees get to know one another, we've launched "This Is Me" — a platform for vulnerability, humor, and connection.
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-stone-400 italic font-serif">Join 40+ colleagues</span>
          </div>
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-100 space-y-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Users className="w-7 h-7 text-stone-900" />
            </div>
            <h3 className="text-2xl font-serif font-bold italic text-stone-900">Peer Interviews</h3>
            <p className="text-stone-500 font-light leading-relaxed">
              No formal HR scripts. Just colleagues asking colleagues the questions that actually matter.
            </p>
          </div>
          <div className="bg-stone-900 p-10 rounded-[2.5rem] space-y-6 text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg">
              <Mic2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-serif font-bold italic">Surprise Questions</h3>
            <p className="text-white/60 font-light leading-relaxed">
              Unscripted, unrehearsed, and entirely authentic. Every episode features a wildcard question.
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="space-y-10">
        <div className="flex justify-between items-end border-b border-stone-200 pb-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-serif font-bold italic tracking-tight">Recent Episodes</h2>
            <p className="text-stone-400 text-lg font-light">The stories that make us who we are.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-stone-300 animate-spin" />
            <p className="text-stone-400 font-serif italic">Loading episodes...</p>
          </div>
        ) : episodes?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {episodes.map((episode) => (
              <motion.div
                key={episode.id}
                whileHover={{ y: -10 }}
                onClick={() => setActiveVideo(episode)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-stone-100 mb-6 shadow-xl">
                  <img 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 fill-current ml-1 text-stone-900" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                    {episode.duration}
                  </div>
                </div>
                
                <div className="space-y-4 px-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{episode.category}</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors italic">
                    {episode.title}
                  </h3>
                  <p className="text-stone-500 font-light leading-relaxed line-clamp-2">
                    {episode.description}
                  </p>
                  
                  <div className="flex items-center space-x-8 pt-4 border-t border-stone-100">
                    <div className="flex items-center space-x-2 text-stone-400">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-bold">{episode.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-stone-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">{episode.commentsCount || 0}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Share logic */ }}
                      className="flex items-center space-x-2 text-stone-400 hover:text-stone-900 ml-auto transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
