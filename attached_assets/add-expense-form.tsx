"use client"

import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

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

  const handleSubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new expense
    const id = `expense_${Date.now()}`

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

    // Create new expense object
    const newExpense: Expense = {
      id,
      title: formData.category,
      budgeted: formattedBudgeted,
      spent: formattedSpent,
      percentage,
      status,
    }

    onAddExpense(newExpense)
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
