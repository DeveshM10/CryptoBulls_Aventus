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
  processingType: 'asset' | 'liability'
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

  // Process the voice input using Google Gemini API
  const processVoiceInput = useCallback(async (text: string) => {
    if (!text.trim()) return
    
    try {
      setIsProcessing(true)
      const response = await apiRequest("POST", "/api/process-voice", {
        text: text,
        type: processingType
      })
      
      if (!response.ok) {
        throw new Error(`Failed to process voice input: ${response.statusText}`)
      }
      
      const data = await response.json()
      onVoiceData(data)
      setIsProcessing(false)
    } catch (error) {
      console.error("Error processing voice input:", error)
      onError(error instanceof Error ? error.message : "Failed to process voice input")
      setIsProcessing(false)
    }
  }, [onVoiceData, onError, processingType])

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