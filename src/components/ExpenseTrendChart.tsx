import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';

interface ExpenseTrendChartProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export default function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  // Group by date and sum amounts
  const dailyTotals = data.reduce((acc, expense) => {
    const existing = acc.find(item => item.date === expense.date);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({ date: expense.date, amount: expense.amount });
    }
    return acc;
  }, [] as Array<{ date: string; amount: number }>);

  // Sort by date
  const sortedData = dailyTotals.sort((a, b) => a.date.localeCompare(b.date));

  // Format dates for display
  const chartData = sortedData.map(item => ({
    date: new Date(item.date).toLocaleDateString('lv-LV', { month: 'short', day: 'numeric' }),
    amount: item.amount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
          <p className="text-sm text-gray-700 font-semibold">{payload[0].payload.date}</p>
          <p className="text-sm text-primary-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-secondary-900">Spending Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value: number) => `€${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Daily Spending"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
