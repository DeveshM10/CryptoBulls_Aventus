"use client"

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, RefreshCw, TrendingUp, Wallet, DollarSign, Target, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

export default function ComparePage() {
  const [period, setPeriod] = useState("monthly");
  const [compareType, setCompareType] = useState("portfolio");
  const [inputValues, setInputValues] = useState({
    portfolio: 100000,
    expenses: 5000,
    goals: 250000
  });
  const [benchmarkValues, setBenchmarkValues] = useState({
    portfolio: 120000,
    expenses: 4500,
    goals: 300000
  });
  const [showCharts, setShowCharts] = useState(false);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  const generatePortfolioData = () => {
    const categories = ["Stocks", "Bonds", "Real Estate", "Cash"];
    return categories.map((category, index) => ({
      name: category,
      you: (inputValues.portfolio / 4) * (1 + index * 0.1),
      benchmark: (benchmarkValues.portfolio / 4) * (1 + index * 0.15)
    }));
  };

  const generateExpensesData = () => {
    const categories = ["Housing", "Transport", "Food", "Utilities", "Entertainment"];
    return categories.map((category, index) => ({
      name: category,
      you: (inputValues.expenses / 5) * (1 + index * 0.2),
      benchmark: (benchmarkValues.expenses / 5) * (1 + index * 0.15)
    }));
  };

  const generateGoalsData = () => {
    const timeframes = ["1Y", "2Y", "3Y", "4Y", "5Y"];
    return timeframes.map((year, index) => ({
      name: year,
      target: inputValues.goals * (1 + index * 0.2),
      projected: benchmarkValues.goals * (1 + index * 0.25)
    }));
  };

  const handleUpdate = () => {
    setShowCharts(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold">FinVault</span>
          </a>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Financial Comparisons</h1>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleUpdate}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Enter your portfolio value</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={inputValues.portfolio}
                  onChange={(e) => setInputValues({ ...inputValues, portfolio: Number(e.target.value) })}
                  placeholder="Your portfolio value"
                />
                <Input
                  className="mt-2"
                  type="number"
                  value={benchmarkValues.portfolio}
                  onChange={(e) => setBenchmarkValues({ ...benchmarkValues, portfolio: Number(e.target.value) })}
                  placeholder="Benchmark portfolio value"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Enter your monthly expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={inputValues.expenses}
                  onChange={(e) => setInputValues({ ...inputValues, expenses: Number(e.target.value) })}
                  placeholder="Your monthly expenses"
                />
                <Input
                  className="mt-2"
                  type="number"
                  value={benchmarkValues.expenses}
                  onChange={(e) => setBenchmarkValues({ ...benchmarkValues, expenses: Number(e.target.value) })}
                  placeholder="Benchmark monthly expenses"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>Enter your target goals</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={inputValues.goals}
                  onChange={(e) => setInputValues({ ...inputValues, goals: Number(e.target.value) })}
                  placeholder="Your financial goals"
                />
                <Input
                  className="mt-2"
                  type="number"
                  value={benchmarkValues.goals}
                  onChange={(e) => setBenchmarkValues({ ...benchmarkValues, goals: Number(e.target.value) })}
                  placeholder="Benchmark financial goals"
                />
              </CardContent>
            </Card>
          </div>

          {showCharts && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Comparison</CardTitle>
                  <CardDescription>Asset allocation comparison</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generatePortfolioData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="you" fill="#8884d8" name="You" />
                      <Bar dataKey="benchmark" fill="#82ca9d" name="Benchmark" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Distribution</CardTitle>
                  <CardDescription>Monthly expense comparison</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateExpensesData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="you" fill="#8884d8" name="You" />
                      <Bar dataKey="benchmark" fill="#82ca9d" name="Benchmark" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals Progress</CardTitle>
                  <CardDescription>Financial goals trajectory</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateGoalsData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="target" stackId="1" stroke="#8884d8" fill="#8884d8" name="Target" />
                      <Area type="monotone" dataKey="projected" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Projected" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
              <CardDescription>Your overall financial health compared to peers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Debt-to-Income</div>
                    <div className="flex items-end gap-2">
                      <div className="text-2xl font-bold">24%</div>
                      <div className="text-sm text-muted-foreground">(Target: &lt;36%)</div>
                    </div>
                    <div className="text-xs text-green-500 mt-2">Excellent</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Emergency Fund</div>
                    <div className="flex items-end gap-2">
                      <div className="text-2xl font-bold">4.2x</div>
                      <div className="text-sm text-muted-foreground">(Target: 3-6x)</div>
                    </div>
                    <div className="text-xs text-green-500 mt-2">Good</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Savings Rate</div>
                    <div className="flex items-end gap-2">
                      <div className="text-2xl font-bold">18%</div>
                      <div className="text-sm text-muted-foreground">(Target: &gt;20%)</div>
                    </div>
                    <div className="text-xs text-yellow-500 mt-2">Almost There</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}