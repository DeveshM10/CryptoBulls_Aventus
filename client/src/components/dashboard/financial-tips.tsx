"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowUpRight, CheckCircle2, LightbulbIcon, TrendingDown, PiggyBank, CreditCard, Wallet } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"

type Tip = {
  icon: JSX.Element
  text: string
  color: string
  bgColor: string
}

export function FinancialTips() {
  const [tips, setTips] = useState<Tip[]>([])
  
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

  // Calculate financial metrics
  const calculateNetWorth = () => {
    try {
      // Handle assets
      const totalAssets = assets.reduce((sum: number, asset: any) => {
        try {
          let value = 0;
          if (typeof asset.value === 'string') {
            const cleanValue = asset.value.replace(/[^0-9.]/g, '');
            value = parseFloat(cleanValue);
          } else if (typeof asset.value === 'number') {
            value = asset.value;
          }
          return isNaN(value) ? sum : sum + value;
        } catch (err) {
          return sum;
        }
      }, 0);
      
      // Handle liabilities
      const totalLiabilities = liabilities.reduce((sum: number, liability: any) => {
        try {
          let amount = 0;
          if (typeof liability.amount === 'string') {
            const cleanAmount = liability.amount.replace(/[^0-9.]/g, '');
            amount = parseFloat(cleanAmount);
          } else if (typeof liability.amount === 'number') {
            amount = liability.amount;
          }
          return isNaN(amount) ? sum : sum + amount;
        } catch (err) {
          return sum;
        }
      }, 0);
      
      return totalAssets - totalLiabilities;
    } catch (err) {
      return 0;
    }
  };

  // Calculate total income
  const calculateTotalIncome = () => {
    try {
      const incomeCategories = ['income', 'salary', 'deposit', 'investment return'];
      
      return budgetItems.reduce((sum: number, item: any) => {
        try {
          const isIncome = incomeCategories.some(category => 
            item.title?.toLowerCase().includes(category) || 
            (item.status?.toLowerCase() === 'income')
          );
          
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
          return sum;
        }
      }, 0);
    } catch (err) {
      return 0;
    }
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    try {
      const incomeCategories = ['income', 'salary', 'deposit', 'investment return'];
      
      return budgetItems.reduce((sum: number, item: any) => {
        try {
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
          return sum;
        }
      }, 0);
    } catch (err) {
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

  // Generate financial tips based on user data
  useEffect(() => {
    if (!assets.length && !liabilities.length && !budgetItems.length) return;
    
    const newTips: Tip[] = [];
    const netWorth = calculateNetWorth();
    const savingsRate = calculateSavingsRate();
    const income = calculateTotalIncome();
    const expenses = calculateTotalExpenses();
    
    // Check if user has negative net worth
    if (netWorth < 0) {
      newTips.push({
        icon: <AlertTriangle className="h-5 w-5" />,
        text: "Your net worth is negative. Focus on paying down high-interest debt.",
        color: "text-amber-500",
        bgColor: "bg-amber-100",
      });
    }
    
    // Check savings rate
    if (savingsRate < 20) {
      newTips.push({
        icon: <PiggyBank className="h-5 w-5" />,
        text: "Try to save at least 20% of your income for long-term financial security.",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
      });
    } else if (savingsRate > 40) {
      newTips.push({
        icon: <CheckCircle2 className="h-5 w-5" />,
        text: "Great job saving! Consider investing some of your savings for higher returns.",
        color: "text-green-500",
        bgColor: "bg-green-100",
      });
    }
    
    // Check if there are high-interest liabilities
    const highInterestLiabilities = liabilities.filter((liability: any) => {
      const interestRate = parseFloat(liability.interest?.replace(/[^0-9.]/g, '') || "0");
      return interestRate > 10;
    });
    
    if (highInterestLiabilities.length > 0) {
      newTips.push({
        icon: <CreditCard className="h-5 w-5" />,
        text: "Consider refinancing or paying off high-interest debt (>10%) as a priority.",
        color: "text-red-500",
        bgColor: "bg-red-100",
      });
    }
    
    // Check for asset diversification
    const assetTypes = new Set(assets.map((asset: any) => asset.type?.toLowerCase()));
    if (assetTypes.size < 3 && assets.length > 1) {
      newTips.push({
        icon: <ArrowUpRight className="h-5 w-5" />,
        text: "Diversify your assets across different asset classes to reduce risk.",
        color: "text-purple-500",
        bgColor: "bg-purple-100",
      });
    }
    
    // Check emergency fund
    const emergencyFund = assets.find((asset: any) => 
      asset.title?.toLowerCase().includes('emergency') || 
      asset.title?.toLowerCase().includes('savings')
    );
    
    if (!emergencyFund) {
      newTips.push({
        icon: <LightbulbIcon className="h-5 w-5" />,
        text: "Build an emergency fund covering 3-6 months of expenses for financial security.",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
      });
    }
    
    // Check if expenses are too high compared to income
    if (income > 0 && expenses > income * 0.7) {
      newTips.push({
        icon: <TrendingDown className="h-5 w-5" />,
        text: "Your expenses are high relative to income. Look for areas to cut back.",
        color: "text-red-500", 
        bgColor: "bg-red-100",
      });
    }
    
    // Check if there's room for investment 
    if (income > expenses * 1.5) {
      newTips.push({
        icon: <Wallet className="h-5 w-5" />,
        text: "You have good cash flow. Consider increasing your investments for future growth.",
        color: "text-green-500",
        bgColor: "bg-green-100",
      });
    }
    
    // Add general financial wellness tips if we don't have many specific ones
    if (newTips.length < 3) {
      newTips.push({
        icon: <LightbulbIcon className="h-5 w-5" />,
        text: "Set up automatic transfers to your savings account on payday.",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
      });
      
      newTips.push({
        icon: <CheckCircle2 className="h-5 w-5" />,
        text: "Review your subscriptions regularly and cancel ones you don't use.",
        color: "text-purple-500", 
        bgColor: "bg-purple-100",
      });
    }
    
    // Limit to 5 tips maximum
    setTips(newTips.slice(0, 5));
  }, [assets, liabilities, budgetItems]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Personalized Financial Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-muted-foreground">
              Loading personalized tips...
            </div>
          ) : (
            tips.map((tip, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${tip.bgColor}`}>
                <div className={`rounded-full p-1.5 ${tip.color} bg-white`}>
                  {tip.icon}
                </div>
                <p className="text-sm flex-1">{tip.text}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}