import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/services/ml/BudgetRecommender";

interface VoiceEntryButtonProps {
  onExpenseParsed: (expense: Partial<Expense>) => void;
}

export default function VoiceEntryButton({ onExpenseParsed }: VoiceEntryButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processingState, setProcessingState] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTranscript(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          });
        }
        stopListening();
        setProcessingState("error");
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          setProcessingState("processing");
          processTranscript();
        }
      };
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        stopListening();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, toast]);

  // Start listening for voice input
  const startListening = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      // Set up audio analyzer for visualizing voice level
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const audioSource = audioContext.createMediaStreamSource(stream);
      audioSource.connect(analyser);
      analyserRef.current = analyser;
      
      // Start animation frame for updating voice level
      updateVoiceLevel();
      
      // Start speech recognition
      setTranscript("");
      setIsListening(true);
      setProcessingState("recording");
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop listening for voice input
  const stopListening = () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Recognition may not be started yet
      }
    }
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Update voice level visualization
  const updateVoiceLevel = () => {
    if (!analyserRef.current || !micStreamRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume level
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const level = Math.min(100, Math.round((average / 128) * 100));
    setVoiceLevel(level);
    
    // Continue updating
    animationFrameRef.current = requestAnimationFrame(updateVoiceLevel);
  };

  // Process the transcript to extract expense data
  const processTranscript = () => {
    if (!transcript) {
      setProcessingState("error");
      toast({
        title: "No speech detected",
        description: "Please try speaking again more clearly.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use local parsing similar to how we did it in voice expense tracker
      const parsedExpense = parseExpenseFromText(transcript);
      
      if (parsedExpense) {
        setProcessingState("success");
        onExpenseParsed(parsedExpense);
      } else {
        setProcessingState("error");
        toast({
          title: "Couldn't understand expense",
          description: "Try a format like 'Spent 500 rupees on groceries yesterday'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing transcript:', error);
      setProcessingState("error");
      toast({
        title: "Processing error",
        description: "Error processing your speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset after a delay
      setTimeout(() => {
        setProcessingState("idle");
        setTranscript("");
      }, 2000);
    }
  };

  // Local parsing function to extract expense details from speech
  const parseExpenseFromText = (text: string): Partial<Expense> | null => {
    if (!text) return null;
    
    // Remove punctuation and convert to lowercase for easier parsing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Try to find amount mentioned in the text
    // Match patterns like "20 rupees", "₹20", "Rs 20", "20 rupees", etc.
    const amountRegex = /(?:spent|paid|bought for|costs|price is|for|rs\.?|₹|inr|rupees?|rs|\$)?(?:\s*?)(\d+(?:\.\d+)?)/i;
    const amountMatch = cleanText.match(amountRegex);
    
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    if (isNaN(amount) || amount <= 0) return null;
    
    // Try to extract category
    const categoryPatterns = [
      { regex: /(?:on|for)\s+(?:food|meal|lunch|dinner|breakfast)/i, category: "Food & Dining" },
      { regex: /(?:on|for)\s+(?:grocer(?:y|ies)|vegetables|fruits|supermarket)/i, category: "Groceries" },
      { regex: /(?:on|for)\s+(?:transport|bus|train|taxi|uber|ola|auto|fuel|petrol|gas)/i, category: "Transportation" },
      { regex: /(?:on|for)\s+(?:movie|concert|entertainment|game|show|sports)/i, category: "Entertainment" },
      { regex: /(?:on|for)\s+(?:shopping|clothes|electronics|gadgets|accessories)/i, category: "Shopping" },
      { regex: /(?:on|for)\s+(?:bill|utility|electricity|water|internet|phone|mobile)/i, category: "Utilities" },
      { regex: /(?:on|for)\s+(?:rent|housing|maintenance|repair)/i, category: "Housing" },
      { regex: /(?:on|for)\s+(?:doctor|medical|medicine|health|hospital|clinic|dental)/i, category: "Healthcare" },
      { regex: /(?:on|for)\s+(?:education|school|college|course|tuition|books)/i, category: "Education" },
      { regex: /(?:on|for)\s+(?:travel|hotel|flight|vacation|tour|trip)/i, category: "Travel" },
    ];
    
    let category = "Other";
    for (const pattern of categoryPatterns) {
      if (pattern.regex.test(cleanText)) {
        category = pattern.category;
        break;
      }
    }
    
    // Try to extract date
    let date = new Date().toISOString().split('T')[0]; // Today as default
    
    if (cleanText.includes('yesterday')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      date = yesterday.toISOString().split('T')[0];
    } else if (cleanText.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    } else if (cleanText.includes('last week')) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      date = lastWeek.toISOString().split('T')[0];
    }
    
    return {
      amount,
      category,
      date,
      isRecurring: cleanText.includes('monthly') || cleanText.includes('recurring') || cleanText.includes('subscription')
    };
  };

  // Determine button appearance based on state
  const getButtonAppearance = () => {
    switch (processingState) {
      case "recording":
        return {
          icon: <MicOff className="h-6 w-6" />,
          text: "Stop",
          variant: "destructive" as const,
          action: stopListening
        };
      case "processing":
        return {
          icon: <Mic className="h-6 w-6 animate-pulse" />,
          text: "Processing...",
          variant: "outline" as const,
          action: () => {}
        };
      case "success":
        return {
          icon: <Check className="h-6 w-6" />,
          text: "Understood!",
          variant: "default" as const,
          action: () => {}
        };
      case "error":
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          text: "Try Again",
          variant: "destructive" as const,
          action: startListening
        };
      default:
        return {
          icon: <Mic className="h-6 w-6" />,
          text: "Speak Now",
          variant: "default" as const,
          action: startListening
        };
    }
  };

  const buttonAppearance = getButtonAppearance();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        variant={buttonAppearance.variant}
        size="lg"
        className="h-16 w-16 rounded-full"
        onClick={buttonAppearance.action}
        disabled={processingState === "processing"}
      >
        {buttonAppearance.icon}
      </Button>
      
      <span className="text-sm font-medium text-center">
        {buttonAppearance.text}
      </span>
      
      {processingState === "recording" && (
        <div className="w-48">
          <Progress value={voiceLevel} className="h-2" />
        </div>
      )}
      
      {transcript && (
        <div className="max-w-xs mt-2 text-sm bg-muted p-2 rounded-md">
          <p className="text-center">{transcript}</p>
        </div>
      )}
    </div>
  );
}