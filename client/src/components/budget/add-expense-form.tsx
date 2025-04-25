import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

export interface Expense {
  id?: string
  title: string
  budgeted: string
  spent: string
  percentage: number
  status: "normal" | "warning" | "danger"
}

export function AddExpenseForm() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Expense) => {
      setLoading(true)
      const response = await apiRequest("POST", "/api/expenses", expense)
      const data = await response.json()
      return data
    },
    onSuccess: () => {
      setLoading(false)
      toast({
        title: "Expense added successfully",
        description: "Your expense has been added to your budget.",
        variant: "default",
      })
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] })
    },
    onError: (error) => {
      setLoading(false)
      toast({
        title: "Error adding expense",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (formData: Record<string, any>) => {
    // Calculate percentage and determine status
    const budgeted = parseFloat(formData.budgeted)
    const spent = parseFloat(formData.spent)
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0
    
    let status: "normal" | "warning" | "danger" = "normal"
    if (percentage > 90) {
      status = "danger"
    } else if (percentage > 75) {
      status = "warning"
    }

    // Create formatted strings for display
    const formattedBudgeted = !isNaN(budgeted)
      ? `$${budgeted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : formData.budgeted
    
    const formattedSpent = !isNaN(spent)
      ? `$${spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : formData.spent

    // Create new expense object
    const newExpense: Expense = {
      title: formData.title,
      budgeted: formattedBudgeted,
      spent: formattedSpent,
      percentage,
      status
    }

    addExpenseMutation.mutate(newExpense)
  }

  return (
    <DialogForm
      title="Add New Budget Category"
      description="Enter the details of your new budget category"
      triggerButton={
        <Button size="sm" disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget Category
        </Button>
      }
      fields={[
        {
          id: "title",
          label: "Category Name",
          type: "text",
          placeholder: "e.g., Groceries",
          required: true,
        },
        {
          id: "budgeted",
          label: "Budgeted Amount",
          type: "number",
          placeholder: "e.g., 500",
          required: true,
        },
        {
          id: "spent",
          label: "Spent Amount",
          type: "number",
          placeholder: "e.g., 320",
          required: true,
        }
      ]}
      onSubmit={handleSubmit}
      submitLabel="Add Budget Category"
    />
  )
}