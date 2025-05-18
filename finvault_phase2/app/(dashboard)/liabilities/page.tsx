"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Download, Filter, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AddLiabilityForm } from "@/components/liabilities/add-liability-form"
import { useFinanceStore } from "@/components/store/finance-store"

function LiabilityCard({ title, amount, type, interest, payment, dueDate, status }) {
  return (
    <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center p-4">
          <div className="flex-1 space-y-1 mb-4 md:mb-0">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{title}</h3>
              {status === "warning" && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Attention needed
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-sm font-medium">{amount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="text-sm font-medium">{interest}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="text-sm font-medium">{payment}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium">{dueDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LiabilitiesPage() {
  const { liabilities, addLiability } = useFinanceStore()
  const [activeTab, setActiveTab] = useState("all")

  // Filter liabilities based on selected tab
  const getFilteredLiabilities = () => {
    switch (activeTab) {
      case "loans":
        return liabilities.filter((l) => l.type.toLowerCase().includes("loan"))
      case "credit":
        return liabilities.filter(
          (l) => l.type.toLowerCase().includes("credit") || l.type.toLowerCase().includes("revolving"),
        )
      case "other":
        return liabilities.filter(
          (l) =>
            !l.type.toLowerCase().includes("loan") &&
            !l.type.toLowerCase().includes("credit") &&
            !l.type.toLowerCase().includes("revolving"),
        )
      default:
        return liabilities
    }
  }

  const filteredLiabilities = getFilteredLiabilities()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Liabilities</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddLiabilityForm onAddLiability={addLiability} />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto md:h-10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="loans"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Loans
          </TabsTrigger>
          <TabsTrigger
            value="credit"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Credit Cards
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredLiabilities.length > 0 ? (
              filteredLiabilities.map((liability) => (
                <LiabilityCard
                  key={liability.id}
                  title={liability.title}
                  amount={liability.amount}
                  type={liability.type}
                  interest={liability.interest}
                  payment={liability.payment}
                  dueDate={liability.dueDate}
                  status={liability.status}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/30">
                <p className="text-muted-foreground">No liabilities found in this category</p>
              </div>
            )}

            <Card
              className="border border-dashed flex items-center justify-center h-[100px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => document.getElementById("add-liability-trigger")?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-8 w-8" />
                <p>Add New Liability</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hidden button for programmatic triggering */}
      <Button id="add-liability-trigger" className="hidden">
        Add Liability
      </Button>
    </div>
  )
}
