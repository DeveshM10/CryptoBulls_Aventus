/**
 * Edge Voice Input Component
 * 
 * A completely offline-capable voice input component that
 * processes speech locally and updates the UI in real-time.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { processVoiceInput } from '../../lib/edge-ai/voice-processor';
import { 
  addAsset, 
  addLiability, 
  addExpense, 
  addIncome, 
  subscribe 
} from '../../lib/edge-ai/data-store';
import { EVENTS } from '../../lib/edge-ai/constants';
import { Mic, MicOff, Loader2, Check, AlertCircle, Type, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEdgeAI } from './EdgeAIProvider';
import { Textarea } from '@/components/ui/textarea';

interface EdgeVoiceInputProps {
  type: 'asset' | 'liability' | 'expense' | 'income' | 'transaction';
  onSuccess?: () => void;
}

export function EdgeVoiceInput({ type, onSuccess }: EdgeVoiceInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const edgeAI = useEdgeAI();
  
  // Check network status on mount and when it changes
  useEffect(() => {
    const updateNetworkStatus = () => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      setIsOffline(offline);
      
      // If we're offline, automatically switch to manual input mode
      if (offline) {
        setManualInputMode(true);
      }
    };
    
    // Initial check
    updateNetworkStatus();
    
    // Listen for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);
  
  // Set up speech recognition when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isOffline) {
      // @ts-ignore - Browser API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          if (event.error === 'not-allowed') {
            setError('Microphone access was denied. Please allow microphone access to use voice input.');
          } else if (event.error === 'network') {
            setError('Speech recognition requires network connectivity. Please use the text input mode while offline.');
            setManualInputMode(true);
          } else {
            setError(`Speech recognition error: ${event.error}`);
          }
          
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isOffline]);
  
  // Start listening for voice input
  const startListening = () => {
    setError(null);
    setTranscript('');
    setIsListening(true);
    
    if (isOffline) {
      setError('Speech recognition is not available offline. Please use text input instead.');
      setIsListening(false);
      setManualInputMode(true);
      return;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setError('Failed to start speech recognition. Please try again or use text input.');
        setIsListening(false);
      }
    } else {
      setError('Speech recognition is not supported in your browser. Please use text input instead.');
      setIsListening(false);
      setManualInputMode(true);
    }
  };
  
  // Stop listening and process the input
  const stopListening = async () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
    }
    
    if (!transcript) {
      setError('No speech detected. Please try again or use text input.');
      return;
    }
    
    processTranscript(transcript);
  };
  
  // Process manual text input
  const processManualInput = async () => {
    if (!transcript) {
      setError('Please enter some text to process.');
      return;
    }
    
    processTranscript(transcript);
  };
  
  // Common function to process transcript whether from voice or text input
  const processTranscript = async (text: string) => {
    setIsProcessing(true);
    
    try {
      const processedResult = await processVoiceInput(text, type);
      setResult(processedResult);
    } catch (error) {
      console.error('Error processing input:', error);
      setError('Failed to process input. Please try again with different wording.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Toggle between voice and manual input modes
  const toggleInputMode = () => {
    setManualInputMode(!manualInputMode);
    setTranscript('');
    setError(null);
  };
  
  // Save the processed data
  const saveData = async () => {
    if (!result) return;
    
    setIsProcessing(true);
    
    try {
      // Save to IndexedDB based on type
      let success = false;
      
      switch (type) {
        case 'asset':
          // Also save to localStorage as backup in case IndexedDB fails
          try {
            // First attempt to save to IndexedDB
            await addAsset(result);
            success = true;
          } catch (err) {
            console.error('IndexedDB save failed, using backup method:', err);
            // Fallback: Save to local memory cache and trigger UI update directly
            if (window.localStorage) {
              // Get existing assets from localStorage if any
              const existingAssetsStr = window.localStorage.getItem('edgeai_assets') || '[]';
              const existingAssets = JSON.parse(existingAssetsStr);
              
              // Add new asset to array
              existingAssets.push(result);
              
              // Save back to localStorage
              window.localStorage.setItem('edgeai_assets', JSON.stringify(existingAssets));
              
              // Get the page's asset list container and add the new asset directly to the DOM
              // This is a direct UI manipulation approach to ensure immediate updates even offline
              setTimeout(() => {
                try {
                  // Trigger direct UI update by dispatching a custom event
                  const event = new CustomEvent('edgeai-asset-added', { 
                    detail: result,
                    bubbles: true, 
                    cancelable: true 
                  });
                  document.dispatchEvent(event);
                  
                  // Force any React components to refresh
                  window.dispatchEvent(new Event('storage'));
                } catch (err) {
                  console.error('Error updating UI directly:', err);
                }
              }, 100);
              
              success = true;
            }
          }
          break;
          
        case 'liability':
          try {
            await addLiability(result);
            success = true;
          } catch (err) {
            console.error('IndexedDB save failed, using backup method:', err);
            if (window.localStorage) {
              const existingItemsStr = window.localStorage.getItem('edgeai_liabilities') || '[]';
              const existingItems = JSON.parse(existingItemsStr);
              existingItems.push(result);
              window.localStorage.setItem('edgeai_liabilities', JSON.stringify(existingItems));
              const event = new CustomEvent('edgeai-liability-added', { detail: result });
              window.dispatchEvent(event);
              success = true;
            }
          }
          break;
          
        case 'expense':
          try {
            await addExpense(result);
            success = true;
          } catch (err) {
            console.error('IndexedDB save failed, using backup method:', err);
            if (window.localStorage) {
              const existingItemsStr = window.localStorage.getItem('edgeai_expenses') || '[]';
              const existingItems = JSON.parse(existingItemsStr);
              existingItems.push(result);
              window.localStorage.setItem('edgeai_expenses', JSON.stringify(existingItems));
              const event = new CustomEvent('edgeai-expense-added', { detail: result });
              window.dispatchEvent(event);
              success = true;
            }
          }
          break;
          
        case 'income':
          try {
            await addIncome(result);
            success = true;
          } catch (err) {
            console.error('IndexedDB save failed, using backup method:', err);
            if (window.localStorage) {
              const existingItemsStr = window.localStorage.getItem('edgeai_income') || '[]';
              const existingItems = JSON.parse(existingItemsStr);
              existingItems.push(result);
              window.localStorage.setItem('edgeai_income', JSON.stringify(existingItems));
              const event = new CustomEvent('edgeai-income-added', { detail: result });
              window.dispatchEvent(event);
              success = true;
            }
          }
          break;
      }
      
      if (success) {
        // Close dialog
        setIsOpen(false);
        
        // Notify success
        toast({
          title: 'Success',
          description: `Your ${type} has been added successfully.`,
        });
        
        // Force refresh the UI by calling the success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Failed to save data using both primary and backup methods');
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      setError(`Failed to save ${type}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Reset the dialog
  const resetDialog = () => {
    setTranscript('');
    setResult(null);
    setError(null);
    setIsListening(false);
    setIsProcessing(false);
  };
  
  // Get example phrases based on type
  const getExamples = () => {
    switch (type) {
      case 'asset':
        return [
          "I own a car worth $10,000",
          "I have stocks valued at $5,000",
          "I have $2,000 in my savings account"
        ];
      case 'liability':
        return [
          "I have a car loan of $15,000 at 4% interest",
          "I owe $5,000 on my credit card",
          "My mortgage is $200,000 with monthly payment of $1,200"
        ];
      case 'expense':
        return [
          "My grocery budget is $500 and I've spent $300",
          "Entertainment budget is $200 and I've spent $150",
          "I budgeted $100 for dining out and spent $75"
        ];
      case 'income':
        return [
          "My salary is $5,000 per month",
          "I earned $1,000 from freelance work",
          "Dividend income of $200 from investments"
        ];
      default:
        return [];
    }
  };
  
  // Get the appropriate button based on the current state
  const getInputButton = () => {
    if (manualInputMode) {
      return (
        <Button 
          onClick={processManualInput}
          className="w-full"
          disabled={isProcessing || !transcript}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Process Text
            </>
          )}
        </Button>
      );
    }
    
    if (isListening) {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>
            <Button 
              onClick={stopListening} 
              className="h-16 w-16 rounded-full"
            >
              <MicOff className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Listening... Click to stop</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center gap-4">
        <Button 
          onClick={startListening}
          className="h-16 w-16 rounded-full"
          disabled={isProcessing}
        >
          <Mic className="h-6 w-6" />
        </Button>
        <p className="text-sm text-muted-foreground">Click to start speaking</p>
      </div>
    );
  };
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Mic className="h-4 w-4" />
        Voice Input
      </Button>
      
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetDialog();
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Voice Input for {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
            {isOffline && (
              <DialogDescription className="flex items-center gap-2 mt-2 text-amber-500">
                <WifiOff className="h-4 w-4" />
                You're currently offline. Using the text input mode.
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!isProcessing && !result && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleInputMode}
                  className="text-xs"
                >
                  {manualInputMode ? (
                    <>
                      <Mic className="h-3 w-3 mr-1" />
                      Switch to Voice
                    </>
                  ) : (
                    <>
                      <Type className="h-3 w-3 mr-1" />
                      Switch to Text
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {!result && (
              <div className="flex flex-col items-center gap-4 py-6">
                {manualInputMode ? (
                  <div className="w-full space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Enter your financial information:</h4>
                      <Textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder={`Example: ${getExamples()[0]}`}
                        className="min-h-[100px]"
                      />
                    </div>
                    {getInputButton()}
                  </div>
                ) : (
                  <>
                    {getInputButton()}
                    
                    {transcript && !isProcessing && (
                      <div className="w-full mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm">{transcript}</p>
                      </div>
                    )}
                  </>
                )}
                
                <div className="w-full mt-4">
                  <h4 className="text-sm font-medium mb-2">Examples:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getExamples().map((example, index) => (
                      <li key={index}>{`"${example}"`}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {result && (
              <div className="flex flex-col gap-4">
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Processed Successfully</AlertTitle>
                  <AlertDescription>
                    Your {manualInputMode ? 'text' : 'voice'} input was processed successfully. Here's what we extracted:
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Extracted Information:</h4>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(result).map(([key, value]) => (
                      key !== 'id' && (
                        <div key={key} className="flex flex-col">
                          <dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                          <dd>{String(value)}</dd>
                        </div>
                      )
                    ))}
                  </dl>
                </div>
                
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={resetDialog}
                    disabled={isProcessing}
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={saveData}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save {type.charAt(0).toUpperCase() + type.slice(1)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}