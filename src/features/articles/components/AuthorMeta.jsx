import { cn } from "../../../utils/cn";

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

  const avatarSizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16 md:w-24 md:h-24"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base md:text-lg"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {showAvatar && (
        <div className={cn(
          "rounded-full bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0",
          avatarSizeClasses[size]
        )}>
          <img 
            src={avatar || `https://i.pravatar.cc/150?u=${id || name}`} 
            alt={name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
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
