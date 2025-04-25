import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, ChevronRight, ExternalLink, Menu, Shield, Wallet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="hidden sm:inline-block font-bold text-xl">FinVault</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
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
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="font-bold text-xl">FinVault</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 p-6">
            <Link href="/features" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
              Features
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
              Pricing
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
              About
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/blog" className="flex items-center gap-2 text-lg font-medium hover:text-primary">
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background/95">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                  Master Your Finances With Blockchain Technology
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Secure. Transparent. Intelligent. FinVault combines traditional financial management with modern blockchain technology to give you complete control over your assets.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth">
                  <Button size="lg" className="gap-1.5">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Live Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center">
              <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-indigo-500/10 border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Manage Your Finances</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                FinVault combines powerful financial tools with blockchain technology to provide a comprehensive solution for your financial needs.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Asset Management</h3>
              <p className="text-muted-foreground text-center">Track all your traditional and crypto assets in a unified dashboard with real-time updates.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Blockchain Security</h3>
              <p className="text-muted-foreground text-center">Benefit from immutable transaction records and enhanced security through blockchain technology.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg className="h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
                  <path d="M12 18h1a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1" />
                  <rect width="6" height="8" x="2" y="10" rx="1" />
                  <rect width="6" height="8" x="16" y="6" rx="1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Advanced Analytics</h3>
              <p className="text-muted-foreground text-center">Gain insights into your financial health with comprehensive reports and predictive analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Select the perfect plan for your financial needs. All plans include our core features.
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold">Basic</h3>
                <div className="mt-4 text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">For individuals getting started with personal finance.</p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Basic financial dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Asset tracking up to 10 accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Standard budget tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Monthly financial reports</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 pt-0 mt-auto">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">Start for Free</Button>
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="flex flex-col rounded-lg border bg-background shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">Popular</div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Pro</h3>
                <div className="mt-4 text-3xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">For serious investors and finance enthusiasts.</p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited asset tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Advanced reporting and analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Blockchain wallet integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 pt-0 mt-auto">
                <Link href="/auth">
                  <Button className="w-full">Get Pro</Button>
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col rounded-lg border bg-background shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="mt-4 text-3xl font-bold">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">For businesses and wealth management professionals.</p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Multi-user access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Custom API integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Enterprise-grade security</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 pt-0 mt-auto">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Financial Future?</h2>
              <p className="max-w-[600px] md:text-xl">
                Join thousands of users who have already unlocked the power of FinVault for their financial journey.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth">
                <Button size="lg" className="bg-background text-primary hover:bg-background/90">Get Started</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="font-bold">FinVault</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern financial management with blockchain integration. Secure, transparent, and intelligent.</p>
            </div>
            <div className="space-y-4">
              <div className="font-medium">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/press" className="hover:text-primary">Press</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-medium">Product</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-primary">Security</Link></li>
                <li><Link href="/roadmap" className="hover:text-primary">Roadmap</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-medium">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-primary">Support</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}