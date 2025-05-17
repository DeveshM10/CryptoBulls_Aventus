/**
 * Offline-capable Voice Input Modal
 * 
 * This component provides voice input functionality that works
 * both online and offline for adding financial data.
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Loader2, WifiOff, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OfflineAwareVoiceProcessor } from "./offline-aware-voice-processor";
import { useFinanceStore } from "../finance-ai/finance-store";
import { useOfflineFeatures } from "../../lib/offline-integrations";
import { apiRequest } from "@/lib/queryClient";
import { executeWithOfflineFallback } from "../../lib/offline-integrations";
import { processVoiceInputOffline } from "../../lib/offline-voice-processor";
import { Asset, Liability } from "../../types/finance";
import { v4 as uuidv4 } from "uuid";

interface OfflineVoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processingType: "asset" | "liability";
  onSuccess?: () => void;
  title?: string;
}

export function OfflineVoiceModal({
  open,
  onOpenChange,
  processingType,
  onSuccess,
  title = "Voice Input"
}: OfflineVoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const financeStore = useFinanceStore();
  const { isOffline, voiceFeaturesAvailable, checkMicrophoneAccess } = useOfflineFeatures();
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTranscript("");
      setExtractedData(null);
      setError(null);
      setIsListening(false);
      setIsProcessing(false);
    }
  }, [open]);
  
  // Handle start listening
  const handleStartListening = async () => {
    setError(null);
    
    // Check microphone access
    const micAccess = await checkMicrophoneAccess();
    if (!micAccess) {
      return;
    }
    
    setIsListening(true);
    setTranscript("");
  };
  
  // Handle stop listening
  const handleStopListening = () => {
    setIsListening(false);
  };
  
  // Handle transcription updates
  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
  };
  
  // Handle error
  const handleError = () => {
    setIsListening(false);
    setError("Failed to process voice input. Please try again.");
  };
  
  // Handle voice data from processor
  const handleVoiceData = (data: any) => {
    setExtractedData(data);
    setIsListening(false);
    toast({
      title: "Voice Processing Complete",
      description: `Successfully extracted ${processingType} information.`
    });
  };
  
  // Handle submit
  const handleSubmit = async () => {
    if (!extractedData) return;
    
    setIsProcessing(true);
    
    try {
      const endpoint = processingType === 'asset' ? '/api/assets' : '/api/liabilities';
      
      // Create a unique ID for new items
      const itemWithId = {
        ...extractedData,
        id: extractedData.id || `local-${uuidv4()}`
      };
      
      // Execute with offline fallback
      await executeWithOfflineFallback(
        // Online operation
        async () => {
          const response = await apiRequest('POST', endpoint, extractedData);
          if (!response.ok) {
            throw new Error(`Failed to add ${processingType}`);
          }
          return await response.json();
        },
        // Offline operation
        () => {
          // Store in local finance store
          if (processingType === 'asset') {
            financeStore.addAsset(itemWithId as Asset);
          } else {
            financeStore.addLiability(itemWithId as Liability);
          }
          return itemWithId;
        }
      );
      
      toast({
        title: `${processingType.charAt(0).toUpperCase() + processingType.slice(1)} Added`,
        description: `Successfully added new ${processingType} using voice input.`
      });
      
      // Close modal
      onOpenChange(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(`Error adding ${processingType}:`, err);
      setError(`Failed to add ${processingType}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {isOffline && (
            <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Offline Mode</AlertTitle>
              <AlertDescription>
                You're working offline. Voice input will still work, and data will be saved locally.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center gap-4 py-4">
            {!isListening && !extractedData && (
              <Button onClick={handleStartListening} className="h-16 w-16 rounded-full">
                <Mic className="h-6 w-6" />
              </Button>
            )}
            
            {isListening && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>
                  <Button onClick={handleStopListening} size="lg" className="h-16 w-16 rounded-full">
                    <Mic className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">Listening... Click to stop</p>
                {transcript && (
                  <div className="mt-4 p-3 bg-muted rounded-md w-full max-h-24 overflow-y-auto">
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}
              </div>
            )}
            
            {extractedData && (
              <div className="w-full">
                <div className="rounded-md border p-4 mb-4">
                  <h3 className="text-sm font-medium mb-2">Extracted Information</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(extractedData).map(([key, value]) => (
                      key !== 'id' && (
                        <div key={key} className="flex flex-col">
                          <dt className="text-muted-foreground capitalize">{key}</dt>
                          <dd>{String(value)}</dd>
                        </div>
                      )
                    ))}
                  </dl>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setExtractedData(null);
                      setTranscript("");
                    }}
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save {processingType}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Voice processor component */}
        {isListening && (
          <OfflineAwareVoiceProcessor
            isListening={isListening}
            onVoiceData={handleVoiceData}
            onTranscriptChange={handleTranscriptChange}
            onError={handleError}
            onStopListening={handleStopListening}
            processingType={processingType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}