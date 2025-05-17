"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SimpleVoiceButtonProps {
  onVoiceCapture: (text: string) => void
  buttonText?: string
  processingType: string
}

export function SimpleVoiceButton({ 
  onVoiceCapture, 
  buttonText = "Voice Input",
  processingType
}: SimpleVoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    let recognition: any = null
    
    if (isListening) {
      try {
        // Initialize speech recognition
        // @ts-ignore - Browser API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        
        if (SpeechRecognition) {
          recognition = new SpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'en-US'
          
          // Set up event handlers
          recognition.onstart = () => {
            console.log(`Started listening for ${processingType}...`)
            setTranscript("")
          }
          
          recognition.onresult = (event: any) => {
            const current = event.resultIndex
            const transcriptText = event.results[current][0].transcript
            setTranscript(transcriptText)
            console.log(`Transcribed: ${transcriptText}`)
          }
          
          recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            toast({
              title: "Voice Recognition Error",
              description: `Error: ${event.error}. Please try again or check your microphone permissions.`,
              variant: "destructive"
            })
            setIsListening(false)
          }
          
          recognition.onend = () => {
            console.log("Speech recognition ended")
            // Process final transcript when recognition ends
            if (transcript) {
              // Submit the final transcript for processing
              onVoiceCapture(transcript)
              setIsProcessing(true)
            }
            
            setIsListening(false)
          }
          
          // Start recognition
          recognition.start()
        } else {
          toast({
            title: "Not Supported",
            description: "Speech recognition is not supported by your browser. Please try Chrome or Edge.",
            variant: "destructive"
          })
          setIsListening(false)
        }
      } catch (error) {
        console.error("Failed to initialize speech recognition:", error)
        toast({
          title: "Voice Recognition Failed",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive"
        })
        setIsListening(false)
      }
    }
    
    // Cleanup function
    return () => {
      if (recognition) {
        try {
          recognition.stop()
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
      }
    }
  }, [isListening, processingType, toast])
  
  const toggleListening = () => {
    if (isProcessing) return
    setIsListening(!isListening)
  }
  
  return (
    <Button
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      disabled={isProcessing}
      className="flex-shrink-0"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isListening ? (
        <>
          <MicOff className="mr-2 h-4 w-4 animate-pulse" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}