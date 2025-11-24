import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card } from './ui/card';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
      <div className="p-6">
        <p className="text-blue-100 mb-2">Total Balance</p>
        <h2 className="mb-6">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <ArrowDownLeft className="size-5 text-green-300" />
            </div>
            <div>
              <p className="text-blue-100">Income</p>
              <p className="text-green-300">${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <ArrowUpRight className="size-5 text-red-300" />
            </div>
            <div>
              <p className="text-blue-100">Expenses</p>
              <p className="text-red-300">${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
