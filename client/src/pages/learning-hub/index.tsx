import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { GraduationCap, BookOpen, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearningHubPage() {
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
            <a className="font-medium transition-colors hover:text-primary" href="/learning-hub">Learning Hub</a>
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
            <h1 className="text-2xl font-bold">Learning Hub</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Featured Course</CardTitle>
                <CardDescription>Building Financial Independence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="aspect-video bg-muted rounded-lg col-span-1 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium">Master Your Finances</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Learn the fundamental principles of personal finance, investing, and wealth building in this comprehensive course designed for beginners and intermediate learners.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">12 Modules</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">24 Videos</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Certificate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Start Learning</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Basics</CardTitle>
                <CardDescription>Learn the fundamentals of investing</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <div className="text-sm text-muted-foreground">8 lessons</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budgeting Strategies</CardTitle>
                <CardDescription>Master your financial planning</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <div className="text-sm text-muted-foreground">6 lessons</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blockchain Fundamentals</CardTitle>
                <CardDescription>Understanding cryptocurrency basics</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <div className="text-sm text-muted-foreground">10 lessons</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Financial wisdom to help you on your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">The Psychology of Investing: Understanding Risk Tolerance</h3>
                    <p className="text-xs text-muted-foreground mt-1">Learn how your psychology affects investment decisions and strategies for managing emotions.</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Digital Assets: The Future of Investment?</h3>
                    <p className="text-xs text-muted-foreground mt-1">Explore the growing world of digital assets and their potential place in diversified portfolios.</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Mastering Debt: Strategies for Financial Freedom</h3>
                    <p className="text-xs text-muted-foreground mt-1">Practical approaches to managing and eliminating debt efficiently.</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Building a Resilient Portfolio in Uncertain Times</h3>
                    <p className="text-xs text-muted-foreground mt-1">How to create an investment strategy that can weather market volatility.</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}