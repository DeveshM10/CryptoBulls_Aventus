"use client"

import { useEffect, useRef, useState } from "react"
import { apiRequest } from "@/lib/queryClient"
 
interface VoiceProcessorProps {
  isListening: boolean
  onVoiceData: (data: any) => void
  onTranscriptChange: (transcript: string) => void
  onError: () => void
  onStopListening: () => void
  processingType: "asset" | "liability"
  showControls?: boolean
}

export function VoiceProcessor({
  isListening,
  onVoiceData,
  onTranscriptChange,
  onError,
  onStopListening,
  processingType,
  showControls = false
}: VoiceProcessorProps) {
  const [fullTranscript, setFullTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  
  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && isListening) {
      // @ts-ignore - Browser API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onresult = (event: any) => {
          const last = event.results.length - 1
          const transcript = event.results[last][0].transcript
          setFullTranscript(transcript)
          onTranscriptChange(transcript)
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          onError()
        }
        
        recognitionRef.current.onend = () => {
          // Auto restart if we're still supposed to be listening
          if (isListening && recognitionRef.current) {
            try {
              // Make sure we're not already listening before starting again
              if (recognitionRef.current.state !== 'listening') {
                recognitionRef.current.start()
              }
            } catch (error) {
              console.error("Failed to restart speech recognition:", error)
            }
          }
        }
        
        recognitionRef.current.start()
      } else {
        console.error("Speech recognition not supported")
        onError()
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening, onError, onTranscriptChange])
  
  // Process voice data when stopped listening
  useEffect(() => {
    if (!isListening && fullTranscript) {
      const processVoiceInput = async () => {
        try {
          setIsProcessing(true)
          
          const response = await apiRequest("POST", "/api/voice-processor", {
            transcript: fullTranscript,
            type: processingType
          })
          
          if (!response.ok) {
            throw new Error(`Failed to process voice input: ${response.statusText}`)
          }
          
          const data = await response.json()
          onVoiceData(data)
        } catch (error) {
          console.error("Error processing voice input:", error)
          onError()
        } finally {
          setIsProcessing(false)
        }
      }
      
      processVoiceInput()
    }
  }, [isListening, fullTranscript, onVoiceData, processingType, onError])
  
  return null
}