
import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronRight, Menu, X, Shield, LineChart, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { AnimatedBackground } from '@/components/animations/animated-background';
import { ThreeDCard } from '@/components/animations/3d-card';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 via-background to-background z-0" />
      <AnimatedBackground />

      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="hidden sm:inline-block font-bold text-xl text-foreground">FinVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Blog</Link>
            <ModeToggle />
            <Link href="/auth">
              <Button variant="outline" className="mr-2">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button>Sign Up</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="font-bold text-xl text-foreground">FinVault</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container mt-4 grid gap-4">
            <Link href="/features" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              Features <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              About <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/blog" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              Blog <ChevronRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 space-y-2">
              <Link href="/auth">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Transform Your Financial Future
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                  Experience the next generation of financial management with blockchain technology. Secure, transparent, and intelligent.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Live Demo</Button>
                </Link>
              </div>
            </div>
            <div className="lg:pl-10">
              <ThreeDCard className="w-full aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl" />
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Financial Dashboard"
                  className="w-full h-full object-cover rounded-xl shadow-2xl"
                />
              </ThreeDCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Core Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Discover how FinVault revolutionizes your financial management with cutting-edge technology.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <ThreeDCard className="p-6 bg-background rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="p-3 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Portfolio</h3>
                <p className="text-muted-foreground">Manage all your assets in one place with real-time tracking and insights.</p>
              </div>
            </ThreeDCard>

            <ThreeDCard className="p-6 bg-background rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="p-3 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Blockchain Security</h3>
                <p className="text-muted-foreground">Enterprise-grade security powered by blockchain technology.</p>
              </div>
            </ThreeDCard>

            <ThreeDCard className="p-6 bg-background rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="p-3 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Analytics</h3>
                <p className="text-muted-foreground">Make informed decisions with AI-powered financial insights.</p>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-semibold">FinVault</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
