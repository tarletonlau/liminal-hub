import React from 'react';
import { ChevronDown } from 'lucide-react';

interface BrutalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const BrutalSelect: React.FC<BrutalSelectProps> = ({ label, options, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
        {label}
      </label>
      <div className="relative">
        <select 
          className={`
            w-full bg-white border-2 border-brutal-black p-3 font-mono text-sm appearance-none
            focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(10,10,10,1)]
            transition-all duration-100 cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};