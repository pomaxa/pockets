import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | ReactNode;
  sublabel?: string;
  variant?: 'default' | 'primary' | 'accent' | 'blue' | 'orange' | 'green' | 'yellow';
}

export default function StatCard({ label, value, sublabel, variant = 'default' }: StatCardProps) {
  const valueColors = {
    default: 'text-gray-900',
    primary: 'text-primary',
    accent: 'text-accent',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
    yellow: 'text-yellow-700',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueColors[variant]}`}>{value}</p>
      {sublabel && <p className="text-sm text-gray-500 mt-2">{sublabel}</p>}
    </div>
  );
}
