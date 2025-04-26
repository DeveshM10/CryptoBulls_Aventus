import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  BarChart3, 
  Check, 
  ChevronRight, 
  Coins, 
  CreditCard, 
  ExternalLink, 
  LineChart, 
  Lock, 
  Menu, 
  Shield, 
  Smartphone, 
  Wallet, 
  X,
  Rocket,
  Sparkles,
  Zap,
  Layers,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { AnimatedBackground } from '@/components/animations/animated-background';
import { ThreeDCard } from '@/components/animations/3d-card';
import { CursorGlow } from '@/components/animations/cursor-glow';
import { ThreeDScene } from '@/components/animations/3d-scene';
import { motion } from 'framer-motion';

// Animated text component
const AnimatedText = ({ children, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.6, 
      delay, 
      ease: [0.215, 0.61, 0.355, 1] 
    }}
    className="inline-block"
  >
    {children}
  </motion.span>
);

// Animated feature card
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 0.4, 
      delay,
      ease: "easeOut"
    }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <ThreeDCard className="flex flex-col items-center space-y-4 border rounded-lg p-6 bg-background shadow-sm">
      <div className="p-3 rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </ThreeDCard>
  </motion.div>
);

// Animated number counter
const CountUpAnimation = ({ target, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  
  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  );
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <CursorGlow />
      
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden sm:inline-block font-bold text-xl"
              >
                FinVault
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background/60 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ThreeDScene />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <motion.h1 
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                    Master Your Finances With Blockchain Technology
                  </span>
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  <AnimatedText delay={0.4}>Secure. Transparent. Intelligent.</AnimatedText> <AnimatedText delay={0.6}>FinVault combines traditional financial management with modern blockchain technology to give you complete control over your assets.</AnimatedText>
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col gap-2 min-[400px]:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              >
                <Link href="/auth">
                  <Button size="lg" className="gap-1.5 relative overflow-hidden group">
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="relative overflow-hidden group">
                    <span className="relative z-10">Live Demo</span>
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                className="flex flex-col gap-2 pt-6 mt-6 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <div className="flex flex-col">
                    <span className="text-xl md:text-3xl font-bold text-primary">
                      <CountUpAnimation target={5000} prefix="+" />
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">Active Users</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl md:text-3xl font-bold text-primary">
                      <CountUpAnimation target={99} suffix="%" />
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">Security Rating</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl md:text-3xl font-bold text-primary">
                      <CountUpAnimation target={75} suffix="M" />
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">Transactions</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mx-auto flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              <ThreeDCard 
                className="w-full h-[350px] md:h-[400px] lg:h-[500px] border border-primary/20 bg-gradient-to-br from-primary/5 via-indigo-500/5 to-background rounded-xl overflow-hidden"
                glowColor="rgba(124, 58, 237, 0.4)"
              >
                <div className="p-8 h-full flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background/60" />
                  
                  <motion.div 
                    className="mb-6 p-6 rounded-full bg-primary/10 relative z-10"
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </motion.div>
                  
                  <div className="space-y-4 text-center relative z-10">
                    <h3 className="text-2xl font-bold">Blockchain-Powered Finance</h3>
                    <p className="text-muted-foreground">Track, manage, and grow your assets with advanced security and real-time insights.</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <motion.div 
                        className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Wallet className="h-4 w-4" />
                        <span className="text-sm">Crypto</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <LineChart className="h-4 w-4" />
                        <span className="text-sm">Analytics</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Lock className="h-4 w-4" />
                        <span className="text-sm">Secure</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">Fast</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/90 z-0" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Key Features
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Manage Your Finances</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                FinVault combines powerful financial tools with blockchain technology to provide a comprehensive solution for your financial needs.
              </p>
            </motion.div>
          </div>
          
          <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <FeatureCard 
              icon={<Wallet className="h-10 w-10 text-primary" />}
              title="Asset Management"
              description="Track all your traditional and crypto assets in a unified dashboard with real-time updates."
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Blockchain Security"
              description="Benefit from immutable transaction records and enhanced security through blockchain technology."
              delay={0.3}
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Advanced Analytics"
              description="Gain insights into your financial health with comprehensive reports and predictive analytics."
              delay={0.4}
            />
            
            <FeatureCard 
              icon={<Coins className="h-10 w-10 text-primary" />}
              title="Smart Budgeting"
              description="Create intelligent budgets that adapt to your spending habits and financial goals."
              delay={0.5}
            />
            
            <FeatureCard 
              icon={<CreditCard className="h-10 w-10 text-primary" />}
              title="Expense Tracking"
              description="Automatically categorize and monitor your expenses with AI-powered insights."
              delay={0.6}
            />
            
            <FeatureCard 
              icon={<Rocket className="h-10 w-10 text-primary" />}
              title="Goal Planning"
              description="Set and track your financial goals with customized strategies and timelines."
              delay={0.7}
            />
          </div>
          
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/features">
              <Button size="lg" className="gap-2 group">
                Explore All Features
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" /> Testimonials
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied users who have transformed their financial management with FinVault.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial Cards */}
            {[
              {
                name: "Priya Sharma",
                role: "Small Business Owner",
                content: "FinVault has completely transformed how I manage my business finances. The blockchain integration gives me peace of mind knowing my records are secure and immutable.",
                delay: 0.2
              },
              {
                name: "Alexander Chen",
                role: "Personal Investor",
                content: "The analytics and insights provided by FinVault have helped me make smarter investment decisions. I've seen a 15% improvement in my portfolio since I started using it.",
                delay: 0.3
              },
              {
                name: "Sophia Williams",
                role: "Freelance Developer",
                content: "As someone who gets paid in multiple currencies including crypto, FinVault has been invaluable in helping me track my income and expenses across different asset types.",
                delay: 0.4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="border border-white/10 rounded-lg p-6 bg-white/5 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-lg mb-6 flex-grow">{testimonial.content}</p>
                  
                  <div className="flex items-center mt-auto">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="font-medium text-lg">{testimonial.name[0]}</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-primary-foreground/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="font-bold">FinVault</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Blockchain-powered financial management<br />
              Secure. Transparent. Intelligent.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground transition-colors hover:text-foreground">Integrations</Link></li>
                <li><Link href="/security" className="text-muted-foreground transition-colors hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About Us</Link></li>
                <li><Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-muted-foreground transition-colors hover:text-foreground">Help Center</Link></li>
                <li><Link href="/documentation" className="text-muted-foreground transition-colors hover:text-foreground">Documentation</Link></li>
                <li><Link href="/guides" className="text-muted-foreground transition-colors hover:text-foreground">Guides</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">Terms</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">© 2025 FinVault. All rights reserved.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="/twitter" className="transition-colors hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="/github" className="transition-colors hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="/linkedin" className="transition-colors hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}