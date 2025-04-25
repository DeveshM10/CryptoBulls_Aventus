import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, RefreshCw, TrendingUp, Wallet, DollarSign, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function ComparePage() {
  const [period, setPeriod] = useState("monthly");
  const [compareType, setCompareType] = useState("industry");
  const [userIncome, setUserIncome] = useState(50000);
  const [userExpenses, setUserExpenses] = useState(30000);
  const [userAssets, setUserAssets] = useState(500000);
  const [userLiabilities, setUserLiabilities] = useState(200000);

  // Dynamic data generation based on user input
  const generatePerformanceData = () => {
    const monthlyMultiplier = {
      industry: 1.2,
      peers: 1.1,
      target: 1.3,
      historical: 0.95
    };

    const multiplier = monthlyMultiplier[compareType];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    return months.map((month, index) => ({
      month,
      userROI: (userIncome - userExpenses) / userAssets * 100,
      benchmarkROI: ((userIncome - userExpenses) / userAssets * 100) * multiplier,
      userGrowth: userAssets * (1 + 0.02 * index),
      benchmarkGrowth: userAssets * (1 + 0.02 * index) * multiplier
    }));
  };

  const generatePortfolioData = () => {
    const benchmarkMultiplier = {
      industry: 1.15,
      peers: 1.05,
      target: 1.25,
      historical: 0.9
    };

    return {
      user: {
        assets: userAssets,
        liabilities: userLiabilities,
        netWorth: userAssets - userLiabilities
      },
      benchmark: {
        assets: userAssets * benchmarkMultiplier[compareType],
        liabilities: userLiabilities * 0.9,
        netWorth: (userAssets * benchmarkMultiplier[compareType]) - (userLiabilities * 0.9)
      }
    };
  };

  const handleUpdate = () => {
    // Trigger charts update
    setUpdateCounter(prev => prev + 1);
  };

  const [updateCounter, setUpdateCounter] = useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary" href="/compare">Compare</a>
          </nav>
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
              <Select value={compareType} onValueChange={setCompareType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Compare Against" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industry">Industry Average</SelectItem>
                  <SelectItem value="peers">Peer Group</SelectItem>
                  <SelectItem value="target">Target Goals</SelectItem>
                  <SelectItem value="historical">Historical Data</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleUpdate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Your Financial Data</CardTitle>
              <CardDescription>Enter your financial information to compare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    value={userIncome}
                    onChange={(e) => setUserIncome(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="expenses">Monthly Expenses</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={userExpenses}
                    onChange={(e) => setUserExpenses(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="assets">Total Assets</Label>
                  <Input
                    id="assets"
                    type="number"
                    value={userAssets}
                    onChange={(e) => setUserAssets(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="liabilities">Total Liabilities</Label>
                  <Input
                    id="liabilities"
                    type="number"
                    value={userLiabilities}
                    onChange={(e) => setUserLiabilities(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="performance" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Return on Investment</CardTitle>
                    <CardDescription>Compare your ROI against {compareType} benchmarks</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generatePerformanceData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="userROI" name="Your ROI" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="benchmarkROI" name="Benchmark ROI" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Trajectory</CardTitle>
                    <CardDescription>Your growth vs {compareType} growth</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generatePerformanceData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="userGrowth" name="Your Growth" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="benchmarkGrowth" name="Benchmark Growth" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Your allocation vs. recommended</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <PieChart className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Asset allocation chart</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>Portfolio risk metrics comparison</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <Target className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Risk analysis chart</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Compare spending patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Expense comparison chart</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Adherence</CardTitle>
                    <CardDescription>Budget vs. actual spending</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <DollarSign className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Budget adherence chart</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Progress</CardTitle>
                    <CardDescription>Track progress against financial goals</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <Target className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Goal progress chart</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Milestone Timeline</CardTitle>
                    <CardDescription>Financial milestones comparison</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center relative">
                    <Clock className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground absolute">Milestone timeline chart</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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