export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'salary'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
  note?: string;
}
