"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mic, Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VoiceProcessor } from "./voice-processor"
import { Liability } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"
import { v4 as uuidv4 } from "uuid"

interface VoiceLiabilityModalProps {
  onAddLiability: (liability: Liability) => void
}

export function VoiceLiabilityModal({ onAddLiability }: VoiceLiabilityModalProps) {
  const [open, setOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Liability> | null>(null)
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

  const handleVoiceData = (data: Partial<Liability>) => {
    console.log("Extracted liability data:", data)
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

  const handleConfirmAdd = async () => {
    if (!extractedData) return
    
    try {
      setIsProcessing(true)
      
      // Create the complete liability object with the extracted data
      const liabilityData: Liability = {
        id: uuidv4(),
        title: extractedData.title || "Unnamed Liability",
        amount: extractedData.amount || "₹0",
        type: extractedData.type || "other",
        interest: extractedData.interest || "0%",
        payment: extractedData.payment || "₹0",
        dueDate: extractedData.dueDate || new Date().toISOString().split('T')[0],
        status: (extractedData.status as "current" | "warning" | "late") || "current",
      }
      
      // Call the API to add the liability
      const response = await apiRequest("POST", "/api/liabilities", liabilityData)
      
      if (!response.ok) {
        throw new Error(`Failed to add liability: ${response.statusText}`)
      }
      
      // Pass the new liability to the parent component
      onAddLiability(liabilityData)
      
      toast({
        title: "Liability Added",
        description: "Your liability has been successfully added via voice input.",
      })
      
      // Close the modal and reset states
      setOpen(false)
      setExtractedData(null)
      setIsProcessing(false)
    } catch (error) {
      console.error("Error adding liability:", error)
      setError(error instanceof Error ? error.message : "Failed to add liability")
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20"
        aria-label="Add liability with voice"
      >
        <Mic className="h-5 w-5 text-primary" />
        <span className="font-medium">Voice Input</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Liability Using Voice</DialogTitle>
            <DialogDescription>
              Click the microphone and describe your liability. For example, "I have a home loan with interest rate of 7.5 percent and monthly payment of ten thousand rupees."
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-4 py-4">
            {isListening && (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <div className="relative">
                  <Mic className="h-12 w-12 text-primary animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Listening... Speak clearly and describe your liability.
                </p>
                
                {currentTranscript && (
                  <div className="mt-2 p-3 border rounded-md bg-muted/30 w-full">
                    <p className="text-sm">{currentTranscript}</p>
                  </div>
                )}
              </div>
            )}
            
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
                <h3 className="font-medium">Extracted Liability Information:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{extractedData.title || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{extractedData.amount || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{extractedData.type || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Interest:</span>
                    <span className="font-medium">{extractedData.interest || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="font-medium">{extractedData.payment || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{extractedData.dueDate || "Not detected"}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setExtractedData(null)}>
                    Try Again
                  </Button>
                  <Button onClick={handleConfirmAdd}>
                    Confirm & Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Voice processor component */}
          {isListening && (
            <VoiceProcessor
              isListening={isListening}
              onVoiceData={handleVoiceData}
              onTranscriptChange={handleTranscriptChange}
              onError={handleError}
              onStopListening={handleStopListening}
              processingType="liability"
              showControls={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}