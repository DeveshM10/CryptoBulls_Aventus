"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { insertAssetSchema, Asset } from "@shared/schema"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

const assetFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  value: z.string().min(1, "Asset value is required"),
  type: z.string().min(1, "Asset type is required"),
  date: z.date(),
  change: z.string().optional(),
  trend: z.enum(["up", "down"]),
})

interface AddAssetFormProps {
  onAddAsset: (asset: Asset) => void
  initialData?: Partial<Asset>
  submitLabel?: string
}

export function AddAssetForm({ 
  onAddAsset, 
  initialData, 
  submitLabel = "Add Asset" 
}: AddAssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set default values, including any passed initialData
  const form = useForm<z.infer<typeof assetFormSchema>>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      value: initialData?.value || "",
      type: initialData?.type || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      change: initialData?.change || "0%",
      trend: initialData?.trend || "up",
    },
  })

  async function onSubmit(values: z.infer<typeof assetFormSchema>) {
    setIsSubmitting(true)
    try {
      // Ensure value has proper currency format (₹)
      let formattedValue = values.value
      if (!formattedValue.includes('₹')) {
        formattedValue = `₹${formattedValue}`
      }

      const newAsset: Asset = {
        id: initialData?.id || uuidv4(),
        title: values.title,
        value: formattedValue,
        type: values.type,
        date: format(values.date, 'yyyy-MM-dd'),
        change: values.change || "0%",
        trend: values.trend,
      }

      // Call the API to add the asset
      const response = await apiRequest("POST", "/api/assets", newAsset)
      
      if (!response.ok) {
        throw new Error("Failed to add asset")
      }
      
      // Call the parent callback with the new asset
      onAddAsset(newAsset)
      
      // Reset the form
      if (!initialData) {
        form.reset({
          title: "",
          value: "",
          type: "",
          date: new Date(),
          change: "0%",
          trend: "up",
        })
      }
      
      toast({
        title: "Asset added successfully",
        description: "Your asset has been added to your portfolio.",
      })
    } catch (error) {
      toast({
        title: "Error adding asset",
        description: "There was an error adding your asset. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding asset:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Title</FormLabel>
                <FormControl>
                  <Input placeholder="House, Car, Stocks, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input placeholder="₹100,000" {...field} />
                </FormControl>
                <FormDescription>
                  Current value of the asset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="bonds">Bonds</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="change"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value Change</FormLabel>
                <FormControl>
                  <Input placeholder="5.2%" {...field} />
                </FormControl>
                <FormDescription>
                  Recent percentage change (e.g., "5.2%")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="trend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trend Direction</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trend" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="up">Upward Trend</SelectItem>
                    <SelectItem value="down">Downward Trend</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : submitLabel}
        </Button>
      </form>
    </Form>
  )
}