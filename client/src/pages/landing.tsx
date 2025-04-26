import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowRight, 
  Wallet, 
  ShieldCheck, 
  PieChart, 
  TrendingUp, 
  BarChart2, 
  Mic, 
  BookOpen, 
  Smartphone,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse move effect for hero section
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      
      const elements = hero.querySelectorAll('.animate-float');
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const speed = parseFloat(el.getAttribute('data-speed') || '5');
          const xOffset = x * speed;
          const yOffset = y * speed;
          el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
      });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>FinVault - Comprehensive Financial Management Platform</title>
      </Helmet>
      
      {/* Navbar */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <span className="font-bold text-xl">FinVault</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </a>
            <a href="#benefits" className="text-sm font-medium transition-colors hover:text-primary">
              Benefits
            </a>
            <a href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-16 md:pt-20"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-20">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Smart Financial Management for Your Future
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
                Track, analyze, and optimize your finances with AI-powered insights and blockchain integration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">
                    Explore Features
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Animated floating elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="animate-float" data-speed="2" style={{position: 'absolute', top: '15%', left: '10%'}}>
              <div className="h-32 w-32 bg-primary/5 rounded-full blur-2xl"></div>
            </div>
            <div className="animate-float" data-speed="3" style={{position: 'absolute', top: '50%', right: '15%'}}>
              <div className="h-40 w-40 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            <div className="animate-float" data-speed="4" style={{position: 'absolute', bottom: '10%', left: '30%'}}>
              <div className="h-24 w-24 bg-primary/10 rounded-full blur-xl"></div>
            </div>
            
            {/* Floating cards */}
            <div className="animate-float hidden md:block" data-speed="6" style={{position: 'absolute', top: '20%', right: '10%', transform: 'rotate(10deg)'}}>
              <Card className="w-48 h-24 opacity-40 shadow-lg">
                <CardContent className="p-3 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <div className="h-2 w-20 bg-primary/30 rounded mb-2"></div>
                    <div className="h-2 w-16 bg-primary/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="animate-float hidden md:block" data-speed="5" style={{position: 'absolute', bottom: '20%', left: '10%', transform: 'rotate(-5deg)'}}>
              <Card className="w-48 h-24 opacity-40 shadow-lg">
                <CardContent className="p-3 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <div className="h-2 w-20 bg-primary/30 rounded mb-2"></div>
                    <div className="h-2 w-16 bg-primary/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Dashboard preview */}
          <div className="container mx-auto relative z-10 pb-12 md:pb-24 mt-8 md:mt-0">
            <div className="max-w-5xl mx-auto bg-card rounded-xl overflow-hidden shadow-2xl border transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary/10 via-card to-card overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11/12 h-5/6 bg-background rounded-md shadow-md overflow-hidden">
                    <div className="w-full h-8 bg-muted flex items-center px-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-12 gap-4">
                      {/* Sidebar mockup */}
                      <div className="col-span-2 bg-muted/50 rounded-md h-[calc(100%-1rem)] p-2">
                        <div className="w-full h-6 bg-primary/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-primary/30 rounded mb-2"></div>
                        <div className="w-full h-4 bg-muted-foreground/20 rounded mb-2"></div>
                      </div>
                      
                      {/* Main content mockup */}
                      <div className="col-span-10 grid grid-cols-3 gap-4">
                        <div className="col-span-3">
                          <div className="w-1/3 h-8 bg-primary/20 rounded mb-2"></div>
                          <div className="w-2/3 h-4 bg-muted-foreground/20 rounded"></div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-md p-3">
                          <div className="w-1/2 h-4 bg-primary/30 rounded mb-2"></div>
                          <div className="w-full h-12 bg-primary/10 rounded"></div>
                        </div>
                        <div className="bg-muted/30 rounded-md p-3">
                          <div className="w-1/2 h-4 bg-primary/30 rounded mb-2"></div>
                          <div className="w-full h-12 bg-primary/10 rounded"></div>
                        </div>
                        <div className="bg-muted/30 rounded-md p-3">
                          <div className="w-1/2 h-4 bg-primary/30 rounded mb-2"></div>
                          <div className="w-full h-12 bg-primary/10 rounded"></div>
                        </div>
                        
                        <div className="col-span-2 bg-muted/30 rounded-md p-3">
                          <div className="w-1/3 h-4 bg-primary/30 rounded mb-2"></div>
                          <div className="w-full h-24 bg-primary/10 rounded"></div>
                        </div>
                        <div className="bg-muted/30 rounded-md p-3">
                          <div className="w-1/2 h-4 bg-primary/30 rounded mb-2"></div>
                          <div className="w-full h-24 bg-primary/10 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Powerful Features for Complete Financial Control
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your finances efficiently in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Asset Management</h3>
                  <p className="text-muted-foreground">
                    Track all your assets in one place with real-time valuation and growth monitoring.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Visualize your financial data with interactive charts and detailed reports.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Blockchain</h3>
                  <p className="text-muted-foreground">
                    Integrate with your crypto wallets for secure and transparent blockchain transactions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Budget Planning</h3>
                  <p className="text-muted-foreground">
                    Create detailed budgets, set financial goals, and track your spending habits.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Voice-Enabled Input</h3>
                  <p className="text-muted-foreground">
                    Add financial data using natural voice commands powered by AI technology.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Learning Hub</h3>
                  <p className="text-muted-foreground">
                    Access educational content and interactive tools to improve your financial literacy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section id="benefits" className="py-16 md:py-24 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="md:flex items-center gap-10">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Transform Your Financial Future
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  FinVault empowers you to take control of your finances with powerful tools
                  and insights that help you make better financial decisions.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Holistic Financial View</h3>
                      <p className="text-muted-foreground">
                        See your complete financial picture with integrated asset, liability, and cash flow tracking.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Time-Saving Automation</h3>
                      <p className="text-muted-foreground">
                        Save hours with automated tracking, voice input, and intelligent categorization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Smart Decision Support</h3>
                      <p className="text-muted-foreground">
                        Get personalized insights and recommendations to optimize your financial strategy.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/auth">
                      Get Started for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative z-10 aspect-square max-w-md mx-auto md:ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl opacity-50"></div>
                  <div className="relative z-20 w-full h-full flex items-center justify-center">
                    <div className="w-9/12 aspect-[3/6] bg-card rounded-[40px] border-8 border-background shadow-2xl overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-background via-background to-muted/50 p-4">
                        <div className="h-4 w-1/2 mx-auto bg-muted rounded-full mb-4"></div>
                        <div className="h-8 w-2/3 mx-auto bg-primary/10 rounded-lg mb-6"></div>
                        <div className="space-y-3">
                          <div className="h-16 bg-card rounded-lg shadow-sm border p-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 mr-2"></div>
                              <div className="flex-1">
                                <div className="h-3 w-16 bg-primary/20 rounded mb-1"></div>
                                <div className="h-2 w-24 bg-muted-foreground/20 rounded"></div>
                              </div>
                              <div className="h-6 w-12 bg-primary/10 rounded"></div>
                            </div>
                          </div>
                          <div className="h-16 bg-card rounded-lg shadow-sm border p-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 mr-2"></div>
                              <div className="flex-1">
                                <div className="h-3 w-16 bg-primary/20 rounded mb-1"></div>
                                <div className="h-2 w-24 bg-muted-foreground/20 rounded"></div>
                              </div>
                              <div className="h-6 w-12 bg-primary/10 rounded"></div>
                            </div>
                          </div>
                          <div className="h-16 bg-card rounded-lg shadow-sm border p-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 mr-2"></div>
                              <div className="flex-1">
                                <div className="h-3 w-16 bg-primary/20 rounded mb-1"></div>
                                <div className="h-2 w-24 bg-muted-foreground/20 rounded"></div>
                              </div>
                              <div className="h-6 w-12 bg-primary/10 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/70 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already taken control of their finances with FinVault.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/20 border-t py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <span className="font-bold">FinVault</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive financial management platform for modern investors.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Asset Tracking</a></li>
                <li><a href="#" className="hover:text-primary">Budget Planning</a></li>
                <li><a href="#" className="hover:text-primary">Crypto Integration</a></li>
                <li><a href="#" className="hover:text-primary">Voice Commands</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Learning Center</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 FinVault. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}