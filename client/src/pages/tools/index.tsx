import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle, Check, X, Calculator, CreditCard, Clock, ArrowRight, SwitchCamera } from "lucide-react";

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Financial Tools</h1>
              <p className="text-muted-foreground">Powerful calculators and tools to help manage your finances</p>
            </div>
          </div>

          <Tabs defaultValue="bill-reminder" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="bill-reminder">Bill Reminder</TabsTrigger>
              <TabsTrigger value="currency-converter">Currency Converter</TabsTrigger>
              <TabsTrigger value="tax-calculator">Tax Calculator</TabsTrigger>
              <TabsTrigger value="interest-calculator">Interest Calculator</TabsTrigger>
              <TabsTrigger value="emi-calculator">EMI Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="bill-reminder">
              <BillReminderTool />
            </TabsContent>

            <TabsContent value="currency-converter">
              <CurrencyConverterTool />
            </TabsContent>

            <TabsContent value="tax-calculator">
              <TaxCalculatorTool />
            </TabsContent>

            <TabsContent value="interest-calculator">
              <InterestCalculatorTool />
            </TabsContent>

            <TabsContent value="emi-calculator">
              <EMICalculatorTool />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function BillReminderTool() {
  const [bills, setBills] = useState([
    {
      id: 1,
      name: "Electricity Bill",
      amount: 2200,
      dueDate: new Date(2025, 3, 25),
      frequency: "monthly",
      reminderDays: 3,
      status: "unpaid",
    },
    {
      id: 2,
      name: "Mobile Bill",
      amount: 999,
      dueDate: new Date(2025, 3, 15),
      frequency: "monthly",
      reminderDays: 2,
      status: "paid",
    },
    {
      id: 3,
      name: "Home Loan EMI",
      amount: 24500,
      dueDate: new Date(2025, 3, 5),
      frequency: "monthly",
      reminderDays: 5,
      status: "unpaid",
    },
  ]);

  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: new Date(),
    frequency: "monthly",
    reminderDays: 3,
    status: "unpaid",
  });

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount) {
      return;
    }

    const id = Math.max(0, ...bills.map((bill) => bill.id)) + 1;
    setBills([...bills, { ...newBill, id, amount: Number(newBill.amount) }]);
    setNewBill({
      name: "",
      amount: "",
      dueDate: new Date(),
      frequency: "monthly",
      reminderDays: 3,
      status: "unpaid",
    });
  };

  const toggleBillStatus = (id) => {
    setBills(
      bills.map((bill) => {
        if (bill.id === id) {
          const newStatus = bill.status === "paid" ? "unpaid" : "paid";
          return { ...bill, status: newStatus };
        }
        return bill;
      }),
    );
  };

  const deleteBill = (id) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Bill Reminder</CardTitle>
          <CardDescription>Set up reminders for your recurring bills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Bill Name</Label>
            <Input
              id="bill-name"
              placeholder="e.g., Electricity Bill"
              value={newBill.name}
              onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bill-amount">Amount (₹)</Label>
            <Input
              id="bill-amount"
              type="number"
              placeholder="e.g., 2000"
              value={newBill.amount}
              onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newBill.dueDate ? format(newBill.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newBill.dueDate}
                  onSelect={(date) => setNewBill({ ...newBill, dueDate: date || new Date() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bill-frequency">Frequency</Label>
            <Select value={newBill.frequency} onValueChange={(value) => setNewBill({ ...newBill, frequency: value })}>
              <SelectTrigger id="bill-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-days">Remind me</Label>
            <Select
              value={newBill.reminderDays.toString()}
              onValueChange={(value) => setNewBill({ ...newBill, reminderDays: Number.parseInt(value) })}
            >
              <SelectTrigger id="reminder-days">
                <SelectValue placeholder="Select days before" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="2">2 days before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="5">5 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddBill} className="w-full">
            Add Bill Reminder
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>Track and manage your bill payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bills.length > 0 ? (
              bills.map((bill) => (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    bill.status === "paid" ? "bg-muted/50 border-muted" : "bg-background border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bill.name}</span>
                      <Badge
                        variant={bill.status === "paid" ? "outline" : "default"}
                        className={
                          bill.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600"
                            : ""
                        }
                      >
                        {bill.status === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{bill.amount.toLocaleString()} • Due: {format(bill.dueDate, "d MMM yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1)} • Reminder: {bill.reminderDays}{" "}
                      days before
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleBillStatus(bill.id)}
                      title={bill.status === "paid" ? "Mark as unpaid" : "Mark as paid"}
                    >
                      {bill.status === "paid" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteBill(bill.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete bill"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No bills yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your first bill reminder to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CurrencyConverterTool() {
  const [amount, setAmount] = useState("10000");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);

  // Exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82, AUD: 0.018 },
    USD: { INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 151.52, AUD: 1.52 },
    EUR: { INR: 90.43, USD: 1.09, GBP: 0.86, JPY: 164.69, AUD: 1.65 },
    GBP: { INR: 105.15, USD: 1.26, EUR: 1.16, JPY: 191.5, AUD: 1.92 },
    JPY: { INR: 0.55, USD: 0.0066, EUR: 0.0061, GBP: 0.0052, AUD: 0.01 },
    AUD: { INR: 54.76, USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 99.74 },
  };

  const handleConvert = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return;

    const amountNum = Number.parseFloat(amount);
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amountNum * rate;

    setResult(convertedAmount);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between different currencies using live exchange rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-currency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" onClick={handleSwapCurrencies}>
                <SwitchCamera className="h-4 w-4" />
                <span className="sr-only">Swap currencies</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-currency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Button onClick={handleConvert} className="w-full">
                Convert
              </Button>
            </div>
          </div>

          {result !== null && (
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">Conversion Result</div>
                <div className="text-2xl font-bold mb-2">
                  {currencySymbols[fromCurrency]}{Number(amount).toLocaleString()} = {currencySymbols[toCurrency]}{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">
                  Exchange Rate: 1 {fromCurrency} = {exchangeRates[fromCurrency][toCurrency]} {toCurrency}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TaxCalculatorTool() {
  const [income, setIncome] = useState("1000000");
  const [regime, setRegime] = useState("new");
  const [deductions, setDeductions] = useState("200000");
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [taxLiability, setTaxLiability] = useState(null);

  const calculateTax = () => {
    // Parse inputs
    const incomeNum = Number.parseFloat(income) || 0;
    const deductionsNum = Number.parseFloat(deductions) || 0;

    // Calculate taxable income based on regime
    let taxable = 0;
    if (regime === "old") {
      taxable = Math.max(0, incomeNum - deductionsNum);
    } else {
      taxable = incomeNum; // New regime has no deductions
    }
    
    setTaxableIncome(taxable);

    // Calculate tax based on regime and slabs
    let tax = 0;
    if (regime === "new") {
      // New Regime Tax Slabs (FY 2024-25)
      if (taxable > 1500000) {
        tax += (taxable - 1500000) * 0.3;
        taxable = 1500000;
      }
      if (taxable > 1200000) {
        tax += (taxable - 1200000) * 0.2;
        taxable = 1200000;
      }
      if (taxable > 900000) {
        tax += (taxable - 900000) * 0.15;
        taxable = 900000;
      }
      if (taxable > 600000) {
        tax += (taxable - 600000) * 0.1;
        taxable = 600000;
      }
      if (taxable > 300000) {
        tax += (taxable - 300000) * 0.05;
      }
    } else {
      // Old Regime Slabs (Basic)
      if (taxable > 1000000) {
        tax += (taxable - 1000000) * 0.3;
        taxable = 1000000;
      }
      if (taxable > 500000) {
        tax += (taxable - 500000) * 0.2;
        taxable = 500000;
      }
      if (taxable > 250000) {
        tax += (taxable - 250000) * 0.05;
      }
    }

    // Add 4% Health & Education Cess
    tax = tax + (tax * 0.04);
    
    setTaxLiability(tax);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Estimator (India FY 2024-25)</CardTitle>
        <CardDescription>Estimate your income tax liability based on your income and chosen tax regime</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tax-regime">Choose Tax Regime</Label>
              <Select value={regime} onValueChange={setRegime}>
                <SelectTrigger id="tax-regime">
                  <SelectValue placeholder="Select regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Regime (Lower Rates, No Deductions)</SelectItem>
                  <SelectItem value="old">Old Regime (Higher Rates, With Deductions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-income">Annual Income (₹)</Label>
              <Input
                id="annual-income"
                type="number"
                placeholder="Enter annual income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            {regime === "old" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deductions">Total Deductions (₹)</Label>
                <Input
                  id="deductions"
                  type="number"
                  placeholder="Enter total deductions (80C, 80D, etc.)"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include Section 80C (max ₹1.5L), 80D (Health Insurance), HRA, Standard Deduction (₹50,000), etc.
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <Button onClick={calculateTax} className="w-full">
                Calculate Tax
              </Button>
            </div>
          </div>

          {taxLiability !== null && (
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gross Annual Income</div>
                  <div className="text-xl font-medium">₹{Number(income).toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Taxable Income</div>
                  <div className="text-xl font-medium">₹{taxableIncome.toLocaleString()}</div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Tax Liability</div>
                  <div className="text-2xl font-bold text-primary">₹{taxLiability.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes 4% Health and Education Cess
                  </p>
                </div>
                
                <div className="md:col-span-2 border-t pt-4 mt-2">
                  <div className="text-sm font-medium mb-2">Tax Regime: {regime === "new" ? "New Regime" : "Old Regime"}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {regime === "new" ? (
                      <>
                        <div>• Income upto ₹3,00,000: 0% tax</div>
                        <div>• ₹3,00,001 to ₹6,00,000: 5% tax</div>
                        <div>• ₹6,00,001 to ₹9,00,000: 10% tax</div>
                        <div>• ₹9,00,001 to ₹12,00,000: 15% tax</div>
                        <div>• ₹12,00,001 to ₹15,00,000: 20% tax</div>
                        <div>• Above ₹15,00,000: 30% tax</div>
                      </>
                    ) : (
                      <>
                        <div>• Income upto ₹2,50,000: 0% tax</div>
                        <div>• ₹2,50,001 to ₹5,00,000: 5% tax</div>
                        <div>• ₹5,00,001 to ₹10,00,000: 20% tax</div>
                        <div>• Above ₹10,00,000: 30% tax</div>
                        <div>• Various deductions available under Section 80C, 80D, etc.</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InterestCalculatorTool() {
  const [calculationType, setCalculationType] = useState("simple");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("6");
  const [time, setTime] = useState("2");
  const [compoundingFrequency, setCompoundingFrequency] = useState("4"); // quarterly by default
  const [result, setResult] = useState(null);

  const calculateInterest = () => {
    const principalNum = Number.parseFloat(principal) || 0;
    const rateNum = Number.parseFloat(rate) || 0;
    const timeNum = Number.parseFloat(time) || 0;
    
    let interestAmount = 0;
    let totalAmount = 0;
    
    if (calculationType === "simple") {
      // Simple Interest: SI = (P × R × T) / 100
      interestAmount = (principalNum * rateNum * timeNum) / 100;
      totalAmount = principalNum + interestAmount;
    } else {
      // Compound Interest: A = P × (1 + R/n)^(n×T)
      const frequencyNum = Number.parseInt(compoundingFrequency);
      const r = rateNum / 100; // Convert percentage to decimal
      totalAmount = principalNum * Math.pow(1 + r / frequencyNum, frequencyNum * timeNum);
      interestAmount = totalAmount - principalNum;
    }
    
    setResult({
      interest: interestAmount,
      total: totalAmount
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Calculator</CardTitle>
        <CardDescription>Calculate simple or compound interest on your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="calculation-type">Interest Type</Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger id="calculation-type">
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple Interest</SelectItem>
                  <SelectItem value="compound">Compound Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="Enter principal amount"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter interest rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period (Years)</Label>
                <Input
                  id="time-period"
                  type="number"
                  step="0.01"
                  placeholder="Enter time period"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            {calculationType === "compound" && (
              <div className="space-y-2">
                <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger id="compounding-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually (1 time per year)</SelectItem>
                    <SelectItem value="2">Semi-annually (2 times per year)</SelectItem>
                    <SelectItem value="4">Quarterly (4 times per year)</SelectItem>
                    <SelectItem value="12">Monthly (12 times per year)</SelectItem>
                    <SelectItem value="365">Daily (365 times per year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={calculateInterest} className="w-full">
              Calculate Interest
            </Button>
          </div>

          {result && (
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Principal Amount</div>
                  <div className="text-xl font-medium">₹{Number(principal).toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Interest Earned</div>
                  <div className="text-xl font-medium">₹{result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="text-xl font-bold text-primary">₹{result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                
                <div className="md:col-span-3 border-t pt-4 mt-2">
                  <div className="text-sm font-medium mb-2">
                    {calculationType === "simple" ? "Simple Interest Details" : "Compound Interest Details"}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {calculationType === "simple" ? (
                      <div className="flex items-center">
                        <span className="font-medium">Formula:</span>
                        <code className="ml-2 bg-muted p-1 rounded">SI = (P × R × T) / 100</code>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <span className="font-medium">Formula:</span>
                          <code className="ml-2 bg-muted p-1 rounded">A = P × (1 + R/n)^(n×T)</code>
                        </div>
                        <div>Compounding: {compoundingFrequency === "1" ? "Annually" : 
                                          compoundingFrequency === "2" ? "Semi-annually" : 
                                          compoundingFrequency === "4" ? "Quarterly" : 
                                          compoundingFrequency === "12" ? "Monthly" : "Daily"}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EMICalculatorTool() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("10");
  const [loanTenure, setLoanTenure] = useState("5");
  const [tenureType, setTenureType] = useState("years");
  const [result, setResult] = useState(null);

  const calculateEMI = () => {
    const principal = Number.parseFloat(loanAmount) || 0;
    const ratePerYear = Number.parseFloat(interestRate) || 0;
    const ratePerMonth = ratePerYear / 12 / 100; // Convert annual rate to monthly decimal
    
    // Calculate tenure in months
    let tenureMonths = Number.parseInt(loanTenure) || 0;
    if (tenureType === "years") {
      tenureMonths = tenureMonths * 12;
    }
    
    // EMI formula: [P × R × (1 + R)^N] / [(1 + R)^N – 1]
    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) / 
                (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
    
    const totalAmount = emi * tenureMonths;
    const totalInterest = totalAmount - principal;
    
    setResult({
      emi: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      tenureMonths: tenureMonths
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>Calculate equated monthly installment (EMI) for your loans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
              <Input
                id="loan-amount"
                type="number"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (% per annum)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="Enter interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-tenure">Loan Tenure</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="loan-tenure"
                  type="number"
                  placeholder="Enter tenure"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                />
                <Select value={tenureType} onValueChange={setTenureType}>
                  <SelectTrigger id="tenure-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={calculateEMI} className="w-full">
                Calculate EMI
              </Button>
            </div>
          </div>

          {result && (
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="grid gap-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Monthly EMI</div>
                  <div className="text-3xl font-bold text-primary">
                    ₹{result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Principal Amount</div>
                    <div className="text-lg font-medium">₹{Number(loanAmount).toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Interest</div>
                    <div className="text-lg font-medium">₹{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Payment</div>
                    <div className="text-lg font-medium">₹{result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Loan Details</div>
                  <div className="grid gap-2 text-sm md:grid-cols-3">
                    <div>
                      <span className="text-muted-foreground">Loan amount:</span> ₹{Number(loanAmount).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interest rate:</span> {interestRate}% per annum
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tenure:</span> {result.tenureMonths} months ({Math.floor(result.tenureMonths / 12)} years, {result.tenureMonths % 12} months)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}