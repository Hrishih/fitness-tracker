import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onChangeValue?: (value: string | number) => void;
}

const Input: React.FC<InputProps> = ({ label, error, className, onChange, onChangeValue, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onChangeValue) onChangeValue(e.target.value);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-400 uppercase ml-1">{label}</label>}
      <input
        className={cn(
          "w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
