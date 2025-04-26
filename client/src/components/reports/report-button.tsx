import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilePdf, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function ReportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to generate reports',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Using window.open to download the report directly
      window.open('/api/generate-report', '_blank');
      
      toast({
        title: 'Report Generation Started',
        description: 'Your financial report is being downloaded.',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Report Generation Failed',
        description: 'There was an error generating your financial report.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateReport}
      variant="outline"
      className="flex items-center gap-2"
      disabled={isGenerating || !user}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FilePdf className="h-4 w-4" />
          Generate Report
        </>
      )}
    </Button>
  );
}