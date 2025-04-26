"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Calculator, PieChart, ArrowRight } from "lucide-react";
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

export function EMICalculator() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState<string>("500000");
  const [interestRate, setInterestRate] = useState<string>("10");
  const [loanTenure, setLoanTenure] = useState<string>("5");
  const [emiResult, setEmiResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Calculate EMI when any input changes
  useEffect(() => {
    if (loanAmount && interestRate && loanTenure) {
      const validInputs = 
        !isNaN(parseFloat(loanAmount)) && 
        !isNaN(parseFloat(interestRate)) && 
        !isNaN(parseFloat(loanTenure));
      
      if (validInputs) {
        calculateEmi();
      }
    }
  }, [loanAmount, interestRate, loanTenure]);

  // Handle EMI Calculation
  const calculateEmi = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / 12 / 100;
    const tenure = parseFloat(loanTenure) * 12; // Convert years to months

    if (isNaN(principal) || isNaN(ratePerMonth) || isNaN(tenure)) {
      return;
    }

    // Calculate EMI using the formula: EMI = [P × R × (1 + R)^N] / [(1 + R)^N – 1]
    const emi = 
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) / 
      (Math.pow(1 + ratePerMonth, tenure) - 1);
    
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    setEmiResult({
      emi,
      totalInterest,
      totalPayment,
    });

    setChartData([
      { name: "Principal", value: principal },
      { name: "Interest", value: totalInterest },
    ]);
  };

  // Format currency to Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ["#6366f1", "#f43f5e"];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">EMI Calculator</h2>
        <p className="text-muted-foreground">
          Calculate your Equated Monthly Installment (EMI) for loans
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Loan Amount Input */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <span className="text-sm font-medium">{formatCurrency(parseFloat(loanAmount) || 0)}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-10">
                      <Slider
                        value={[parseFloat(loanAmount) || 0]}
                        min={10000}
                        max={10000000}
                        step={10000}
                        onValueChange={(value) => setLoanAmount(value[0].toString())}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        id="loan-amount"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Interest Rate Input */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <span className="text-sm font-medium">{interestRate}%</span>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-10">
                      <Slider
                        value={[parseFloat(interestRate) || 0]}
                        min={1}
                        max={36}
                        step={0.1}
                        onValueChange={(value) => setInterestRate(value[0].toString())}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        id="interest-rate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Loan Tenure Input */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-tenure">Loan Tenure (Years)</Label>
                    <span className="text-sm font-medium">{loanTenure} years</span>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-10">
                      <Slider
                        value={[parseFloat(loanTenure) || 0]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) => setLoanTenure(value[0].toString())}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        id="loan-tenure"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button onClick={calculateEmi} size="lg" className="px-8">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate EMI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          {emiResult && (
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold mb-4">Loan Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Monthly EMI</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(emiResult.emi)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Principal Amount</span>
                      <span className="font-medium">{formatCurrency(parseFloat(loanAmount))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-medium text-rose-500">{formatCurrency(emiResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Total Payment</span>
                      <span className="font-bold">{formatCurrency(emiResult.totalPayment)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-64">
                  <h4 className="text-sm font-medium mb-2 text-center">Payment Breakdown</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {emiResult && (
        <div className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">How is EMI calculated?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                EMI = [P × R × (1 + R)^N] / [(1 + R)^N – 1], where:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>P = Principal loan amount (₹{parseFloat(loanAmount).toLocaleString()})</li>
                <li>R = Monthly interest rate ({(parseFloat(interestRate) / 12 / 100).toFixed(6)})</li>
                <li>N = Loan tenure in months ({parseFloat(loanTenure) * 12})</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}