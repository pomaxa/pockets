import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'blue' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  loading = false,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-[#10b981] text-white hover:bg-[#059669] focus:ring-[#10b981] disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-[#6b7280] text-white hover:bg-[#4b5563] focus:ring-[#6b7280] disabled:bg-gray-300 disabled:text-gray-500',
    accent: 'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444] disabled:bg-gray-300 disabled:text-gray-500',
    blue: 'bg-[#3b82f6] text-white hover:bg-[#2563eb] focus:ring-[#3b82f6] disabled:bg-gray-300 disabled:text-gray-500',
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 disabled:bg-gray-200 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm', // 44px min height for touch targets
    md: 'px-6 py-3', // Better touch target
    lg: 'px-8 py-3.5 text-lg', // Larger for primary CTAs
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const widthClasses = fullWidth ? 'w-full' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
