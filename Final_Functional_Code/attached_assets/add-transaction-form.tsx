"use client"

import { DialogForm } from "@/components/ui/dialog-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export interface Transaction {
  id: string
  hash: string
  from: string
  to: string
  amount: string
  type: string
  timestamp: string
  status: "verified" | "pending" | "rejected"
  confirmations: number
}

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void
}

export function AddTransactionForm({ onAddTransaction }: AddTransactionFormProps) {
  const transactionTypes = [
    { value: "Payment", label: "Payment" },
    { value: "Deposit", label: "Deposit" },
    { value: "Transfer", label: "Transfer" },
    { value: "Withdrawal", label: "Withdrawal" },
    { value: "Loan Payment", label: "Loan Payment" },
    { value: "Credit Card Payment", label: "Credit Card Payment" },
    { value: "Other", label: "Other" },
  ]

  const handleSubmit = (formData: Record<string, any>) => {
    // Generate a unique ID for the new transaction
    const id = `tx_${Date.now()}`

    // Generate random hash
    const hash = generateRandomHash()

    // Create formatted strings
    const fromAddress =
      formData.from.length > 12
        ? `${formData.from.substring(0, 6)}...${formData.from.substring(formData.from.length - 4)}`
        : formData.from

    const toAddress =
      formData.to.length > 12
        ? `${formData.to.substring(0, 6)}...${formData.to.substring(formData.to.length - 4)}`
        : formData.to

    // Format amount
    const numericAmount = Number.parseFloat(formData.amount)
    const formattedAmount = isNaN(numericAmount)
      ? formData.amount
      : `$${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    // Create new transaction object
    const newTransaction: Transaction = {
      id,
      hash,
      from: fromAddress,
      to: toAddress,
      amount: formattedAmount,
      type: formData.type,
      timestamp: new Date().toISOString(),
      status: "pending",
      confirmations: Math.floor(Math.random() * 5) + 1,
    }

    onAddTransaction(newTransaction)
  }

  // Helper to generate random hash
  const generateRandomHash = () => {
    const characters = "0123456789abcdef"
    let result = "0x"
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  return (
    <DialogForm
      title="Add New Transaction"
      description="Enter transaction details to be stored on the blockchain"
      triggerButton={
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      }
      fields={[
        {
          id: "from",
          label: "From Address",
          type: "text",
          placeholder: "e.g., 0x1234...5678",
          required: true,
        },
        {
          id: "to",
          label: "To Address",
          type: "text",
          placeholder: "e.g., 0x8765...4321",
          required: true,
        },
        {
          id: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g., 100",
          required: true,
        },
        {
          id: "type",
          label: "Transaction Type",
          type: "select",
          options: transactionTypes,
          required: true,
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Submit Transaction"
    />
  )
}
