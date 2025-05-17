"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Info, Wallet, CreditCard, Percent } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function QuickStats() {
  // State to track which card is being hovered
  const [isHovered, setIsHovered] = useState(null)

  // Sample stats data
  // In a real app, this would come from an API
  const stats = [
    {
      title: "Net Worth",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      info: "Your total assets minus total liabilities",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Assets",
      value: "$68,500.00",
      change: "+10.5%",
      trend: "up",
      info: "The total value of everything you own",
      icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Liabilities",
      value: "$23,268.11",
      change: "-2.5%",
      trend: "down",
      info: "The total amount of debt you owe",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Debt-to-Income",
      value: "28%",
      change: "-1.2%",
      trend: "down",
      info: "Your monthly debt payments divided by your gross monthly income",
      icon: <Percent className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`overflow-hidden border bg-card text-card-foreground shadow-sm transition-all duration-200 ${
            isHovered === index ? "shadow-md scale-[1.02]" : ""
          }`}
          onMouseEnter={() => setIsHovered(index)}
          onMouseLeave={() => setIsHovered(null)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 inline-flex">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stat.info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"} inline-flex items-center`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {stat.change}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
