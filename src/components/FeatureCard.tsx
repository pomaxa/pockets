import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

export default function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-primary/10 rounded-lg">
        <img src={icon} alt="" className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </>
  );

  const baseClasses = "bg-white rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md";

  if (link) {
    return (
      <Link
        to={link}
        className={`${baseClasses} hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
}
