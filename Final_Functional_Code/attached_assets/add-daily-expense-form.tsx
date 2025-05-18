"use client"

import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { DailyExpense } from "@/components/store/finance-store"

interface AddDailyExpenseFormProps {
  onAddExpense: (expense: DailyExpense) => void
}

export function AddDailyExpenseForm({ onAddExpense }: AddDailyExpenseFormProps) {
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
    const id = `daily_${Date.now()}`

    // Format amount
    const amount = Number.parseFloat(formData.amount)
    const formattedAmount = !isNaN(amount)
      ? `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : formData.amount

    // Format date
    const date = formData.date || new Date().toISOString().split("T")[0]

    // Create new expense object
    const newExpense: DailyExpense = {
      id,
      title: formData.title,
      amount: formattedAmount,
      category: formData.category,
      date,
      notes: formData.notes || "",
    }

    onAddExpense(newExpense)
  }

  return (
    <DialogForm
      title="Log Daily Expense"
      description="Track your day-to-day spending"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Log Expense
        </Button>
      }
      fields={[
        {
          id: "title",
          label: "Expense Title",
          type: "text",
          placeholder: "e.g., Grocery Shopping",
          required: true,
        },
        {
          id: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g., 2500",
          required: true,
        },
        {
          id: "category",
          label: "Category",
          type: "select",
          options: expenseCategories,
          required: true,
        },
        {
          id: "date",
          label: "Date",
          type: "date",
          required: true,
        },
        {
          id: "notes",
          label: "Notes",
          type: "textarea",
          placeholder: "Add any additional details",
          required: false,
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Log Expense"
    />
  )
}
