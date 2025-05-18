"use client"

import { useState } from "react"
import { Mic } from "lucide-react"
import { useLocation } from "wouter"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Asset, Liability } from "@shared/schema"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"
import { VoiceProcessor } from "../voice-input/voice-processor"
import { v4 as uuidv4 } from "uuid"
import { useQueryClient } from "@tanstack/react-query"

export function VoiceFloatingActionButton() {
  const [open, setOpen] = useState(false)
  const [location] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Determine which voice input type based on current page
  const isAssetPage = location.includes('/portfolio') || location.includes('/assets')
  const isLiabilityPage = location.includes('/portfolio') || location.includes('/liabilities')
  
  const [inputType, setInputType] = useState<"asset" | "liability">("asset")
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [processingData, setProcessingData] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleOpen = () => {
    if (isAssetPage) {
      setInputType("asset")
    } else if (isLiabilityPage) {
      setInputType("liability")
    } else {
      // Default to asset if can't determine
      setInputType("asset")
    }
    setOpen(true)
    setIsListening(false)
    setTranscript("")
    setExtractedData(null)
  }

  const handleStartListening = () => {
    setIsListening(true)
    setTranscript("")
    setExtractedData(null)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleVoiceData = (data: any) => {
    console.log("Extracted data:", data)
    setExtractedData(data)
    setProcessingData(false)
  }

  const handleConfirm = async () => {
    if (!extractedData) return
    
    try {
      setProcessingData(true)
      
      if (inputType === "asset") {
        const assetData = {
          id: uuidv4(),
          title: extractedData.title || "Unnamed Asset",
          value: extractedData.value || "₹0",
          type: extractedData.type || "other",
          date: new Date().toISOString().split('T')[0],
          change: extractedData.change || "0%",
          trend: extractedData.trend || "up",
        }
        
        const response = await apiRequest("POST", "/api/assets", assetData)
        
        if (!response.ok) {
          throw new Error(`Failed to add asset: ${response.statusText}`)
        }
        
        // Invalidate cache to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/assets"] })
        
        toast({
          title: "Asset Added",
          description: "Your asset has been successfully added via voice input.",
        })
      } else {
        const liabilityData = {
          id: uuidv4(),
          title: extractedData.title || "Unnamed Liability",
          amount: extractedData.amount || "₹0",
          type: extractedData.type || "other",
          interest: extractedData.interest || "0%",
          payment: extractedData.payment || "₹0",
          dueDate: extractedData.dueDate || new Date().toISOString().split('T')[0],
          status: extractedData.status || "current",
        }
        
        const response = await apiRequest("POST", "/api/liabilities", liabilityData)
        
        if (!response.ok) {
          throw new Error(`Failed to add liability: ${response.statusText}`)
        }
        
        // Invalidate cache to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] })
        
        toast({
          title: "Liability Added",
          description: "Your liability has been successfully added via voice input.",
        })
      }
      
      // Close the dialog and reset
      setOpen(false)
      setExtractedData(null)
      setProcessingData(false)
    } catch (error) {
      console.error("Error adding data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add data",
        variant: "destructive",
      })
      setProcessingData(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 p-0"
        onClick={handleOpen}
      >
        <Mic className="h-6 w-6" />
      </Button>
      
      {/* Dialog for Voice Input */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add {inputType === "asset" ? "Asset" : "Liability"} Using Voice
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 p-4">
            {isListening ? (
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                <div className="relative">
                  <Mic className="h-16 w-16 text-primary animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                
                <p className="text-center">
                  Listening... Speak clearly and describe your {inputType}.
                </p>
                
                {transcript && (
                  <div className="mt-2 w-full">
                    <div className="p-3 border rounded-md bg-muted/30">
                      <p>{transcript}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setTranscript("")}
                    >
                      Clear
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 ml-2"
                      onClick={handleStopListening}
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
            ) : extractedData ? (
              <div className="space-y-4">
                <h3 className="font-medium">Extracted Information:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {extractedData && Object.entries(extractedData)
                    .filter(([_, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setExtractedData(null)}>
                    Try Again
                  </Button>
                  <Button onClick={handleConfirm}>
                    Confirm & Add
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <p className="text-center mb-4">
                  {inputType === "asset" 
                    ? "For example: \"I have a stock investment worth fifty thousand rupees with 5% increase\""
                    : "For example: \"I have a car loan of 300,000 rupees with 7% interest rate\""}
                </p>
                
                <Button 
                  size="lg"
                  onClick={handleStartListening}
                  className="w-full max-w-xs"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Speaking
                </Button>
              </div>
            )}
            
            {isListening && (
              <VoiceProcessor
                isListening={isListening}
                onVoiceData={handleVoiceData}
                onTranscriptChange={setTranscript}
                onError={() => setIsListening(false)}
                onStopListening={handleStopListening}
                processingType={inputType}
                showControls
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}