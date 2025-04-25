"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, CreditCard, Clock, AlertCircle, CheckCircle, Download, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreditScorePage() {
  // State for credit score factors
  const [creditUtilization, setCreditUtilization] = useState(30)
  const [paymentHistory, setPaymentHistory] = useState(95)
  const [creditAge, setCreditAge] = useState(5)
  const [inquiries, setInquiries] = useState(2)
  const [creditMix, setCreditMix] = useState(3)

  // State for calculated score
  const [score, setScore] = useState(0)
  const [scoreCategory, setScoreCategory] = useState("")
  const [scoreColor, setScoreColor] = useState("")

  // Reference to recommendations section for scrolling
  const recommendationsRef = useRef<HTMLDivElement | null>(null)

  // Calculate credit score based on factors
  useEffect(() => {
    // This is a simplified credit score calculation for demonstration
    // In a real app, this would use a more complex algorithm

    // Base score
    let calculatedScore = 300

    // Payment history (35% of score) - 95% to 100% is excellent
    calculatedScore += (paymentHistory / 100) * 300

    // Credit utilization (30% of score) - lower is better
    calculatedScore += ((100 - creditUtilization) / 100) * 255

    // Credit age (15% of score) - longer is better (max 30 years)
    calculatedScore += (Math.min(creditAge, 30) / 30) * 128

    // Credit inquiries (10% of score) - fewer is better (0-10 scale)
    calculatedScore += ((10 - Math.min(inquiries, 10)) / 10) * 85

    // Credit mix (10% of score) - more diverse is better (1-5 scale)
    calculatedScore += (creditMix / 5) * 85

    // Round to nearest whole number
    calculatedScore = Math.round(calculatedScore)

    // Cap at 850
    calculatedScore = Math.min(calculatedScore, 850)

    setScore(calculatedScore)

    // Determine score category and color
    if (calculatedScore >= 800) {
      setScoreCategory("Exceptional")
      setScoreColor("text-emerald-500")
    } else if (calculatedScore >= 740) {
      setScoreCategory("Very Good")
      setScoreColor("text-emerald-500")
    } else if (calculatedScore >= 670) {
      setScoreCategory("Good")
      setScoreColor("text-blue-500")
    } else if (calculatedScore >= 580) {
      setScoreCategory("Fair")
      setScoreColor("text-amber-500")
    } else {
      setScoreCategory("Poor")
      setScoreColor("text-rose-500")
    }
  }, [creditUtilization, paymentHistory, creditAge, inquiries, creditMix])

  // Function to scroll to recommendations section
  const scrollToRecommendations = () => {
    if (recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Credit Score Simulator</h2>
          <p className="text-muted-foreground">Adjust the factors below to see how they affect your credit score</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Credit Score Factors</CardTitle>
            <CardDescription>Adjust these factors to see how they impact your credit score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credit Utilization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-primary" />
                  <h3 className="font-medium">Credit Utilization</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The percentage of your available credit that you're using</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span
                  className={`text-sm font-medium ${creditUtilization <= 30 ? "text-emerald-500" : creditUtilization <= 50 ? "text-amber-500" : "text-rose-500"}`}
                >
                  {creditUtilization}%
                </span>
              </div>
              <Slider
                value={[creditUtilization]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setCreditUtilization(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (Excellent)</span>
                <span>30% (Good)</span>
                <span>100% (Poor)</span>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <h3 className="font-medium">Payment History</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The percentage of payments you've made on time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span
                  className={`text-sm font-medium ${paymentHistory >= 95 ? "text-emerald-500" : paymentHistory >= 85 ? "text-amber-500" : "text-rose-500"}`}
                >
                  {paymentHistory}%
                </span>
              </div>
              <Slider
                value={[paymentHistory]}
                min={50}
                max={100}
                step={1}
                onValueChange={(value) => setPaymentHistory(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50% (Poor)</span>
                <span>90% (Good)</span>
                <span>100% (Excellent)</span>
              </div>
            </div>

            {/* Credit Age */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <h3 className="font-medium">Credit Age</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The average age of your credit accounts in years</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span
                  className={`text-sm font-medium ${creditAge >= 7 ? "text-emerald-500" : creditAge >= 3 ? "text-amber-500" : "text-rose-500"}`}
                >
                  {creditAge} {creditAge === 1 ? "year" : "years"}
                </span>
              </div>
              <Slider
                value={[creditAge]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setCreditAge(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 year (Poor)</span>
                <span>7 years (Good)</span>
                <span>30 years (Excellent)</span>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-primary" />
                  <h3 className="font-medium">Recent Inquiries</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The number of hard inquiries on your credit report in the last 2 years</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span
                  className={`text-sm font-medium ${inquiries <= 2 ? "text-emerald-500" : inquiries <= 5 ? "text-amber-500" : "text-rose-500"}`}
                >
                  {inquiries}
                </span>
              </div>
              <Slider
                value={[inquiries]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => setInquiries(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 (Excellent)</span>
                <span>3-5 (Good)</span>
                <span>10+ (Poor)</span>
              </div>
            </div>

            {/* Credit Mix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                  <h3 className="font-medium">Credit Mix</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The variety of credit accounts you have (credit cards, loans, etc.)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span
                  className={`text-sm font-medium ${creditMix >= 4 ? "text-emerald-500" : creditMix >= 2 ? "text-amber-500" : "text-rose-500"}`}
                >
                  {creditMix} {creditMix === 1 ? "type" : "types"}
                </span>
              </div>
              <Slider
                value={[creditMix]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setCreditMix(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 type (Poor)</span>
                <span>3 types (Good)</span>
                <span>5 types (Excellent)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Estimated Score</CardTitle>
              <CardDescription>Based on the factors you've selected</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-4">
                <svg className="w-32 h-32">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${scoreColor} stroke-current`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${((score - 300) / 550) * 352} 352`}
                    strokeDashoffset="88"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
                  <span className="text-sm text-muted-foreground">out of 850</span>
                </div>
              </div>
              <div className={`text-lg font-medium ${scoreColor}`}>{scoreCategory}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={scrollToRecommendations}>
                Get Personalized Tips
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Impact of each factor on your score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment History</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credit Utilization</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "30%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credit Age</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "15%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credit Mix</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "10%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Credit</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "10%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card ref={recommendationsRef}>
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
          <CardDescription>Personalized tips to improve your credit score</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="short-term">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="short-term">Short-term</TabsTrigger>
              <TabsTrigger value="long-term">Long-term</TabsTrigger>
            </TabsList>
            <TabsContent value="short-term" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Reduce Credit Utilization</h3>
                <p className="text-sm text-muted-foreground">
                  Try to keep your credit utilization below 30%. Pay down your credit card balances or request a credit
                  limit increase.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Make All Payments On Time</h3>
                <p className="text-sm text-muted-foreground">
                  Set up automatic payments to ensure you never miss a due date. Late payments can significantly impact
                  your score.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Limit New Credit Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Each application can result in a hard inquiry, which can temporarily lower your score. Space out
                  applications when possible.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="long-term" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Maintain Older Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your oldest credit accounts open to increase your average credit age. Consider using them
                  occasionally to prevent closure.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Diversify Your Credit Mix</h3>
                <p className="text-sm text-muted-foreground">
                  Having a mix of credit types (credit cards, loans, mortgage) can improve your score over time.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Monitor Your Credit Report</h3>
                <p className="text-sm text-muted-foreground">
                  Regularly check your credit report for errors and dispute any inaccuracies you find.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
