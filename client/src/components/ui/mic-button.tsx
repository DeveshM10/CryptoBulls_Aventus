"use client"

import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Asset, Liability } from "@shared/schema"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { VoiceProcessor } from "../voice-input/voice-processor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"
import { v4 as uuidv4 } from "uuid"

type MicButtonProps = {
  type: "asset" | "liability"
  onDataAdded: (data: Asset | Liability) => void
}

export function MicButton({ type, onDataAdded }: MicButtonProps) {
  const [open, setOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Asset | Liability> | null>(null)
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

  const handleVoiceData = (data: Partial<Asset | Liability>) => {
    console.log(`Extracted ${type} data:`, data)
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
      
      if (type === "asset") {
        // Create the complete asset object with the extracted data
        const assetData = {
          id: uuidv4(),
          title: extractedData.title || "Unnamed Asset",
          value: (extractedData as Partial<Asset>).value || "₹0",
          type: extractedData.type || "other",
          date: new Date().toISOString().split('T')[0],
          change: (extractedData as Partial<Asset>).change || "0%",
          trend: (extractedData as Partial<Asset>).trend as "up" | "down" || "up",
        } as Asset
        
        // Call the API to add the asset
        const response = await apiRequest("POST", "/api/assets", assetData)
        
        if (!response.ok) {
          throw new Error(`Failed to add asset: ${response.statusText}`)
        }
        
        // Pass the new asset to the parent component
        onDataAdded(assetData)
        
        toast({
          title: "Asset Added",
          description: "Your asset has been successfully added via voice input.",
        })
      } else {
        // Create the complete liability object with the extracted data
        const liabilityData = {
          id: uuidv4(),
          title: extractedData.title || "Unnamed Liability",
          amount: (extractedData as Partial<Liability>).amount || "₹0",
          type: extractedData.type || "other",
          interest: (extractedData as Partial<Liability>).interest || "0%",
          payment: (extractedData as Partial<Liability>).payment || "₹0",
          dueDate: (extractedData as Partial<Liability>).dueDate || new Date().toISOString().split('T')[0],
          status: (extractedData as Partial<Liability>).status as "current" | "warning" | "late" || "current",
        } as Liability
        
        // Call the API to add the liability
        const response = await apiRequest("POST", "/api/liabilities", liabilityData)
        
        if (!response.ok) {
          throw new Error(`Failed to add liability: ${response.statusText}`)
        }
        
        // Pass the new liability to the parent component
        onDataAdded(liabilityData)
        
        toast({
          title: "Liability Added",
          description: "Your liability has been successfully added via voice input.",
        })
      }
      
      // Close the modal and reset states
      setOpen(false)
      setExtractedData(null)
      setIsProcessing(false)
    } catch (error) {
      console.error(`Error adding ${type}:`, error)
      setError(error instanceof Error ? error.message : `Failed to add ${type}`)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={() => setOpen(true)}
        className="bg-primary text-white hover:bg-primary/90 gap-2"
        aria-label={`Add ${type} with voice input`}
        size="sm"
      >
        <Mic className="h-5 w-5" />
        Voice Input
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add {type === "asset" ? "Asset" : "Liability"} Using Voice</DialogTitle>
            <DialogDescription>
              {type === "asset" 
                ? "Click the microphone and describe your asset. For example, \"I have a stock investment worth fifty thousand rupees.\""
                : "Click the microphone and describe your liability. For example, \"I have a car loan for three hundred thousand rupees.\""}
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
                  Listening... Speak clearly and describe your {type}.
                </p>
                
                {currentTranscript && (
                  <div className="mt-2 w-full">
                    <div className="p-3 border rounded-md bg-muted/30">
                      <p className="text-sm">{currentTranscript}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setCurrentTranscript("")}
                    >
                      Clear
                    </Button>
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
                <h3 className="font-medium">Extracted {type === "asset" ? "Asset" : "Liability"} Information:</h3>
                {type === "asset" ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{extractedData.title || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">{(extractedData as Partial<Asset>).value || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{extractedData.type || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Change:</span>
                      <span className="font-medium">{(extractedData as Partial<Asset>).change || "Not detected"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{extractedData.title || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{(extractedData as Partial<Liability>).amount || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{extractedData.type || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Interest:</span>
                      <span className="font-medium">{(extractedData as Partial<Liability>).interest || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-medium">{(extractedData as Partial<Liability>).payment || "Not detected"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{(extractedData as Partial<Liability>).dueDate || "Not detected"}</span>
                    </div>
                  </div>
                )}
                
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
              processingType={type}
              showControls={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}