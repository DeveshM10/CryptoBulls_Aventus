import { useState, useEffect, useRef } from 'react';
import { processVoiceInputOffline } from '../../lib/offline-voice-processor';
import { isOffline } from '../../lib/offline-helpers';
import { apiRequest } from '@/lib/queryClient';
import { useFinanceStore } from '../finance-ai/finance-store';

interface OfflineAwareVoiceProcessorProps {
  isListening: boolean;
  onVoiceData: (data: any) => void;
  onTranscriptChange: (transcript: string) => void;
  onError: () => void;
  onStopListening: () => void;
  processingType: "asset" | "liability";
  showControls?: boolean;
}

/**
 * Voice processor component that works both online and offline
 */
export function OfflineAwareVoiceProcessor({
  isListening,
  onVoiceData,
  onTranscriptChange,
  onError,
  onStopListening,
  processingType,
  showControls = false
}: OfflineAwareVoiceProcessorProps) {
  const [fullTranscript, setFullTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const financeStore = useFinanceStore();
  
  // Setup speech recognition
  useEffect(() => {
    // Initialize speech recognition on component mount
    if (typeof window !== "undefined") {
      try {
        // @ts-ignore - Browser API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          // Create new instance or reuse existing
          if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';
            
            // Set up event handlers
            recognitionRef.current.onresult = (event: any) => {
              console.log("Speech recognized!", event);
              const last = event.results.length - 1;
              const transcript = event.results[last][0].transcript;
              setFullTranscript(transcript);
              onTranscriptChange(transcript);
            };
            
            recognitionRef.current.onerror = (event: any) => {
              console.error("Speech recognition error:", event.error);
              onError();
            };
            
            recognitionRef.current.onend = () => {
              console.log("Speech recognition ended");
              onStopListening();
            };
          }
          
          // Start or stop based on isListening prop
          if (isListening) {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          } else {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (error) {
                // Ignore the error if recognition hasn't started yet
              }
            }
          }
        } else {
          console.error("Speech Recognition API not supported in this browser");
          onError();
        }
      } catch (error) {
        console.error("Failed to initialize speech recognition:", error);
        onError();
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isListening, onError, onStopListening, onTranscriptChange]);
  
  // Process transcript when speech recognition stops
  useEffect(() => {
    if (!isListening && fullTranscript && !isProcessing) {
      const processVoiceInput = async () => {
        setIsProcessing(true);
        
        try {
          let data;
          
          // Check if we're offline
          if (isOffline()) {
            console.log(`Offline: processing voice input locally. Type: ${processingType}`);
            // Process the transcript locally
            data = processVoiceInputOffline(fullTranscript, processingType);
            
            // When offline, store this in the finance store directly
            if (processingType === 'asset') {
              financeStore.addAsset(data);
            } else if (processingType === 'liability') {
              financeStore.addLiability(data);
            }
          } else {
            // Online mode - use the server API
            console.log(`Sending transcript to /api/voice-processor with type=${processingType}`);
            const response = await apiRequest("POST", "/api/voice-processor", {
              transcript: fullTranscript,
              type: processingType
            });
            
            if (!response.ok) {
              throw new Error(`Failed to process voice input: ${response.statusText}`);
            }
            
            data = await response.json();
          }
          
          console.log("Voice processing response:", data);
          onVoiceData(data);
        } catch (error) {
          console.error("Error processing voice input:", error);
          onError();
        } finally {
          setIsProcessing(false);
        }
      };
      
      processVoiceInput();
    }
  }, [isListening, fullTranscript, isProcessing, onVoiceData, processingType, onError, financeStore]);
  
  return null;
}