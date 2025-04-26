"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, ChevronRight, Clock, FileText, Play, Star, Trophy, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { YouTubeVideo } from "@/components/youtube-video"

// Mock data for learning content
const learningContent = {
  beginner: [
    {
      id: "b1",
      title: "Introduction to Cryptocurrency",
      type: "video",
      duration: "15 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: true,
      description: "Learn the basics of cryptocurrency, blockchain technology, and how digital assets work.",
      youtubeId: "VYWc9dFqROI",
    },
    {
      id: "b2",
      title: "Understanding Market Basics",
      type: "article",
      duration: "10 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: true,
      description: "Explore the fundamentals of market dynamics, order types, and basic trading concepts.",
      youtubeId: "Xn7KWR9EOGQ",
    },
    {
      id: "b3",
      title: "Setting Up Your First Wallet",
      type: "video",
      duration: "20 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Step-by-step guide to creating and securing your first cryptocurrency wallet.",
      youtubeId: "AlwrxqVmEK4",
    },
    {
      id: "b4",
      title: "Reading Price Charts",
      type: "article",
      duration: "12 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Learn how to interpret price charts and understand basic technical analysis patterns.",
      youtubeId: "7PWkn9k_bok",
    },
  ],
  intermediate: [
    {
      id: "i1",
      title: "Technical Analysis Fundamentals",
      type: "video",
      duration: "30 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Dive deeper into technical analysis with support/resistance, trend lines, and indicators.",
      youtubeId: "eynxyoKgpng",
    },
    {
      id: "i2",
      title: "Understanding DeFi Protocols",
      type: "article",
      duration: "15 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Explore decentralized finance protocols, yield farming, and liquidity pools.",
      youtubeId: "k9HYC0EJU6E",
    },
    {
      id: "i3",
      title: "Risk Management Strategies",
      type: "video",
      duration: "25 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Learn essential risk management techniques to protect your portfolio.",
      youtubeId: "arIi7KxQPkE",
    },
    {
      id: "i4",
      title: "Trading Psychology",
      type: "quiz",
      duration: "15 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Test your knowledge on trading psychology and emotional discipline.",
      youtubeId: "XQfeoqHXG6s",
    },
  ],
  advanced: [
    {
      id: "a1",
      title: "Advanced Trading Strategies",
      type: "video",
      duration: "45 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Master complex trading strategies including grid trading, arbitrage, and more.",
      youtubeId: "u6bE-A0LipA",
    },
    {
      id: "a2",
      title: "Smart Contract Analysis",
      type: "article",
      duration: "20 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Learn how to analyze smart contracts for security vulnerabilities and tokenomics.",
      youtubeId: "M576WGiDBdQ",
    },
    {
      id: "a3",
      title: "Algorithmic Trading Basics",
      type: "video",
      duration: "35 min",
      thumbnail: "/placeholder.svg?height=120&width=200",
      completed: false,
      description: "Introduction to creating and implementing trading bots and algorithms.",
      youtubeId: "xfzGZB4HhEE",
    },
    {
      id: "a4",
      title: "Macro Economic Factors in Crypto",
      type: "article",
      duration: "25 min",
      thumbnail: "/placeholder.svg?height=120&width=200",

      completed: false,
      description: "Understand how global economic factors influence cryptocurrency markets.",
      youtubeId: "1YyAzVmP9xQ",
    },
  ],
}

// Calculate progress
const calculateProgress = (level: "beginner" | "intermediate" | "advanced") => {
  const total = learningContent[level].length
  const completed = learningContent[level].filter((item) => item.completed).length
  return (completed / total) * 100
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [selectedContent, setSelectedContent] = useState<any>(null)

  const beginnerProgress = calculateProgress("beginner")
  const intermediateProgress = calculateProgress("intermediate")
  const advancedProgress = calculateProgress("advanced")

  const totalCompleted =
    learningContent.beginner.filter((item) => item.completed).length +
    learningContent.intermediate.filter((item) => item.completed).length +
    learningContent.advanced.filter((item) => item.completed).length

  const totalContent =
    learningContent.beginner.length + learningContent.intermediate.length + learningContent.advanced.length

  const overallProgress = (totalCompleted / totalContent) * 100

  return (
    <DashboardShell>
      <DashboardHeader heading="Learning Hub" text="Expand your trading knowledge with our educational resources" />

      {selectedContent ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-primary/20 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedContent.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedContent.description}</p>
                </div>
                <Button variant="outline" className="border-primary/20" onClick={() => setSelectedContent(null)}>
                  Back to Courses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <YouTubeVideo videoId={selectedContent.youtubeId} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-primary/20 bg-black/20 p-2">
                      <div className="text-2xl font-bold">{totalCompleted}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-black/20 p-2">
                      <div className="text-2xl font-bold">{totalContent - totalCompleted}</div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-black/20 p-2">
                      <div className="text-2xl font-bold">{totalContent}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/20 p-3 mb-1">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-center">First Lesson</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/20 p-3 mb-1">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-center">5 Lessons</span>
                  </div>
                  <div className="flex flex-col items-center opacity-40">
                    <div className="rounded-full bg-primary/20 p-3 mb-1">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-center">Complete Beginner</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle>Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div
                    className="flex items-start gap-3 rounded-lg border border-primary/20 bg-black/20 p-2 hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedContent(learningContent.beginner[2])}
                  >
                    <div className="rounded-md bg-black/60 p-1">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Setting Up Your First Wallet</h3>
                      <p className="text-xs text-muted-foreground">Continue where you left off</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div
                    className="flex items-start gap-3 rounded-lg border border-primary/20 bg-black/20 p-2 hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedContent(learningContent.intermediate[1])}
                  >
                    <div className="rounded-md bg-black/60 p-1">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Understanding DeFi Protocols</h3>
                      <p className="text-xs text-muted-foreground">Recommended for you</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs defaultValue="beginner" onValueChange={(value) => setActiveTab(value as any)}>
              <div className="flex items-center justify-between">
                <TabsList className="mb-4 bg-black/60">
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <div className="w-32 h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${
                          activeTab === "beginner"
                            ? beginnerProgress
                            : activeTab === "intermediate"
                              ? intermediateProgress
                              : advancedProgress
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span>
                    {activeTab === "beginner"
                      ? Math.round(beginnerProgress)
                      : activeTab === "intermediate"
                        ? Math.round(intermediateProgress)
                        : Math.round(advancedProgress)}
                    %
                  </span>
                </div>
              </div>

              <TabsContent value="beginner">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {learningContent.beginner.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card
                        className={`border-primary/20 bg-black/40 backdrop-blur-sm h-full ${content.completed ? "border-green-500/30" : ""}`}
                      >
                        <CardHeader className="p-3">
                          <div className="relative">
                            <img
                              src={content.thumbnail || "/placeholder.svg"}
                              alt={content.title}
                              className="rounded-md w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="rounded-full bg-black/60 p-2 hover:bg-primary/80 transition-colors cursor-pointer"
                                onClick={() => setSelectedContent(content)}
                              >
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            {content.completed && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                                  Completed
                                </Badge>
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="outline" className="bg-black/60 border-primary/30">
                                <Clock className="mr-1 h-3 w-3" />
                                {content.duration}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-base mt-2">{content.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-xs text-muted-foreground">{content.description}</p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/20 bg-black/60 hover:bg-primary/10 hover:text-primary"
                            onClick={() => setSelectedContent(content)}
                          >
                            {content.completed ? "Review" : "Start Learning"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="intermediate">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {learningContent.intermediate.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card
                        className={`border-primary/20 bg-black/40 backdrop-blur-sm h-full ${content.completed ? "border-green-500/30" : ""}`}
                      >
                        <CardHeader className="p-3">
                          <div className="relative">
                            <img
                              src={content.thumbnail || "/placeholder.svg"}
                              alt={content.title}
                              className="rounded-md w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="rounded-full bg-black/60 p-2 hover:bg-primary/80 transition-colors cursor-pointer"
                                onClick={() => setSelectedContent(content)}
                              >
                                {content.type === "video" ? (
                                  <Play className="h-6 w-6 text-white" />
                                ) : content.type === "article" ? (
                                  <FileText className="h-6 w-6 text-white" />
                                ) : (
                                  <BookOpen className="h-6 w-6 text-white" />
                                )}
                              </div>
                            </div>
                            {content.completed && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                                  Completed
                                </Badge>
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="outline" className="bg-black/60 border-primary/30">
                                <Clock className="mr-1 h-3 w-3" />
                                {content.duration}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-base mt-2">{content.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-xs text-muted-foreground">{content.description}</p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/20 bg-black/60 hover:bg-primary/10 hover:text-primary"
                            onClick={() => setSelectedContent(content)}
                          >
                            {content.completed ? "Review" : "Start Learning"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {learningContent.advanced.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card
                        className={`border-primary/20 bg-black/40 backdrop-blur-sm h-full ${content.completed ? "border-green-500/30" : ""}`}
                      >
                        <CardHeader className="p-3">
                          <div className="relative">
                            <img
                              src={content.thumbnail || "/placeholder.svg"}
                              alt={content.title}
                              className="rounded-md w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="rounded-full bg-black/60 p-2 hover:bg-primary/80 transition-colors cursor-pointer"
                                onClick={() => setSelectedContent(content)}
                              >
                                {content.type === "video" ? (
                                  <Play className="h-6 w-6 text-white" />
                                ) : content.type === "article" ? (
                                  <FileText className="h-6 w-6 text-white" />
                                ) : (
                                  <BookOpen className="h-6 w-6 text-white" />
                                )}
                              </div>
                            </div>
                            {content.completed && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                                  Completed
                                </Badge>
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="outline" className="bg-black/60 border-primary/30">
                                <Clock className="mr-1 h-3 w-3" />
                                {content.duration}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-base mt-2">{content.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-xs text-muted-foreground">{content.description}</p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/20 bg-black/60 hover:bg-primary/10 hover:text-primary"
                            onClick={() => setSelectedContent(content)}
                          >
                            {content.completed ? "Review" : "Start Learning"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </DashboardShell>
  )
}
