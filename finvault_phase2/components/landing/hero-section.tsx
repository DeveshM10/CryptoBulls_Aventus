"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ThreeDCard } from "@/components/ui/3d-card"

export function HeroSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/register")
  }

  return (
    <section className="px-4 py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden relative">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>

      <div className="container mx-auto flex flex-col items-center text-center gap-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
        >
          Introducing FinVault
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl"
        >
          Smart Personal Finance for the{" "}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            className="text-primary inline-block relative"
          >
            Future
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-[600px] mt-4"
        >
          Take control of your financial future with AI-powered insights, asset tracking, and personalized
          recommendations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="gap-2 relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            <span className="relative z-10">Get Started</span>
            <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </Button>

          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="relative overflow-hidden group border-primary/20 hover:border-primary/40"
            >
              <span className="relative z-10">View Demo</span>
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ y: "-100%" }}
                whileHover={{ y: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </Button>
          </Link>
        </motion.div>

        {/* Hero Image with Animation */}
        <ThreeDCard className="mt-12 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="rounded-xl overflow-hidden border shadow-xl"
          >
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-1">
              <div className="w-full h-[500px] bg-background rounded-lg overflow-hidden relative">
                {/* Dashboard Preview Image */}
                <img
                  src="https://v0.blob.com/pjtmy8OGJ.png"
                  alt="FinVault Dashboard Preview"
                  className="w-full h-full object-cover"
                />

                {/* Animated Elements */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute top-[140px] left-[150px] bg-background/90 backdrop-blur-sm p-4 rounded-lg border shadow-lg w-[200px]"
                >
                  <div className="h-6 w-24 bg-primary/20 rounded-full mb-2"></div>
                  <div className="h-3 w-full bg-muted rounded-full mb-1"></div>
                  <div className="h-3 w-[80%] bg-muted rounded-full"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="absolute bottom-[120px] right-[150px] bg-background/90 backdrop-blur-sm p-4 rounded-lg border shadow-lg w-[220px]"
                >
                  <div className="h-6 w-14 bg-emerald-500/20 rounded-full mb-2"></div>
                  <div className="h-8 w-full bg-emerald-500/10 rounded-lg mb-1"></div>
                  <div className="h-3 w-[70%] bg-muted rounded-full"></div>
                </motion.div>

                {/* Floating Data Points */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute top-[80px] right-[180px] bg-primary/90 text-white p-2 rounded-lg shadow-lg"
                >
                  <div className="text-xs font-medium">Net Worth</div>
                  <div className="text-lg font-bold">$45,231.89</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="absolute top-[200px] right-[100px] bg-emerald-500/90 text-white p-2 rounded-lg shadow-lg"
                >
                  <div className="text-xs font-medium">Monthly Savings</div>
                  <div className="text-lg font-bold">$1,410.00</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </ThreeDCard>
      </div>
    </section>
  )
}
