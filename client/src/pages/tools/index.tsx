import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calculator, CreditCard, Wrench, Calendar, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToolsPage() {
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
            <a className="font-medium transition-colors hover:text-primary" href="/tools">Tools</a>
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
            <h1 className="text-2xl font-bold">Financial Tools</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Loan Calculator</CardTitle>
                </div>
                <CardDescription>Calculate loan payments and amortization schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plan your loan payments, see how much interest you'll pay, and explore different scenarios with our comprehensive loan calculator.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Investment Calculator</CardTitle>
                </div>
                <CardDescription>Project your investment growth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Model your investment growth with different contribution strategies, interest rates, and time periods to reach your financial goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Debt Payoff Planner</CardTitle>
                </div>
                <CardDescription>Create a strategy to eliminate debt</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare debt payoff strategies like snowball and avalanche methods to find the most efficient way to become debt-free.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Planner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Retirement Calculator</CardTitle>
                </div>
                <CardDescription>Plan for your retirement needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Estimate how much you need to save for retirement and track your progress toward your retirement goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Tax Estimator</CardTitle>
                </div>
                <CardDescription>Estimate your tax liability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calculate potential tax liabilities and explore strategies to optimize your tax situation throughout the year.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Estimator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Budget Generator</CardTitle>
                </div>
                <CardDescription>Create a personalized budget template</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate a personalized budget based on your income, lifestyle, and financial goals with recommendations for each category.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Launch Generator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Health Check</CardTitle>
              <CardDescription>Evaluate your overall financial wellness</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Take our comprehensive financial health assessment to identify strengths and areas for improvement in your financial life.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <div className="mb-2 font-medium">Basic Assessment</div>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li>• Budget analysis</li>
                    <li>• Debt overview</li>
                    <li>• Emergency fund check</li>
                  </ul>
                  <Button variant="outline" className="w-full">Start Basic Check</Button>
                </div>
                
                <div className="border-2 border-primary rounded-lg p-4 relative">
                  <div className="absolute -top-3 right-3 bg-primary text-white text-xs px-2 py-0.5 rounded">Recommended</div>
                  <div className="mb-2 font-medium">Comprehensive Check</div>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li>• All basic checks</li>
                    <li>• Retirement readiness</li>
                    <li>• Investment analysis</li>
                    <li>• Insurance coverage review</li>
                  </ul>
                  <Button className="w-full">Start Comprehensive Check</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="mb-2 font-medium">Advanced Analysis</div>
                  <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                    <li>• All comprehensive checks</li>
                    <li>• Tax optimization</li>
                    <li>• Estate planning review</li>
                    <li>• Custom recommendations</li>
                  </ul>
                  <Button variant="outline" className="w-full">Start Advanced Analysis</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}