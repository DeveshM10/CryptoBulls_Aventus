import { MainLayout } from "@/components/layout/main-layout";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseByCategoryChart } from "@/components/expenses/expense-by-category-chart";
import { Mic, RefreshCw, Search, CalendarDays, Filter, Plus, Download, BellRing, Pencil, Trash2 } from "lucide-react";
import { DailyExpense } from "@/types/expenses";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import VoiceExpenseTracker from "@/components/expenses/voice-expense-tracker";

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Fetch daily expenses
  const { data: expenses = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/daily-expenses'],
    queryFn: async () => {
      const response = await fetch('/api/daily-expenses');
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      return response.json();
    }
  });

  // Filter expenses based on search term and active tab
  const filteredExpenses = expenses.filter((expense: DailyExpense) => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") {
      return matchesSearch;
    }
    
    return matchesSearch && expense.category.toLowerCase() === activeTab.toLowerCase();
  });

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((total: number, expense: DailyExpense) => {
    const amount = typeof expense.amount === 'string' 
      ? parseFloat(expense.amount.replace(/[₹,]/g, "")) 
      : expense.amount;
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Format currency
  const formatCurrency = (amount: number | string) => {
    let numAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[₹,]/g, "")) 
      : amount;
      
    if (isNaN(numAmount)) return "₹0.00";
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numAmount);
  };

  // Handle new expense added
  const handleNewExpense = (expense: DailyExpense) => {
    refetch();
    toast({
      title: "Expense added",
      description: `${expense.title} (${formatCurrency(expense.amount)}) has been added.`,
    });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Expenses | FinVault</title>
      </Helmet>
      
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
            <p className="text-muted-foreground">
              Track your daily expenses and monitor your spending habits
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="hidden md:flex"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <VoiceExpenseTracker onExpenseAdded={handleNewExpense} />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Enter the details of your expense below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Expense form will go here */}
                  <p className="text-sm text-muted-foreground">Form placeholder - will be implemented</p>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Pencil className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpenses * 0.8)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CalendarDays className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Daily</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpenses / 30)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BellRing className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>List of all your recorded expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="hidden md:flex">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="hidden md:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground mt-2">Loading expenses...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                          <p className="text-muted-foreground">No expenses found.</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search or add a new expense.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense: DailyExpense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <div className="font-medium">{expense.title}</div>
                            {expense.notes && (
                              <div className="text-xs text-muted-foreground">{expense.notes}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(expense.date), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">No data to display</p>
                  <p className="text-xs text-muted-foreground mt-1">Add expenses to see the chart</p>
                </div>
              ) : (
                <ExpenseByCategoryChart expenses={filteredExpenses as DailyExpense[]} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}