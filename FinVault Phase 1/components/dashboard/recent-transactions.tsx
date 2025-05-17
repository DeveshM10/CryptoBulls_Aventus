import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Home, ShoppingBag, Utensils } from "lucide-react"

const transactions = [
  {
    id: "t1",
    description: "Mortgage Payment",
    amount: -1250.0,
    date: "Apr 12, 2025",
    type: "expense",
    category: "Housing",
    icon: <Home className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "t2",
    description: "Salary Deposit",
    amount: 4200.0,
    date: "Apr 10, 2025",
    type: "income",
    category: "Income",
    icon: <ArrowDownLeft className="h-4 w-4" />,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    id: "t3",
    description: "Grocery Store",
    amount: -128.42,
    date: "Apr 8, 2025",
    type: "expense",
    category: "Food",
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    id: "t4",
    description: "Restaurant Dinner",
    amount: -86.3,
    date: "Apr 5, 2025",
    type: "expense",
    category: "Dining",
    icon: <Utensils className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "t5",
    description: "Credit Card Payment",
    amount: -450.0,
    date: "Apr 3, 2025",
    type: "expense",
    category: "Debt",
    icon: <CreditCard className="h-4 w-4" />,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Avatar className={`mr-4 h-9 w-9 ${transaction.color}`}>
                <AvatarFallback>{transaction.icon}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={transaction.type === "income" ? "outline" : "secondary"} className="rounded-sm">
                  {transaction.category}
                </Badge>
                <span
                  className={`text-sm font-medium ${transaction.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {transaction.amount > 0 ? (
                    <span className="flex items-center">
                      <ArrowDownLeft className="mr-1 h-4 w-4" />${transaction.amount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
