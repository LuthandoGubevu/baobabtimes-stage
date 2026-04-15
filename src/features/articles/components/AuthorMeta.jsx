import { cn } from "../../../utils/cn";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";

/**
 * Reusable AuthorMeta component for displaying author information
 * @param {Object} props
 * @param {Object} props.author - The author object { id, name, avatar, role }
 * @param {string} props.date - Optional formatted date string
 * @param {boolean} props.showAvatar - Whether to show the author's avatar
 * @param {string} props.size - Size of the component ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 */
export default function AuthorMeta({ 
  author, 
  date, 
  showAvatar = true, 
  size = "sm", 
  className 
}) {
  if (!author) return null;

  const { id, name, avatar, role } = author;

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base md:text-lg"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {showAvatar && (
        <AvatarPlaceholder name={name} size={size} />
      )}
      <div className="flex flex-col">
        <span className={cn(
          "font-bold text-stone-900 leading-tight",
          textSizeClasses[size]
        )}>
          {name || "Anonymous"}
        </span>
        {(date || role) && (
          <div className="flex items-center space-x-2 text-[10px] md:text-xs text-stone-400 font-medium uppercase tracking-widest mt-0.5">
            {role && <span>{role}</span>}
            {role && date && <span className="w-1 h-1 rounded-full bg-stone-300" />}
            {date && <span>{date}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
