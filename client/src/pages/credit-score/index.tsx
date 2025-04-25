import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, RefreshCw, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CreditScorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Credit Score</h1>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Score
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
                      <div className="text-5xl font-bold">785</div>
                      <div className="text-sm text-muted-foreground">Excellent</div>
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Poor</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Very Good</span>
                      <span>Excellent</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "78.5%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>300</span>
                      <span>850</span>
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
                      <span className="text-sm font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">You've never missed a payment. Keep it up!</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Credit Utilization</span>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">You're using a small portion of your available credit. Excellent!</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium">Credit Age</span>
                      </div>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">Your credit history is relatively young. This will improve with time.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Account Mix</span>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">You have a good mix of credit types. This helps your score.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Recent Applications</span>
                      </div>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
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
  );
}