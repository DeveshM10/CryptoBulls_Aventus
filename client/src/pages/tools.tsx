import { MainLayout } from "@/components/layouts/main-layout";
import { Helmet } from "react-helmet-async";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillReminderTool } from "@/components/tools/bill-reminder-tool";
import { VoiceAssetModal } from "@/components/voice-input/voice-asset-modal";
import { VoiceLiabilityModal } from "@/components/voice-input/voice-liability-modal";
import { InterestCalculator } from "@/components/tools/interest-calculator";
import { EMICalculator } from "@/components/tools/emi-calculator";
import { TaxCalculator } from "@/components/tools/tax-calculator";
import { CurrencyConverter } from "@/components/tools/currency-converter";
import { Asset, Liability } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Mic, 
  AlertTriangle, 
  Calculator, 
  Clock, 
  FileText, 
  BarChart3, 
  DollarSign,
  Percent,
  BadgeDollarSign, 
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ToolsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTool, setSelectedTool] = useState<string>("voice-input");

  const handleAssetAdded = (asset: Asset) => {
    toast({
      title: "Asset Added",
      description: "Your asset has been successfully added to your portfolio."
    });
    
    // Invalidate the assets query to refresh the data
    queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
  };

  const handleLiabilityAdded = (liability: Liability) => {
    toast({
      title: "Liability Added",
      description: "Your liability has been successfully added to your portfolio."
    });
    
    // Invalidate the liabilities query to refresh the data
    queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Financial Tools | FinVault</title>
      </Helmet>
      
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Tools</h1>
            <p className="text-muted-foreground">
              Special tools to help you manage your finances efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tools sidebar */}
            <div className="md:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Tools</CardTitle>
                  <CardDescription>Select a tool to use</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 px-1">
                    <Button 
                      variant={selectedTool === "voice-input" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("voice-input")}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Input
                    </Button>
                    <Button 
                      variant={selectedTool === "bill-reminder" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("bill-reminder")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Bill Reminder
                    </Button>
                    <Button 
                      variant={selectedTool === "emi-calculator" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("emi-calculator")}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      EMI Calculator
                    </Button>
                    <Button 
                      variant={selectedTool === "interest-calculator" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("interest-calculator")}
                    >
                      <Percent className="mr-2 h-4 w-4" />
                      Interest Calculator
                    </Button>
                    <Button 
                      variant={selectedTool === "tax-calculator" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("tax-calculator")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Tax Calculator
                    </Button>
                    <Button 
                      variant={selectedTool === "currency-converter" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("currency-converter")}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Currency Converter
                    </Button>
                    <Button 
                      variant={selectedTool === "investment-calculator" ? "default" : "ghost"} 
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setSelectedTool("investment-calculator")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Investment Calculator
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary" />
                    <p className="text-sm">Voice input for quick financial data entry</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="text-sm">Bill reminder to track due dates</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-green-500" />
                    <p className="text-sm">EMI & loan calculators</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <p className="text-sm">Tax estimation for FY 2024-25</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-indigo-500" />
                    <p className="text-sm">Real-time currency conversion</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tool content area */}
            <div className="md:col-span-9">
              {selectedTool === "voice-input" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Input Tools</CardTitle>
                    <CardDescription>
                      Add financial information using your voice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/20 rounded-full">
                          <Mic className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Voice Recognition</h3>
                          <p className="text-sm text-muted-foreground">
                            Simply speak to add assets and liabilities
                          </p>
                        </div>
                      </div>
                      
                      <p className="mb-4">
                        Use our advanced voice recognition system to add financial entries without typing.
                        Our AI understands natural language and automatically extracts key financial information.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Add Asset by Voice</CardTitle>
                            <CardDescription>
                              Speak to add stocks, property, or other assets
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 text-sm">
                              Example: "I have a fixed deposit worth 50,000 rupees with 6.5% interest rate"
                            </p>
                            <VoiceAssetModal onAddAsset={handleAssetAdded} />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Add Liability by Voice</CardTitle>
                            <CardDescription>
                              Speak to add loans, credit card debt, or other liabilities
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 text-sm">
                              Example: "I have a car loan for 300,000 rupees with 8% interest rate"
                            </p>
                            <VoiceLiabilityModal onAddLiability={handleLiabilityAdded} />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "bill-reminder" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bill Reminder Tool</CardTitle>
                    <CardDescription>
                      Stay on top of your bill payments and never miss a due date
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BillReminderTool />
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "emi-calculator" && (
                <Card>
                  <CardHeader>
                    <CardTitle>EMI Calculator</CardTitle>
                    <CardDescription>
                      Calculate your Equated Monthly Installment for loans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EMICalculator />
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "interest-calculator" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Interest Calculator</CardTitle>
                    <CardDescription>
                      Calculate simple and compound interest on your investments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InterestCalculator />
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "tax-calculator" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Calculator (FY 2024-25)</CardTitle>
                    <CardDescription>
                      Estimate your income tax liability based on both new and old tax regimes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaxCalculator />
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "currency-converter" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Currency Converter</CardTitle>
                    <CardDescription>
                      Convert between different currencies using real-time exchange rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CurrencyConverter />
                  </CardContent>
                </Card>
              )}
              
              {selectedTool === "investment-calculator" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Calculator</CardTitle>
                    <CardDescription>
                      Calculate future value of investments with regular contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <Clock className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      We're working hard to bring you the investment calculator tool.
                      This feature will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}