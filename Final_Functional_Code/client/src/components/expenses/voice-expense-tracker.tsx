import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DailyExpense } from "@/types/expenses";

// Interface for the extracted expense data from voice input
interface ExtractedExpense {
  title: string;
  amount: number;
  category: string;
  date: string;
  confidence: number;
}

interface VoiceExpenseTrackerProps {
  onExpenseAdded: (expense: DailyExpense) => void;
}

export default function VoiceExpenseTracker({ onExpenseAdded }: VoiceExpenseTrackerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [extractedExpense, setExtractedExpense] = useState<ExtractedExpense | null>(null);
  const [editedExpense, setEditedExpense] = useState<Partial<DailyExpense>>({});
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      // Using window as any to handle the webkitSpeechRecognition which is not in TypeScript types
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
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
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          // If we're still supposed to be listening, restart recognition
          // This prevents it from automatically stopping after a silence
          recognitionRef.current.start();
        }
      };
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
    }
    
    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        if (isListening) {
          recognitionRef.current.stop();
        }
      }
    };
  }, [isListening, toast]);

  // Start listening for voice input
  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Stop listening for voice input
  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Process the transcript using on-device NLP
  const processExpense = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // This is where we would normally send the transcript to a cloud NLP service
      // But since we're doing on-device processing, we'll implement a simple parser here
      
      // Simple NLP processing to extract expense details from text
      // In a production app, this would use a proper NLP library like Compromise.js or a TensorFlow.js model
      const extractedData = parseExpenseFromText(transcript);
      
      if (extractedData) {
        setExtractedExpense(extractedData);
        setEditedExpense({
          title: extractedData.title,
          amount: extractedData.amount.toString(),
          category: extractedData.category,
          date: extractedData.date,
        });
      } else {
        toast({
          title: "Couldn't extract expense details",
          description: "Please try speaking more clearly or in the format 'Spent [amount] on [item] for [category]'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing expense:', error);
      toast({
        title: "Error processing speech",
        description: "There was an error processing your speech input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple natural language processing function to extract expense details
  // This is a basic implementation that would be replaced with a more sophisticated model in production
  const parseExpenseFromText = (text: string): ExtractedExpense | null => {
    // Remove punctuation and convert to lowercase for easier parsing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Try to find amount mentioned in the text
    // Match patterns like "20 dollars", "$20", "Rs 20", "₹20", "20 rupees", etc.
    const amountRegex = /(?:spent|paid|bought for|costs|price is|for|rs\.?|₹|inr|rupees?|rs|\$)?(?:\s*?)(\d+(?:\.\d+)?)/i;
    const amountMatch = cleanText.match(amountRegex);
    
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    if (isNaN(amount)) return null;
    
    // Try to extract what the expense was for
    let title = "Expense";
    
    // Patterns to extract expense title - look for phrases after "for", "on", etc.
    const forMatch = cleanText.match(/(?:for|on)\s+(?:a|an|the)?\s*([a-z\s]+?)(?:at|in|from|on|for|yesterday|today|tomorrow|january|february|march|april|may|june|july|august|september|october|november|december|food|groceries|shopping|transportation|entertainment|bills|health|education|travel|dining|other|\d|$)/i);
    const onMatch = cleanText.match(/(?:spent|paid|bought)(?:\s+[\d.]+)?\s+(?:on|for)\s+([a-z\s]+?)(?:at|in|from|on|for|yesterday|today|tomorrow|january|february|march|april|may|june|july|august|september|october|november|december|food|groceries|shopping|transportation|entertainment|bills|health|education|travel|dining|other|\d|$)/i);
    
    if (forMatch) {
      title = forMatch[1].trim();
    } else if (onMatch) {
      title = onMatch[1].trim();
    }
    
    // Capitalize the first letter of each word
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Try to categorize the expense
    let category = "Other";
    
    // Category detection
    const categoryMapping: Record<string, string[]> = {
      "Food & Dining": ["food", "restaurant", "dining", "lunch", "dinner", "breakfast", "eat", "meal", "grocery", "groceries", "snack", "cafe", "coffee"],
      "Transportation": ["transport", "travel", "bus", "train", "subway", "taxi", "uber", "ola", "car", "gas", "petrol", "diesel", "fuel", "auto", "rickshaw", "bike", "scooter"],
      "Shopping": ["shopping", "clothes", "clothing", "shirt", "pants", "dress", "shoes", "accessory", "accessories", "electronics", "gadget", "device", "amazon", "flipkart"],
      "Entertainment": ["movie", "cinema", "theater", "concert", "show", "game", "entertainment", "netflix", "subscription", "prime", "party"],
      "Utilities": ["bill", "electricity", "water", "gas", "internet", "phone", "mobile", "broadband", "utility", "utilities", "maintenance", "rent"],
      "Healthcare": ["medical", "medicine", "doctor", "hospital", "health", "healthcare", "dental", "prescription", "therapy", "treatment"],
      "Education": ["education", "school", "college", "university", "course", "class", "tuition", "book", "study", "training", "workshop"],
    };
    
    // Try to find category keywords in the text
    for (const [cat, keywords] of Object.entries(categoryMapping)) {
      if (keywords.some(keyword => cleanText.includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    // Try to extract date - default to today
    const today = new Date();
    let date = today.toISOString().split('T')[0];
    
    // Look for date references
    if (cleanText.includes('yesterday')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      date = yesterday.toISOString().split('T')[0];
    } else if (cleanText.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }
    
    // Calculate confidence score based on how much we extracted
    // This is a simplified measure - a real ML model would have actual confidence scores
    let confidence = 0.5; // Base confidence
    if (title !== "Expense") confidence += 0.2;
    if (category !== "Other") confidence += 0.2;
    if (date !== today.toISOString().split('T')[0]) confidence += 0.1;
    
    return {
      title,
      amount,
      category,
      date,
      confidence
    };
  };

  // Handle changes to the edited expense form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense({
      ...editedExpense,
      [name]: value,
    });
  };

  // Save the expense
  const saveExpense = async () => {
    if (!editedExpense.title || !editedExpense.amount || !editedExpense.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a unique ID for the expense
      const id = `expense_${Date.now()}`;
      
      // Create the expense object
      const expense: DailyExpense = {
        id,
        title: editedExpense.title || "",
        amount: editedExpense.amount || "0",
        category: editedExpense.category || "Other",
        date: editedExpense.date || new Date().toISOString().split('T')[0],
        notes: editedExpense.notes,
      };
      
      // In a real application, we would save this to the database
      // For now, we'll just call the callback function
      const response = await fetch('/api/daily-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save expense');
      }
      
      // Call the callback function
      onExpenseAdded(expense);
      
      // Reset the state and close the dialog
      setExtractedExpense(null);
      setEditedExpense({});
      setTranscript("");
      setIsDialogOpen(false);
      
      toast({
        title: "Expense saved",
        description: `${expense.title} for ${formatCurrency(expense.amount)} has been added.`,
      });
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Error saving expense",
        description: "There was an error saving your expense. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numAmount);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice Expense Tracker</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Voice Expense Tracker</DialogTitle>
            <DialogDescription>
              Speak to add an expense. Try saying something like "Spent 500 rupees on groceries yesterday".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Button 
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="h-16 w-16 rounded-full"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening... Click to stop" : "Click to start speaking"}
              </p>
            </div>
            
            {transcript && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{transcript}</p>
                </CardContent>
                {!extractedExpense && (
                  <CardFooter>
                    <Button 
                      onClick={processExpense}
                      disabled={isProcessing || !transcript}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process Expense"
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            {extractedExpense && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Extracted Expense</span>
                    <Badge variant={extractedExpense.confidence > 0.7 ? "default" : "outline"}>
                      {extractedExpense.confidence > 0.7 ? "High Confidence" : "Low Confidence"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Review and edit the extracted expense details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Description</Label>
                    <Input 
                      id="title"
                      name="title"
                      value={editedExpense.title || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                      id="amount"
                      name="amount"
                      type="number"
                      value={editedExpense.amount || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category"
                      name="category"
                      value={editedExpense.category || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date"
                      name="date"
                      type="date"
                      value={editedExpense.date || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input 
                      id="notes"
                      name="notes"
                      value={editedExpense.notes || ''}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setExtractedExpense(null);
                      setEditedExpense({});
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={saveExpense}>
                    <Check className="mr-2 h-4 w-4" />
                    Save Expense
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}