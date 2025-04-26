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
      console.log("Assets:", assets);
      console.log("Liabilities:", liabilities);
      console.log("Budget items:", budgetItems);
      setIsLoading(false);
    }
  }, [assets, liabilities, budgetItems]);

  // Calculate net worth
  const calculateNetWorth = () => {
    try {
      // Handle assets
      const totalAssets = assets.reduce((sum: number, asset: any) => {
        try {
          // Since we're using MongoDB, the asset value might be stored as a string with currency symbols
          let value = 0;
          if (typeof asset.value === 'string') {
            // Remove currency symbols, commas, and other non-numeric characters
            const cleanValue = asset.value.replace(/[^0-9.]/g, '');
            value = parseFloat(cleanValue);
          } else if (typeof asset.value === 'number') {
            value = asset.value;
          }
          return isNaN(value) ? sum : sum + value;
        } catch (err) {
          console.error("Error parsing asset value:", asset.value, err);
          return sum;
        }
      }, 0);
      
      // Handle liabilities
      const totalLiabilities = liabilities.reduce((sum: number, liability: any) => {
        try {
          let amount = 0;
          if (typeof liability.amount === 'string') {
            // Remove currency symbols, commas, and other non-numeric characters
            const cleanAmount = liability.amount.replace(/[^0-9.]/g, '');
            amount = parseFloat(cleanAmount);
          } else if (typeof liability.amount === 'number') {
            amount = liability.amount;
          }
          return isNaN(amount) ? sum : sum + amount;
        } catch (err) {
          console.error("Error parsing liability amount:", liability.amount, err);
          return sum;
        }
      }, 0);
      
      return totalAssets - totalLiabilities;
    } catch (err) {
      console.error("Error calculating net worth:", err);
      return 0;
    }
  };

  // Calculate total income including asset profits
  const calculateTotalIncome = () => {
    try {
      // Calculate regular income from budget items
      const incomeCategories = ['income', 'salary', 'deposit', 'investment return'];
      const budgetIncome = budgetItems.reduce((sum: number, item: any) => {
        try {
          const isIncome = incomeCategories.some(category => 
            item.title?.toLowerCase().includes(category) || 
            (item.status?.toLowerCase() === 'income')
          );

          if (!isIncome) return sum;

          let amount = parseFloat(item.budgeted?.replace(/[^0-9.-]/g, '') || '0');
          return isNaN(amount) ? sum : sum + amount;
        } catch (err) {
          console.error("Error parsing income item:", item, err);
          return sum;
        }
      }, 0);

      // Calculate income from asset profits
      const assetProfits = assets.reduce((sum: number, asset: any) => {
        try {
          const currentValue = parseFloat(asset.value.replace(/[^0-9.-]/g, '') || '0');
          const changePercent = parseFloat(asset.change.replace(/[^0-9.-]/g, '') || '0') / 100;
          const originalValue = currentValue / (1 + changePercent);
          const profit = asset.trend === 'up' ? currentValue - originalValue : 0;
          return isNaN(profit) ? sum : sum + profit;
        } catch (err) {
          console.error("Error calculating asset profit:", asset, err);
          return sum;
        }
      }, 0);

      return budgetIncome + assetProfits;
          
          if (!isIncome) return sum;
          
          let amount = 0;
          if (typeof item.budgeted === 'string') {
            const cleanAmount = item.budgeted.replace(/[^0-9.]/g, '');
            amount = parseFloat(cleanAmount);
          } else if (typeof item.budgeted === 'number') {
            amount = item.budgeted;
          }
          
          return isNaN(amount) ? sum : sum + amount;
        } catch (err) {
          console.error("Error parsing income item:", item, err);
          return sum;
        }
      }, 0);
    } catch (err) {
      console.error("Error calculating total income:", err);
      return 0;
    }
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    try {
      const incomeCategories = ['income', 'salary', 'deposit', 'investment return'];
      
      return budgetItems.reduce((sum: number, item: any) => {
        try {
          // Check if this is an expense item (not income)
          const isIncome = incomeCategories.some(category => 
            item.title?.toLowerCase().includes(category) || 
            (item.status?.toLowerCase() === 'income')
          );
          
          if (isIncome) return sum;
          
          let amount = 0;
          if (typeof item.spent === 'string') {
            const cleanAmount = item.spent.replace(/[^0-9.]/g, '');
            amount = parseFloat(cleanAmount);
          } else if (typeof item.spent === 'number') {
            amount = item.spent;
          }
          
          return isNaN(amount) ? sum : sum + amount;
        } catch (err) {
          console.error("Error parsing expense item:", item, err);
          return sum;
        }
      }, 0);
    } catch (err) {
      console.error("Error calculating total expenses:", err);
      return 0;
    }
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

  // Use fixed percentages for demonstration
  // In a real app, you would fetch historical data or calculate trends
  const netWorthChange = 8.1;  // 8.1% increase
  const incomeChange = 2.3;    // 2.3% increase 
  const expensesChange = -5.2; // 5.2% decrease
  const savingsRateChange = 12.5; // 12.5% increase

  // Calculate previous values based on current values and fixed percentage changes
  const prevNetWorth = calculateNetWorth() / (1 + netWorthChange/100);
  const prevIncome = calculateTotalIncome() / (1 + incomeChange/100);
  const prevExpenses = calculateTotalExpenses() / (1 + expensesChange/100);
  const prevSavingsRate = calculateSavingsRate() - savingsRateChange;

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