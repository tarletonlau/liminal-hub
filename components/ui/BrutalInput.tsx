import React from 'react';

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const BrutalInput: React.FC<BrutalInputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
        {label}
      </label>
      <input 
        className={`
          w-full bg-white border-2 border-brutal-black p-3 font-mono text-sm
          focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]
          transition-all duration-100 placeholder:text-gray-300
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-brutal-red text-xs font-bold">{error}</span>}
    </div>
  );
};

interface BrutalTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const BrutalTextArea: React.FC<BrutalTextAreaProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
        {label}
      </label>
      <textarea 
        className={`
          w-full bg-white border-2 border-brutal-black p-3 font-mono text-sm
          focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]
          transition-all duration-100 min-h-[100px] resize-none
          ${className}
        `}
        {...props}
      />
    </div>
  );
};