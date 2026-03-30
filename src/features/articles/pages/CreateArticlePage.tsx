import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateArticle } from "../hooks/useArticles";
import { useAuth } from "../../../hooks/useAuth";
import { ArrowLeft, Save, Send, Image as ImageIcon, AlertCircle } from "lucide-react";

import { CATEGORIES } from "../../../constants/categories";

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

/**
 * CreateArticlePage component for contributors to write new posts
 */
export default function CreateArticlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createArticle = useCreateArticle();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      category: CATEGORIES[0].name,
      excerpt: "",
      content: "",
      imageUrl: ""
    }
  });

  const onSubmit = async (data: ArticleFormValues, status: "DRAFT" | "PUBLISHED" = "PUBLISHED") => {
    try {
      await createArticle.mutateAsync({ 
        ...data, 
        status,
        author: {
          id: user?.uid,
          name: user?.displayName || "Anonymous",
          avatar: user?.photoURL || "",
          role: "Contributor" // Default role, could be dynamic based on user profile
        },
        authorId: user?.uid, // Keep for legacy/querying
        authorName: user?.displayName || "Anonymous", // Keep for legacy/querying
        slug: data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
      });
      navigate("/contributor");
    } catch (err) {
      console.error("Failed to create article", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">Back</span>
      </button>

      <form className="flex flex-col md:flex-row gap-12">
        {/* Editor Area */}
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <input 
              {...register("title")}
              type="text"
              placeholder="Article Title"
              className="w-full text-4xl md:text-5xl font-serif font-bold bg-transparent border-none focus:outline-none placeholder-stone-200"
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title.message}
              </p>
            )}
            <div className="h-1 w-24 bg-stone-900"></div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Excerpt / Subtitle</label>
            <textarea 
              {...register("excerpt")}
              rows={2}
              placeholder="A brief summary of the article..."
              className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all text-lg italic text-stone-500"
            />
            {errors.excerpt && <p className="text-red-500 text-xs font-bold">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Content</label>
            <textarea 
              {...register("content")}
              rows={15}
              placeholder="Start writing your story..."
              className="w-full p-6 bg-white border border-stone-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all text-lg leading-relaxed"
            />
            {errors.content && <p className="text-red-500 text-xs font-bold">{errors.content.message}</p>}
          </div>
        </div>

        {/* Sidebar / Settings */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl">Publish Settings</h3>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Category</label>
              <select 
                {...register("category")}
                className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Featured Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  {...register("imageUrl")}
                  type="text"
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none"
                />
              </div>
              {errors.imageUrl && <p className="text-red-500 text-xs font-bold">{errors.imageUrl.message}</p>}
            </div>

            <div className="pt-6 space-y-3">
              <button 
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, "PUBLISHED"))}
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Publish Now</span>
              </button>
              <button 
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, "DRAFT"))}
                disabled={isSubmitting}
                className="w-full py-4 bg-white border border-stone-200 text-stone-900 font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          <div className="bg-stone-100 p-6 rounded-3xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Pro Tip</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Great articles have a clear hook in the first paragraph. Don't forget to add a high-quality featured image to increase engagement!
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
