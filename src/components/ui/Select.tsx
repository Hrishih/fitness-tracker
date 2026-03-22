import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
  onChangeValue?: (value: string | number) => void;
}

const Select: React.FC<SelectProps> = ({ label, options, className, onChange, onChangeValue, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) onChange(e);
    if (onChangeValue) onChangeValue(e.target.value);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-400 uppercase ml-1">{label}</label>}
      <select
        className={cn(
          "w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all appearance-none",
          className
        )}
        onChange={handleChange}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
