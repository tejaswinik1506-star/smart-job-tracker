import React from 'react';
import { cn } from '../../utils/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden liquid-button magnetic';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 focus:ring-purple-500 shadow-deep hover:shadow-2xl neon-glow-purple animate-gradient',
    secondary: 'glass-strong text-white hover:bg-white/20 focus:ring-white/50 border border-white/20 hover:border-purple-500/50 card-3d',
    danger: 'bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white hover:from-red-700 hover:via-pink-700 hover:to-orange-700 focus:ring-red-500 shadow-deep neon-glow-pink animate-gradient',
    ghost: 'bg-transparent hover:glass text-white border border-transparent hover:border-white/30 backdrop-blur-sm',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Holographic background effect */}
      {variant === 'primary' && (
        <span className="absolute inset-0 holographic opacity-30" />
      )}
      
      <span className="relative z-10 flex items-center justify-center">
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
};
