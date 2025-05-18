"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calculator, ArrowRight, Percent, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function InterestCalculator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"simple" | "compound">("simple");
  
  // Simple Interest State
  const [simpleState, setSimpleState] = useState({
    principal: "10000",
    rate: "10",
    time: "5",
    result: null as number | null,
  });
  
  // Compound Interest State
  const [compoundState, setCompoundState] = useState({
    principal: "10000",
    rate: "10",
    time: "5",
    frequency: "1", // 1 = annually, 12 = monthly, 4 = quarterly, 2 = semi-annually
    result: null as number | null,
    growthData: [] as { year: number; amount: number }[],
  });

  // Calculate Simple Interest
  const calculateSimpleInterest = () => {
    const p = parseFloat(simpleState.principal);
    const r = parseFloat(simpleState.rate) / 100;
    const t = parseFloat(simpleState.time);
    
    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numeric values for all fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Simple Interest = P × r × t
    const interest = p * r * t;
    const totalAmount = p + interest;
    
    setSimpleState({
      ...simpleState,
      result: totalAmount,
    });
    
    toast({
      title: "Simple Interest Calculated",
      description: `Total amount after ${t} years: ₹${totalAmount.toFixed(2)}`,
    });
  };
  
  // Calculate Compound Interest
  const calculateCompoundInterest = () => {
    const p = parseFloat(compoundState.principal);
    const r = parseFloat(compoundState.rate) / 100;
    const t = parseFloat(compoundState.time);
    const n = parseFloat(compoundState.frequency);
    
    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numeric values for all fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Compound Interest = P(1 + r/n)^nt - P
    const finalAmount = p * Math.pow(1 + r / n, n * t);
    const interest = finalAmount - p;
    
    // Create data for the growth chart
    const growthData = [];
    for (let year = 0; year <= t; year++) {
      const amount = p * Math.pow(1 + r / n, n * year);
      growthData.push({
        year,
        amount: parseFloat(amount.toFixed(2)),
      });
    }
    
    setCompoundState({
      ...compoundState,
      result: finalAmount,
      growthData,
    });
    
    toast({
      title: "Compound Interest Calculated",
      description: `Total amount after ${t} years: ₹${finalAmount.toFixed(2)}`,
    });
  };
  
  // Format currency to Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "simple" | "compound");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Interest Calculator</h2>
        <p className="text-muted-foreground">
          Calculate simple and compound interest on your investments
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple Interest</TabsTrigger>
          <TabsTrigger value="compound">Compound Interest</TabsTrigger>
        </TabsList>
        
        {/* Simple Interest Tab */}
        <TabsContent value="simple" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Principal Amount */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="simple-principal">Principal Amount</Label>
                        <span className="text-sm font-medium">{formatCurrency(parseFloat(simpleState.principal) || 0)}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(simpleState.principal) || 0]}
                            min={1000}
                            max={1000000}
                            step={1000}
                            onValueChange={(value) => 
                              setSimpleState({ ...simpleState, principal: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="simple-principal"
                            value={simpleState.principal}
                            onChange={(e) => 
                              setSimpleState({ ...simpleState, principal: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="simple-rate">Interest Rate (%)</Label>
                        <span className="text-sm font-medium">{simpleState.rate}%</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(simpleState.rate) || 0]}
                            min={1}
                            max={30}
                            step={0.1}
                            onValueChange={(value) => 
                              setSimpleState({ ...simpleState, rate: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="simple-rate"
                            value={simpleState.rate}
                            onChange={(e) => 
                              setSimpleState({ ...simpleState, rate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Period */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="simple-time">Time Period (Years)</Label>
                        <span className="text-sm font-medium">{simpleState.time} years</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(simpleState.time) || 0]}
                            min={1}
                            max={30}
                            step={1}
                            onValueChange={(value) => 
                              setSimpleState({ ...simpleState, time: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="simple-time"
                            value={simpleState.time}
                            onChange={(e) => 
                              setSimpleState({ ...simpleState, time: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={calculateSimpleInterest} className="w-full mt-4">
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Simple Interest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-5">
              {simpleState.result !== null && (
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl font-bold mb-6">Simple Interest Result</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Principal Amount</span>
                          <span className="font-medium">{formatCurrency(parseFloat(simpleState.principal))}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Interest Earned</span>
                          <span className="font-medium text-emerald-500">
                            {formatCurrency(simpleState.result - parseFloat(simpleState.principal))}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-medium">Total Amount</span>
                          <span className="text-xl font-bold text-primary">{formatCurrency(simpleState.result)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <Info className="inline-block h-4 w-4 mr-1" />
                          Simple interest is calculated once on the initial principal:
                        </p>
                        <p className="text-sm font-medium mt-2">
                          Interest = Principal × Rate × Time
                        </p>
                        <p className="text-sm mt-1">
                          {formatCurrency(parseFloat(simpleState.principal))} × {parseFloat(simpleState.rate) / 100} × {simpleState.time} = 
                          {formatCurrency(simpleState.result - parseFloat(simpleState.principal))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Compound Interest Tab */}
        <TabsContent value="compound" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Principal Amount */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="compound-principal">Principal Amount</Label>
                        <span className="text-sm font-medium">{formatCurrency(parseFloat(compoundState.principal) || 0)}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(compoundState.principal) || 0]}
                            min={1000}
                            max={1000000}
                            step={1000}
                            onValueChange={(value) => 
                              setCompoundState({ ...compoundState, principal: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="compound-principal"
                            value={compoundState.principal}
                            onChange={(e) => 
                              setCompoundState({ ...compoundState, principal: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="compound-rate">Interest Rate (%)</Label>
                        <span className="text-sm font-medium">{compoundState.rate}%</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(compoundState.rate) || 0]}
                            min={1}
                            max={30}
                            step={0.1}
                            onValueChange={(value) => 
                              setCompoundState({ ...compoundState, rate: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="compound-rate"
                            value={compoundState.rate}
                            onChange={(e) => 
                              setCompoundState({ ...compoundState, rate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Period */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="compound-time">Time Period (Years)</Label>
                        <span className="text-sm font-medium">{compoundState.time} years</span>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-10">
                          <Slider
                            value={[parseFloat(compoundState.time) || 0]}
                            min={1}
                            max={30}
                            step={1}
                            onValueChange={(value) => 
                              setCompoundState({ ...compoundState, time: value[0].toString() })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            id="compound-time"
                            value={compoundState.time}
                            onChange={(e) => 
                              setCompoundState({ ...compoundState, time: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Compounding Frequency */}
                    <div className="space-y-2">
                      <Label htmlFor="compound-frequency">Compounding Frequency</Label>
                      <Select
                        value={compoundState.frequency}
                        onValueChange={(value) => 
                          setCompoundState({ ...compoundState, frequency: value })
                        }
                      >
                        <SelectTrigger id="compound-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Annually</SelectItem>
                          <SelectItem value="2">Semi-Annually</SelectItem>
                          <SelectItem value="4">Quarterly</SelectItem>
                          <SelectItem value="12">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={calculateCompoundInterest} className="w-full mt-4">
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Compound Interest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-5">
              {compoundState.result !== null && (
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Compound Interest Result</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Principal Amount</span>
                          <span className="font-medium">{formatCurrency(parseFloat(compoundState.principal))}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Interest Earned</span>
                          <span className="font-medium text-emerald-500">
                            {formatCurrency(compoundState.result - parseFloat(compoundState.principal))}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-medium">Total Amount</span>
                          <span className="text-xl font-bold text-primary">{formatCurrency(compoundState.result)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {compoundState.growthData.length > 0 && (
                      <div className="mt-4 flex-grow">
                        <h4 className="text-sm font-medium mb-2">Growth Over Time</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={compoundState.growthData}
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="year" 
                                label={{ 
                                  value: 'Years', 
                                  position: 'insideBottomRight', 
                                  offset: -5 
                                }} 
                              />
                              <YAxis 
                                tickFormatter={(value) => formatCurrency(value)}
                              />
                              <Tooltip 
                                formatter={(value) => formatCurrency(value as number)}
                                labelFormatter={(value) => `Year ${value}`}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#6366f1" 
                                activeDot={{ r: 8 }} 
                                name="Amount"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {compoundState.result !== null && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">How Compound Interest Works</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Compound interest is calculated using the formula: A = P(1 + r/n)^(nt)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>A = Final amount</li>
                      <li>P = Principal (initial investment)</li>
                      <li>r = Annual interest rate (decimal)</li>
                      <li>n = Number of times interest is compounded per year</li>
                      <li>t = Time in years</li>
                    </ul>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><strong>Your values:</strong></p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>P = ₹{parseFloat(compoundState.principal).toLocaleString()}</li>
                      <li>r = {parseFloat(compoundState.rate) / 100} ({compoundState.rate}%)</li>
                      <li>n = {compoundState.frequency} ({
                        compoundState.frequency === "1" ? "Annually" :
                        compoundState.frequency === "2" ? "Semi-Annually" :
                        compoundState.frequency === "4" ? "Quarterly" : "Monthly"
                      })</li>
                      <li>t = {compoundState.time} years</li>
                      <li>A = ₹{compoundState.result.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}