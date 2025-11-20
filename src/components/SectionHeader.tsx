interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false, light = false }: SectionHeaderProps) {
  const textColor = light ? 'text-white' : 'text-gray-900';
  const subtitleColor = light ? 'text-white/90' : 'text-gray-600';
  const alignment = centered ? 'text-center' : 'text-left';

  return (
    <div className={`mb-12 ${alignment}`}>
      <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${textColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${subtitleColor} max-w-3xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
