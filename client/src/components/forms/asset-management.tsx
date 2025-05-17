"use client"

import { useState } from "react"
import { PlusCircle, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AddAssetForm } from "./add-asset-form"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Asset } from "@shared/schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function AssetManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
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

  const handleVoiceInput = () => {
    setShowVoiceInput(true)
    toast({
      title: "Voice Input",
      description: "Voice input for assets is now available! Try saying: 'I have a stock investment worth 50,000 rupees with 5% growth'",
    })
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
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : 
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Asset
            </>}
          </Button>
          
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={handleVoiceInput}
          >
            <Mic className="h-4 w-4" />
            Voice Input
          </Button>
        </div>
      </div>
      
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <AddAssetForm onAddAsset={handleAddAsset} />
          </CardContent>
        </Card>
      )}
      
      <TabsContent value="all">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset: any) => (
            <Card key={asset.id || asset._id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 p-4">
                <CardTitle className="text-base">{asset.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium">{asset.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{asset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth:</span>
                    <span className={asset.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {asset.change}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{asset.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="real-estate">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets
            .filter((asset: any) => 
              asset.type?.toLowerCase().includes("real estate") || 
              asset.type?.toLowerCase().includes("property") || 
              asset.type?.toLowerCase().includes("house")
            )
            .map((asset: any) => (
              <Card key={asset.id || asset._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 p-4">
                  <CardTitle className="text-base">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">{asset.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{asset.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth:</span>
                      <span className={asset.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="investments">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets
            .filter((asset: any) => 
              asset.type?.toLowerCase().includes("stock") || 
              asset.type?.toLowerCase().includes("investment")
            )
            .map((asset: any) => (
              <Card key={asset.id || asset._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 p-4">
                  <CardTitle className="text-base">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">{asset.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{asset.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth:</span>
                      <span className={asset.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="cash">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets
            .filter((asset: any) => 
              asset.type?.toLowerCase().includes("cash") || 
              asset.type?.toLowerCase().includes("deposit") ||
              asset.type?.toLowerCase().includes("bank")
            )
            .map((asset: any) => (
              <Card key={asset.id || asset._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 p-4">
                  <CardTitle className="text-base">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-medium">{asset.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{asset.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth:</span>
                      <span className={asset.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}