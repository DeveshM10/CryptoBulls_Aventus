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
    // Initialize speech recognition on component mount
    if (typeof window !== "undefined") {
      try {
        // @ts-ignore - Browser API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        
        if (SpeechRecognition) {
          // Create new instance or reuse existing
          if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = 'en-US'
            
            // Set up event handlers
            recognitionRef.current.onresult = (event: any) => {
              console.log("Speech recognized!", event)
              const last = event.results.length - 1
              const transcript = event.results[last][0].transcript
              setFullTranscript(transcript)
              onTranscriptChange(transcript)
            }
            
            recognitionRef.current.onerror = (event: any) => {
              console.error("Speech recognition error", event.error, event.message)
              if (event.error === 'not-allowed') {
                alert("Microphone access is required for voice input. Please allow microphone access and try again.")
              }
              onError()
            }
            
            recognitionRef.current.onend = () => {
              console.log("Speech recognition ended. isListening:", isListening)
              // Only auto-restart if we're still supposed to be listening
              if (isListening && recognitionRef.current) {
                try {
                  // Add a small delay before restarting
                  setTimeout(() => {
                    if (isListening && recognitionRef.current) {
                      console.log("Restarting speech recognition...")
                      recognitionRef.current.start()
                    }
                  }, 200)
                } catch (error) {
                  console.error("Failed to restart speech recognition:", error)
                }
              }
            }
          }
          
          // Start or stop based on isListening state
          if (isListening) {
            try {
              console.log("Starting speech recognition...")
              recognitionRef.current.start()
            } catch (error) {
              console.error("Failed to start speech recognition:", error)
              // Recreate recognition instance if it fails
              recognitionRef.current = new SpeechRecognition()
              setTimeout(() => {
                if (isListening) {
                  try {
                    recognitionRef.current.start()
                  } catch (e) {
                    console.error("Second attempt to start speech recognition failed:", e)
                    onError()
                  }
                }
              }, 500)
            }
          } else if (recognitionRef.current) {
            try {
              recognitionRef.current.stop()
            } catch (error) {
              console.error("Error stopping speech recognition:", error)
            }
          }
        } else {
          console.error("Speech recognition not supported by your browser")
          alert("Speech recognition is not supported by your browser. Please use Chrome, Edge, or Safari.")
          onError()
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
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
      console.log("Processing voice input for transcript:", fullTranscript)
      const processVoiceInput = async () => {
        try {
          setIsProcessing(true)
          
          // This is directly calling the voice processor API with the transcript
          console.log(`Sending transcript to /api/voice-processor with type=${processingType}`)
          const response = await apiRequest("POST", "/api/voice-processor", {
            transcript: fullTranscript,
            type: processingType
          })
          
          if (!response.ok) {
            throw new Error(`Failed to process voice input: ${response.statusText}`)
          }
          
          const data = await response.json()
          console.log("Voice processing response:", data)
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