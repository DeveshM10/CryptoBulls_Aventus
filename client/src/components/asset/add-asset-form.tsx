import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

export interface Asset {
  id?: string
  title: string
  value: string
  type: string
  date: string
  change: string
  trend: "up" | "down"
}

export function AddAssetForm() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const assetTypes = [
    { value: "Property", label: "Property" },
    { value: "Investment", label: "Investment" },
    { value: "Cash", label: "Cash" },
    { value: "Retirement", label: "Retirement" },
    { value: "Personal Property", label: "Personal Property" },
    { value: "Other", label: "Other" },
  ]

  const addAssetMutation = useMutation({
    mutationFn: async (asset: Asset) => {
      setLoading(true)
      const response = await apiRequest("POST", "/api/assets", asset)
      const data = await response.json()
      return data
    },
    onSuccess: () => {
      setLoading(false)
      toast({
        title: "Asset added successfully",
        description: "Your asset has been added to your portfolio.",
        variant: "default",
      })
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] })
    },
    onError: (error) => {
      setLoading(false)
      toast({
        title: "Error adding asset",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (formData: Record<string, any>) => {
    // Extract numeric value for consistent formatting
    const numericValue = Number.parseFloat(formData.value)
    const formattedValue = !isNaN(numericValue)
      ? `$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : formData.value

    // Create new asset object
    const newAsset: Asset = {
      title: formData.title,
      value: formattedValue,
      type: formData.type,
      date: formData.date,
      change: `${formData.changePercentage}%`,
      trend: Number.parseFloat(formData.changePercentage) >= 0 ? "up" : "down",
    }

    addAssetMutation.mutate(newAsset)
  }

  return (
    <DialogForm
      title="Add New Asset"
      description="Enter the details of your new asset"
      triggerButton={
        <Button size="sm" disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      }
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
          placeholder: "e.g., 250000",
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
  )
}