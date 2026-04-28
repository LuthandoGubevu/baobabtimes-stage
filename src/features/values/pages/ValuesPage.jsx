import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play,
  X,
  Heart,
  MessageCircle,
  Send,
  User
} from 'lucide-react';

const VALUES = [
  { id: 'smart', label: 'Smart', icon: '/Baobab-Values-01-scaled.png' },
  { id: 'communication', label: 'Communication', icon: '/Baobab-Values-02-scaled.png' },
  { id: 'impact', label: 'Impact', icon: '/Baobab-Values-03-scaled.png' },
  { id: 'transforming', label: 'Transforming', icon: '/Baobab-Values-04-scaled.png' },
  { id: 'innovation', label: 'Innovation', icon: '/Baobab-Values-05-scaled.png' },
  { id: 'courage', label: 'Courage', icon: '/Baobab-Values-06-scaled.png' },
  { id: 'passion', label: 'Passion', icon: '/Baobab-Values-07-scaled.png' },
  { id: 'authentic', label: 'Authentic', icon: '/Baobab-Values-08-scaled.png' },
  { id: 'selflessness', label: 'Selflessness', icon: '/Baobab-Values-09-scaled.png' },
  { id: 'heart', label: 'Heart', icon: '/Baobab-Values-10-scaled.png' },
];

const INITIAL_VIDEOS = [
  { 
    id: 'MsVRb1yCAAQ', 
    title: 'Smart', 
    description: 'Wise decision making. Effective prioritising. Clear thought articulation.',
    value: 'Smart', 
    isNew: true,
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'A6zKceRq4cc', 
    title: 'Selflessness', 
    description: 'Making time for others. Egoless. Sharing ideas openly and proactively.',
    value: 'Selflessness',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'Gw0BRPRPlXE', 
    title: 'Authentic', 
    description: 'Open and direct. Non-political. Quick to admit mistakes.',
    value: 'Authentic',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'GOJlAvwMz4Q', 
    title: 'Passion', 
    description: 'Inspiring others with a thirst for excellence. Tenacious and supportive.',
    value: 'Passion',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'MbEnVfNlUr4', 
    title: 'Innovation', 
    description: 'Generating useful ideas that minimise complexity. Finding practical solutions.',
    value: 'Innovation',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'F0et-Ep-lAs', 
    title: 'Transforming', 
    description: 'Learning eagerly and rapidly. Contributing effectively outside of speciality.',
    value: 'Transforming',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'zigmyF10tDo', 
    title: 'Impact', 
    description: 'Reliable strong performance. Highly productive. Results focused.',
    value: 'Impact',
    likes: 0,
    likedByUser: false,
    comments: []
  },
  { 
    id: 'FwZDKeHtj2U', 
    title: 'Communication', 
    description: 'Listening to understand. Respectful with a calm composure.',
    value: 'Communication',
    likes: 0,
    likedByUser: false,
    comments: []
  },
];

const VideoModal = ({ isOpen, onClose, videoId }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Video Player"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoCard = ({ video, onPlay, onLike, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(video.id, newComment);
    setNewComment('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] overflow-hidden border border-stone-200 shadow-sm flex flex-col h-full"
    >
      {/* Thumbnail Area */}
      <div 
        className="aspect-video relative overflow-hidden cursor-pointer group"
        onClick={() => onPlay(video.id)}
      >
        <img 
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/30 transition-colors duration-500 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-lg">
            <Play className="w-8 h-8 text-brand-900 fill-brand-900 ml-1" strokeWidth={2} />
          </div>
        </div>
        {video.isNew && (
          <div className="absolute top-6 left-6 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg z-10">
            New Video
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#6ecbda] leading-tight">
              {video.title}
            </h3>
            <p className="text-stone-500 text-sm font-medium mt-1 leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center space-x-6 pt-4 border-t border-stone-100 mt-auto">
          <button 
            onClick={() => onLike(video.id)}
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${video.likedByUser ? 'text-red-500 fill-red-500' : 'text-stone-400 group-hover:text-red-400'}`} 
              />
            </motion.div>
            <span className={`text-sm font-bold ${video.likedByUser ? 'text-stone-900' : 'text-stone-500'}`}>
              {video.likes}
            </span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <MessageCircle className={`w-5 h-5 transition-colors ${showComments ? 'text-brand-500 fill-brand-50/50' : 'text-stone-400 group-hover:text-brand-400'}`} />
            <span className={`text-sm font-bold ${showComments ? 'text-stone-900' : 'text-stone-500'}`}>
              {video.comments.length} <span className="hidden sm:inline">Comments</span>
            </span>
          </button>
        </div>

        {/* Expandable Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 space-y-6">
                {/* Comment List */}
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {video.comments.length > 0 ? (
                    video.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-stone-900">{comment.author}</h4>
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">{comment.createdAt}</span>
                          </div>
                          <p className="text-sm text-stone-600 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <p className="text-stone-400 text-sm">No comments yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="relative">
                  <div className="relative group">
                    <input 
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full pl-6 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className={`absolute right-2 top-2 p-2 rounded-xl transition-all ${newComment.trim() ? 'text-brand-500 hover:bg-brand-50' : 'text-stone-300'}`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function ValuesPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoData, setVideoData] = useState(INITIAL_VIDEOS);

  const handleLike = (videoId) => {
    setVideoData(prev => prev.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          likes: video.likedByUser ? video.likes - 1 : video.likes + 1,
          likedByUser: !video.likedByUser
        };
      }
      return video;
    }));
  };

  const handleAddComment = (videoId, text) => {
    setVideoData(prev => prev.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          comments: [
            ...video.comments,
            {
              id: Date.now(),
              author: 'You',
              avatar: null, // Would use actual user avatar in production
              text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return video;
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#6ecbda] tracking-tight leading-none mb-4">
              OUR VALUES
            </h1>
            <div className="h-1 w-24 bg-brand-500 mx-auto rounded-full mb-8" />
            <h2 className="text-xl md:text-2xl font-sans font-medium text-brand-700 tracking-widest uppercase">
              Video Series
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Icon Row */}
      <section className="bg-white border-y border-stone-200 py-12 mb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {VALUES.map((value, idx) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center group min-w-[64px]"
              >
                <div className="w-16 h-16 rounded-full border-2 border-brand-100 flex items-center justify-center text-brand-500">
                  <img 
                    src={value.icon} 
                    alt={value.label} 
                    className="w-10 h-10 object-contain" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-8 space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#6ecbda] leading-tight">
              “I’m thrilled to introduce this video series designed to help us all reconnect with and refresh our understanding of Baobab’s core values.”
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed max-w-3xl">
              These videos highlight how our values are woven into our daily work and the behavioral competencies that bring them to life. By embracing and demonstrating these values, we can continue to achieve excellence and make a meaningful impact throughout our organization.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-4 flex justify-center xl:justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-brand-500 p-3 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img 
                    src="/Harvey.jpg" 
                    alt="Harvey De Wit"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border border-stone-200 px-6 py-3 rounded-2xl shadow-xl">
                <p className="text-sm font-bold text-brand-900">Harvey De Wit</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">People Executive</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Grid - Updated to 2-column layout */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videoData.map((video, idx) => (
            <VideoCard 
              key={video.id}
              video={video} 
              onPlay={(id) => setSelectedVideo(id)}
              onLike={handleLike}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoId={selectedVideo} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
