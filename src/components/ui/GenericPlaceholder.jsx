import React from 'react';
import { User, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

export const AvatarPlaceholder = ({ name = "", src = "", size = "md", className = "" }) => {
  const initials = name
    ? name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '';

  const sizeClasses = {
    xs: "w-5 h-5 text-[8px]",
    sm: "w-6 h-6 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-2xl",
    "2xl": "w-32 h-32 text-3xl"
  };

  const finalSrc = src || "";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-stone-100 text-stone-500 font-bold border border-stone-200 shrink-0 overflow-hidden",
        sizeClasses[size] || size,
        className
      )}
    >
      {finalSrc ? (
        <img src={finalSrc} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        initials || <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
};

export const ImagePlaceholder = ({ icon: Icon = ImageIcon, className = "" }) => {
  return (
    <div
      className={cn(
        "w-full h-full bg-stone-50 flex flex-col items-center justify-center text-stone-200",
        className
      )}
    >
      <Icon className="w-12 h-12 mb-2 opacity-20" />
      <div className="w-1/3 h-1 bg-stone-100 rounded-full opacity-50" />
    </div>
  );
};
