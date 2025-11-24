import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface MonthSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthSelector({ selectedDate, onDateChange }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleCurrentMonth = () => {
    onDateChange(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedDate.getMonth() === now.getMonth() && 
           selectedDate.getFullYear() === now.getFullYear();
  };

  return (
    <div className="flex items-center justify-between gap-2 bg-white rounded-lg p-3 border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreviousMonth}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="size-4" />
      </Button>
      
      <button
        onClick={handleCurrentMonth}
        className="flex-1 text-center hover:text-blue-600 transition-colors"
      >
        <p>{formatMonthYear(selectedDate)}</p>
        {!isCurrentMonth() && (
          <p className="text-muted-foreground">Tap for current month</p>
        )}
      </button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNextMonth}
        className="h-8 w-8 p-0"
        disabled={isCurrentMonth()}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
