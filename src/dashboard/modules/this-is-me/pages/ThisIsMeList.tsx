import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { thisIsMeService } from '@/features/this-is-me/services/thisIsMeService';
import { format } from 'date-fns';

export const ThisIsMeList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const data = await thisIsMeService.getAllVideos();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await thisIsMeService.deleteVideo(id);
        setVideos(videos.filter(v => v.id !== id));
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">This Is Me</h1>
          <p className="text-zinc-500 text-sm">Manage the office podcast and video series.</p>
        </div>
        <Link
          to="/dashboard/this-is-me/new"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>Upload Video</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
          />
        </div>
        <button className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-zinc-200 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-all">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200/80">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Video</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Engagement</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-12 bg-zinc-100 rounded-lg"></div>
                    </td>
                  </tr>
                ))
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <Play className="text-zinc-300" size={32} />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 mb-1">No videos found</h3>
                      <p className="text-xs text-zinc-500">
                        Upload your first 'This is me' video to get started with the series.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr key={video.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play size={12} className="text-white fill-current" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">{video.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{video.category || 'General'}</span>
                            <span className="text-[10px] text-zinc-300">•</span>
                            <span className="text-[10px] text-zinc-500">{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        video.status === 'PUBLISHED' 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-zinc-50 text-zinc-500 border border-zinc-100'
                      }`}>
                        {video.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-zinc-500">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp size={14} />
                          <span className="text-xs font-bold">{video.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={14} />
                          <span className="text-xs font-bold">{video.commentsCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-500 font-medium">
                        {video.createdAt ? format(video.createdAt.toDate(), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/dashboard/this-is-me/${video.id}/edit`}
                          className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a 
                          href={video.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
