import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Speaker, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeFinanceQuery, FinanceQueryResult } from "../../lib/finance-ai/voice-analyzer";

interface VoiceFinanceAssistantProps {
  onQueryResult?: (result: FinanceQueryResult) => void;
}

export function VoiceFinanceAssistant({ onQueryResult }: VoiceFinanceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryResult, setQueryResult] = useState<FinanceQueryResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Set up speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: "Voice Recognition Error",
            description: "Failed to recognize speech. Please try again.",
            variant: "destructive"
          });
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          // Only stop listening if we intended to stop
          if (isListening) {
            recognitionRef.current.start();
          }
        };
      } else {
        toast({
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser.",
          variant: "destructive"
        });
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);
  
  const handleStartListening = () => {
    setIsListening(true);
    setTranscript("");
    setQueryResult(null);
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };
  
  const handleStopListening = () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (transcript) {
      processQuery(transcript);
    }
  };
  
  const processQuery = (query: string) => {
    setIsProcessing(true);
    
    // Process the query offline using our AI engine
    setTimeout(() => {
      try {
        const result = analyzeFinanceQuery(query);
        setQueryResult(result);
        
        if (onQueryResult) {
          onQueryResult(result);
        }
        
        // Speak the response if text-to-speech is available
        speakResponse(result.response);
      } catch (error) {
        console.error('Error processing query:', error);
        toast({
          title: "Processing Error",
          description: "Failed to analyze your question. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1000); // Simulate processing time
  };
  
  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = 1;
      
      setIsSpeaking(true);
      
      speech.onend = () => {
        setIsSpeaking(false);
      };
      
      speech.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Text-to-Speech Error",
          description: "Could not play the audio response.",
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(speech);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>AI Voice Assistant</span>
          <Badge variant="outline" className="ml-2">Offline</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          {!isListening && !isProcessing && !queryResult && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Ask your finance assistant a question about your finances using your voice.
              </p>
              <Button onClick={handleStartListening} className="bg-primary">
                <Mic className="mr-2 h-4 w-4" />
                Start Listening
              </Button>
            </div>
          )}
          
          {isListening && (
            <div className="w-full">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-primary/20 animate-ping"></div>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 rounded-full bg-primary/5 relative"
                    onClick={handleStopListening}
                  >
                    <Mic className="h-6 w-6 text-primary" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Listening... Speak clearly.</p>
              </div>
              
              {transcript && (
                <div className="p-3 border rounded-lg bg-muted/30 w-full">
                  <p className="text-sm">{transcript}</p>
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleStopListening}>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </Button>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Processing your question...
              </p>
            </div>
          )}
          
          {queryResult && !isProcessing && (
            <div className="w-full space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-1">You asked:</h4>
                <p className="text-sm text-muted-foreground">{transcript}</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-primary/5">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Response:</h4>
                    <p className="text-sm">{queryResult.response}</p>
                  </div>
                  
                  {!isSpeaking ? (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="flex-shrink-0" 
                      onClick={() => speakResponse(queryResult.response)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="flex-shrink-0" 
                      onClick={() => window.speechSynthesis.cancel()}
                    >
                      <Speaker className="h-4 w-4 text-primary animate-pulse" />
                    </Button>
                  )}
                </div>
                
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline">
                    Intent: {queryResult.intent.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline">
                    Confidence: {Math.round(queryResult.confidence * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {(queryResult || isProcessing) && !isListening && (
          <Button variant="outline" onClick={handleStartListening}>
            <Mic className="mr-2 h-4 w-4" />
            Ask Another Question
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}