"use client"
import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export interface Asset {
  id: string
  title: string
  value: string
  type: string
  date: string
  change: string
  trend: "up" | "down"
}

interface AddAssetFormProps {
  onAddAsset: (asset: Asset) => void
}

export function AddAssetForm({ onAddAsset }: AddAssetFormProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [propertyEstimate, setPropertyEstimate] = useState<string | null>(null)

  const assetTypes = [
    { value: "Property", label: "Property" },
    { value: "Investment", label: "Investment" },
    { value: "Cash", label: "Cash" },
    { value: "Retirement", label: "Retirement" },
    { value: "Personal Property", label: "Personal Property" },
    { value: "Other", label: "Other" },
  ]

  const handleSubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new asset
    const id = `asset_${Date.now()}`

    // Extract numeric value for consistent formatting
    const numericValue = Number.parseFloat(formData.value)
    const formattedValue = !isNaN(numericValue) ? `₹${numericValue.toLocaleString("en-IN")}` : formData.value

    // Create new asset object
    const newAsset: Asset = {
      id,
      title: formData.title,
      value: formattedValue,
      type: formData.type,
      date: formData.date,
      change: `${formData.changePercentage}%`,
      trend: Number.parseFloat(formData.changePercentage) >= 0 ? "up" : "down",
    }

    onAddAsset(newAsset)
  }

  const calculatePropertyEstimate = (formData: Record<string, any>) => {
    // Simple property valuation formula (in a real app, this would be a ML model)
    const location = formData.location
    const bhk = Number.parseInt(formData.bhk, 10)
    const sqft = Number.parseFloat(formData.sqft)

    // Base price per sqft based on location
    const locationPrices = {
      Mumbai: 25000,
      Delhi: 15000,
      Bangalore: 12000,
      Hyderabad: 8000,
      Chennai: 7000,
      Pune: 9000,
      Kolkata: 6000,
      Other: 5000,
    }

    const basePrice = locationPrices[location as keyof typeof locationPrices] || 5000

    // BHK multiplier
    const bhkMultiplier = 1 + (bhk - 1) * 0.15

    // Calculate estimated value
    const estimatedValue = basePrice * sqft * bhkMultiplier

    return `₹${Math.round(estimatedValue).toLocaleString("en-IN")}`
  }

  const handlePropertyEstimate = (formData: Record<string, any>) => {
    const estimate = calculatePropertyEstimate(formData)
    setPropertyEstimate(estimate)
  }

  const handlePropertySubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new asset
    const id = `asset_${Date.now()}`

    // Get the estimated value
    const estimatedValue = propertyEstimate || calculatePropertyEstimate(formData)

    // Create new asset object
    const newAsset: Asset = {
      id,
      title: formData.propertyName,
      value: estimatedValue,
      type: "Property",
      date: `Estimated: ${new Date().toLocaleDateString()}`,
      change: "+0%", // New property has no change yet
      trend: "up",
    }

    onAddAsset(newAsset)
    setPropertyEstimate(null)
  }

  return (
    <DialogForm
      title="Add New Asset"
      description="Enter the details of your new asset"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      }
      customContent={
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Asset</TabsTrigger>
            <TabsTrigger value="property">Property Estimator</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <DialogForm.Fields
              fields={[
                {
                  id: "title",
                  label: "Asset Name",
                  type: "text",
                  placeholder: "e.g., Primary Home",
                  required: true,
                },
                {
                  id: "value",
                  label: "Value",
                  type: "number",
                  placeholder: "e.g., 2500000",
                  required: true,
                },
                {
                  id: "type",
                  label: "Type",
                  type: "select",
                  options: assetTypes,
                  required: true,
                },
                {
                  id: "date",
                  label: "Date Added",
                  type: "text",
                  placeholder: "e.g., Purchased: Jan 2023",
                  required: true,
                },
                {
                  id: "changePercentage",
                  label: "Change %",
                  type: "number",
                  placeholder: "e.g., 12.5",
                  required: true,
                },
              ]}
              onSubmit={handleSubmit}
              submitLabel="Add Asset"
            />
          </TabsContent>

          <TabsContent value="property" className="space-y-4 py-4">
            <div className="bg-primary/5 p-4 rounded-md mb-4">
              <h3 className="font-medium text-sm mb-2">Property Price Estimator</h3>
              <p className="text-sm text-muted-foreground">
                Our ML model will estimate your property value based on location, BHK, and area.
              </p>
            </div>

            {propertyEstimate && (
              <Card className="mb-4 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Property Value</p>
                    <p className="text-2xl font-bold text-primary">{propertyEstimate}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on location, size, and current market trends
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogForm.Fields
              fields={[
                {
                  id: "propertyName",
                  label: "Property Name",
                  type: "text",
                  placeholder: "e.g., My Apartment",
                  required: true,
                },
                {
                  id: "location",
                  label: "Location",
                  type: "select",
                  options: [
                    { value: "Mumbai", label: "Mumbai" },
                    { value: "Delhi", label: "Delhi" },
                    { value: "Bangalore", label: "Bangalore" },
                    { value: "Hyderabad", label: "Hyderabad" },
                    { value: "Chennai", label: "Chennai" },
                    { value: "Pune", label: "Pune" },
                    { value: "Kolkata", label: "Kolkata" },
                    { value: "Other", label: "Other" },
                  ],
                  required: true,
                },
                {
                  id: "bhk",
                  label: "BHK",
                  type: "select",
                  options: [
                    { value: "1", label: "1 BHK" },
                    { value: "2", label: "2 BHK" },
                    { value: "3", label: "3 BHK" },
                    { value: "4", label: "4 BHK" },
                    { value: "5", label: "5+ BHK" },
                  ],
                  required: true,
                },
                {
                  id: "sqft",
                  label: "Area (sq.ft)",
                  type: "number",
                  placeholder: "e.g., 1200",
                  required: true,
                },
              ]}
              onSubmit={handlePropertySubmit}
              submitLabel={propertyEstimate ? "Add Property" : "Estimate & Add Property"}
              onPreSubmit={!propertyEstimate ? handlePropertyEstimate : undefined}
              preSubmitLabel={!propertyEstimate ? "Calculate Estimate" : undefined}
            />
          </TabsContent>
        </Tabs>
      }
    />
  )
}
