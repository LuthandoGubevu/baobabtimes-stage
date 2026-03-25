import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-stone-900 text-white hover:bg-stone-800",
      secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
      outline: "bg-transparent border border-stone-200 text-stone-900 hover:bg-stone-50",
      ghost: "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
