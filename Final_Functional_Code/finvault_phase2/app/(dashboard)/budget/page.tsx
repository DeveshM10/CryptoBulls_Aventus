"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Download, Filter, ArrowUpRight } from "lucide-react"
import { AddExpenseForm } from "@/components/budget/add-expense-form"
import { AddIncomeForm } from "@/components/budget/add-income-form"
import { useFinanceStore } from "@/components/store/finance-store"

function BudgetCategoryCard({ title, budgeted, spent, percentage, status }) {
  let statusColor = "bg-emerald-500"
  if (status === "warning") statusColor = "bg-amber-500"
  if (status === "danger") statusColor = "bg-rose-500"

  return (
    <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="text-sm font-medium">
              {spent} / {budgeted}
            </div>
          </div>
          <Progress value={percentage} className="h-2" indicatorClassName={statusColor} />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">Budget used</p>
            <p
              className={`text-xs font-medium ${
                status === "danger"
                  ? "text-rose-500"
                  : status === "warning"
                    ? "text-amber-500"
                    : "text-muted-foreground"
              }`}
            >
              {percentage}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BudgetPage() {
  const { expenses, addExpense, incomes, addIncome, getTotalIncome, getTotalExpenses, getSurplus } = useFinanceStore()

  const [activeTab, setActiveTab] = useState("expenses")

  // Calculate monthly change percentages
  // In a real app, this would be calculated from historical data
  const incomeChangePercent = "+5.2%"
  const expensesChangePercent = "+2.8%"
  const surplusChangePercent = "+12.5%"

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budget & Surplus</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {activeTab === "expenses" ? (
            <AddExpenseForm onAddExpense={addExpense} />
          ) : (
            <AddIncomeForm onAddIncome={addIncome} />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Income</CardTitle>
            <CardDescription>Total income for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalIncome())}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {incomeChangePercent}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Expenses</CardTitle>
            <CardDescription>Total expenses for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalExpenses())}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <span className="text-rose-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {expensesChangePercent}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Surplus</CardTitle>
            <CardDescription>Available for savings or investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getSurplus())}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <span className="text-emerald-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {surplusChangePercent}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto md:h-10">
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Income
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <BudgetCategoryCard
                key={expense.id}
                title={expense.title}
                budgeted={expense.budgeted}
                spent={expense.spent}
                percentage={expense.percentage}
                status={expense.status}
              />
            ))}

            <Card
              className="border border-dashed flex items-center justify-center h-[100px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => document.getElementById("add-expense-trigger")?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-8 w-8" />
                <p>Add Expense Category</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <div className="grid gap-4">
            {incomes.map((income) => (
              <Card
                key={income.id}
                className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-4">
                    <div className="flex-1 space-y-1 mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold">{income.title}</h3>
                      <p className="text-sm text-muted-foreground">{income.description}</p>
                    </div>
                    <div className="text-xl font-bold">{income.amount}</div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              className="border border-dashed flex items-center justify-center h-[100px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => document.getElementById("add-income-trigger")?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-8 w-8" />
                <p>Add Income Source</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden buttons for programmatic triggering */}
      <Button id="add-expense-trigger" className="hidden">
        Add Expense
      </Button>
      <Button id="add-income-trigger" className="hidden">
        Add Income
      </Button>
    </div>
  )
}
