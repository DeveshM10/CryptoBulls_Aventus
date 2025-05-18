"use client"

import { HeroSection } from "@/components/landing/hero-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, PieChart, BarChart, LineChart, Wallet, TrendingUp, BookOpen, Award } from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <PieChart className="h-6 w-6 text-primary" />
          <span>FinVault</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="relative overflow-hidden group">
              <span className="relative z-10">Login</span>
              <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Animations */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="px-4 py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Assets & Liabilities</h3>
              <p className="text-muted-foreground">
                Track all your assets and liabilities in one place with visual insights.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget & Surplus</h3>
              <p className="text-muted-foreground">
                Set budgets, track expenses, and identify surplus funds for investments.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Credit Score Simulator</h3>
              <p className="text-muted-foreground">
                Simulate how different financial decisions affect your credit score.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare Tool</h3>
              <p className="text-muted-foreground">
                Compare your assets and liabilities over time with interactive charts.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Hub</h3>
              <p className="text-muted-foreground">Access educational content to improve your financial literacy.</p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="group bg-gradient-to-br from-background to-muted/50 border rounded-xl p-6 hover:shadow-md transition-all hover:translate-y-[-5px] hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamified Learning</h3>
              <p className="text-muted-foreground">
                Learn financial concepts through streaks, badges, and a fun leaderboard.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-16 md:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Accounts</h3>
              <p className="text-muted-foreground">
                Securely link your bank accounts, credit cards, and investment portfolios.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Insights</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your financial data and provides tailored recommendations.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve Your Finances</h3>
              <p className="text-muted-foreground">Take action based on insights and track your progress over time.</p>
            </motion.div>
          </div>

          {/* Demo Video */}
          <motion.div
            className="mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="aspect-video bg-black/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-center relative z-10">
                <p className="text-muted-foreground mb-4">Watch how FinVault works</p>
                <Button className="animated-gradient text-white border-none">Play Demo Video</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              className="bg-muted/20 p-6 rounded-xl border hover:border-primary/20 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Financial Analyst</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "FinVault has completely transformed how I manage my personal finances. The insights are incredibly
                valuable."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              className="bg-muted/20 p-6 rounded-xl border hover:border-primary/20 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Small Business Owner</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The budget tracking features have helped me save an additional 15% each month. Highly recommended!"
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              className="bg-muted/20 p-6 rounded-xl border hover:border-primary/20 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Freelance Designer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a freelancer, tracking my finances was always a challenge. FinVault makes it simple and intuitive."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-16 md:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h2>

          <motion.p
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the plan that works best for your financial needs
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              className="bg-background p-6 rounded-xl border hover:shadow-md transition-shadow hover:border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">
                $0<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Basic financial tracking</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Up to 5 accounts</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Monthly reports</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-background p-6 rounded-xl border border-primary shadow-md relative hover:shadow-lg hover:glow-effect"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">
                $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Advanced financial insights</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Unlimited accounts</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Weekly reports</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>AI-powered recommendations</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-background p-6 rounded-xl border hover:shadow-md transition-shadow hover:border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-4">
                $29.99<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span>Advanced security features</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-primary/5 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

        <div className="container mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to transform your finances?
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-[600px] mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of users who have already taken control of their financial future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/register">
              <Button size="lg" className="gap-2 animated-gradient text-white border-none">
                Get Started Today <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-4 py-6 md:py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <span className="font-semibold">FinVault</span>
          </div>
          <div className="text-sm text-muted-foreground">© 2025 FinVault. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
