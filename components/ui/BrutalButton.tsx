import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  withIcon?: boolean;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  withIcon = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-mono font-bold uppercase transition-all duration-75 ease-linear active:translate-y-1 active:translate-x-1 active:shadow-none border-2 border-brutal-black";
  
  const variants = {
    primary: "bg-brutal-black text-white hover:bg-brutal-yellow hover:text-brutal-black shadow-hard",
    outline: "bg-transparent text-brutal-black hover:bg-brutal-black hover:text-white shadow-hard",
    ghost: "bg-transparent border-transparent hover:bg-brutal-black/5 shadow-none hover:shadow-none border-0",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const spacing = withIcon ? "pl-6 pr-4 py-3 gap-2" : "px-8 py-3";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${spacing} ${className}`}
      {...props}
    >
      {children}
      {withIcon && <ArrowRight className="w-5 h-5" />}
    </button>
  );
};