
import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SessionManagerProps {
  totalCarbon: number;
  promptCount: number;
  totalTokens: number;
  waterUsage: number;
  energyConsumption: number;
  onReset: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ 
  totalCarbon, 
  promptCount, 
  totalTokens,
  waterUsage,
  energyConsumption,
  onReset 
}) => {
  const downloadCSV = () => {
    // Create CSV content
    const date = new Date().toISOString().split('T')[0];
    const headers = ['Metric', 'Value', 'Unit'];
    const data = [
      ['Date', date, ''],
      ['Total Carbon Emissions', totalCarbon, 'g CO₂'],
      ['Total Prompts', promptCount, 'count'],
      ['Total Tokens', totalTokens, 'tokens'],
      ['Water Usage', waterUsage, 'mL'],
      ['Energy Consumption', energyConsumption, 'kWh'],
      ['Average Carbon per Prompt', totalCarbon / (promptCount || 1), 'g CO₂/prompt'],
      ['Average Tokens per Prompt', totalTokens / (promptCount || 1), 'tokens/prompt']
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-eco-footprint-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={downloadCSV}
        className="text-xs flex items-center"
      >
        <Download className="h-3 w-3 mr-1" />
        Export Data
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Tracking Session</DialogTitle>
            <DialogDescription>
              This will reset all your carbon tracking data for this session. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={onReset}
            >
              Reset All Data
            </Button>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionManager;
