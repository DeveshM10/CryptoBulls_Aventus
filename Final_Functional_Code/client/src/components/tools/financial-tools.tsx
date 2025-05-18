"use client"

import { useState } from "react"
import { 
  ClipboardList, Calculator, FileText, Wallet, 
  BarChart, CreditCard, CalendarClock, RefreshCw 
} from "lucide-react"
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Form, FormControl, FormDescription, 
  FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts"

// Schema definitions for form validation
const billReminderSchema = z.object({
  bill_name: z.string().min(2, "Bill name must be at least 2 characters"),
  amount: z.string().min(1, "Amount is required"),
  due_date: z.string().min(1, "Due date is required"),
  frequency: z.string().min(1, "Frequency is required"),
  reminder_days_before: z.string().min(1, "Reminder setting is required"),
})

const currencySchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  from: z.string().min(1, "From currency is required"),
  to: z.string().min(1, "To currency is required"),
})

const taxEstimatorSchema = z.object({
  income: z.string().min(1, "Income is required"),
  regime: z.string().min(1, "Tax regime is required"),
  deductions: z.string().optional(),
})

const interestCalculatorSchema = z.object({
  principal: z.string().min(1, "Principal amount is required"),
  rate: z.string().min(1, "Interest rate is required"),
  time: z.string().min(1, "Time period is required"),
  compounding: z.string().optional(),
  type: z.string().min(1, "Interest type is required"),
})

const emiCalculatorSchema = z.object({
  loan_amount: z.string().min(1, "Loan amount is required"),
  interest_rate: z.string().min(1, "Interest rate is required"),
  tenure: z.string().min(1, "Loan tenure is required"),
  tenure_type: z.string().min(1, "Tenure type is required"),
})

// Dummy data for currency conversion
const currencyRates = {
  "INR": {
    "USD": 0.012,
    "EUR": 0.011,
    "GBP": 0.0095,
    "AUD": 0.018,
    "CAD": 0.016
  },
  "USD": {
    "INR": 83.2,
    "EUR": 0.93,
    "GBP": 0.79,
    "AUD": 1.51,
    "CAD": 1.36
  },
  "EUR": {
    "INR": 89.9,
    "USD": 1.08,
    "GBP": 0.85,
    "AUD": 1.63,
    "CAD": 1.46
  },
  "GBP": {
    "INR": 105.7,
    "USD": 1.27,
    "EUR": 1.18,
    "AUD": 1.91,
    "CAD": 1.72
  }
}

// Dummy historical currency data
const currencyHistoricalData = [
  { date: "01/04", value: 83.2 },
  { date: "02/04", value: 83.1 },
  { date: "03/04", value: 83.3 },
  { date: "04/04", value: 83.4 },
  { date: "05/04", value: 83.2 },
  { date: "06/04", value: 83.0 },
  { date: "07/04", value: 82.9 },
  { date: "08/04", value: 82.8 },
  { date: "09/04", value: 82.7 },
  { date: "10/04", value: 82.9 },
  { date: "11/04", value: 83.0 },
  { date: "12/04", value: 83.1 },
  { date: "13/04", value: 83.2 },
  { date: "14/04", value: 83.3 },
];

// Define new regime tax slabs
const newRegimeTaxSlabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 600000, rate: 5 },
  { min: 600001, max: 900000, rate: 10 },
  { min: 900001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

// Define old regime tax slabs
const oldRegimeTaxSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

export function FinancialTools() {
  const [activeTab, setActiveTab] = useState("bill-reminders")
  const [bills, setBills] = useState<any[]>([])
  const [conversionResult, setConversionResult] = useState<number | null>(null)
  const [taxResult, setTaxResult] = useState<any | null>(null)
  const [interestResult, setInterestResult] = useState<any | null>(null)
  const [emiResult, setEmiResult] = useState<any | null>(null)
  const [showCurrencyChart, setShowCurrencyChart] = useState(false)
  
  // Bill Reminder Form
  const billForm = useForm<z.infer<typeof billReminderSchema>>({
    resolver: zodResolver(billReminderSchema),
    defaultValues: {
      bill_name: "",
      amount: "",
      due_date: "",
      frequency: "monthly",
      reminder_days_before: "3",
    },
  })
  
  // Currency Converter Form
  const currencyForm = useForm<z.infer<typeof currencySchema>>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      amount: "",
      from: "INR",
      to: "USD",
    },
  })
  
  // Tax Estimator Form
  const taxForm = useForm<z.infer<typeof taxEstimatorSchema>>({
    resolver: zodResolver(taxEstimatorSchema),
    defaultValues: {
      income: "",
      regime: "new",
      deductions: "",
    },
  })
  
  // Interest Calculator Form
  const interestForm = useForm<z.infer<typeof interestCalculatorSchema>>({
    resolver: zodResolver(interestCalculatorSchema),
    defaultValues: {
      principal: "",
      rate: "",
      time: "",
      compounding: "1",
      type: "simple",
    },
  })
  
  // EMI Calculator Form
  const emiForm = useForm<z.infer<typeof emiCalculatorSchema>>({
    resolver: zodResolver(emiCalculatorSchema),
    defaultValues: {
      loan_amount: "",
      interest_rate: "",
      tenure: "",
      tenure_type: "years",
    },
  })
  
  // Handler for bill reminder form submission
  const onBillSubmit = (values: z.infer<typeof billReminderSchema>) => {
    const newBill = {
      id: Date.now().toString(),
      bill_name: values.bill_name,
      amount: values.amount,
      due_date: values.due_date,
      frequency: values.frequency,
      reminder_days_before: values.reminder_days_before,
      status: "unpaid"
    }
    
    setBills([...bills, newBill])
    billForm.reset()
  }
  
  // Handler for currency conversion form submission
  const onCurrencySubmit = (values: z.infer<typeof currencySchema>) => {
    const { amount, from, to } = values
    const rate = currencyRates[from as keyof typeof currencyRates][to as keyof typeof currencyRates[keyof typeof currencyRates]]
    const result = parseFloat(amount) * rate
    setConversionResult(result)
    setShowCurrencyChart(true)
  }
  
  // Handler for tax estimation form submission
  const onTaxSubmit = (values: z.infer<typeof taxEstimatorSchema>) => {
    const income = parseFloat(values.income)
    const deductions = values.deductions ? parseFloat(values.deductions) : 0
    const regime = values.regime
    
    let taxableIncome = income
    if (regime === "old") {
      taxableIncome = Math.max(0, income - deductions)
    }
    
    const slabs = regime === "new" ? newRegimeTaxSlabs : oldRegimeTaxSlabs
    let tax = 0
    
    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const amountInSlab = Math.min(taxableIncome, slab.max) - slab.min
        tax += (amountInSlab * slab.rate) / 100
      }
    }
    
    // Add 4% cess
    const cess = tax * 0.04
    const totalTax = tax + cess
    
    setTaxResult({
      income,
      taxableIncome,
      tax,
      cess,
      totalTax,
      regime,
      effectiveRate: (totalTax / income) * 100
    })
  }
  
  // Handler for interest calculator form submission
  const onInterestSubmit = (values: z.infer<typeof interestCalculatorSchema>) => {
    const principal = parseFloat(values.principal)
    const rate = parseFloat(values.rate) / 100
    const time = parseFloat(values.time)
    const type = values.type
    
    if (type === "simple") {
      // Simple Interest: P * R * T
      const interest = principal * rate * time
      const total = principal + interest
      
      setInterestResult({
        type: "Simple Interest",
        principal,
        interest,
        total,
        breakdown: [{
          year: time,
          interest,
          total
        }]
      })
    } else {
      // Compound Interest: P(1 + r/n)^(nt) - P
      const n = parseInt(values.compounding || "1")
      const amount = principal * Math.pow(1 + rate/n, n * time)
      const interest = amount - principal
      
      const breakdown = []
      for (let t = 1; t <= time; t++) {
        const yearAmount = principal * Math.pow(1 + rate/n, n * t)
        const yearInterest = yearAmount - principal
        breakdown.push({
          year: t,
          interest: yearInterest,
          total: yearAmount
        })
      }
      
      setInterestResult({
        type: "Compound Interest",
        principal,
        interest,
        total: amount,
        breakdown
      })
    }
  }
  
  // Handler for EMI calculator form submission
  const onEmiSubmit = (values: z.infer<typeof emiCalculatorSchema>) => {
    const principal = parseFloat(values.loan_amount)
    const annualRate = parseFloat(values.interest_rate) / 100
    const monthlyRate = annualRate / 12
    let tenure = parseFloat(values.tenure)
    
    // Convert years to months if needed
    if (values.tenure_type === "years") {
      tenure = tenure * 12
    }
    
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
               (Math.pow(1 + monthlyRate, tenure) - 1)
    
    const totalPayment = emi * tenure
    const totalInterest = totalPayment - principal
    
    // Generate amortization schedule for first 12 months only
    const amortization = []
    let remainingPrincipal = principal
    
    for (let i = 1; i <= Math.min(tenure, 12); i++) {
      const interestForMonth = remainingPrincipal * monthlyRate
      const principalForMonth = emi - interestForMonth
      remainingPrincipal -= principalForMonth
      
      amortization.push({
        month: i,
        emi: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingPrincipal
      })
    }
    
    setEmiResult({
      emi,
      totalPayment,
      totalInterest,
      tenure,
      interestRate: annualRate * 100,
      amortization
    })
  }
  
  // Function to toggle bill status
  const toggleBillStatus = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: bill.status === "paid" ? "unpaid" : "paid" } 
        : bill
    ))
  }
  
  // Function to delete a bill
  const deleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Financial Tools</h2>
      
      <Tabs defaultValue="bill-reminders" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="bill-reminders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Bill Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Currency Converter</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Tax Estimator</span>
          </TabsTrigger>
          <TabsTrigger value="interest" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Interest Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="emi" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">EMI Calculator</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Bill Reminders Tab */}
        <TabsContent value="bill-reminders">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Bill Reminder</CardTitle>
                <CardDescription>Set up reminders for recurring bill payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...billForm}>
                  <form onSubmit={billForm.handleSubmit(onBillSubmit)} className="space-y-4">
                    <FormField
                      control={billForm.control}
                      name="bill_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bill Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Electricity Bill" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={billForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="2000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={billForm.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={billForm.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="one-time">One-time</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={billForm.control}
                      name="reminder_days_before"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder (days before)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select days" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="2">2 days</SelectItem>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="5">5 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">Add Bill Reminder</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Bill Reminders</CardTitle>
                <CardDescription>Manage your upcoming bills and payments</CardDescription>
              </CardHeader>
              <CardContent>
                {bills.length === 0 ? (
                  <div className="text-center p-6">
                    <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">No bills added yet</p>
                    <p className="text-sm text-muted-foreground">Add a bill to track it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.map(bill => (
                      <div key={bill.id} className="flex flex-col p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{bill.bill_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₹{bill.amount} · {bill.frequency}
                            </p>
                          </div>
                          <Badge variant={bill.status === "paid" ? "outline" : "destructive"}>
                            {bill.status === "paid" ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <p>Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                          <p>Reminder: {bill.reminder_days_before} days before</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleBillStatus(bill.id)}
                          >
                            {bill.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteBill(bill.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Currency Converter Tab */}
        <TabsContent value="currency">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Currency Converter</CardTitle>
                <CardDescription>Convert between different currencies</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...currencyForm}>
                  <form onSubmit={currencyForm.handleSubmit(onCurrencySubmit)} className="space-y-4">
                    <FormField
                      control={currencyForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="10000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={currencyForm.control}
                        name="from"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                <SelectItem value="USD">US Dollar ($)</SelectItem>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="GBP">British Pound (£)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={currencyForm.control}
                        name="to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">US Dollar ($)</SelectItem>
                                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="GBP">British Pound (£)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Convert</Button>
                  </form>
                </Form>
                
                {conversionResult !== null && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Conversion Result</h3>
                    <div className="text-2xl font-bold">
                      {currencyForm.getValues("amount")} {currencyForm.getValues("from")} = 
                      {' '}
                      {conversionResult.toFixed(2)} {currencyForm.getValues("to")}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      1 {currencyForm.getValues("from")} = 
                      {' '}
                      {currencyRates[currencyForm.getValues("from") as keyof typeof currencyRates][currencyForm.getValues("to") as keyof typeof currencyRates[keyof typeof currencyRates]]} {currencyForm.getValues("to")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Currency Trends</CardTitle>
                <CardDescription>30-day historical exchange rate data</CardDescription>
              </CardHeader>
              <CardContent>
                {showCurrencyChart ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={currencyHistoricalData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          name={`${currencyForm.getValues("from")}/${currencyForm.getValues("to")} Rate`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <RefreshCw className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No currency selected</p>
                    <p className="text-sm text-muted-foreground">Convert a currency to see historical trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tax Estimator Tab */}
        <TabsContent value="tax">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Tax Estimator (India FY 2024-25)</CardTitle>
                <CardDescription>Estimate your tax liability based on income and deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...taxForm}>
                  <form onSubmit={taxForm.handleSubmit(onTaxSubmit)} className="space-y-4">
                    <FormField
                      control={taxForm.control}
                      name="income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="1000000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={taxForm.control}
                      name="regime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Regime</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax regime" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">New Regime (No Deductions)</SelectItem>
                              <SelectItem value="old">Old Regime (With Deductions)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {field.value === "new" 
                              ? "New regime has lower tax rates but no deductions" 
                              : "Old regime allows for deductions but with higher tax rates"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {taxForm.watch("regime") === "old" && (
                      <FormField
                        control={taxForm.control}
                        name="deductions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Deductions (₹)</FormLabel>
                            <FormControl>
                              <Input placeholder="150000" type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Include all eligible deductions like 80C, 80D, HRA, LTA, Standard deduction
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button type="submit" className="w-full">Calculate Tax</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Estimation Results</CardTitle>
                <CardDescription>Breakdown of your tax liability</CardDescription>
              </CardHeader>
              <CardContent>
                {taxResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Gross Income:</span>
                        <span className="font-semibold">₹{taxResult.income.toLocaleString('en-IN')}</span>
                      </div>
                      
                      {taxResult.regime === "old" && (
                        <div className="flex justify-between mb-2">
                          <span>Deductions:</span>
                          <span className="font-semibold">₹{(taxResult.income - taxResult.taxableIncome).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between mb-2">
                        <span>Taxable Income:</span>
                        <span className="font-semibold">₹{taxResult.taxableIncome.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span>Base Tax:</span>
                        <span className="font-semibold">₹{taxResult.tax.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span>Health & Education Cess (4%):</span>
                        <span className="font-semibold">₹{taxResult.cess.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Tax Liability:</span>
                          <span>₹{taxResult.totalTax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Effective Tax Rate:</span>
                          <span>{taxResult.effectiveRate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="tax-slabs">
                        <AccordionTrigger>View Tax Slab Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <h4 className="font-medium">{taxResult.regime === "new" ? "New Regime" : "Old Regime"} Tax Slabs</h4>
                            <div className="border rounded-lg divide-y">
                              {(taxResult.regime === "new" ? newRegimeTaxSlabs : oldRegimeTaxSlabs).map((slab, index) => (
                                <div 
                                  key={index}
                                  className={`p-2 flex justify-between ${
                                    taxResult.taxableIncome > slab.min && taxResult.taxableIncome <= slab.max 
                                      ? "bg-muted font-medium" 
                                      : ""
                                  }`}
                                >
                                  <span>
                                    {slab.min.toLocaleString('en-IN')} - {slab.max === Infinity ? "Above" : slab.max.toLocaleString('en-IN')}
                                  </span>
                                  <span>{slab.rate}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No tax calculation yet</p>
                    <p className="text-sm text-muted-foreground">Enter your income details to calculate tax liability</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Interest Calculator Tab */}
        <TabsContent value="interest">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interest Calculator</CardTitle>
                <CardDescription>Calculate simple and compound interest on investments</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...interestForm}>
                  <form onSubmit={interestForm.handleSubmit(onInterestSubmit)} className="space-y-4">
                    <FormField
                      control={interestForm.control}
                      name="principal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="10000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={interestForm.control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Interest Rate (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="6" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={interestForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Period (Years)</FormLabel>
                          <FormControl>
                            <Input placeholder="2" type="number" step="0.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={interestForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select interest type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="simple">Simple Interest</SelectItem>
                              <SelectItem value="compound">Compound Interest</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {interestForm.watch("type") === "compound" && (
                      <FormField
                        control={interestForm.control}
                        name="compounding"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compounding Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Annually (1x)</SelectItem>
                                <SelectItem value="2">Semi-annually (2x)</SelectItem>
                                <SelectItem value="4">Quarterly (4x)</SelectItem>
                                <SelectItem value="12">Monthly (12x)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button type="submit" className="w-full">Calculate Interest</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interest Calculation Results</CardTitle>
                <CardDescription>Breakdown of your investment growth</CardDescription>
              </CardHeader>
              <CardContent>
                {interestResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">{interestResult.type} Calculation</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Principal Amount:</span>
                          <span className="font-semibold">₹{interestResult.principal.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Interest Earned:</span>
                          <span className="font-semibold text-green-600">₹{interestResult.interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                          <span>Maturity Amount:</span>
                          <span>₹{interestResult.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="yearly-breakdown">
                        <AccordionTrigger>View Year-wise Breakdown</AccordionTrigger>
                        <AccordionContent>
                          <div className="border rounded-lg divide-y">
                            <div className="grid grid-cols-3 p-2 font-medium bg-muted">
                              <span>Year</span>
                              <span>Interest</span>
                              <span>Total Value</span>
                            </div>
                            {interestResult.breakdown.map((entry, index) => (
                              <div key={index} className="grid grid-cols-3 p-2">
                                <span>{entry.year}</span>
                                <span>₹{entry.interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                <span>₹{entry.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <BarChart className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No interest calculation yet</p>
                    <p className="text-sm text-muted-foreground">Enter investment details to calculate interest</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* EMI Calculator Tab */}
        <TabsContent value="emi">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>EMI Calculator</CardTitle>
                <CardDescription>Calculate loan EMI and total repayment</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emiForm}>
                  <form onSubmit={emiForm.handleSubmit(onEmiSubmit)} className="space-y-4">
                    <FormField
                      control={emiForm.control}
                      name="loan_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="500000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emiForm.control}
                      name="interest_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate (% per annum)</FormLabel>
                          <FormControl>
                            <Input placeholder="10" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={emiForm.control}
                        name="tenure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Tenure</FormLabel>
                            <FormControl>
                              <Input placeholder="5" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emiForm.control}
                        name="tenure_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tenure Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="years">Years</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Calculate EMI</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>EMI Calculation Results</CardTitle>
                <CardDescription>Breakdown of your loan repayment plan</CardDescription>
              </CardHeader>
              <CardContent>
                {emiResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold">Monthly EMI</h3>
                        <div className="text-3xl font-bold">₹{emiResult.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded p-2 text-center">
                          <p className="text-sm text-muted-foreground">Principal</p>
                          <p className="font-semibold">₹{parseFloat(emiForm.getValues("loan_amount")).toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="border rounded p-2 text-center">
                          <p className="text-sm text-muted-foreground">Interest</p>
                          <p className="font-semibold text-amber-600">₹{emiResult.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        
                        <div className="border rounded p-2 text-center">
                          <p className="text-sm text-muted-foreground">Total Payment</p>
                          <p className="font-semibold">₹{emiResult.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        
                        <div className="border rounded p-2 text-center">
                          <p className="text-sm text-muted-foreground">Tenor</p>
                          <p className="font-semibold">{emiResult.tenure} {emiResult.tenure === 1 ? 'Month' : 'Months'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="amortization">
                        <AccordionTrigger>View Amortization Schedule</AccordionTrigger>
                        <AccordionContent>
                          <div className="border rounded-lg divide-y text-sm">
                            <div className="grid grid-cols-5 p-2 font-medium bg-muted">
                              <span>Month</span>
                              <span>EMI</span>
                              <span>Principal</span>
                              <span>Interest</span>
                              <span>Balance</span>
                            </div>
                            {emiResult.amortization.map((entry, index) => (
                              <div key={index} className="grid grid-cols-5 p-2">
                                <span>{entry.month}</span>
                                <span>₹{entry.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                <span>₹{entry.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                <span>₹{entry.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                <span>₹{entry.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                              </div>
                            ))}
                            {emiResult.tenure > 12 && (
                              <div className="p-2 text-center text-muted-foreground">
                                Showing first 12 months only. Total tenure: {emiResult.tenure} months.
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No EMI calculation yet</p>
                    <p className="text-sm text-muted-foreground">Enter loan details to calculate monthly EMI</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}