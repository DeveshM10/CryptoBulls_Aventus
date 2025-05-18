"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Calculator, BarChart, Info, Check, BadgeIndianRupee } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TaxCalculator() {
  const { toast } = useToast();
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [income, setIncome] = useState<string>("");
  const [deductions, setDeductions] = useState<{
    section80C: string;
    section80D: string;
    hra: string;
    standardDeduction: string;
    others: string;
  }>({
    section80C: "0",
    section80D: "0",
    hra: "0",
    standardDeduction: "50000", // Default standard deduction
    others: "0",
  });
  
  const [taxResult, setTaxResult] = useState<{
    taxableIncome: number;
    taxLiability: number;
    cessAmount: number;
    totalTax: number;
    effectiveTaxRate: number;
    taxSlabs: { start: number; end: number; rate: number; tax: number }[];
  } | null>(null);

  // New Regime Tax Slabs (FY 2024-25)
  const newRegimeSlabs = [
    { start: 0, end: 300000, rate: 0 },
    { start: 300001, end: 600000, rate: 5 },
    { start: 600001, end: 900000, rate: 10 },
    { start: 900001, end: 1200000, rate: 15 },
    { start: 1200001, end: 1500000, rate: 20 },
    { start: 1500001, end: Infinity, rate: 30 },
  ];

  // Old Regime Tax Slabs (FY 2024-25)
  const oldRegimeSlabs = [
    { start: 0, end: 250000, rate: 0 },
    { start: 250001, end: 500000, rate: 5 },
    { start: 500001, end: 1000000, rate: 20 },
    { start: 1000001, end: Infinity, rate: 30 },
  ];

  const calculateTax = () => {
    const grossIncome = parseFloat(income);

    if (isNaN(grossIncome)) {
      toast({
        title: "Invalid Income",
        description: "Please enter a valid income amount.",
        variant: "destructive",
      });
      return;
    }

    let taxableIncome = grossIncome;
    let applicableSlabs = newRegimeSlabs;
    
    // Apply deductions only for old regime
    if (regime === "old") {
      const totalDeductions = Object.values(deductions).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      );
      
      taxableIncome = Math.max(0, grossIncome - totalDeductions);
      applicableSlabs = oldRegimeSlabs;
    }

    // Calculate tax based on slabs
    const taxSlabsWithTax = applicableSlabs.map(slab => {
      if (taxableIncome <= slab.start) {
        return { ...slab, tax: 0 };
      }
      
      const taxableInSlab = Math.min(
        taxableIncome - slab.start,
        (slab.end - slab.start) || Infinity
      );
      
      const taxInSlab = Math.max(0, taxableInSlab * (slab.rate / 100));
      return { ...slab, tax: taxInSlab };
    });

    const taxLiability = taxSlabsWithTax.reduce((sum, slab) => sum + slab.tax, 0);
    const cessAmount = taxLiability * 0.04; // 4% Health and Education Cess
    const totalTax = taxLiability + cessAmount;
    const effectiveTaxRate = (totalTax / grossIncome) * 100;

    setTaxResult({
      taxableIncome,
      taxLiability,
      cessAmount,
      totalTax,
      effectiveTaxRate,
      taxSlabs: taxSlabsWithTax,
    });

    toast({
      title: "Tax Calculation Complete",
      description: `Your estimated tax liability is ₹${totalTax.toFixed(2)}`,
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Income Tax Calculator (FY 2024-25)</h2>
        <p className="text-muted-foreground">
          Estimate your income tax liability under both new and old tax regimes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Tax Regime Selection */}
                <div className="space-y-3">
                  <Label>Select Tax Regime</Label>
                  <RadioGroup 
                    value={regime} 
                    onValueChange={(value) => setRegime(value as "new" | "old")}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new-regime" />
                      <Label htmlFor="new-regime" className="font-normal cursor-pointer">
                        New Regime - Lower tax rates, no exemptions/deductions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="old" id="old-regime" />
                      <Label htmlFor="old-regime" className="font-normal cursor-pointer">
                        Old Regime - Higher tax rates with exemptions/deductions
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Income Input */}
                <div className="space-y-3">
                  <Label htmlFor="gross-income">Gross Annual Income (₹)</Label>
                  <Input
                    id="gross-income"
                    placeholder="e.g., 1000000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>

                {/* Deductions (Only for Old Regime) */}
                {regime === "old" && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">Deductions & Exemptions</h3>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="section-80c">Section 80C (max ₹1.5L)</Label>
                        <Input
                          id="section-80c"
                          placeholder="e.g., 150000"
                          value={deductions.section80C}
                          onChange={(e) => setDeductions({...deductions, section80C: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          PPF, ELSS, Life Insurance, etc.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="section-80d">Section 80D (Medical Insurance)</Label>
                        <Input
                          id="section-80d"
                          placeholder="e.g., 25000"
                          value={deductions.section80D}
                          onChange={(e) => setDeductions({...deductions, section80D: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          Health Insurance Premium
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hra">HRA Exemption</Label>
                        <Input
                          id="hra"
                          placeholder="e.g., 120000"
                          value={deductions.hra}
                          onChange={(e) => setDeductions({...deductions, hra: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          House Rent Allowance
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="std-deduction">Standard Deduction</Label>
                        <Input
                          id="std-deduction"
                          placeholder="50000"
                          value={deductions.standardDeduction}
                          onChange={(e) => setDeductions({...deductions, standardDeduction: e.target.value})}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Default ₹50,000 for salaried
                        </p>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="other-deductions">Other Deductions</Label>
                        <Input
                          id="other-deductions"
                          placeholder="e.g., 50000"
                          value={deductions.others}
                          onChange={(e) => setDeductions({...deductions, others: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          80E (Education Loan), 80G (Donations), etc.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <Button onClick={calculateTax} size="lg" className="px-8">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Tax
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tax Slabs Information */}
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tax-slabs">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <BadgeIndianRupee className="mr-2 h-4 w-4" />
                    Tax Slabs (FY 2024-25)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Tabs defaultValue="new-regime-slabs">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="new-regime-slabs">New Regime</TabsTrigger>
                      <TabsTrigger value="old-regime-slabs">Old Regime</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="new-regime-slabs" className="pt-4">
                      <Table>
                        <TableCaption>Income Tax Slabs for New Regime FY 2024-25</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Income Range</TableHead>
                            <TableHead>Tax Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newRegimeSlabs.map((slab, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {slab.start === 0 
                                  ? `Up to ${formatCurrency(slab.end)}`
                                  : slab.end === Infinity 
                                    ? `Above ${formatCurrency(slab.start)}`
                                    : `${formatCurrency(slab.start)} to ${formatCurrency(slab.end)}`
                                }
                              </TableCell>
                              <TableCell>{slab.rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="old-regime-slabs" className="pt-4">
                      <Table>
                        <TableCaption>Income Tax Slabs for Old Regime FY 2024-25</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Income Range</TableHead>
                            <TableHead>Tax Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {oldRegimeSlabs.map((slab, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {slab.start === 0 
                                  ? `Up to ${formatCurrency(slab.end)}`
                                  : slab.end === Infinity 
                                    ? `Above ${formatCurrency(slab.start)}`
                                    : `${formatCurrency(slab.start)} to ${formatCurrency(slab.end)}`
                                }
                              </TableCell>
                              <TableCell>{slab.rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-5">
          {taxResult && (
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Tax Summary</h3>
                    <div className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1">
                      {regime === "new" ? "New Regime" : "Old Regime"}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-muted/30">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Gross Income</p>
                          <p className="text-xl font-bold">{formatCurrency(parseFloat(income))}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Taxable Income</p>
                          <p className="text-xl font-bold">{formatCurrency(taxResult.taxableIncome)}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Tax on Income</span>
                        <span className="font-medium">{formatCurrency(taxResult.taxLiability)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Health & Education Cess (4%)</span>
                        <span className="font-medium">{formatCurrency(taxResult.cessAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-medium">Total Tax Liability</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(taxResult.totalTax)}</span>
                      </div>
                      
                      <div className="flex justify-between border-t border-dashed pt-2 mt-2">
                        <span className="text-muted-foreground">Effective Tax Rate</span>
                        <span className="font-medium">{taxResult.effectiveTaxRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    {/* Tax Slab Breakdown */}
                    {taxResult.taxSlabs.some(slab => slab.tax > 0) && (
                      <div className="mt-8">
                        <h4 className="text-sm font-medium mb-3">Tax Breakdown by Slabs</h4>
                        <div className="space-y-2">
                          {taxResult.taxSlabs
                            .filter(slab => slab.tax > 0)
                            .map((slab, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {slab.start === 0 
                                    ? `Up to ${formatCurrency(slab.end)}`
                                    : slab.end === Infinity 
                                      ? `Above ${formatCurrency(slab.start)}`
                                      : `${formatCurrency(slab.start)} to ${formatCurrency(slab.end)}`
                                  } @{slab.rate}%
                                </span>
                                <span className="font-medium">{formatCurrency(slab.tax)}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}