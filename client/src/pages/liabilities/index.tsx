import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, TrendingDown, ArrowDownRight, Filter, Download, Calendar, Mic } from "lucide-react";
import { VoiceLiabilityModal } from "@/components/voice-input/voice-liability-modal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart, Area, AreaChart } from "recharts";

// Define liability form schema
const liabilityFormSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters"),
  amount: z.string().min(1, "Amount is required"),
  type: z.string().min(1, "Type is required"),
  interest: z.string().min(1, "Interest rate is required"),
  payment: z.string().min(1, "Monthly payment is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["current", "warning", "late"]).default("current"),
});

type LiabilityFormValues = z.infer<typeof liabilityFormSchema>;

// Liability Types List
const liabilityTypes = [
  { value: "mortgage", label: "Mortgage" },
  { value: "credit_card", label: "Credit Card" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "student_loan", label: "Student Loan" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "medical_debt", label: "Medical Debt" },
  { value: "business_loan", label: "Business Loan" },
  { value: "tax_debt", label: "Tax Debt" },
  { value: "other", label: "Other" },
];

// Status options
const statusOptions = [
  { value: "current", label: "Current" },
  { value: "warning", label: "Warning" },
  { value: "late", label: "Late" },
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">₹{Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function LiabilitiesPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Set up form
  const form = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: "",
      interest: "",
      payment: "",
      dueDate: new Date().toISOString().split('T')[0],
      status: "current",
    },
  });

  // Query to fetch liabilities
  const { data: liabilities = [], isLoading } = useQuery({
    queryKey: ['/api/liabilities'],
    queryFn: async () => {
      const response = await fetch('/api/liabilities');
      if (!response.ok) {
        throw new Error('Failed to fetch liabilities');
      }
      return response.json();
    },
  });

  // Mutation to create a new liability
  const createLiabilityMutation = useMutation({
    mutationFn: async (newLiability: LiabilityFormValues) => {
      const response = await fetch('/api/liabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLiability),
      });

      if (!response.ok) {
        throw new Error('Failed to create liability');
      }

      return response.json();
    },
    onSuccess: () => {
      // Close the dialog and reset form
      setOpen(false);
      form.reset();

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/liabilities'] });

      // Show success message
      toast({
        title: "Liability Added",
        description: "Your liability has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add liability. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(data: LiabilityFormValues) {
    createLiabilityMutation.mutate(data);
  }

  // Define liability interface
  interface Liability {
    _id: string;
    userId: string;
    title: string;
    amount: string;
    type: string;
    interest: string;
    payment: string;
    dueDate: string;
    status: 'current' | 'warning' | 'late';
  }

  // Calculate totals and prepare chart data
  const totalLiabilityAmount = liabilities.reduce((sum: number, liability: Liability) => 
    sum + Number(liability.amount.replace(/[^0-9.-]+/g, '')), 0);

  // Prepare chart data for liability types distribution
  type ChartDataItem = { name: string; value: number };

  const liabilityTypeData = liabilities.reduce((acc: ChartDataItem[], liability: Liability) => {
    const existingType = acc.find(item => item.name === liability.type);
    const liabilityValue = Number(liability.amount.replace(/[^0-9.-]+/g, ''));

    if (existingType) {
      existingType.value += liabilityValue;
    } else {
      acc.push({
        name: liability.type,
        value: liabilityValue
      });
    }

    return acc;
  }, []);

  // Prepare data for future projections - simple amortization calculation
  const projectMonths = 12; // Project 12 months ahead
  const projectionData = Array.from({ length: projectMonths + 1 }, (_, i) => {
    const totalForMonth = liabilities.reduce((sum: number, liability: Liability) => {
      // Simple calculation: current amount - (payment * months)
      const payment = Number(liability.payment.replace(/[^0-9.-]+/g, ''));
      const amount = Number(liability.amount.replace(/[^0-9.-]+/g, ''));
      // Calculate remaining balance after i months
      const remainingBalance = Math.max(0, amount - (payment * i));
      return sum + remainingBalance;
    }, 0);

    return {
      month: i,
      value: totalForMonth
    };
  });

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary" href="/budget">Budget</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-x-auto py-2">
            <h1 className="text-2xl font-bold whitespace-nowrap">Liabilities</h1>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Download className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Export</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                onClick={() => {
                  toast({
                    title: "Voice Input",
                    description: "Speak clearly and say something like 'I have a home loan of 2 million rupees with 7.5% interest'",
                  });
                  
                  // Ask for microphone permission
                  navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function(stream) {
                      // Permission granted, show success and release stream
                      stream.getTracks().forEach(track => track.stop());
                      
                      // Create a simple voice recognition instance
                      try {
                        // @ts-ignore - Browser API
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'en-US';
                        recognition.interimResults = false;
                        recognition.maxAlternatives = 1;
                        
                        recognition.onresult = function(event: any) {
                          const transcript = event.results[0][0].transcript;
                          console.log('Transcript:', transcript);
                          
                          // Process the voice input
                          fetch('/api/voice-processor', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              transcript: transcript,
                              type: 'liability'
                            }),
                          })
                          .then(response => response.json())
                          .then(data => {
                            console.log('Processed data:', data);
                            
                            // Create the new liability
                            fetch('/api/liabilities', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(data),
                            })
                            .then(() => {
                              // Refresh data
                              queryClient.invalidateQueries({ queryKey: ['/api/liabilities'] });
                              
                              toast({
                                title: "Liability Added",
                                description: "Your liability has been successfully added via voice input.",
                              });
                            })
                            .catch(error => {
                              console.error('Error:', error);
                              toast({
                                title: "Error",
                                description: "Failed to add liability. Please try again.",
                                variant: "destructive",
                              });
                            });
                          })
                          .catch(error => {
                            console.error('Error:', error);
                            toast({
                              title: "Error",
                              description: "Failed to process voice input. Please try again.",
                              variant: "destructive",
                            });
                          });
                        };
                        
                        recognition.onerror = function(event: any) {
                          console.error('Error:', event.error);
                          toast({
                            title: "Error",
                            description: `Recognition error: ${event.error}`,
                            variant: "destructive",
                          });
                        };
                        
                        // Start recognition
                        recognition.start();
                        
                        toast({
                          title: "Listening...",
                          description: "Speak now to add a liability.",
                        });
                      } catch (error) {
                        console.error('Error:', error);
                        toast({
                          title: "Error",
                          description: "Speech recognition is not supported in your browser.",
                          variant: "destructive",
                        });
                      }
                    })
                    .catch(function(err) {
                      toast({
                        title: "Microphone Access Denied",
                        description: "Please allow microphone access to use voice input.",
                        variant: "destructive",
                      });
                    });
                }}
              >
                <Mic className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Voice Input</span>
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-shrink-0 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="whitespace-nowrap">Add Liability</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Liability</DialogTitle>
                    <DialogDescription>
                      Add details of your liability below. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Liability Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Mortgage, Auto Loan" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the name of your liability
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Outstanding Amount (₹)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g., 150000" {...field} />
                            </FormControl>
                            <FormDescription>
                              Current outstanding balance in INR
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Liability Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select liability type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {liabilityTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The category this liability belongs to
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interest Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g., 4.5" {...field} />
                            </FormControl>
                            <FormDescription>
                              Annual interest rate (%)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Payment (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="e.g., 1200" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Monthly payment amount
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              Next payment due date
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {statusOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Current payment status
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={createLiabilityMutation.isPending}
                        >
                          {createLiabilityMutation.isPending ? "Adding..." : "Add Liability"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{totalLiabilityAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {liabilities.length} <span className="ml-1">total liabilities</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mortgage</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{liabilities
                          .filter((liability: Liability) => liability.type.includes('mortgage'))
                          .reduce((sum: number, liability: Liability) => sum + Number(liability.amount.replace(/[^0-9.-]+/g, '')), 0)
                          .toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {liabilities.filter((liability: Liability) => liability.type.includes('mortgage')).length} <span className="ml-1">mortgage(s)</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{liabilities
                          .filter((liability: Liability) => liability.type.includes('credit_card'))
                          .reduce((sum: number, liability: Liability) => sum + Number(liability.amount.replace(/[^0-9.-]+/g, '')), 0)
                          .toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {liabilities.filter((liability: Liability) => liability.type.includes('credit_card')).length} <span className="ml-1">credit card(s)</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto & Personal Loans</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₹{liabilities
                          .filter((liability: Liability) => ['auto_loan', 'personal_loan'].some(type => liability.type.includes(type)))
                          .reduce((sum: number, liability: Liability) => sum + Number(liability.amount.replace(/[^0-9.-]+/g, '')), 0)
                          .toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {liabilities.filter((liability: Liability) => ['auto_loan', 'personal_loan'].some(type => liability.type.includes(type))).length} <span className="ml-1">loan(s)</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Liability Distribution Chart */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Liability Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : liabilityTypeData.length === 0 ? (
                <div className="h-full flex items-center justify-center border rounded-lg">
                  <p className="text-sm text-muted-foreground">No liability data available. Add a liability to see distribution.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liabilityTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {liabilityTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Liability Payoff Projection Chart */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Liability Payoff Projections</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : projectionData.length === 0 ? (
                <div className="h-full flex items-center justify-center border rounded-lg">
                  <p className="text-sm text-muted-foreground">No liability data available for projections.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      label={{ value: 'Liability Balance', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Balance"]} 
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Table of Liabilities */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Liability Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : liabilities.length === 0 ? (
                <div className="text-center py-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">No liabilities found. Add your first liability to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-2">Name</th>
                        <th className="text-left font-medium p-2">Type</th>
                        <th className="text-left font-medium p-2">Amount</th>
                        <th className="text-left font-medium p-2">Interest</th>
                        <th className="text-left font-medium p-2">Payment</th>
                        <th className="text-left font-medium p-2">Due Date</th>
                        <th className="text-left font-medium p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liabilities.map((liability: Liability) => (
                        <tr key={liability._id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{liability.title}</td>
                          <td className="p-2">
                            {liabilityTypes.find(t => t.value === liability.type)?.label || liability.type}
                          </td>
                          <td className="p-2">₹{Number(liability.amount.replace(/[^0-9.-]+/g, '')).toLocaleString()}</td>
                          <td className="p-2">{liability.interest}%</td>
                          <td className="p-2">₹{Number(liability.payment.replace(/[^0-9.-]+/g, '')).toLocaleString()}</td>
                          <td className="p-2">{new Date(liability.dueDate).toLocaleDateString()}</td>
                          <td className="p-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${liability.status === 'current' ? 'bg-green-100 text-green-800' : 
                                liability.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {liability.status === 'current' ? 'Current' : 
                                liability.status === 'warning' ? 'Warning' : 'Late'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}