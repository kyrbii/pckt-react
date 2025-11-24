import { 
  DollarSign, 
  ShoppingBag, 
  Car, 
  Utensils, 
  Film, 
  Receipt, 
  Heart,
  MoreHorizontal 
} from 'lucide-react';
import { TransactionCategory } from '../types/finance';

interface CategoryIconProps {
  category: TransactionCategory;
  className?: string;
}

export function CategoryIcon({ category, className = "size-5" }: CategoryIconProps) {
  const icons = {
    salary: DollarSign,
    food: Utensils,
    transport: Car,
    shopping: ShoppingBag,
    entertainment: Film,
    bills: Receipt,
    health: Heart,
    other: MoreHorizontal,
  };

  const Icon = icons[category];
  return <Icon className={className} />;
}
