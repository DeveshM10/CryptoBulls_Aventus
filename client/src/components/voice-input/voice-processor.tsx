"use client"

import { useState, useEffect, useCallback } from "react"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

// Define interface for the Voice processor component
interface VoiceProcessorProps {
  isListening: boolean
  onVoiceData: (data: any) => void
  onError: (error: string) => void
  onStopListening: () => void
  processingType: 'asset' | 'liability'
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
  onError,
  onStopListening,
  processingType
}: VoiceProcessorProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [transcript, setTranscript] = useState("")
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
    try {
      console.log("Processing voice input:", text);
      const response = await apiRequest("POST", "/api/process-voice", {
        text: text.trim(),
        type: processingType
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process voice input');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to process voice input: ${response.statusText}`)
      }
      
      const data = await response.json()
      onVoiceData(data)
    } catch (error) {
      console.error("Error processing voice input:", error)
      onError(error instanceof Error ? error.message : "Failed to process voice input")
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

      setTranscript(finalTranscript || interimTranscript)
    }

    // Handle speech recognition errors
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      onError(`Speech recognition error: ${event.error}`)
      onStopListening()
    }

    // Handle speech recognition end
    recognition.onend = () => {
      if (transcript) {
        processVoiceInput(transcript)
      }
      onStopListening()
    }
  }, [recognition, transcript, onStopListening, onError, processVoiceInput])

  return null // This component doesn't render anything, it just processes speech
}