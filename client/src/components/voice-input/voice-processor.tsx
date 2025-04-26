"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

interface VoiceProcessorProps {
  type: 'asset' | 'liability'
  onDataExtracted: (data: any) => void
}

export function VoiceProcessor({ type, onDataExtracted }: VoiceProcessorProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null)
  const { toast } = useToast()

  // Setup speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError("Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.")
      return
    }
    
    // Create a new recognition instance
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      setTranscript(transcript)
    }
    
    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error)
      setError(`Recognition error: ${event.error}`)
      setIsListening(false)
    }
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start()
      }
    }
    
    setRecognitionInstance(recognition)
    
    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [isListening])

  // Toggle listening state
  const toggleListening = () => {
    if (!recognitionInstance) return
    
    if (isListening) {
      recognitionInstance.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      setError(null)
      recognitionInstance.start()
      setIsListening(true)
    }
  }

  // Process the transcript with AI
  const processTranscript = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No speech detected",
        description: "Please record some speech first before processing.",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsProcessing(true)
      
      const response = await apiRequest("POST", "/api/process-voice", {
        text: transcript,
        type: type
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to process voice input")
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Success! Pass the extracted data up
      toast({
        title: "Successfully extracted data",
        description: `Your ${type} information has been processed successfully.`,
        variant: "default"
      })
      
      onDataExtracted(data)
      setTranscript("")
    } catch (err: any) {
      console.error("Error processing transcript:", err)
      toast({
        title: "Error processing input",
        description: err.message || "There was a problem processing your voice input.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Clear the transcript
  const clearTranscript = () => {
    setTranscript("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Voice Input for {type === 'asset' ? 'Asset' : 'Liability'}</CardTitle>
        <CardDescription>
          Speak about your {type === 'asset' ? 'asset' : 'liability'} details and we'll extract the information automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 mb-2">
          <Badge variant={isListening ? "default" : "outline"} className="animate-pulse">
            {isListening ? "Listening..." : "Not listening"}
          </Badge>
          {type === 'asset' && <Badge variant="secondary">Asset Mode</Badge>}
          {type === 'liability' && <Badge variant="secondary">Liability Mode</Badge>}
        </div>

        <ScrollArea className="h-[120px] w-full border rounded-md p-4 bg-muted/20">
          {transcript ? (
            <p className="text-sm">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isListening 
                ? "Start speaking about your " + (type === 'asset' ? 'asset' : 'liability') + "..." 
                : "Click the microphone button to start recording"}
            </p>
          )}
        </ScrollArea>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">
            {type === 'asset' 
              ? "Example: \"I bought 10 shares of Apple stock worth ₹15,000 yesterday as a long-term investment.\"" 
              : "Example: \"I have a home loan of ₹25,00,000 at 7.5% interest rate with a monthly payment of ₹18,500.\""}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant={isListening ? "destructive" : "default"}
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? "Stop" : "Start Recording"}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearTranscript}
            disabled={isProcessing || !transcript}
          >
            Clear
          </Button>
        </div>
        <Button 
          onClick={processTranscript}
          disabled={isProcessing || !transcript}
          variant="default"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Process with AI
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}