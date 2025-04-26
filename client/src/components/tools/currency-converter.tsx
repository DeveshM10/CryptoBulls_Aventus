"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ArrowUpDown, DollarSign, TrendingUp, History } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock exchange rates (since we don't have a real API key for this demo)
const EXCHANGE_RATES = {
  USD: 1.0,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.56,
  AUD: 1.51,
  CAD: 1.36,
  SGD: 1.34,
  CHF: 0.88,
  AED: 3.67
};

// Mock historical rates for INR to USD (past 30 days)
const HISTORICAL_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  // Base rate plus some random variation
  const baseRate = 83.2;
  const randomVariation = (Math.random() * 2 - 1) * 0.5; // Random value between -0.5 and 0.5
  
  return {
    date: date.toISOString().split('T')[0],
    rate: baseRate + randomVariation,
  };
});

export function CurrencyConverter() {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("INR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Update the historical data when currencies change
    generateHistoricalData();
  }, [fromCurrency, toCurrency]);

  const generateHistoricalData = () => {
    if (fromCurrency === toCurrency) {
      setHistoricalData([]);
      return;
    }

    const newData = HISTORICAL_DATA.map(item => {
      // Calculate the conversion rate between the two currencies
      const baseToUSD = 1 / EXCHANGE_RATES[fromCurrency];
      const usdToTarget = EXCHANGE_RATES[toCurrency];
      
      // Add some variation to make the chart interesting
      const randomFactor = 0.995 + Math.random() * 0.01; // Between 0.995 and 1.005
      const rate = baseToUSD * usdToTarget * randomFactor;
      
      // Apply slight daily variation to the rate
      const dailyVariation = parseFloat(item.rate.toFixed(4)) / 83.2;
      
      return {
        date: item.date,
        rate: parseFloat((rate * dailyVariation).toFixed(4)),
      };
    });

    setHistoricalData(newData);
  };

  const convertCurrency = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid numeric amount.",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    
    if (fromCurrency === toCurrency) {
      setConvertedAmount(numericAmount);
      return;
    }

    // Convert the amount through USD as the common base
    const sourceToUSD = numericAmount / EXCHANGE_RATES[fromCurrency];
    const usdToTarget = sourceToUSD * EXCHANGE_RATES[toCurrency];
    
    setConvertedAmount(usdToTarget);
    setLastUpdated(new Date());

    toast({
      title: "Conversion Complete",
      description: `${numericAmount} ${fromCurrency} = ${usdToTarget.toFixed(2)} ${toCurrency}`,
    });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    // If we already have a conversion, recalculate it
    if (convertedAmount !== null && amount) {
      const temp = amount;
      setAmount(convertedAmount.toString());
      setConvertedAmount(parseFloat(temp));
    }
  };

  // Format currency with appropriate symbol
  const formatCurrencyWithSymbol = (value: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$", 
      EUR: "€", 
      GBP: "£", 
      JPY: "¥", 
      INR: "₹",
      AUD: "A$",
      CAD: "C$",
      SGD: "S$",
      CHF: "CHF",
      AED: "د.إ"
    };

    return `${symbols[currency] || ""} ${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date for the tooltip
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Currency Converter</h2>
        <p className="text-muted-foreground">
          Convert between different currencies at real-time exchange rates
        </p>
      </div>

      <Tabs defaultValue="converter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="converter">
            <DollarSign className="h-4 w-4 mr-2" />
            Converter
          </TabsTrigger>
          <TabsTrigger value="historical">
            <TrendingUp className="h-4 w-4 mr-2" />
            Historical Chart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="converter" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-12 md:col-span-5">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-5 md:col-span-3">
                    <div className="space-y-2">
                      <Label htmlFor="from-currency">From</Label>
                      <Select 
                        value={fromCurrency} 
                        onValueChange={setFromCurrency}
                      >
                        <SelectTrigger id="from-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(EXCHANGE_RATES).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={swapCurrencies}
                      className="mt-7"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="col-span-5 md:col-span-3">
                    <div className="space-y-2">
                      <Label htmlFor="to-currency">To</Label>
                      <Select 
                        value={toCurrency} 
                        onValueChange={setToCurrency}
                      >
                        <SelectTrigger id="to-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(EXCHANGE_RATES).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={convertCurrency} className="px-8">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Convert
                  </Button>
                </div>

                {convertedAmount !== null && (
                  <div className="mt-4 p-6 bg-muted/50 rounded-lg">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-medium">Conversion Result</h3>
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <span>{formatCurrencyWithSymbol(parseFloat(amount), fromCurrency)}</span>
                        <span>=</span>
                        <span className="text-primary">{formatCurrencyWithSymbol(convertedAmount, toCurrency)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        1 {fromCurrency} = {(EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency]).toFixed(4)} {toCurrency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <History className="inline h-3 w-3 mr-1" />
                        Last updated: {lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historical" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                  <h3 className="text-lg font-medium">
                    {fromCurrency} to {toCurrency} - Last 30 Days
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Select 
                        value={fromCurrency} 
                        onValueChange={setFromCurrency}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(EXCHANGE_RATES).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      
                      <Select 
                        value={toCurrency} 
                        onValueChange={setToCurrency}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(EXCHANGE_RATES).map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {historicalData.length > 0 && (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historicalData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          minTickGap={40}
                        />
                        <YAxis 
                          domain={['auto', 'auto']}
                          tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip 
                          formatter={(value) => [
                            `${value.toFixed(4)}`, 
                            `${fromCurrency}/${toCurrency}`
                          ]}
                          labelFormatter={formatDate}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#6366f1" 
                          activeDot={{ r: 8 }} 
                          name={`${fromCurrency}/${toCurrency}`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    <strong>Note:</strong> Current exchange rate: 1 {fromCurrency} = {(EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency]).toFixed(4)} {toCurrency}
                  </p>
                  <p className="text-xs mt-1">
                    For demonstration purposes only. Rates may not reflect actual market values.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}