import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface Expense {
  id: string;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: "normal" | "warning" | "danger";
}

// Sample expenses for initial state
const initialExpenses: Expense[] = [];

export function BudgetChart() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  
  // This would be replaced with an API call in a real application
  useEffect(() => {
    // Fetch expenses from the API
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    
    fetchExpenses();
  }, []);

  // Calculate total budget and spending
  const totalBudgeted = expenses.reduce((sum, expense) => {
    const budgetValue = parseFloat(expense.budgeted.replace(/[^0-9.-]+/g, ""));
    return isNaN(budgetValue) ? sum : sum + budgetValue;
  }, 0);

  const totalSpent = expenses.reduce((sum, expense) => {
    const spentValue = parseFloat(expense.spent.replace(/[^0-9.-]+/g, ""));
    return isNaN(spentValue) ? sum : sum + spentValue;
  }, 0);

  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>
          Total Budget: {formatCurrency(totalBudgeted)} | 
          Spent: {formatCurrency(totalSpent)} | 
          Remaining: {formatCurrency(totalBudgeted - totalSpent)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall budget progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall Budget</span>
            <span className="text-sm font-medium">{overallPercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={overallPercentage} 
            className={`h-3 ${overallPercentage > 90 ? 'bg-red-200' : overallPercentage > 75 ? 'bg-yellow-200' : 'bg-green-200'}`} 
          />
        </div>
        
        {/* Expense categories */}
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{expense.title}</span>
                  <Badge 
                    variant={expense.status === "danger" ? "destructive" : expense.status === "warning" ? "outline" : "default"}
                  >
                    {expense.status === "danger" ? "Over Budget" : expense.status === "warning" ? "Near Limit" : "On Track"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: {expense.spent}</span>
                  <span>Budget: {expense.budgeted}</span>
                </div>
                <Progress 
                  value={expense.percentage} 
                  className={`h-2 ${expense.status === "danger" ? 'bg-red-200' : expense.status === "warning" ? 'bg-yellow-200' : 'bg-green-200'}`} 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found. Add budget categories to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}