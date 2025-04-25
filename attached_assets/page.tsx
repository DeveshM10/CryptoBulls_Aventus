"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Download, Filter } from "lucide-react"
import { AddAssetForm } from "@/components/assets/add-asset-form"
import { useFinanceStore } from "@/components/store/finance-store"
import { AssetDistributionChart } from "@/components/assets/asset-distribution-chart"
import { AssetGrowthChart } from "@/components/assets/asset-growth-chart"

function AssetCard({ title, value, type, date, change, trend }) {
  return (
    <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{date}</p>
          <p className={`text-xs ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>{change}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AssetsPage() {
  const { assets, addAsset } = useFinanceStore()
  const [activeTab, setActiveTab] = useState("all")
  const [activeView, setActiveView] = useState("grid")

  // Filter assets based on selected tab
  const filteredAssets =
    activeTab === "all" ? assets : assets.filter((asset) => asset.type.toLowerCase().includes(activeTab))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddAssetForm onAddAsset={addAsset} />
        </div>
      </div>

      {/* Asset Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Breakdown of your assets by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AssetDistributionChart assets={assets} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Growth</CardTitle>
            <CardDescription>Value change over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AssetGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto md:h-10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="property"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Property
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Investments
            </TabsTrigger>
            <TabsTrigger
              value="other"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Other
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant={activeView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("grid")}
          >
            Grid
          </Button>
          <Button
            variant={activeView === "chart" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("chart")}
          >
            Charts
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-0">
        {activeView === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                title={asset.title}
                value={asset.value}
                type={asset.type}
                date={asset.date}
                change={asset.change}
                trend={asset.trend}
              />
            ))}

            <Card
              className="border border-dashed flex items-center justify-center h-[180px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => document.getElementById("add-asset-trigger")?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-8 w-8" />
                <p>Add New Asset</p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Value Comparison</CardTitle>
                <CardDescription>Compare the value of your different assets</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AssetDistributionChart assets={filteredAssets} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Hidden button for programmatic triggering */}
      <Button id="add-asset-trigger" className="hidden">
        Add Asset
      </Button>
    </div>
  )
}
