import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded border border-gray-700 px-3 py-2 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
