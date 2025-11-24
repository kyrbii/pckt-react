import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, TransactionCategory } from '../types/finance';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const categoryColors: Record<TransactionCategory, string> = {
    salary: '#10b981',
    food: '#f97316',
    transport: '#3b82f6',
    shopping: '#a855f7',
    entertainment: '#ec4899',
    bills: '#eab308',
    health: '#ef4444',
    other: '#6b7280',
  };

  const categoryLabels: Record<TransactionCategory, string> = {
    salary: 'Salary',
    food: 'Food',
    transport: 'Transport',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills',
    health: 'Health',
    other: 'Other',
  };

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<TransactionCategory, number>);

  const chartData = Object.entries(categoryTotals).map(([category, value]) => ({
    name: categoryLabels[category as TransactionCategory],
    value,
    color: categoryColors[category as TransactionCategory],
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
