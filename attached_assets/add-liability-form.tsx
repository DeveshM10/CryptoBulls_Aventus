"use client"

import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export interface Liability {
  id: string
  title: string
  amount: string
  type: string
  interest: string
  payment: string
  dueDate: string
  status: "current" | "warning" | "late"
}

interface AddLiabilityFormProps {
  onAddLiability: (liability: Liability) => void
}

export function AddLiabilityForm({ onAddLiability }: AddLiabilityFormProps) {
  const liabilityTypes = [
    { value: "Home Loan", label: "Home Loan" },
    { value: "Vehicle Loan", label: "Vehicle Loan" },
    { value: "Student Loan", label: "Student Loan" },
    { value: "Personal Loan", label: "Personal Loan" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Revolving Credit", label: "Revolving Credit" },
    { value: "Other", label: "Other" },
  ]

  const statusOptions = [
    { value: "current", label: "Current" },
    { value: "warning", label: "Warning" },
    { value: "late", label: "Late" },
  ]

  const handleSubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new liability
    const id = `liability_${Date.now()}`

    // Extract numeric value for consistent formatting
    const numericValue = Number.parseFloat(formData.amount)
    const formattedAmount = !isNaN(numericValue)
      ? `$${numericValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : formData.amount

    // Create new liability object
    const newLiability: Liability = {
      id,
      title: formData.title,
      amount: formattedAmount,
      type: formData.type,
      interest: `${formData.interest}%`,
      payment: `$${formData.payment} / month`,
      dueDate: formData.dueDate,
      status: formData.status as "current" | "warning" | "late",
    }

    onAddLiability(newLiability)
  }

  return (
    <DialogForm
      title="Add New Liability"
      description="Enter the details of your new liability"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Liability
        </Button>
      }
      fields={[
        {
          id: "title",
          label: "Liability Name",
          type: "text",
          placeholder: "e.g., Mortgage",
          required: true,
        },
        {
          id: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g., 250000",
          required: true,
        },
        {
          id: "type",
          label: "Type",
          type: "select",
          options: liabilityTypes,
          required: true,
        },
        {
          id: "interest",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g., 3.25",
          required: true,
        },
        {
          id: "payment",
          label: "Monthly Payment",
          type: "number",
          placeholder: "e.g., 1250",
          required: true,
        },
        {
          id: "dueDate",
          label: "Due Date",
          type: "text",
          placeholder: "e.g., 15th of each month",
          required: true,
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: statusOptions,
          required: true,
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Add Liability"
    />
  )
}
