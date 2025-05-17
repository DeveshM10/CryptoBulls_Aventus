"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mic, Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VoiceProcessor } from "./voice-processor"
// Define the budget expense type that matches the app's structure
interface Expense {
  id: string;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: "normal" | "warning" | "danger";
}
import { apiRequest } from "@/lib/queryClient"
import { v4 as uuidv4 } from "uuid"

interface VoiceBudgetModalProps {
  onAddBudget: (budget: Expense) => void
}

export function VoiceBudgetModal({ onAddBudget }: VoiceBudgetModalProps) {
  const [open, setOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Expense> | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState<string>("")
  const { toast } = useToast()

  const handleStartListening = () => {
    setIsListening(true)
    setError(null)
    setExtractedData(null)
    setCurrentTranscript("")
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleVoiceData = (data: Partial<Expense>) => {
    console.log("Extracted budget data:", data)
    setExtractedData(data)
    setIsProcessing(false)
  }

  const handleTranscriptChange = (text: string) => {
    setCurrentTranscript(text)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsListening(false)
    setIsProcessing(false)
  }

  const handleAdd = async () => {
    if (!extractedData?.title || !extractedData.budgeted || !extractedData.spent) {
      toast({
        title: "Incomplete data",
        description: "The extracted data is incomplete. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      
      // Extract percentage from the budgeted and spent values
      const budgeted = parseFloat(String(extractedData.budgeted).replace(/[₹,]/g, ""))
      const spent = parseFloat(String(extractedData.spent).replace(/[₹,]/g, ""))
      
      // Calculate percentage
      const percentage = Math.round((spent / budgeted) * 100)
      
      // Determine status based on percentage
      let status: "normal" | "warning" | "danger" = "normal"
      if (percentage >= 100) {
        status = "danger"
      } else if (percentage >= 90) {
        status = "warning"
      }
      
      // Create the budget object
      const budget: Expense = {
        id: uuidv4(),
        title: extractedData.title,
        budgeted: formatCurrency(budgeted),
        spent: formatCurrency(spent),
        percentage,
        status
      }
      
      // Call the callback
      onAddBudget(budget)
      
      // Send to API
      await apiRequest('POST', '/api/budget', budget)
      
      // Reset and close
      setOpen(false)
      setExtractedData(null)
      setCurrentTranscript("")
      
      toast({
        title: "Budget added",
        description: `${budget.title} with budget of ${budget.budgeted} has been added.`,
      })
    } catch (error) {
      console.error("Error adding budget:", error)
      toast({
        title: "Error adding budget",
        description: "There was an error adding the budget. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Mic className="h-4 w-4 mr-2" />
        Voice Input
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Budget by Voice</DialogTitle>
            <DialogDescription>
              Speak to add a new budget category. Try saying something like "I budget 5000 rupees for groceries and spent 3000 so far".
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isListening ? (
            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center animate-pulse">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Listening... Speak clearly and describe your budget.
              </p>
              
              {currentTranscript && (
                <div className="mt-2 p-3 border rounded-md bg-muted/30 w-full">
                  <p className="text-sm">{currentTranscript}</p>
                </div>
              )}
            </div>
          ) : null}
          
          {!isListening && !extractedData && !isProcessing && (
            <Button onClick={handleStartListening} className="mx-auto">
              <Mic className="mr-2 h-4 w-4" />
              Start Speaking
            </Button>
          )}
          
          {isProcessing && (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Processing your speech...
              </p>
            </div>
          )}
          
          {extractedData && !isProcessing && (
            <div className="space-y-4">
              <h3 className="font-medium">Extracted Budget Information:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{extractedData.title}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Budgeted Amount:</span>
                  <span className="font-medium">{extractedData.budgeted}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Spent Amount:</span>
                  <span className="font-medium">{extractedData.spent}</span>
                </div>
                {extractedData.percentage && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Percentage Used:</span>
                    <span className="font-medium">{extractedData.percentage}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setExtractedData(null)
                    setCurrentTranscript("")
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handleAdd}>Add Budget</Button>
              </div>
            </div>
          )}
          
          {!isListening && !isProcessing && currentTranscript && !extractedData && (
            <VoiceProcessor
              isListening={isListening}
              onVoiceData={handleVoiceData}
              onTranscriptChange={handleTranscriptChange}
              onError={handleError}
              onStopListening={handleStopListening}
              processingType="budget"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}