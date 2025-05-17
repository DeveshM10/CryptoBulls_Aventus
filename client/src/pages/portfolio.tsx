"use client"

import { useState } from "react"
import { AssetManagement } from "@/components/forms/asset-management"
import { LiabilityManagement } from "@/components/forms/liability-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { VoiceAssetModal } from "@/components/voice-input/voice-asset-modal"
import { VoiceLiabilityModal } from "@/components/voice-input/voice-liability-modal"
import { Button } from "@/components/ui/button"
import { Mic, Plus, RefreshCw } from "lucide-react"

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("assets")
  const queryClient = useQueryClient()
  
  // Fetch assets for chart
  const { data: assets = [] } = useQuery({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/assets");
      return await res.json();
    }
  });
  
  // Fetch liabilities for chart
  const { data: liabilities = [] } = useQuery({
    queryKey: ["/api/liabilities"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/liabilities");
      return await res.json();
    }
  });

  // Create data for the asset distribution chart
  const assetChartData = assets.reduce((acc: any[], asset: any) => {
    // Get the asset type or set to "Other" if not available
    const type = asset.type || "Other";
    
    // Find if this type already exists in the accumulator
    const existingType = acc.find(item => item.name === type);
    
    // Parse the value, removing currency symbol and commas
    const value = typeof asset.value === 'string' 
      ? parseFloat(asset.value.replace(/[₹,]/g, '')) 
      : (typeof asset.value === 'number' ? asset.value : 0);
    
    if (existingType) {
      existingType.value += value;
    } else {
      acc.push({
        name: type,
        value: value
      });
    }
    
    return acc;
  }, []);

  // Create data for the liability distribution chart
  const liabilityChartData = liabilities.reduce((acc: any[], liability: any) => {
    // Get the liability type or set to "Other" if not available
    const type = liability.type || "Other";
    
    // Find if this type already exists in the accumulator
    const existingType = acc.find(item => item.name === type);
    
    // Parse the amount, removing currency symbol and commas
    const amount = typeof liability.amount === 'string' 
      ? parseFloat(liability.amount.replace(/[₹,]/g, '')) 
      : (typeof liability.amount === 'number' ? liability.amount : 0);
    
    if (existingType) {
      existingType.value += amount;
    } else {
      acc.push({
        name: type,
        value: amount
      });
    }
    
    return acc;
  }, []);

  // Colors for the charts
  const ASSET_COLORS = ['#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#facc15'];
  const LIABILITY_COLORS = ['#f87171', '#fb7185', '#e879f9', '#c084fc', '#ff7876'];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">
            Manage your assets and liabilities with voice assistance
          </p>
        </div>
        <div className="flex gap-4">
          {activeTab === "assets" && (
            <div className="flex items-center gap-2">
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/assets"] })} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <VoiceAssetModal 
                onAddAsset={(asset: any) => {
                  // Invalidate the query to refresh the data
                  queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
                }} 
              />
            </div>
          )}
          {activeTab === "liabilities" && (
            <div className="flex items-center gap-2">
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] })} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <VoiceLiabilityModal 
                onAddLiability={(liability: any) => {
                  // Invalidate the query to refresh the data
                  queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] });
                }} 
              />
            </div>
          )}
        </div>
      </div>

      <QuickStats />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>
              Breakdown of your assets by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {assetChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No asset data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liability Distribution</CardTitle>
            <CardDescription>
              Breakdown of your liabilities by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {liabilityChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No liability data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liabilityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {liabilityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LIABILITY_COLORS[index % LIABILITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4"
      >
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="assets" className="space-y-4">
          <div className="container mx-auto">
            <AssetManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="liabilities" className="space-y-4">
          <div className="container mx-auto">
            <LiabilityManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}