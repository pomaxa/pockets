interface CategoryCardProps {
  icon: string;
  title: string;
  description?: string;
  examples?: string[];
  percentage?: string;
  amount?: number;
}

export default function CategoryCard({ icon, title, description, examples, percentage, amount }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start gap-4 mb-3">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <img src={icon} alt="" aria-hidden="true" className="w-6 h-6" width="24" height="24" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-gray-900">{title}</h4>
            {percentage && (
              <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded flex-shrink-0">
                {percentage}
              </span>
            )}
          </div>
          {amount !== undefined && amount > 0 && (
            <p className="text-lg font-bold text-primary mb-1">
              €{amount.toFixed(2)}
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {examples && examples.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Examples:</p>
          <ul className="space-y-1">
            {examples.map((example, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-primary mr-2 mt-0.5">•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
