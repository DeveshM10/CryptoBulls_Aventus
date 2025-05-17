"use client"

import { useState } from "react"
import { PlusCircle, Mic } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AddAssetForm } from "./add-asset-form"
import { VoiceAssetModal } from "../voice-input/voice-asset-modal"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Asset } from "@shared/schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function AssetManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Fetch assets
  const { data: assets = [] } = useQuery({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/assets");
      return await res.json();
    }
  });

  const handleAddAsset = async (asset: Asset) => {
    try {
      // The add form already handles the API call, so we just need to invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["/api/assets"] })
      
      // Close the form
      setShowAddForm(false)
      
      toast({
        title: "Asset added",
        description: "Your asset has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding asset:", error)
      toast({
        title: "Error adding asset",
        description: "There was a problem adding your asset.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="cash">Cash & Deposits</TabsTrigger>
        </TabsList>
        
        <div className="flex space-x-2">
          <VoiceAssetModal onAddAsset={handleAddAsset} />
          
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : 
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Asset
            </>}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
            <CardDescription>
              Enter the details of your asset below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddAssetForm onAddAsset={handleAddAsset} />
          </CardContent>
        </Card>
      )}

      <TabsContent value="all" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No assets found</h3>
                <p className="text-muted-foreground">
                  Add an asset to get started tracking your wealth.
                </p>
              </div>
            </div>
          ) : (
            assets.map((asset: Asset) => (
              <Card key={asset._id || asset.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{asset.title}</CardTitle>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      asset.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {asset.change || "0%"}
                    </span>
                  </div>
                  <CardDescription>{asset.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{asset.value}</span>
                    <span className="text-sm text-muted-foreground">
                      Added: {new Date(asset.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="real-estate" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.filter((asset: Asset) => asset.type === 'real-estate').length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No real estate assets found</h3>
                <p className="text-muted-foreground">
                  Add a real estate asset to track your property investments.
                </p>
              </div>
            </div>
          ) : (
            assets
              .filter((asset: Asset) => asset.type === 'real-estate')
              .map((asset: Asset) => (
                <Card key={asset._id || asset.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{asset.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        asset.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {asset.change || "0%"}
                      </span>
                    </div>
                    <CardDescription>{asset.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{asset.value}</span>
                      <span className="text-sm text-muted-foreground">
                        Added: {new Date(asset.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
      
      {/* Similar content for other tabs */}
      <TabsContent value="investments" className="mt-0">
        {/* Investments assets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.filter((asset: Asset) => 
            ['stocks', 'bonds', 'crypto', 'gold'].includes(asset.type)
          ).length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No investment assets found</h3>
                <p className="text-muted-foreground">
                  Add stocks, bonds, or other investments to track your portfolio.
                </p>
              </div>
            </div>
          ) : (
            assets
              .filter((asset: Asset) => 
                ['stocks', 'bonds', 'crypto', 'gold'].includes(asset.type)
              )
              .map((asset: Asset) => (
                <Card key={asset._id || asset.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{asset.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        asset.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {asset.change || "0%"}
                      </span>
                    </div>
                    <CardDescription>{asset.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{asset.value}</span>
                      <span className="text-sm text-muted-foreground">
                        Added: {new Date(asset.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="cash" className="mt-0">
        {/* Cash assets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.filter((asset: Asset) => asset.type === 'cash').length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No cash assets found</h3>
                <p className="text-muted-foreground">
                  Add bank accounts, cash on hand, or other liquid assets.
                </p>
              </div>
            </div>
          ) : (
            assets
              .filter((asset: Asset) => asset.type === 'cash')
              .map((asset: Asset) => (
                <Card key={asset._id || asset.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{asset.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        asset.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {asset.change || "0%"}
                      </span>
                    </div>
                    <CardDescription>{asset.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{asset.value}</span>
                      <span className="text-sm text-muted-foreground">
                        Added: {new Date(asset.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}