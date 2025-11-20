import { ReactNode } from 'react';

interface HeroSectionProps {
  children: ReactNode;
  variant?: 'default' | 'gradient';
}

export default function HeroSection({ children, variant = 'default' }: HeroSectionProps) {
  const bgClass = variant === 'gradient'
    ? 'bg-gradient-to-br from-primary to-primary/80'
    : 'bg-gray-50';

  return (
    <section className={`${bgClass} py-20 sm:py-24 lg:py-32`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
