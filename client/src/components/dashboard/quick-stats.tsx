"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, ActivitySquare } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"

export function QuickStats() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch assets
  const { data: assets = [] } = useQuery({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/assets");
      return await res.json();
    }
  });
  
  // Fetch liabilities
  const { data: liabilities = [] } = useQuery({
    queryKey: ["/api/liabilities"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/liabilities");
      return await res.json();
    }
  });
  
  // Fetch budget data
  const { data: budgetItems = [] } = useQuery({
    queryKey: ["/api/budget"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/budget");
      return await res.json();
    }
  });

  useEffect(() => {
    // Set loading to false when all data is loaded
    if (assets && liabilities && budgetItems) {
      setIsLoading(false);
    }
  }, [assets, liabilities, budgetItems]);

  // Calculate net worth
  const calculateNetWorth = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + parseFloat(asset.value || "0"), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount || "0"), 0);
    return totalAssets - totalLiabilities;
  };

  // Calculate total income
  const calculateTotalIncome = () => {
    // Here we're assuming income items in the budget have a specific category type
    // Adjust this based on your actual data structure
    return budgetItems
      .filter(item => item.status === "income")
      .reduce((sum, item) => sum + parseFloat(item.budgeted || "0"), 0);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    // For expenses, we're summing the 'spent' field from budget items
    // Adjust this based on your actual data structure
    return budgetItems
      .filter(item => item.status !== "income")
      .reduce((sum, item) => sum + parseFloat(item.spent || "0"), 0);
  };

  // Calculate savings rate
  const calculateSavingsRate = () => {
    const income = calculateTotalIncome();
    const expenses = calculateTotalExpenses();
    
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  };

  // Format currency with ₹ symbol
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Hardcoded previous values for demonstration
  // In a real app, you would fetch historical data or calculate trends
  const prevNetWorth = calculateNetWorth() / 1.081;  // 8.1% increase
  const prevIncome = calculateTotalIncome() / 1.023;  // 2.3% increase
  const prevExpenses = calculateTotalExpenses() / 0.948;  // 5.2% decrease
  const prevSavingsRate = calculateSavingsRate() / 1.125;  // 12.5% increase

  // Calculate percentage changes
  const netWorthChange = ((calculateNetWorth() - prevNetWorth) / prevNetWorth) * 100;
  const incomeChange = ((calculateTotalIncome() - prevIncome) / prevIncome) * 100;
  const expensesChange = ((calculateTotalExpenses() - prevExpenses) / prevExpenses) * 100;
  const savingsRateChange = calculateSavingsRate() - prevSavingsRate;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Net Worth */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row items-center justify-between space-y-0 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatCurrency(calculateNetWorth())}
              </p>
              <div className="flex items-center space-x-2">
                {netWorthChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${netWorthChange > 0 ? "text-green-500" : "text-red-500"}`}>
                  {netWorthChange.toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row items-center justify-between space-y-0 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatCurrency(calculateTotalIncome())}
              </p>
              <div className="flex items-center space-x-2">
                {incomeChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${incomeChange > 0 ? "text-green-500" : "text-red-500"}`}>
                  {incomeChange.toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ActivitySquare className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row items-center justify-between space-y-0 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatCurrency(calculateTotalExpenses())}
              </p>
              <div className="flex items-center space-x-2">
                {expensesChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${expensesChange < 0 ? "text-green-500" : "text-red-500"}`}>
                  {Math.abs(expensesChange).toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Rate */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row items-center justify-between space-y-0 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${calculateSavingsRate().toFixed(1)}%`}
              </p>
              <div className="flex items-center space-x-2">
                {savingsRateChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${savingsRateChange > 0 ? "text-green-500" : "text-red-500"}`}>
                  {savingsRateChange.toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PiggyBank className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}