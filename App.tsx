import { useState, useEffect } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { BalanceCard } from './components/BalanceCard';
import { TransactionItem } from './components/TransactionItem';
import { AddTransactionModal } from './components/AddTransactionModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { SpendingChart } from './components/SpendingChart';
import { InstallPrompt } from './components/InstallPrompt';
import { MonthSelector } from './components/MonthSelector';
import { ExportImport } from './components/ExportImport';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { mockTransactions } from './data/transactions';
import { Transaction } from './types/finance';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('finance-transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withDates = parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(withDates);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        setTransactions(mockTransactions);
      }
    } else {
      setTransactions(mockTransactions);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('finance-transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions([transaction, ...transactions]);
    toast.success('Transaction added successfully!');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    toast.success('Transaction updated successfully!');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction deleted successfully!');
  };

  const handleImport = (importedTransactions: Transaction[]) => {
    // Merge imported transactions with existing ones, avoiding duplicates
    const existingIds = new Set(transactions.map(t => t.id));
    const newTransactions = importedTransactions.filter(t => !existingIds.has(t.id));
    setTransactions([...transactions, ...newTransactions]);
  };

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === selectedMonth.getMonth() &&
           transactionDate.getFullYear() === selectedMonth.getFullYear();
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <h1>Finance Tracker</h1>
              <p className="text-muted-foreground">Manage your expenses</p>
            </div>
          </div>
          <ExportImport transactions={transactions} onImport={handleImport} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Month Selector */}
        <MonthSelector selectedDate={selectedMonth} onDateChange={setSelectedMonth} />

        {/* Balance Card */}
        <BalanceCard 
          balance={balance} 
          income={totalIncome} 
          expenses={totalExpenses} 
        />

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {sortedTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No transactions this month
                  </p>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            {/* Spending Chart */}
            <SpendingChart transactions={filteredTransactions} />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Transactions</span>
                  <span>{filteredTransactions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Expense</span>
                  <span>
                    ${filteredTransactions.filter(t => t.type === 'expense').length > 0 
                      ? (totalExpenses / filteredTransactions.filter(t => t.type === 'expense').length).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Largest Expense</span>
                  <span>
                    ${Math.max(...filteredTransactions.filter(t => t.type === 'expense').map(t => t.amount), 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Transaction Button */}
      <AddTransactionModal onAddTransaction={handleAddTransaction} />
      
      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveEdit}
      />
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}