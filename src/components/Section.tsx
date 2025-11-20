import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  variant?: 'white' | 'gray' | 'gradient';
  className?: string;
}

export default function Section({ children, variant = 'white', className = '' }: SectionProps) {
  const variantClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-primary to-primary/80',
  };

  return (
    <section className={`py-16 ${variantClasses[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
