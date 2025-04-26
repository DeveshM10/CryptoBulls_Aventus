
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
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 via-background to-background z-0" />
      <AnimatedBackground />

      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="hidden sm:inline-block font-bold text-xl text-foreground">FinVault</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium text-foreground hover:text-primary">Features</Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary">About</Link>
            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary">Blog</Link>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/auth">
              <Button variant="outline" className="hidden md:flex">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button className="hidden md:flex">Sign Up</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="font-bold text-xl text-foreground">FinVault</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="container grid gap-4 p-4">
            <Link href="/features" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              Features
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              About
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/blog" className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary">
              Blog
              <ChevronRight className="h-4 w-4" />
            </Link>
            <div className="flex flex-col gap-2 mt-4">
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
      <section className="w-full py-8 md:py-16 lg:py-20 relative">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  Transform Your{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500 font-extrabold">
                    Financial Future
                  </span>
                </h1>
                <p className="max-w-[600px] text-lg text-foreground/90 md:text-xl font-medium">
                  Experience the next generation of financial management with blockchain technology. Secure, transparent, and intelligent.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto gap-1.5 bg-primary hover:bg-primary/90">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Live Demo</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center">
              <ThreeDCard className="w-full h-[400px] border bg-card shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Financial Dashboard"
                  className="w-full h-full object-cover rounded-lg opacity-90"
                />
              </ThreeDCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-8 md:py-16 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Core Features</div>
              <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">The Future of Finance is Here</h2>
              <p className="max-w-[900px] text-foreground/90 md:text-xl/relaxed">
                Discover how FinVault revolutionizes your financial management with cutting-edge technology.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 py-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <ThreeDCard className="flex flex-col items-center space-y-4 border rounded-lg p-6 bg-card shadow-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Smart Portfolio</h3>
              <p className="text-foreground/90 text-center">Manage all your assets in one place with real-time tracking and insights.</p>
            </ThreeDCard>

            <ThreeDCard className="flex flex-col items-center space-y-4 border rounded-lg p-6 bg-card shadow-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Blockchain Security</h3>
              <p className="text-foreground/90 text-center">Enterprise-grade security powered by blockchain technology.</p>
            </ThreeDCard>

            <ThreeDCard className="flex flex-col items-center space-y-4 border rounded-lg p-6 bg-card shadow-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">AI Analytics</h3>
              <p className="text-foreground/90 text-center">Make informed decisions with AI-powered financial insights.</p>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t bg-background/95">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="font-bold text-foreground">FinVault</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-foreground/90 hover:text-primary">Privacy</Link>
              <Link href="/terms" className="text-sm text-foreground/90 hover:text-primary">Terms</Link>
              <Link href="/contact" className="text-sm text-foreground/90 hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
