import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  DownloadCloud,
  HelpCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BudgetRecommendation } from '@/services/ml/BudgetRecommender';

interface BudgetRecommendationCardProps {
  recommendation: BudgetRecommendation | null;
  isLoading: boolean;
  onRefresh: () => void;
  modelStats: {
    totalExpenses: number;
    weeksOfData: number;
    categoriesTracked: number;
    lastUpdated: Date;
    confidenceLevel: string;
  };
}

export default function BudgetRecommendationCard({ 
  recommendation, 
  isLoading, 
  onRefresh,
  modelStats
}: BudgetRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // For color-coding based on spending level
  const getCategoryColor = (category: string, amount: number) => {
    if (!recommendation) return 'bg-blue-100 text-blue-800';
    
    const totalBudget = recommendation.weeklyTotal;
    const percentage = (amount / totalBudget) * 100;
    
    if (percentage > 30) return 'bg-red-100 text-red-800'; // High spending category
    if (percentage > 15) return 'bg-yellow-100 text-yellow-800'; // Medium spending
    return 'bg-green-100 text-green-800'; // Low spending
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Budget Recommendation</CardTitle>
          <CardDescription>Calculating your personalized budget...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Budget Recommendation</CardTitle>
          <CardDescription>Add some expenses to get started</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No recommendation available yet. Add a few expenses first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Recommended Budget</CardTitle>
            <CardDescription>
              Personalized budget based on your spending patterns
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Badge 
              variant={modelStats.confidenceLevel === 'High' ? 'default' : 'outline'}
              className="flex items-center"
            >
              {modelStats.confidenceLevel} Confidence
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5" aria-label="What is this?">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Based on {modelStats.totalExpenses} expenses across {modelStats.weeksOfData} weeks of data.
                    More data improves accuracy.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/40 rounded-md p-4 text-center">
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(recommendation.weeklyTotal)}
          </div>
          <div className="text-sm text-muted-foreground">
            Recommended weekly budget
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Category Breakdown</span>
            <span>Amount</span>
          </div>
          
          {recommendation.categoryBreakdown.slice(0, expanded ? undefined : 5).map((category) => (
            <div key={category.category} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(category.category, category.amount)}>
                    {category.percentOfTotal}%
                  </Badge>
                  <span>{category.category}</span>
                  {category.comparedToAverage === 'higher' && <TrendingUp className="h-3 w-3 text-red-500" />}
                  {category.comparedToAverage === 'lower' && <TrendingDown className="h-3 w-3 text-green-500" />}
                </div>
                <span>{formatCurrency(category.amount)}</span>
              </div>
              <Progress value={category.percentOfTotal} className="h-1.5" />
              {category.warning && (
                <div className="text-xs flex items-center text-amber-600 mt-0.5">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {category.warning}
                </div>
              )}
            </div>
          ))}
          
          {recommendation.categoryBreakdown.length > 5 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-1" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : `Show ${recommendation.categoryBreakdown.length - 5} More Categories`}
            </Button>
          )}
        </div>
        
        <div className="bg-muted/20 rounded-md p-3 space-y-2 mt-2">
          <div className="flex justify-between text-sm">
            <span>Recommended savings:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(recommendation.savingsRecommendation)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Forecasted next week:</span>
            <span className="font-semibold">
              {formatCurrency(recommendation.nextWeekForecast)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 pt-1">
          <div className="text-xs font-medium">Rationale:</div>
          <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
            {recommendation.rationale.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Update
        </Button>
        <Button variant="outline" size="sm">
          <DownloadCloud className="h-3.5 w-3.5 mr-1.5" />
          Save Budget
        </Button>
      </CardFooter>
    </Card>
  );
}