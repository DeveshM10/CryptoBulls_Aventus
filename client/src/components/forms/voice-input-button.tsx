"use client"

import { useState } from 'react'
import { Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

interface VoiceInputButtonProps {
  type: 'asset' | 'liability' | 'expense'
  onSuccess?: () => void
}

export function VoiceInputButton({ type, onSuccess }: VoiceInputButtonProps) {
  const [open, setOpen] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const handleStartListening = () => {
    if (!navigator.mediaDevices || !window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError('Speech recognition is not supported in this browser')
      return
    }
    
    setError(null)
    setIsListening(true)
    setTranscript('')
    setExtractedData(null)
    
    // Using browser's SpeechRecognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1]
      const text = lastResult[0].transcript
      setTranscript(text)
    }
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }
    
    recognition.onend = () => {
      // Process the transcript
      if (transcript) {
        processVoiceInput(transcript)
      }
      setIsListening(false)
    }
    
    try {
      recognition.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition')
      setIsListening(false)
    }
  }
  
  const handleStopListening = () => {
    setIsListening(false)
    
    // Process the transcript
    if (transcript) {
      processVoiceInput(transcript)
    }
  }
  
  const processVoiceInput = async (text: string) => {
    if (!text) return
    
    try {
      setIsProcessing(true)
      
      const response = await apiRequest('POST', '/api/voice-processor', {
        transcript: text,
        type: type
      })
      
      if (!response.ok) {
        throw new Error(`Failed to process voice input: ${response.statusText}`)
      }
      
      const data = await response.json()
      setExtractedData(data)
    } catch (err) {
      console.error('Error processing voice input:', err)
      setError(err instanceof Error ? err.message : 'Failed to process voice input')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleConfirm = async () => {
    if (!extractedData) return
    
    try {
      setIsProcessing(true)
      
      // Determine the API endpoint based on type
      const endpoint = type === 'asset' 
        ? '/api/assets' 
        : type === 'liability'
          ? '/api/liabilities'
          : '/api/budget'
      
      // For budget items, format the data correctly
      let dataToSend = extractedData
      if (type === 'expense' && extractedData) {
        dataToSend = {
          ...extractedData,
          percentage: Math.round((parseFloat(extractedData.spent.replace('₹', '')) / 
                                parseFloat(extractedData.budgeted.replace('₹', ''))) * 100) || 0
        }
      }
      
      const response = await apiRequest('POST', endpoint, dataToSend)
      
      if (!response.ok) {
        throw new Error(`Failed to add ${type}: ${response.statusText}`)
      }
      
      // Invalidate the appropriate queries
      queryClient.invalidateQueries({ 
        queryKey: [endpoint]
      })
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} added`,
        description: `Your ${type} has been added successfully using voice input.`,
      })
      
      // Close dialog and reset state
      setOpen(false)
      setTranscript('')
      setExtractedData(null)
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error(`Error adding ${type}:`, err)
      setError(err instanceof Error ? err.message : `Failed to add ${type}`)
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Mic className="h-4 w-4" />
        Voice Input
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add {type.charAt(0).toUpperCase() + type.slice(1)} Using Voice
            </DialogTitle>
            <DialogDescription>
              {type === 'asset' 
                ? "For example: \"I have a stock investment worth fifty thousand rupees with 5% increase\"" 
                : type === 'liability'
                  ? "For example: \"I have a car loan of 300,000 rupees with 7% interest rate\""
                  : "For example: \"Entertainment budget of 5000 rupees with 3500 spent so far\""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            {isListening ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Mic className="h-16 w-16 text-primary animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                
                <p className="mt-4 text-center text-sm">
                  Listening... Speak clearly to describe your {type}.
                </p>
                
                {transcript && (
                  <div className="mt-4 w-full">
                    <div className="p-3 border rounded-md bg-muted/30">
                      <p className="text-sm">{transcript}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setTranscript('')}
                      >
                        Clear
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleStopListening}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : extractedData ? (
              <div className="space-y-4">
                <h3 className="font-medium">Extracted Information:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(extractedData)
                    .filter(([key, value]) => 
                      value !== null && 
                      value !== undefined && 
                      key !== 'id' && 
                      typeof value !== 'object'
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
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
                <Button 
                  onClick={handleStartListening}
                  className="w-full max-w-xs"
                  disabled={isProcessing}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Speaking
                </Button>
                
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}