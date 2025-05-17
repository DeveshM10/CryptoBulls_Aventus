"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, BookOpen, Video, FileText, Award, Filter, ChevronRight, Star, Clock, CheckCircle2 } from "lucide-react"

// Sample learning resources data
// In a real app, this would come from an API
const learningResources = [
  {
    id: 1,
    title: "Understanding Credit Scores",
    type: "article",
    category: "Credit",
    difficulty: "Beginner",
    duration: "10 min read",
    image: "/placeholder.svg?height=200&width=300",
    completed: true,
    popular: true,
  },
  {
    id: 2,
    title: "Investing in Index Funds",
    type: "video",
    category: "Investing",
    difficulty: "Intermediate",
    duration: "15 min video",
    image: "/placeholder.svg?height=200&width=300",
    completed: false,
    popular: true,
  },
  {
    id: 3,
    title: "Budgeting 101",
    type: "article",
    category: "Budgeting",
    difficulty: "Beginner",
    duration: "8 min read",
    image: "/placeholder.svg?height=200&width=300",
    completed: true,
    popular: false,
  },
  {
    id: 4,
    title: "Debt Reduction Strategies",
    type: "quiz",
    category: "Debt",
    difficulty: "Intermediate",
    duration: "5 questions",
    image: "/placeholder.svg?height=200&width=300",
    completed: false,
    popular: false,
  },
  {
    id: 5,
    title: "Retirement Planning Essentials",
    type: "article",
    category: "Retirement",
    difficulty: "Advanced",
    duration: "12 min read",
    image: "/placeholder.svg?height=200&width=300",
    completed: false,
    popular: true,
  },
  {
    id: 6,
    title: "Understanding Mortgage Options",
    type: "video",
    category: "Mortgages",
    difficulty: "Intermediate",
    duration: "20 min video",
    image: "/placeholder.svg?height=200&width=300",
    completed: false,
    popular: false,
  },
  {
    id: 7,
    title: "Tax Optimization Strategies",
    type: "article",
    category: "Taxes",
    difficulty: "Advanced",
    duration: "15 min read",
    image: "/placeholder.svg?height=200&width=300",
    completed: false,
    popular: false,
  },
  {
    id: 8,
    title: "Emergency Fund Basics",
    type: "quiz",
    category: "Savings",
    difficulty: "Beginner",
    duration: "8 questions",
    image: "/placeholder.svg?height=200&width=300",
    completed: true,
    popular: true,
  },
]

// Sample user progress data
const userProgress = {
  level: 3,
  xp: 450,
  nextLevelXp: 600,
  streak: 5,
  badges: [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
    { id: 2, name: "Knowledge Seeker", description: "Complete 5 lessons", icon: <BookOpen className="h-6 w-6" /> },
    { id: 3, name: "Streak Master", description: "Maintain a 5-day streak", icon: <Award className="h-6 w-6" /> },
  ],
  completedResources: 3,
  totalResources: learningResources.length,
}

export default function LearnPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")

  // Get unique categories from resources
  const categories = ["All", ...new Set(learningResources.map((resource) => resource.category))]

  // Filter resources based on search term and filters
  const filteredResources = learningResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesType = selectedType === "All" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Learning Hub</h2>
          <p className="text-muted-foreground">Improve your financial literacy with articles, videos, and quizzes</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Search and filters */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="article">Articles</option>
                      <option value="video">Videos</option>
                      <option value="quiz">Quizzes</option>
                    </select>
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning resources */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No resources found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.filter((r) => r.type === "article").length > 0 ? (
                  filteredResources
                    .filter((r) => r.type === "article")
                    .map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.filter((r) => r.type === "video").length > 0 ? (
                  filteredResources
                    .filter((r) => r.type === "video")
                    .map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                    <Video className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No videos found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.filter((r) => r.type === "quiz").length > 0 ? (
                  filteredResources
                    .filter((r) => r.type === "quiz")
                    .map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No quizzes found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.filter((r) => r.completed).length > 0 ? (
                  filteredResources
                    .filter((r) => r.completed)
                    .map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No completed resources</h3>
                    <p className="text-muted-foreground">Start learning to see your progress here</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* User progress sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Level {userProgress.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {userProgress.xp}/{userProgress.nextLevelXp} XP
                  </span>
                </div>
                <Progress value={(userProgress.xp / userProgress.nextLevelXp) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Current Streak</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold">{userProgress.streak}</span>
                  <span className="text-sm text-muted-foreground ml-1">days</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Completion</h3>
                <div className="flex items-center gap-2">
                  <Progress
                    value={(userProgress.completedResources / userProgress.totalResources) * 100}
                    className="h-2 flex-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {userProgress.completedResources}/{userProgress.totalResources}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Achievements you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {userProgress.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1 text-primary">
                      {badge.icon}
                    </div>
                    <span className="text-xs font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Badges
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended</CardTitle>
              <CardDescription>Based on your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningResources
                .filter((r) => r.popular && !r.completed)
                .slice(0, 3)
                .map((resource) => (
                  <div key={resource.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                      <img
                        src={resource.image || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground">{resource.duration}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Resource card component
function ResourceCard({ resource }) {
  // Helper function to get icon based on resource type
  const getTypeIcon = (type) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "quiz":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  // Helper function to get badge color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Intermediate":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Advanced":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={resource.image || "/placeholder.svg"}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {resource.completed && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </div>
        )}
        {resource.popular && !resource.completed && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            {getTypeIcon(resource.type)}
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {resource.category}
          </Badge>
          <Badge variant="outline" className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </Badge>
        </div>
        <h3 className="font-medium mb-1">{resource.title}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <Clock className="h-3 w-3 mr-1" />
          {resource.duration}
        </div>
        <Button size="sm" className="w-full">
          {resource.completed ? "Review Again" : "Start Learning"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
