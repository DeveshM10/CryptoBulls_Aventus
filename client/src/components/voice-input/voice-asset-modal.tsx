"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mic, Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VoiceProcessor } from "./voice-processor"
import { Asset } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"
import { v4 as uuidv4 } from "uuid"

interface VoiceAssetModalProps {
  onAddAsset: (asset: Asset) => void
}

export function VoiceAssetModal({ onAddAsset }: VoiceAssetModalProps) {
  const [open, setOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Asset> | null>(null)
  const { toast } = useToast()

  const handleStartListening = () => {
    setIsListening(true)
    setError(null)
    setExtractedData(null)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleVoiceData = (data: Partial<Asset>) => {
    console.log("Extracted asset data:", data)
    setExtractedData(data)
    setIsProcessing(false)
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
      
      // Create the complete asset object with the extracted data
      const assetData: Asset = {
        id: uuidv4(),
        title: extractedData.title || "Unnamed Asset",
        value: extractedData.value || "₹0",
        type: extractedData.type || "other",
        date: extractedData.date || new Date().toISOString(),
        change: extractedData.change || "0%",
        trend: extractedData.trend as "up" | "down" || "up",
      }
      
      // Call the API to add the asset
      const response = await apiRequest("POST", "/api/assets", assetData)
      
      if (!response.ok) {
        throw new Error(`Failed to add asset: ${response.statusText}`)
      }
      
      // Pass the new asset to the parent component
      onAddAsset(assetData)
      
      toast({
        title: "Asset Added",
        description: "Your asset has been successfully added via voice input.",
      })
      
      // Close the modal and reset states
      setOpen(false)
      setExtractedData(null)
      setIsProcessing(false)
    } catch (error) {
      console.error("Error adding asset:", error)
      setError(error instanceof Error ? error.message : "Failed to add asset")
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <Mic className="h-4 w-4" />
        Voice Input
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Asset Using Voice</DialogTitle>
            <DialogDescription>
              Click the microphone and describe your asset. For example, "I have a stock investment worth fifty thousand rupees."
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
                  Listening... Speak clearly and describe your asset.
                </p>
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
                <h3 className="font-medium">Extracted Asset Information:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{extractedData.title || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium">{extractedData.value || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{extractedData.type || "Not detected"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Change:</span>
                    <span className="font-medium">{extractedData.change || "Not detected"}</span>
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
          
          {/* Hidden component for processing speech */}
          {isListening && (
            <VoiceProcessor
              isListening={isListening}
              onVoiceData={handleVoiceData}
              onError={handleError}
              onStopListening={handleStopListening}
              processingType="asset"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}