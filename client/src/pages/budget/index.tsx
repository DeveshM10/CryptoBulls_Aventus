import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Plus, PieChart, ArrowUpRight, ArrowDownRight, RefreshCw, IndianRupee, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AddExpenseForm, Expense } from "@/components/budget/add-expense-form";
import { BudgetChart } from "@/components/budget/budget-chart";
import { SpendingCategoryChart } from "@/components/budget/spending-category-chart";
import { VoiceBudgetModal } from "@/components/voice-input/voice-budget-modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Fetch budget items from API
  const fetchBudgetItems = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      const response = await fetch('/api/budget');
      
      if (!response.ok) {
        throw new Error('Failed to fetch budget items');
      }
      
      const data = await response.json();
      setBudgetItems(data);
    } catch (error) {
      console.error('Error fetching budget items:', error);
      setIsError(true);
      toast({
        title: "Error",
        description: "Failed to load budget data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load budget items on component mount
  useEffect(() => {
    fetchBudgetItems();
  }, []);

  // Handle adding a new budget item
  const handleAddBudgetItem = (newItem: Expense) => {
    setBudgetItems((prevItems) => [...prevItems, newItem]);
  };

  // Helper to extract numeric value from formatted currency string
  const extractNumericValue = (value: string): number => {
    // Remove ₹ and commas, then parse as float
    const numericString = value.replace(/[₹$,]/g, "");
    return Number.parseFloat(numericString) || 0;
  };

  // Calculate totals
  const totalBudgeted = budgetItems.reduce((total, item) => total + extractNumericValue(item.budgeted), 0);
  const totalSpent = budgetItems.reduce((total, item) => total + extractNumericValue(item.spent), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const percentageUsed = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;
  const percentageRemaining = 100 - percentageUsed;

  // Format currency values
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="flex items-center gap-2" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Monthly Budget</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchBudgetItems} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <VoiceBudgetModal onAddBudget={handleAddBudgetItem} />
              <AddExpenseForm onAddExpense={handleAddBudgetItem} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <span className="text-muted-foreground">Monthly allocation</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <div className="flex items-center text-green-500">
                    <span>{percentageUsed}% of budget used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <div className="flex items-center text-green-500">
                    <span>{percentageRemaining}% of budget remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>Track your spending against your budget by category</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading budget items...</span>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Failed to load budget data. Please try again.</p>
                </div>
              ) : budgetItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <p className="text-muted-foreground">No budget items found. Add your first budget item to get started.</p>
                  <AddExpenseForm onAddExpense={handleAddBudgetItem} />
                </div>
              ) : (
                <div className="space-y-8">
                  {budgetItems.map((item) => {
                    // Calculate amount remaining or overspent
                    const budgetedAmount = extractNumericValue(item.budgeted);
                    const spentAmount = extractNumericValue(item.spent);
                    const remaining = budgetedAmount - spentAmount;
                    const isOverBudget = remaining < 0;
                    
                    return (
                      <div key={item.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : ''}`}>
                            {item.spent} / {item.budgeted}
                          </span>
                        </div>
                        <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {item.percentage}% used
                          </span>
                          <span className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {isOverBudget 
                              ? `₹${Math.abs(remaining).toLocaleString("en-IN")} over budget` 
                              : `₹${remaining.toLocaleString("en-IN")} remaining`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Where your money is going this month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Failed to load chart data.</p>
                  </div>
                ) : budgetItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <PieChart className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Add budget items to see spending distribution</p>
                  </div>
                ) : (
                  <SpendingCategoryChart expenses={budgetItems} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget vs. Spending</CardTitle>
                <CardDescription>Comparison of budgeted amounts vs. actual spending</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Failed to load chart data.</p>
                  </div>
                ) : budgetItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Add budget items to see comparison</p>
                  </div>
                ) : (
                  <BudgetChart expenses={budgetItems} />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}