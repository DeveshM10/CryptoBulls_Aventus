"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/components/ui/notification"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function ComparisonChart() {
  const [comparisonType, setComparisonType] = useState("assets-liabilities")
  const [yourAssets, setYourAssets] = useState("690000")
  const [yourLiabilities, setYourLiabilities] = useState("365500")
  const [benchmarkAssets, setBenchmarkAssets] = useState("750000")
  const [benchmarkLiabilities, setBenchmarkLiabilities] = useState("320000")

  const [yourIncome, setYourIncome] = useState("58000")
  const [yourExpenses, setYourExpenses] = useState("42000")
  const [benchmarkIncome, setBenchmarkIncome] = useState("65000")
  const [benchmarkExpenses, setBenchmarkExpenses] = useState("45000")

  const { show } = useNotification()

  const handleUpdate = () => {
    show({
      title: "Comparison Updated",
      description: "Your financial comparison has been updated successfully.",
      variant: "success",
    })
  }

  // Calculate net worth
  const yourNetWorth = Number.parseInt(yourAssets) - Number.parseInt(yourLiabilities)
  const benchmarkNetWorth = Number.parseInt(benchmarkAssets) - Number.parseInt(benchmarkLiabilities)

  // Calculate savings
  const yourSavings = Number.parseInt(yourIncome) - Number.parseInt(yourExpenses)
  const benchmarkSavings = Number.parseInt(benchmarkIncome) - Number.parseInt(benchmarkExpenses)

  // Data for assets-liabilities comparison
  const assetsLiabilitiesData = [
    {
      name: "You",
      Assets: Number.parseInt(yourAssets),
      Liabilities: Number.parseInt(yourLiabilities),
      "Net Worth": yourNetWorth,
    },
    {
      name: "Benchmark",
      Assets: Number.parseInt(benchmarkAssets),
      Liabilities: Number.parseInt(benchmarkLiabilities),
      "Net Worth": benchmarkNetWorth,
    },
  ]

  // Data for income-expenses comparison
  const incomeExpensesData = [
    {
      name: "You",
      Income: Number.parseInt(yourIncome),
      Expenses: Number.parseInt(yourExpenses),
      Savings: yourSavings,
    },
    {
      name: "Benchmark",
      Income: Number.parseInt(benchmarkIncome),
      Expenses: Number.parseInt(benchmarkExpenses),
      Savings: benchmarkSavings,
    },
  ]

  // Data for pie charts
  const yourAssetsLiabilitiesPieData = [
    { name: "Assets", value: Number.parseInt(yourAssets) },
    { name: "Liabilities", value: Number.parseInt(yourLiabilities) },
  ]

  const benchmarkAssetsLiabilitiesPieData = [
    { name: "Assets", value: Number.parseInt(benchmarkAssets) },
    { name: "Liabilities", value: Number.parseInt(benchmarkLiabilities) },
  ]

  const yourIncomeExpensesPieData = [
    { name: "Income", value: Number.parseInt(yourIncome) },
    { name: "Expenses", value: Number.parseInt(yourExpenses) },
  ]

  const benchmarkIncomeExpensesPieData = [
    { name: "Income", value: Number.parseInt(benchmarkIncome) },
    { name: "Expenses", value: Number.parseInt(benchmarkExpenses) },
  ]

  const COLORS = ["#8b5cf6", "#f43f5e", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-4">
      <Tabs value={comparisonType} onValueChange={setComparisonType}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assets-liabilities">Assets vs Liabilities</TabsTrigger>
          <TabsTrigger value="income-expenses">Income vs Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="assets-liabilities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Financial Data</CardTitle>
                <CardDescription>Enter your assets and liabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="your-assets">Your Total Assets (₹)</Label>
                  <Input
                    id="your-assets"
                    type="number"
                    value={yourAssets}
                    onChange={(e) => setYourAssets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="your-liabilities">Your Total Liabilities (₹)</Label>
                  <Input
                    id="your-liabilities"
                    type="number"
                    value={yourLiabilities}
                    onChange={(e) => setYourLiabilities(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Your Net Worth: ₹{yourNetWorth.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Data</CardTitle>
                <CardDescription>Enter benchmark assets and liabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="benchmark-assets">Benchmark Assets (₹)</Label>
                  <Input
                    id="benchmark-assets"
                    type="number"
                    value={benchmarkAssets}
                    onChange={(e) => setBenchmarkAssets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benchmark-liabilities">Benchmark Liabilities (₹)</Label>
                  <Input
                    id="benchmark-liabilities"
                    type="number"
                    value={benchmarkLiabilities}
                    onChange={(e) => setBenchmarkLiabilities(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Benchmark Net Worth: ₹{benchmarkNetWorth.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleUpdate} className="w-full">
            Update Comparison
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Assets vs Liabilities Comparison</CardTitle>
              <CardDescription>Compare your financial position with the benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetsLiabilitiesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Assets" fill="#8b5cf6" />
                    <Bar dataKey="Liabilities" fill="#f43f5e" />
                    <Bar dataKey="Net Worth" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Assets vs Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yourAssetsLiabilitiesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {yourAssetsLiabilitiesPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Assets vs Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={benchmarkAssetsLiabilitiesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {benchmarkAssetsLiabilitiesPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income-expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Financial Data</CardTitle>
                <CardDescription>Enter your monthly income and expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="your-income">Your Monthly Income (₹)</Label>
                  <Input
                    id="your-income"
                    type="number"
                    value={yourIncome}
                    onChange={(e) => setYourIncome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="your-expenses">Your Monthly Expenses (₹)</Label>
                  <Input
                    id="your-expenses"
                    type="number"
                    value={yourExpenses}
                    onChange={(e) => setYourExpenses(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Your Monthly Savings: ₹{yourSavings.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Data</CardTitle>
                <CardDescription>Enter benchmark monthly income and expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="benchmark-income">Benchmark Income (₹)</Label>
                  <Input
                    id="benchmark-income"
                    type="number"
                    value={benchmarkIncome}
                    onChange={(e) => setBenchmarkIncome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benchmark-expenses">Benchmark Expenses (₹)</Label>
                  <Input
                    id="benchmark-expenses"
                    type="number"
                    value={benchmarkExpenses}
                    onChange={(e) => setBenchmarkExpenses(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium">Benchmark Monthly Savings: ₹{benchmarkSavings.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleUpdate} className="w-full">
            Update Comparison
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses Comparison</CardTitle>
              <CardDescription>Compare your monthly cash flow with the benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpensesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Income" fill="#8b5cf6" />
                    <Bar dataKey="Expenses" fill="#f43f5e" />
                    <Bar dataKey="Savings" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={yourIncomeExpensesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {yourIncomeExpensesPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={benchmarkIncomeExpensesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {benchmarkIncomeExpensesPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
