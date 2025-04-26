"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, AlertCircle, Check, X } from "lucide-react"
import { useNotification } from "@/components/ui/notification"

export default function ToolsPage() {
  const { show } = useNotification()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Tools</h2>
        <p className="text-muted-foreground">Powerful calculators and tools to help manage your finances</p>
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
    </div>
  )
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
  ])

  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: new Date(),
    frequency: "monthly",
    reminderDays: 3,
    status: "unpaid",
  })

  const { show } = useNotification()

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount) {
      show({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "error",
      })
      return
    }

    const id = Math.max(0, ...bills.map((bill) => bill.id)) + 1
    setBills([...bills, { ...newBill, id }])
    setNewBill({
      name: "",
      amount: "",
      dueDate: new Date(),
      frequency: "monthly",
      reminderDays: 3,
      status: "unpaid",
    })

    show({
      title: "Success",
      description: "Bill reminder added successfully",
      variant: "success",
    })
  }

  const toggleBillStatus = (id: number) => {
    setBills(
      bills.map((bill) => {
        if (bill.id === id) {
          const newStatus = bill.status === "paid" ? "unpaid" : "paid"
          show({
            title: newStatus === "paid" ? "Bill Marked as Paid" : "Bill Marked as Unpaid",
            description: `${bill.name} has been marked as ${newStatus}`,
            variant: newStatus === "paid" ? "success" : "info",
          })
          return { ...bill, status: newStatus }
        }
        return bill
      }),
    )
  }

  const deleteBill = (id: number) => {
    const billToDelete = bills.find((bill) => bill.id === id)
    setBills(bills.filter((bill) => bill.id !== id))

    show({
      title: "Bill Deleted",
      description: `${billToDelete?.name} has been removed from your reminders`,
      variant: "info",
    })
  }

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
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border",
                    bill.status === "paid" ? "bg-muted/50 border-muted" : "bg-background border-border",
                  )}
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
  )
}

function CurrencyConverterTool() {
  const [amount, setAmount] = useState("10000")
  const [fromCurrency, setFromCurrency] = useState("INR")
  const [toCurrency, setToCurrency] = useState("USD")
  const [result, setResult] = useState<number | null>(null)

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82, AUD: 0.018 },
    USD: { INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 151.52, AUD: 1.52 },
    EUR: { INR: 90.43, USD: 1.09, GBP: 0.86, JPY: 164.69, AUD: 1.65 },
    GBP: { INR: 105.15, USD: 1.26, EUR: 1.16, JPY: 191.5, AUD: 1.92 },
    JPY: { INR: 0.55, USD: 0.0066, EUR: 0.0061, GBP: 0.0052, AUD: 0.01 },
    AUD: { INR: 54.76, USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 99.74 },
  }

  const handleConvert = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return

    const amountNum = Number.parseFloat(amount)
    const rate =
      exchangeRates[fromCurrency as keyof typeof exchangeRates][
        toCurrency as keyof (typeof exchangeRates)[typeof fromCurrency]
      ]
    const convertedAmount = amountNum * rate

    setResult(convertedAmount)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
  }

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m17 10-5-6-5 6" />
                  <path d="m17 14-5 6-5-6" />
                </svg>
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
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Conversion Result</p>
                <div className="text-2xl font-bold">
                  {Number.parseFloat(amount).toLocaleString()} {fromCurrency} ={" "}
                  {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Exchange Rate: 1 {fromCurrency} ={" "}
                  {exchangeRates[fromCurrency as keyof typeof exchangeRates][
                    toCurrency as keyof (typeof exchangeRates)[typeof fromCurrency]
                  ].toFixed(4)}{" "}
                  {toCurrency}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Popular Conversions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">₹10,000 INR to USD</p>
                    <p className="text-sm text-muted-foreground">Indian Rupees to US Dollars</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$120.19</p>
                    <p className="text-xs text-muted-foreground">1 INR = 0.012 USD</p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">₹10,000 INR to EUR</p>
                    <p className="text-sm text-muted-foreground">Indian Rupees to Euros</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€110.58</p>
                    <p className="text-xs text-muted-foreground">1 INR = 0.011 EUR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaxCalculatorTool() {
  const [income, setIncome] = useState("1000000")
  const [regime, setRegime] = useState("new")
  const [deductions, setDeductions] = useState("150000")
  const [taxResult, setTaxResult] = useState<{
    taxableIncome: number
    tax: number
    cess: number
    totalTax: number
    effectiveRate: number
  } | null>(null)

  const calculateTax = () => {
    const grossIncome = Number.parseFloat(income) || 0
    let taxableIncome = grossIncome
    let tax = 0

    if (regime === "old") {
      // Apply deductions in old regime
      const totalDeductions = Number.parseFloat(deductions) || 0
      taxableIncome = Math.max(0, grossIncome - totalDeductions)

      // Old regime tax calculation
      if (taxableIncome <= 250000) {
        tax = 0
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2
      } else {
        tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.3
      }
    } else {
      // New regime tax calculation
      if (taxableIncome <= 300000) {
        tax = 0
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.1
      } else if (taxableIncome <= 1200000) {
        tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15
      } else if (taxableIncome <= 1500000) {
        tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.2
      } else {
        tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.3
      }
    }

    // Calculate cess (4% of tax)
    const cess = tax * 0.04
    const totalTax = tax + cess
    const effectiveRate = (totalTax / grossIncome) * 100

    setTaxResult({
      taxableIncome,
      tax,
      cess,
      totalTax,
      effectiveRate,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Tax Calculator (FY 2024-25)</CardTitle>
        <CardDescription>
          Estimate your income tax liability based on your income and applicable deductions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tax-regime">Tax Regime</Label>
              <Select value={regime} onValueChange={setRegime}>
                <SelectTrigger id="tax-regime">
                  <SelectValue placeholder="Select tax regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Regime (No Deductions)</SelectItem>
                  <SelectItem value="old">Old Regime (With Deductions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gross-income">Gross Annual Income (₹)</Label>
              <Input
                id="gross-income"
                type="number"
                placeholder="e.g., 1000000"
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
                  placeholder="e.g., 150000"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include Section 80C (max ₹1.5L), 80D, HRA, Standard Deduction (₹50,000), etc.
                </p>
              </div>
            )}
          </div>

          <Button onClick={calculateTax} className="w-full">
            Calculate Tax
          </Button>

          {taxResult && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Tax Calculation Result</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross Income:</span>
                  <span className="font-medium">₹{Number.parseFloat(income).toLocaleString()}</span>
                </div>

                {regime === "old" && (
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span className="font-medium">₹{Number.parseFloat(deductions).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxable Income:</span>
                  <span className="font-medium">₹{taxResult.taxableIncome.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-medium">
                    ₹{taxResult.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Health & Education Cess (4%):</span>
                  <span className="font-medium">
                    ₹{taxResult.cess.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Tax Liability:</span>
                  <span>₹{taxResult.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Effective Tax Rate:</span>
                  <span>{taxResult.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Tax Slabs (FY 2024-25)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">New Regime</h4>
                <div className="text-sm space-y-1">
                  <p>₹0 - ₹3,00,000: 0%</p>
                  <p>₹3,00,001 - ₹6,00,000: 5%</p>
                  <p>₹6,00,001 - ₹9,00,000: 10%</p>
                  <p>₹9,00,001 - ₹12,00,000: 15%</p>
                  <p>₹12,00,001 - ₹15,00,000: 20%</p>
                  <p>Above ₹15,00,000: 30%</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Old Regime</h4>
                <div className="text-sm space-y-1">
                  <p>₹0 - ₹2,50,000: 0%</p>
                  <p>₹2,50,001 - ₹5,00,000: 5%</p>
                  <p>₹5,00,001 - ₹10,00,000: 20%</p>
                  <p>Above ₹10,00,000: 30%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InterestCalculatorTool() {
  const [calculatorType, setCalculatorType] = useState("simple")
  const [principal, setPrincipal] = useState("10000")
  const [rate, setRate] = useState("6")
  const [time, setTime] = useState("2")
  const [compoundingFrequency, setCompoundingFrequency] = useState("4")
  const [result, setResult] = useState<{
    interest: number
    totalAmount: number
    breakdown?: { year: number; interest: number; balance: number }[]
  } | null>(null)

  const calculateInterest = () => {
    const p = Number.parseFloat(principal) || 0
    const r = Number.parseFloat(rate) || 0
    const t = Number.parseFloat(time) || 0

    if (calculatorType === "simple") {
      // Simple Interest calculation
      const interest = (p * r * t) / 100
      const totalAmount = p + interest

      // Create yearly breakdown
      const breakdown = Array.from({ length: Math.ceil(t) }, (_, i) => {
        const year = i + 1
        const yearInterest = year <= t ? (p * r * (year <= t - 1 ? 1 : t - Math.floor(t))) / 100 : 0
        return {
          year,
          interest: yearInterest,
          balance: p + (year <= t ? (p * r * Math.min(year, t)) / 100 : interest),
        }
      })

      setResult({ interest, totalAmount, breakdown })
    } else {
      // Compound Interest calculation
      const n = Number.parseInt(compoundingFrequency) || 1
      const totalAmount = p * Math.pow(1 + r / (100 * n), n * t)
      const interest = totalAmount - p

      // Create yearly breakdown
      const breakdown = []
      let runningBalance = p

      for (let year = 1; year <= Math.ceil(t); year++) {
        const yearEnd = Math.min(year, t)
        const yearBalance = p * Math.pow(1 + r / (100 * n), n * yearEnd)
        const yearInterest = yearBalance - (year === 1 ? p : breakdown[year - 2].balance)

        breakdown.push({
          year,
          interest: yearInterest,
          balance: yearBalance,
        })

        runningBalance = yearBalance
      }

      setResult({ interest, totalAmount, breakdown })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Calculator</CardTitle>
        <CardDescription>Calculate simple and compound interest on your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="calculator-type" className="sr-only">
                Calculator Type
              </Label>
              <Select value={calculatorType} onValueChange={setCalculatorType}>
                <SelectTrigger id="calculator-type">
                  <SelectValue placeholder="Select calculator type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple Interest</SelectItem>
                  <SelectItem value="compound">Compound Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal Amount (₹)</Label>
              <Input
                id="principal"
                type="number"
                placeholder="e.g., 10000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="e.g., 6"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time Period (Years)</Label>
              <Input
                id="time"
                type="number"
                placeholder="e.g., 2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {calculatorType === "compound" && (
              <div className="space-y-2">
                <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger id="compounding-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually (1/year)</SelectItem>
                    <SelectItem value="2">Semi-annually (2/year)</SelectItem>
                    <SelectItem value="4">Quarterly (4/year)</SelectItem>
                    <SelectItem value="12">Monthly (12/year)</SelectItem>
                    <SelectItem value="365">Daily (365/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={calculateInterest} className="w-full">
            Calculate Interest
          </Button>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Calculation Result</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-medium">₹{Number.parseFloat(principal).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Interest Earned:</span>
                    <span className="font-medium">
                      ₹{result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>₹{result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {result.breakdown && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Year-by-Year Breakdown</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left">Year</th>
                          <th className="px-4 py-2 text-right">Interest</th>
                          <th className="px-4 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.breakdown.map((item) => (
                          <tr key={item.year} className="border-t">
                            <td className="px-4 py-2">{item.year}</td>
                            <td className="px-4 py-2 text-right">
                              ₹{item.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-2 text-right">
                              ₹{item.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EMICalculatorTool() {
  const [loanAmount, setLoanAmount] = useState("500000")
  const [interestRate, setInterestRate] = useState("10")
  const [loanTenure, setLoanTenure] = useState("5")
  const [result, setResult] = useState<{
    emi: number
    totalInterest: number
    totalPayment: number
    amortization: { month: number; principal: number; interest: number; balance: number }[]
  } | null>(null)

  const calculateEMI = () => {
    const p = Number.parseFloat(loanAmount) || 0
    const r = (Number.parseFloat(interestRate) || 0) / 12 / 100 // Monthly interest rate
    const n = (Number.parseFloat(loanTenure) || 0) * 12 // Total number of months

    // EMI calculation
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - p

    // Generate amortization schedule
    const amortization = []
    let balance = p

    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r
      const principalPayment = emi - interestPayment
      balance -= principalPayment

      // Only store data for months 1, 2, 3, 4, 5, 6, 12, 24, 36, 48, 60
      if ([1, 2, 3, 4, 5, 6, 12, 24, 36, 48, 60].includes(month) && month <= n) {
        amortization.push({
          month,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
        })
      }
    }

    setResult({ emi, totalInterest, totalPayment, amortization })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>Calculate your loan EMI and view amortization schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
              <Input
                id="loan-amount"
                type="number"
                placeholder="e.g., 500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
              <Input
                id="interest-rate"
                type="number"
                placeholder="e.g., 10"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-tenure">Loan Tenure (Years)</Label>
              <Input
                id="loan-tenure"
                type="number"
                placeholder="e.g., 5"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateEMI} className="w-full">
            Calculate EMI
          </Button>

          {result && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Monthly EMI</h3>
                      <p className="text-3xl font-bold text-primary">
                        ₹{result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Total Interest</h3>
                      <p className="text-3xl font-bold text-amber-500">
                        ₹{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Total Payment</h3>
                      <p className="text-3xl font-bold">
                        ₹{result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Loan Breakup</h3>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${(Number.parseFloat(loanAmount) / result.totalPayment) * 100}%` }}
                  ></div>
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span>Principal ({((Number.parseFloat(loanAmount) / result.totalPayment) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span>Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Amortization Schedule</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left">Month</th>
                        <th className="px-4 py-2 text-right">Principal (₹)</th>
                        <th className="px-4 py-2 text-right">Interest (₹)</th>
                        <th className="px-4 py-2 text-right">Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortization.map((item) => (
                        <tr key={item.month} className="border-t">
                          <td className="px-4 py-2">{item.month}</td>
                          <td className="px-4 py-2 text-right">
                            {item.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {item.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {item.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
