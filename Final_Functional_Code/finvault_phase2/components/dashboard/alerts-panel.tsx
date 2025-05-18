"use client"

import { useState } from "react"
import { AlertCircle, TrendingUp, CreditCard, Calendar, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertsPanel() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "success",
      icon: <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      title: "Investment Opportunity",
      description: "Your savings account has excess funds. Consider investing $5,000 in index funds.",
      color: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950",
      titleColor: "text-emerald-600 dark:text-emerald-400",
      descColor: "text-emerald-600/90 dark:text-emerald-400/90",
    },
    {
      id: 2,
      type: "warning",
      icon: <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      title: "Upcoming Payment",
      description: "Home loan payment of $1,250 due in 3 days. Ensure sufficient funds in your account.",
      color: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
      titleColor: "text-amber-600 dark:text-amber-400",
      descColor: "text-amber-600/90 dark:text-amber-400/90",
    },
    {
      id: 3,
      type: "error",
      icon: <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
      title: "Credit Utilization",
      description:
        "Your credit card utilization is at 45%. Consider paying down balances to improve your credit score.",
      color: "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950",
      titleColor: "text-rose-600 dark:text-rose-400",
      descColor: "text-rose-600/90 dark:text-rose-400/90",
    },
    {
      id: 4,
      type: "info",
      icon: <AlertCircle className="h-4 w-4" />,
      title: "Budget Alert",
      description: "You've reached 85% of your dining out budget for this month.",
      color: "",
      titleColor: "",
      descColor: "",
    },
  ])

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <div className="space-y-4">
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant="default"
            className={`${alert.color} relative group transition-all duration-200 hover:shadow-sm`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => dismissAlert(alert.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Dismiss</span>
            </Button>
            {alert.icon}
            <AlertTitle className={alert.titleColor}>{alert.title}</AlertTitle>
            <AlertDescription className={`${alert.descColor} text-sm`}>{alert.description}</AlertDescription>
          </Alert>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
          <p className="text-muted-foreground">No alerts at this time</p>
          <p className="text-xs text-muted-foreground mt-1">We'll notify you when there's something important</p>
        </div>
      )}
    </div>
  )
}
