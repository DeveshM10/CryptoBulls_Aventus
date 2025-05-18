"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DialogForm } from "@/components/ui/dialog-form"

// Sample financial goals data
// In a real app, this would come from an API
const initialGoals = [
  {
    id: 1,
    name: "Emergency Fund",
    target: 25000,
    current: 15000,
    deadline: "Dec 2025",
    status: "on-track", // on-track, behind, ahead
  },
  {
    id: 2,
    name: "Down Payment",
    target: 60000,
    current: 12000,
    deadline: "Jun 2026",
    status: "behind",
  },
  {
    id: 3,
    name: "Vacation Fund",
    target: 5000,
    current: 4200,
    deadline: "Aug 2025",
    status: "ahead",
  },
]

export function FinancialGoals() {
  const [goals, setGoals] = useState(initialGoals)

  const handleAddGoal = (formData: Record<string, any>) => {
    const newGoal = {
      id: Date.now(),
      name: formData.name,
      target: Number(formData.target),
      current: Number(formData.current),
      deadline: formData.deadline,
      status:
        Number(formData.current) / Number(formData.target) > 0.8
          ? "ahead"
          : Number(formData.current) / Number(formData.target) > 0.5
            ? "on-track"
            : "behind",
    }

    setGoals([...goals, newGoal])
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{goal.name}</h3>
              <p className="text-xs text-muted-foreground">
                Target: ${goal.target.toLocaleString()} by {goal.deadline}
              </p>
            </div>
            <StatusBadge status={goal.status} />
          </div>

          <div className="space-y-1">
            <Progress
              value={(goal.current / goal.target) * 100}
              className="h-2"
              indicatorClassName={
                goal.status === "ahead" ? "bg-emerald-500" : goal.status === "behind" ? "bg-rose-500" : "bg-primary"
              }
            />
            <div className="flex justify-between text-xs">
              <span>${goal.current.toLocaleString()}</span>
              <span className="text-muted-foreground">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      ))}

      {goals.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>No financial goals set yet.</p>
          <p className="text-sm">Create goals to track your financial progress.</p>
        </div>
      )}

      <div className="flex justify-end">
        <DialogForm
          title="Add New Financial Goal"
          description="Set a new financial goal to track your progress"
          triggerButton={
            <Button size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          }
          fields={[
            {
              id: "name",
              label: "Goal Name",
              type: "text",
              placeholder: "e.g., New Car Fund",
              required: true,
            },
            {
              id: "target",
              label: "Target Amount",
              type: "number",
              placeholder: "e.g., 10000",
              required: true,
            },
            {
              id: "current",
              label: "Current Amount",
              type: "number",
              placeholder: "e.g., 2500",
              required: true,
            },
            {
              id: "deadline",
              label: "Deadline",
              type: "text",
              placeholder: "e.g., Dec 2026",
              required: true,
            },
          ]}
          onSubmit={handleAddGoal}
          submitLabel="Add Goal"
        />
      </div>
    </div>
  )
}

// Helper component for status badges
function StatusBadge({ status }) {
  if (status === "on-track") {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        On Track
      </Badge>
    )
  }

  if (status === "ahead") {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
        Ahead
      </Badge>
    )
  }

  if (status === "behind") {
    return (
      <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
        Behind
      </Badge>
    )
  }

  return null
}
