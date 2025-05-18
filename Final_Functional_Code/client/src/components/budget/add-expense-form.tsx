import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Expense {
  id: string
  title: string
  budgeted: string
  spent: string
  percentage: number
  status: "normal" | "warning" | "danger"
}

interface AddExpenseFormProps {
  onAddExpense: (expense: Expense) => void
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const expenseCategories = [
    { value: "Housing", label: "Housing" },
    { value: "Food & Dining", label: "Food & Dining" },
    { value: "Transportation", label: "Transportation" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Utilities", label: "Utilities" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Shopping", label: "Shopping" },
    { value: "Personal Care", label: "Personal Care" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" },
  ]

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true)
      
      // Calculate percentage of budget spent
      const budgeted = Number.parseFloat(formData.budgeted)
      const spent = Number.parseFloat(formData.spent)
      const percentage = Math.round((spent / budgeted) * 100)

      // Determine status based on percentage
      let status: "normal" | "warning" | "danger" = "normal"
      if (percentage >= 100) {
        status = "danger"
      } else if (percentage >= 90) {
        status = "warning"
      }

      // Format currency values
      const formattedBudgeted = `₹${budgeted.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      const formattedSpent = `₹${spent.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

      // Create budget item to send to API
      const budgetItem = {
        title: formData.category,
        budgeted: formattedBudgeted,
        spent: formattedSpent,
        percentage,
        status,
      }

      // Save to API
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetItem),
      })

      if (!response.ok) {
        throw new Error('Failed to add budget item')
      }

      const savedBudgetItem = await response.json()
      
      // Call the callback with the saved item
      onAddExpense(savedBudgetItem)
      
      toast({
        title: "Budget Item Added",
        description: `Successfully added ${formData.category} to your budget.`,
      })
    } catch (error) {
      console.error('Error adding budget item:', error)
      toast({
        title: "Error",
        description: "Failed to add budget item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogForm
      title="Add New Budget Category"
      description="Enter your budgeted and spent amounts"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      }
      fields={[
        {
          id: "category",
          label: "Category",
          type: "select",
          options: expenseCategories,
          required: true,
        },
        {
          id: "budgeted",
          label: "Budgeted Amount",
          type: "number",
          placeholder: "e.g., 50000",
          required: true,
        },
        {
          id: "spent",
          label: "Spent Amount",
          type: "number",
          placeholder: "e.g., 35000",
          required: true,
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Add Budget Category"
    />
  )
}