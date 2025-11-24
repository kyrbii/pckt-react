import { Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';
import { Button } from './ui/button';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const categoryColors = {
    salary: 'bg-green-100 text-green-600',
    food: 'bg-orange-100 text-orange-600',
    transport: 'bg-blue-100 text-blue-600',
    shopping: 'bg-purple-100 text-purple-600',
    entertainment: 'bg-pink-100 text-pink-600',
    bills: 'bg-yellow-100 text-yellow-600',
    health: 'bg-red-100 text-red-600',
    other: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="flex items-center gap-3 py-3 group">
      <div className={`p-3 rounded-xl ${categoryColors[transaction.category]}`}>
        <CategoryIcon category={transaction.category} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-foreground truncate">{transaction.title}</p>
        <p className="text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      
      <div className="text-right flex items-center gap-2">
        <p className={isIncome ? 'text-green-600' : 'text-foreground'}>
          {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}