"use client"

import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export interface Income {
  id: string
  title: string
  amount: string
  description: string
}

interface AddIncomeFormProps {
  onAddIncome: (income: Income) => void
}

export function AddIncomeForm({ onAddIncome }: AddIncomeFormProps) {
  const incomeTypes = [
    { value: "Salary", label: "Salary" },
    { value: "Freelance", label: "Freelance" },
    { value: "Business", label: "Business" },
    { value: "Investments", label: "Investments" },
    { value: "Rental", label: "Rental" },
    { value: "Other", label: "Other" },
  ]

  const handleSubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new income
    const id = `income_${Date.now()}`

    // Format amount
    const amount = Number.parseFloat(formData.amount)
    const formattedAmount = !isNaN(amount)
      ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : formData.amount

    // Create new income object
    const newIncome: Income = {
      id,
      title: formData.title,
      amount: formattedAmount,
      description: formData.description,
    }

    onAddIncome(newIncome)
  }

  return (
    <DialogForm
      title="Add Income Source"
      description="Enter details about your income source"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Income Source
        </Button>
      }
      fields={[
        {
          id: "title",
          label: "Source Name",
          type: "select",
          options: incomeTypes,
          required: true,
        },
        {
          id: "amount",
          label: "Monthly Amount",
          type: "number",
          placeholder: "e.g., 3000",
          required: true,
        },
        {
          id: "description",
          label: "Description",
          type: "text",
          placeholder: "e.g., Monthly salary",
          required: false,
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Add Income"
    />
  )
}
