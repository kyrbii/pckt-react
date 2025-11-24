import { Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Transaction } from '../types/finance';
import { useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

export function ExportImport({ transactions, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate the data structure
        if (!Array.isArray(importedData)) {
          toast.error('Invalid file format. Expected an array of transactions.');
          return;
        }

        // Convert date strings back to Date objects
        const parsedTransactions: Transaction[] = importedData.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));

        onImport(parsedTransactions);
        toast.success(`Imported ${parsedTransactions.length} transactions!`);
      } catch (error) {
        toast.error('Failed to import file. Please check the file format.');
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="flex-1"
      >
        <Download className="size-4 mr-2" />
        Export
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        className="flex-1"
      >
        <Upload className="size-4 mr-2" />
        Import
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
