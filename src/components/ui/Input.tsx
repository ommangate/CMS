import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, fullWidth = false, className = '', ...props }, ref) => {
    const id = props.id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
            ring-offset-white file:border-0 file:bg-transparent file:text-sm
            file:font-medium placeholder:text-gray-500 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed
            disabled:opacity-50 ${error ? 'border-error-500 focus:ring-error-500' : ''}
            ${fullWidth ? 'w-full' : ''} ${className}
          `}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;