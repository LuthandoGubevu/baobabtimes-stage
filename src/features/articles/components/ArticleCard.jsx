import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../../../utils/cn";
import AuthorMeta from "./AuthorMeta";
import { ImagePlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * ArticleCard component for displaying article summaries
 * @param {Object} props
 * @param {Object} props.article
 * @param {string} props.className
 */
export default function ArticleCard({ article, className }) {
  const { id, title, slug, category, author, authorName, authorId, createdAt, imageUrl, excerpt } = article;

  const formatDate = (date) => {
    if (!date) return "Draft";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  const articleSlug = slug || id;

  // Use the new author object or fallback to existing authorName/authorId
  const authorData = author || { id: authorId, name: authorName };

  return (
    <Link 
      to={`/posts/${articleSlug}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-400 transition-all duration-300",
        className
      )}
    >
      <div className="aspect-[16/9] overflow-hidden bg-stone-100">
        <ImagePlaceholder className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 py-0.5 bg-stone-50 rounded border border-stone-100">
            {category === "From the Desk" ? "👉 From the Desk" : category}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-stone-600 transition-colors leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="text-stone-500 text-sm line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <div className="pt-4 border-t border-stone-50">
          <AuthorMeta author={authorData} size="sm" />
        </div>
      </div>
    </Link>
  );
}
