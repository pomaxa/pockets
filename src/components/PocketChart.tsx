import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/formatters';

interface PocketChartProps {
  savings: number;
  lifestyle: number;
  mandatory: number;
}

export default function PocketChart({ savings, lifestyle, mandatory }: PocketChartProps) {
  const data = [
    { name: 'Savings', value: savings, color: '#10b981' },
    { name: 'Lifestyle', value: lifestyle, color: '#3b82f6' },
    { name: 'Housing & Utilities', value: mandatory, color: '#6b7280' },
  ];

  const renderCustomLabel = ({ name, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4 text-secondary-900">Pocket Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-secondary-700">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-secondary-900">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
