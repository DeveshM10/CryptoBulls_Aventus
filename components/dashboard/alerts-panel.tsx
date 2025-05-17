import { AlertCircle, TrendingUp, CreditCard, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertsPanel() {
  return (
    <div className="space-y-4">
      <Alert variant="default" className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950">
        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <AlertTitle className="text-emerald-600 dark:text-emerald-400">Investment Opportunity</AlertTitle>
        <AlertDescription className="text-emerald-600/90 dark:text-emerald-400/90 text-sm">
          Your savings account has excess funds. Consider investing $5,000 in index funds.
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-600 dark:text-amber-400">Upcoming Payment</AlertTitle>
        <AlertDescription className="text-amber-600/90 dark:text-amber-400/90 text-sm">
          Home loan payment of $1,250 due in 3 days. Ensure sufficient funds in your account.
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950">
        <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        <AlertTitle className="text-rose-600 dark:text-rose-400">Credit Utilization</AlertTitle>
        <AlertDescription className="text-rose-600/90 dark:text-rose-400/90 text-sm">
          Your credit card utilization is at 45%. Consider paying down balances to improve your credit score.
        </AlertDescription>
      </Alert>

      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Budget Alert</AlertTitle>
        <AlertDescription className="text-sm">
          You've reached 85% of your dining out budget for this month.
        </AlertDescription>
      </Alert>
    </div>
  )
}
