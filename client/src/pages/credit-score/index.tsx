"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, CreditCard, Clock, AlertCircle, CheckCircle, Download, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/layout/sidebar";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, ShieldCheck, AlertTriangle } from "lucide-react";


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
    let calculatedScore = 300
    calculatedScore += (paymentHistory / 100) * 300
    calculatedScore += ((100 - creditUtilization) / 100) * 255
    calculatedScore += (Math.min(creditAge, 30) / 30) * 128
    calculatedScore += ((10 - Math.min(inquiries, 10)) / 10) * 85
    calculatedScore += (creditMix / 5) * 85
    calculatedScore = Math.round(Math.min(calculatedScore, 850))

    setScore(calculatedScore)

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

  const scrollToRecommendations = () => {
    if (recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary" href="/credit-score">Credit Score</a>
          </nav>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
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
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">Your Credit Score</CardTitle>
                  <CardDescription>Last updated: April 22, 2025</CardDescription>
                </div>
                <ShieldCheck className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex flex-col items-center justify-center">
                  <div className="relative h-48 w-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                    <div className="absolute inset-[8px] rounded-full border-8 border-primary"></div>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${scoreColor}`}>{score}</div>
                      <div className="text-sm text-muted-foreground">{scoreCategory}</div>
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>300</span>
                      <span>580</span>
                      <span>670</span>
                      <span>740</span>
                      <span>800</span>
                      <span>850</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${(score - 300) / 550 * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <CardTitle>Credit Score Factors</CardTitle>
                <CardDescription>Factors that influence your credit score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Payment History</span>
                      </div>
                      <span className="text-sm font-medium">{paymentHistory}%</span>
                    </div>
                    <Slider value={paymentHistory} onChange={setPaymentHistory} min={0} max={100} />
                    <p className="mt-1 text-xs text-muted-foreground">You've never missed a payment. Keep it up!</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Credit Utilization</span>
                      </div>
                      <span className="text-sm font-medium">{creditUtilization}%</span>
                    </div>
                    <Slider value={creditUtilization} onChange={setCreditUtilization} min={0} max={100} />
                    <p className="mt-1 text-xs text-muted-foreground">You're using a small portion of your available credit. Excellent!</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium">Credit Age</span>
                      </div>
                      <span className="text-sm font-medium">{creditAge} years</span>
                    </div>
                    <Slider value={creditAge} onChange={setCreditAge} min={0} max={30} step={1} />
                    <p className="mt-1 text-xs text-muted-foreground">Your credit history is relatively young. This will improve with time.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Account Mix</span>
                      </div>
                      <span className="text-sm font-medium">{creditMix} accounts</span>
                    </div>
                    <Slider value={creditMix} onChange={setCreditMix} min={1} max={5} step={1} />
                    <p className="mt-1 text-xs text-muted-foreground">You have a good mix of credit types. This helps your score.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Recent Applications</span>
                      </div>
                      <span className="text-sm font-medium">{inquiries} inquiries</span>
                    </div>
                    <Slider value={inquiries} onChange={setInquiries} min={0} max={10} step={1} />
                    <p className="mt-1 text-xs text-muted-foreground">You have few recent credit inquiries. This is positive for your score.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Credit Score History</CardTitle>
                <CardDescription>How your credit score has changed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center border rounded-lg">
                <p className="text-sm text-muted-foreground">Credit score history chart will display here</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}