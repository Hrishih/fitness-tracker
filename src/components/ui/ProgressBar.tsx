import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

const ProgressBar = ({ value, max = 2000, className }: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={cn("w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden", className)}>
      <div 
        className="bg-emerald-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
