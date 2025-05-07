import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border-transparent',
    secondary: 'bg-secondary-100 text-secondary-800 border-transparent',
    outline: 'bg-transparent border-gray-300 text-gray-700',
    success: 'bg-success-100 text-success-800 border-transparent',
    warning: 'bg-warning-100 text-warning-800 border-transparent',
    error: 'bg-error-100 text-error-800 border-transparent'
  };
  
  return (
    <span 
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
        ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;