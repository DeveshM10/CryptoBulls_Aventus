import { useState } from "react";
import { Brain, Lightbulb, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FinanceAssistantPanel } from "../../components/finance-assistant/FinanceAssistantPanel";
import { VoiceFinanceAssistant } from "../../components/finance-assistant/VoiceFinanceAssistant";
import { FinanceQueryResult } from "../../lib/finance-ai/voice-analyzer";

export default function AIFinanceAssistantPage() {
  const [activeTab, setActiveTab] = useState("insights");
  const [lastQuery, setLastQuery] = useState<FinanceQueryResult | null>(null);
  
  const handleVoiceQueryResult = (result: FinanceQueryResult) => {
    setLastQuery(result);
    
    // If the query is about budget or spending, switch to insights tab
    if (
      result.intent === "check_budget" || 
      result.intent === "spending_category"
    ) {
      setActiveTab("insights");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Finance Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Get personalized financial insights and advice powered by AI - all processed locally for privacy
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="insights" className="flex-1">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Insights & Analysis
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Voice Assistant
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights" className="mt-6">
                <FinanceAssistantPanel />
              </TabsContent>
              
              <TabsContent value="voice" className="mt-6">
                <VoiceFinanceAssistant onQueryResult={handleVoiceQueryResult} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="flex flex-col gap-6">
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Privacy-First Design</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All financial analysis happens directly on your device. Your data never leaves your browser - ensuring complete privacy and security.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">How It Works</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The AI analyzes your spending patterns and financial data locally.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      It detects anomalies, finds saving opportunities, and monitors budget adherence.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-primary/10 w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ask questions using voice and get instant insights without data leaving your device.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🎓</span>
                  Learn More About Financial Planning
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📊</span>
                  Export Financial Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">⚙️</span>
                  Configure Assistant Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}