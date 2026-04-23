import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Youtube, 
  Clock, 
  Tag, 
  Type, 
  AlignLeft,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { thisIsMeService } from '@/features/this-is-me/services/thisIsMeService';

interface ThisIsMeVideo {
  id?: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail?: string;
  videoId?: string;
  duration: string;
  category: string;
  tags: string[];
  status: string;
  createdAt?: any;
}

export const ThisIsMeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'Culture',
    duration: '',
    tags: '',
    status: 'DRAFT'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [youtubePreview, setYoutubePreview] = useState<any>(null);

  useEffect(() => {
    if (isEditing && id) {
      fetchVideo(id);
    }
  }, [id]);

  const fetchVideo = async (videoId: string) => {
    try {
      setIsLoading(true);
      const data = await thisIsMeService.getVideoById(videoId) as ThisIsMeVideo;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          youtubeUrl: data.youtubeUrl || '',
          category: data.category || 'Culture',
          duration: data.duration || '',
          tags: data.tags?.join(', ') || '',
          status: data.status || 'DRAFT'
        });
        updateYoutubePreview(data.youtubeUrl);
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateYoutubePreview = (url: string) => {
    if (!url) {
      setYoutubePreview(null);
      return;
    }
    const meta = thisIsMeService.getYoutubeMetadata(url);
    setYoutubePreview(meta);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'youtubeUrl') {
      updateYoutubePreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubePreview) {
      alert('Please provide a valid YouTube URL');
      return;
    }

    try {
      setIsSaving(true);
      const videoData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        thumbnail: youtubePreview.thumbnail,
        videoId: youtubePreview.videoId
      };

      if (isEditing && id) {
        await thisIsMeService.updateVideo(id, videoData);
      } else {
        await thisIsMeService.createVideo(videoData);
      }
      
      navigate('/dashboard/this-is-me');
    } catch (error) {
      console.error('Failed to save video:', error);
      alert('Failed to save video. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center">Loading editor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard/this-is-me"
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? 'Edit Video' : 'New Video'}
            </h1>
            <p className="text-zinc-500 text-sm">Fill in the details for the series episode.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }))}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center space-x-2 ${
              formData.status === 'PUBLISHED'
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500'
            }`}
          >
            {formData.status === 'PUBLISHED' ? <CheckCircle2 size={16} /> : <Eye size={16} />}
            <span>{formData.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-sm"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                <Type size={14} className="mr-2" /> Video Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="The Visionary & The Builder"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                <Youtube size={14} className="mr-2" /> YouTube URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                  required
                />
                {youtubePreview && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                )}
              </div>
              
              {youtubePreview ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 relative group">
                  <iframe
                    src={youtubePreview.embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="YouTube Preview"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center p-8 bg-zinc-50">
                  <Youtube size={48} className="text-zinc-200 mb-4" />
                  <p className="text-sm font-medium text-zinc-400">Enter a YouTube URL to see preview</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                <AlignLeft size={14} className="mr-2" /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Tell the story behind this episode..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold">Video Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                  <Tag size={12} className="mr-2" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:bg-white focus:outline-none transition-all"
                >
                  <option value="Culture">Culture</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Product">Product</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                  <Clock size={12} className="mr-2" /> Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 15:30"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Culture, Design, Team"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center space-x-3 text-white/60">
              <AlertCircle size={20} />
              <h3 className="text-sm font-bold">Quick Tip</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Make sure your video title is engaging. This will appear as the main heading in the 'This is me' gallery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
