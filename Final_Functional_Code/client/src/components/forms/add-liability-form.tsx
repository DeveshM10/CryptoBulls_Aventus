"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { insertLiabilitySchema, Liability } from "@shared/schema"
import { Button } from "@/components/ui/button"
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
import { v4 as uuidv4 } from "uuid"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

const liabilityFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.string().min(1, "Liability amount is required"),
  type: z.string().min(1, "Liability type is required"),
  interest: z.string().optional(),
  payment: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["current", "warning", "late"]),
})

interface AddLiabilityFormProps {
  onAddLiability: (liability: Liability) => void
  initialData?: Partial<Liability>
  submitLabel?: string
}

export function AddLiabilityForm({ 
  onAddLiability, 
  initialData,
  submitLabel = "Add Liability"
}: AddLiabilityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set default values, including any passed initialData
  const form = useForm<z.infer<typeof liabilityFormSchema>>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      amount: initialData?.amount || "",
      type: initialData?.type || "",
      interest: initialData?.interest || "",
      payment: initialData?.payment || "",
      dueDate: initialData?.dueDate || "",
      status: initialData?.status || "current",
    },
  })

  async function onSubmit(values: z.infer<typeof liabilityFormSchema>) {
    setIsSubmitting(true)
    try {
      // Ensure amount has proper currency format (₹)
      let formattedAmount = values.amount
      if (!formattedAmount.includes('₹')) {
        formattedAmount = `₹${formattedAmount}`
      }

      const newLiability: Liability = {
        id: initialData?.id || uuidv4(),
        title: values.title,
        amount: formattedAmount,
        type: values.type,
        interest: values.interest || "0%",
        payment: values.payment || "₹0",
        dueDate: values.dueDate || "Not specified",
        status: values.status,
      }

      // Call the API to add the liability
      const response = await apiRequest("POST", "/api/liabilities", newLiability)
      
      if (!response.ok) {
        throw new Error("Failed to add liability")
      }
      
      // Call the parent callback with the new liability
      onAddLiability(newLiability)
      
      // Reset the form
      if (!initialData) {
        form.reset({
          title: "",
          amount: "",
          type: "",
          interest: "",
          payment: "",
          dueDate: "",
          status: "current",
        })
      }
      
      toast({
        title: "Liability added successfully",
        description: "Your liability has been added to your account.",
      })
    } catch (error) {
      toast({
        title: "Error adding liability",
        description: "There was an error adding your liability. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding liability:", error)
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
                <FormLabel>Liability Title</FormLabel>
                <FormControl>
                  <Input placeholder="Home Loan, Credit Card, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="₹100,000" {...field} />
                </FormControl>
                <FormDescription>
                  Current balance of the liability
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
                <FormLabel>Liability Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select liability type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="loan">Personal Loan</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="auto-loan">Auto Loan</SelectItem>
                    <SelectItem value="student-loan">Student Loan</SelectItem>
                    <SelectItem value="medical">Medical Debt</SelectItem>
                    <SelectItem value="tax">Tax Debt</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate</FormLabel>
                <FormControl>
                  <Input placeholder="5.25%" {...field} />
                </FormControl>
                <FormDescription>
                  Current interest rate (e.g., "5.25%")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Payment</FormLabel>
                <FormControl>
                  <Input placeholder="₹1,500" {...field} />
                </FormControl>
                <FormDescription>
                  Regular payment amount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input placeholder="15th of every month" {...field} />
                </FormControl>
                <FormDescription>
                  When payments are due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="warning">Warning (Upcoming)</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
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