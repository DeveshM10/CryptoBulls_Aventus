"use client"

import { useState, useEffect, useCallback } from "react"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2, Mic, MicOff, Check } from "lucide-react"

// Define interface for the Voice processor component
interface VoiceProcessorProps {
  isListening: boolean
  onVoiceData: (data: any) => void
  onTranscriptChange?: (text: string) => void
  onError: (error: string) => void
  onStopListening: () => void
  processingType: 'asset' | 'liability' | 'budget' | 'expense'
  showControls?: boolean
}

// Define the SpeechRecognition type to avoid TypeScript errors
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onerror: (event: any) => void
  onresult: (event: any) => void
  onend: (event: any) => void
}

export function VoiceProcessor({
  isListening,
  onVoiceData,
  onTranscriptChange,
  onError,
  onStopListening,
  processingType,
  showControls = true
}: VoiceProcessorProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Create and initialize the SpeechRecognition object
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use type assertion for WebSpeechAPI compatibility
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition() as SpeechRecognition
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"
        setRecognition(recognitionInstance)
      } else {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser does not support speech recognition. Please try a different browser.",
          variant: "destructive",
        })
        onError("Speech recognition not supported")
      }
    }

    // Cleanup
    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [])

  // Process voice input locally or using API when needed
  const processVoiceInput = useCallback(async (text: string) => {
    if (!text.trim()) return
    
    try {
      setIsProcessing(true)
      
      // First try to process locally using Edge ML for privacy and offline capability
      const localResult = processLocalVoiceInput(text);
      
      if (localResult) {
        // Successfully processed locally
        console.log("Processed voice input locally:", localResult);
        onVoiceData(localResult);
        setIsProcessing(false);
        return;
      }
      
      // Fall back to API if local processing fails
      console.log("Local processing failed, using API fallback");
      const response = await apiRequest("POST", "/api/process-voice", {
        text: text,
        type: processingType
      })
      
      if (!response.ok) {
        throw new Error(`Failed to process voice input: ${response.statusText}`)
      }
      
      const data = await response.json()
      onVoiceData(data)
    } catch (error) {
      console.error("Error processing voice input:", error)
      onError(error instanceof Error ? error.message : "Failed to process voice input")
    } finally {
      setIsProcessing(false)
    }
  }, [onVoiceData, onError, processingType])
  
  // Process voice input locally using edge ML techniques
  const processLocalVoiceInput = (text: string) => {
    // Different processing logic based on the type
    switch (processingType) {
      case 'budget':
        return processBudgetVoiceInput(text);
      case 'expense':
        return processExpenseVoiceInput(text);
      case 'asset':
        return processAssetVoiceInput(text);
      case 'liability':
        return processLiabilityVoiceInput(text);
      default:
        return null;
    }
  }
  
  // Process budget-related voice input locally
  const processBudgetVoiceInput = (text: string) => {
    if (!text) return null;
    
    // Clean the text for processing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Find budget category
    let title = "";
    const categoryMatches = [
      { regex: /(?:budget|spend|allocate|set aside)(?:.*?)(?:for|on)\s+([a-z\s]+?)(?:\s+(?:and|with|spent|budget|i|\.|\$|₹|rs\.)|$)/i, group: 1 },
      { regex: /(?:my|the)\s+([a-z\s]+?)(?:\s+budget|expense)/i, group: 1 },
    ];
    
    for (const pattern of categoryMatches) {
      const match = cleanText.match(pattern.regex);
      if (match && match[pattern.group]) {
        title = match[pattern.group].trim();
        break;
      }
    }
    
    // If we couldn't find a category, try to infer one
    if (!title) {
      const commonCategories = [
        'food', 'groceries', 'dining', 'entertainment', 'shopping', 
        'transportation', 'utilities', 'rent', 'housing', 'healthcare',
        'education', 'travel', 'personal care', 'subscriptions'
      ];
      
      for (const category of commonCategories) {
        if (cleanText.includes(category)) {
          title = category;
          break;
        }
      }
    }
    
    // If we still don't have a title, we can't process it locally
    if (!title) return null;
    
    // Capitalize title
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Find budgeted amount
    let budgeted = 0;
    const budgetRegex = /(?:budget|allocate|set aside)(?:.*?)(?:of|for|is|about|around)?\s+(?:rs\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)/i;
    const budgetMatch = cleanText.match(budgetRegex);
    
    if (budgetMatch) {
      budgeted = parseFloat(budgetMatch[1].replace(/,/g, ''));
    } else {
      // Try to find any numbers that might be the budget
      const numberMatches = cleanText.match(/(\d[\d,]*(?:\.\d+)?)/g);
      if (numberMatches && numberMatches.length > 0) {
        // If there are multiple numbers, the larger one is likely the budget
        const numbers = numberMatches.map(n => parseFloat(n.replace(/,/g, '')));
        budgeted = Math.max(...numbers);
      }
    }
    
    // If we can't find a budget amount, return null
    if (budgeted <= 0) return null;
    
    // Find spent amount
    let spent = 0;
    const spentRegex = /(?:spent|used|consumed)(?:.*?)(?:rs\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)/i;
    const spentMatch = cleanText.match(spentRegex);
    
    if (spentMatch) {
      spent = parseFloat(spentMatch[1].replace(/,/g, ''));
    } else if (cleanText.includes('spent') || cleanText.includes('used')) {
      // If "spent" is mentioned but we couldn't parse the amount,
      // look for any other numbers that might be the spent amount
      const numbers = cleanText.match(/(\d[\d,]*(?:\.\d+)?)/g);
      if (numbers && numbers.length > 1) {
        // If there are two numbers, the smaller one is likely the spent amount
        const vals = numbers.map(n => parseFloat(n.replace(/,/g, '')));
        const sortedVals = [...vals].sort((a, b) => a - b);
        if (sortedVals[0] !== budgeted) {
          spent = sortedVals[0];
        } else {
          spent = sortedVals[1] || 0;
        }
      }
    }
    
    // If we couldn't find a spent amount, assume it's 0 (new budget)
    if (spent <= 0) {
      spent = 0;
    }
    
    // Format currency
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount)
    };
    
    // Calculate percentage and determine status
    const percentage = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0;
    let status: "normal" | "warning" | "danger" = "normal";
    if (percentage >= 100) {
      status = "danger";
    } else if (percentage >= 90) {
      status = "warning";
    }
    
    return {
      title,
      budgeted: formatCurrency(budgeted),
      spent: formatCurrency(spent),
      percentage,
      status
    };
  }
  
  // Process expense-related voice input locally
  const processExpenseVoiceInput = (text: string) => {
    if (!text) return null;
    
    // Clean the text for processing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Find expense amount
    const amountRegex = /(?:spent|paid|bought for|costs|price is|for|rs\.?|₹|inr|rupees?|rs|\$)?(?:\s*?)(\d+(?:\.\d+)?)/i;
    const amountMatch = cleanText.match(amountRegex);
    
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    if (isNaN(amount) || amount <= 0) return null;
    
    // Find expense category
    let category = "Other";
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
    
    for (const pattern of categoryPatterns) {
      if (pattern.regex.test(cleanText)) {
        category = pattern.category;
        break;
      }
    }
    
    // Find or extract title
    let title = "";
    const titleMatch = cleanText.match(/(?:for|on)\s+(?:a|an|the)?\s*([a-z\s]+?)(?:at|in|from|on|for|yesterday|today|tomorrow|january|february|march|april|may|june|july|august|september|october|november|december|food|groceries|shopping|transportation|entertainment|bills|health|education|travel|dining|other|\d|$)/i);
    
    if (titleMatch) {
      title = titleMatch[1].trim();
      // Capitalize title
      title = title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      // If no specific title, use the category as title
      title = category;
    }
    
    // Get date
    let date = new Date().toISOString().split('T')[0]; // Today as default
    
    if (cleanText.includes('yesterday')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      date = yesterday.toISOString().split('T')[0];
    } else if (cleanText.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }
    
    return {
      title,
      amount: amount.toString(),
      category,
      date,
      notes: text
    };
  }
  
  // Process asset-related voice input locally
  const processAssetVoiceInput = (text: string) => {
    if (!text) return null;
    
    // Clean the text for processing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Find asset type
    let type = "Other";
    const assetTypes = [
      { regex: /\b(?:real estate|property|house|apartment|flat|land)\b/i, type: "Real Estate" },
      { regex: /\b(?:stock|share|equity|etf|mutual fund|investment|market)\b/i, type: "Investments" },
      { regex: /\b(?:fixed deposit|fd|deposit|savings|cash|bank|gold|silver)\b/i, type: "Cash & Deposits" },
      { regex: /\b(?:car|vehicle|bike|motorcycle|boat|yacht)\b/i, type: "Vehicles" },
      { regex: /\b(?:jewel|jewelry|watch|art|collectible|antique)\b/i, type: "Valuables" },
    ];
    
    for (const pattern of assetTypes) {
      if (pattern.regex.test(cleanText)) {
        type = pattern.type;
        break;
      }
    }
    
    // Find asset title
    let title = "";
    let titlePatterns = [
      { regex: /(?:have|own|bought|purchased|acquired)(?:\s+a|\s+an)?\s+([a-z\s]+?)(?:\s+(?:worth|valued|of|for|at|which))/i, group: 1 },
      { regex: /(?:my|the)\s+([a-z\s]+?)(?:\s+is|are\s+worth|has\s+value|costs)/i, group: 1 },
    ];
    
    for (const pattern of titlePatterns) {
      const match = cleanText.match(pattern.regex);
      if (match && match[pattern.group]) {
        title = match[pattern.group].trim();
        break;
      }
    }
    
    // If we couldn't extract a title, try to infer one from the asset type
    if (!title) {
      if (type === "Real Estate") title = "Property";
      else if (type === "Investments") title = "Investment";
      else if (type === "Cash & Deposits") title = "Deposit";
      else if (type === "Vehicles") title = "Vehicle";
      else if (type === "Valuables") title = "Valuable Item";
      else title = "Asset";
    }
    
    // Capitalize title
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Find value
    let value = 0;
    const valueRegex = /(?:worth|valued at|value of|cost|price|amount)(?:\s+of)?\s+(?:rs\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)/i;
    const valueMatch = cleanText.match(valueRegex);
    
    if (valueMatch) {
      value = parseFloat(valueMatch[1].replace(/,/g, ''));
    } else {
      // Try to find any numbers that might be the value
      const numberMatches = cleanText.match(/(\d[\d,]*(?:\.\d+)?)/g);
      if (numberMatches && numberMatches.length > 0) {
        // Use the largest number as the asset value
        const numbers = numberMatches.map(n => parseFloat(n.replace(/,/g, '')));
        value = Math.max(...numbers);
      }
    }
    
    // If we can't find a value, return null
    if (value <= 0) return null;
    
    // Format value as currency
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    // Get the date (today)
    const date = new Date().toISOString().split('T')[0];
    
    // Determine trend and change
    // For now, use default values
    const trend = "up";
    const change = "+2.5%";
    
    return {
      title,
      value: formatCurrency(value),
      type,
      date,
      change,
      trend
    };
  }
  
  // Process liability-related voice input locally
  const processLiabilityVoiceInput = (text: string) => {
    if (!text) return null;
    
    // Clean the text for processing
    const cleanText = text.toLowerCase().replace(/[.,!?]/g, '');
    
    // Find liability type
    let type = "Other";
    const liabilityTypes = [
      { regex: /\b(?:house loan|mortgage|home loan|property loan)\b/i, type: "Mortgage" },
      { regex: /\b(?:car loan|vehicle loan|auto loan)\b/i, type: "Auto Loan" },
      { regex: /\b(?:personal loan|payday loan|cash loan)\b/i, type: "Personal Loan" },
      { regex: /\b(?:credit card|card debt|credit debt)\b/i, type: "Credit Card" },
      { regex: /\b(?:education loan|student loan|study loan|college loan)\b/i, type: "Education Loan" },
      { regex: /\b(?:business loan|commercial loan)\b/i, type: "Business Loan" },
    ];
    
    for (const pattern of liabilityTypes) {
      if (pattern.regex.test(cleanText)) {
        type = pattern.type;
        break;
      }
    }
    
    // Find liability title
    let title = "";
    let titlePatterns = [
      { regex: /(?:have|owe|took|borrowed|get)(?:\s+a|\s+an)?\s+([a-z\s]+?)(?:\s+(?:for|worth|of|from|with|which))/i, group: 1 },
      { regex: /(?:my|the)\s+([a-z\s]+?)(?:\s+(?:loan|debt|bill|payment|emi))/i, group: 1 },
    ];
    
    for (const pattern of titlePatterns) {
      const match = cleanText.match(pattern.regex);
      if (match && match[pattern.group]) {
        title = match[pattern.group].trim();
        break;
      }
    }
    
    // If we couldn't extract a title, try to infer one from the liability type
    if (!title) {
      if (type === "Mortgage") title = "Home Loan";
      else if (type === "Auto Loan") title = "Car Loan";
      else if (type === "Personal Loan") title = "Personal Loan";
      else if (type === "Credit Card") title = "Credit Card";
      else if (type === "Education Loan") title = "Education Loan";
      else if (type === "Business Loan") title = "Business Loan";
      else title = "Loan";
    }
    
    // Capitalize title
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Find amount/principal
    let amount = 0;
    const amountRegex = /(?:amount|loan|debt|borrowed|principal|worth)(?:\s+of)?\s+(?:rs\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)/i;
    const amountMatch = cleanText.match(amountRegex);
    
    if (amountMatch) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    } else {
      // Try to find any numbers that might be the amount
      const numberMatches = cleanText.match(/(\d[\d,]*(?:\.\d+)?)/g);
      if (numberMatches && numberMatches.length > 0) {
        // Use the largest number as the liability amount
        const numbers = numberMatches.map(n => parseFloat(n.replace(/,/g, '')));
        amount = Math.max(...numbers);
      }
    }
    
    // If we can't find an amount, return null
    if (amount <= 0) return null;
    
    // Format amount as currency
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    // Find interest rate
    let interest = "0%";
    const interestRegex = /(?:interest|rate)(?:\s+(?:of|is))?\s+(\d+(?:\.\d+)?)\s*%/i;
    const interestMatch = cleanText.match(interestRegex);
    
    if (interestMatch) {
      interest = `${interestMatch[1]}%`;
    }
    
    // Find payment amount
    let payment = "";
    const paymentRegex = /(?:pay|emi|installment|monthly payment)(?:\s+(?:of|is))?\s+(?:rs\.?|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)/i;
    const paymentMatch = cleanText.match(paymentRegex);
    
    if (paymentMatch) {
      const paymentAmount = parseFloat(paymentMatch[1].replace(/,/g, ''));
      payment = formatCurrency(paymentAmount);
    } else {
      // If payment not specified, estimate it based on typical loan terms
      // Using simple interest calculation for demonstration
      const estimatedPayment = amount * 0.02; // Rough estimate of monthly payment
      payment = formatCurrency(estimatedPayment);
    }
    
    // Get due date (default to 5th of next month)
    const today = new Date();
    let nextMonth = today.getMonth() + 1;
    let year = today.getFullYear();
    
    if (nextMonth > 11) {
      nextMonth = 0;
      year += 1;
    }
    
    const dueDate = `${year}-${(nextMonth + 1).toString().padStart(2, '0')}-05`;
    
    // Default status
    const status = "current";
    
    return {
      title,
      amount: formatCurrency(amount),
      type,
      interest,
      payment,
      dueDate,
      status
    };
  }

  // Start or stop listening based on isListening prop
  useEffect(() => {
    if (!recognition) return

    if (isListening) {
      try {
        recognition.start()
        setTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    } else if (recognition) {
      try {
        recognition.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }, [isListening, recognition])

  // Handle manual stop and process
  const handleManualProcess = () => {
    if (recognition) {
      recognition.stop()
      if (transcript) {
        processVoiceInput(transcript)
      }
    }
  }

  // Set up recognition event handlers
  useEffect(() => {
    if (!recognition) return

    // Handle speech recognition results
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)
      
      // Pass the transcript back to parent component for real-time display
      if (onTranscriptChange) {
        onTranscriptChange(currentTranscript)
      }
    }

    // Handle speech recognition errors
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      onError(`Speech recognition error: ${event.error}`)
      onStopListening()
    }

    // Handle speech recognition end
    recognition.onend = () => {
      // Only auto-process if we're not showing manual controls
      if (!showControls && transcript) {
        processVoiceInput(transcript)
      }
      
      // Always notify parent component that listening has stopped
      if (!showControls) {
        onStopListening()
      }
    }
  }, [recognition, transcript, onStopListening, onError, processVoiceInput, showControls, onTranscriptChange])

  if (!showControls) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {transcript && (
        <div className="p-3 border rounded-md bg-muted/30">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      
      <div className="flex justify-center gap-2">
        {isListening ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={onStopListening}
              className="flex items-center gap-2"
            >
              <MicOff className="h-4 w-4" />
              Cancel
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleManualProcess}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              OK
            </Button>
          </>
        ) : (
          <Button
            variant={isProcessing ? "outline" : "default"}
            size="sm"
            onClick={() => !isProcessing && processVoiceInput(transcript)}
            disabled={!transcript || isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Process Voice Input
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}