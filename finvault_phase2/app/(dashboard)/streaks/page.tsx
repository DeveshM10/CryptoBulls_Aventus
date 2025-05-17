"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, CheckCircle, Trophy, Users, TrendingUp, Star, Clock, BookOpen, Flame } from "lucide-react"

// Sample user streak data
// In a real app, this would come from an API
const userStreak = {
  currentStreak: 5,
  longestStreak: 12,
  totalDaysActive: 28,
  lastCheckIn: "2025-04-15", // Today's date in the example
  streakGoal: 30,
  xp: 450,
  level: 3,
  nextLevelXp: 600,
}

// Sample calendar data for the current month
// In a real app, this would be generated based on the user's activity
const generateCalendarData = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  // Get the first day of the month
  const firstDay = new Date(year, month, 1)
  const startingDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get the number of days in the month
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()

  // Generate calendar data
  const calendarData = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    calendarData.push({ day: null, status: "empty" })
  }

  // Add days of the month
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i)
    const dateString = date.toISOString().split("T")[0]

    // Determine status based on date
    // For this example, we'll mark days before today as either active or missed
    // and days after today as upcoming
    if (date > today) {
      calendarData.push({ day: i, status: "upcoming" })
    } else if (date.getTime() === today.getTime()) {
      calendarData.push({ day: i, status: "today" })
    } else {
      // Randomly mark past days as active or missed for the example
      // In a real app, this would be based on actual user activity
      const isActive = Math.random() > 0.3
      calendarData.push({ day: i, status: isActive ? "active" : "missed" })
    }
  }

  return calendarData
}

// Sample badges data
const badges = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first lesson",
    earned: true,
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "Knowledge Seeker",
    description: "Complete 5 lessons",
    earned: true,
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "Streak Master",
    description: "Maintain a 5-day streak",
    earned: true,
    icon: <Flame className="h-6 w-6" />,
  },
  {
    id: 4,
    name: "Financial Wizard",
    description: "Complete all beginner courses",
    earned: false,
    icon: <Star className="h-6 w-6" />,
  },
  {
    id: 5,
    name: "Consistency King",
    description: "Maintain a 30-day streak",
    earned: false,
    icon: <Award className="h-6 w-6" />,
  },
  {
    id: 6,
    name: "Time Master",
    description: "Spend 10 hours learning",
    earned: false,
    icon: <Clock className="h-6 w-6" />,
  },
]

// Sample leaderboard data
const leaderboard = [
  { id: 1, name: "Sarah J.", streak: 45, xp: 2450, savingsRate: 32 },
  { id: 2, name: "Michael T.", streak: 38, xp: 2100, savingsRate: 28 },
  { id: 3, name: "You", streak: 5, xp: 450, savingsRate: 15, isCurrentUser: true },
  { id: 4, name: "David K.", streak: 21, xp: 1250, savingsRate: 22 },
  { id: 5, name: "Emily R.", streak: 19, xp: 980, savingsRate: 18 },
]

export default function StreaksPage() {
  const [calendarData] = useState(generateCalendarData())
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Handle check-in button click
  const handleCheckIn = () => {
    setCheckedInToday(true)
    // In a real app, this would send a request to the server to record the check-in
  }

  // Get month name
  const getMonthName = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[new Date().getMonth()]
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Streaks & Achievements</h2>
          <p className="text-muted-foreground">Track your learning progress and compete with others</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {/* Streak Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Streak</CardTitle>
              <CardDescription>Keep your streak going to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                  <Flame className="h-8 w-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">{userStreak.currentStreak}</span>
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold">{userStreak.longestStreak}</span>
                  <span className="text-sm text-muted-foreground">Longest Streak</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold">{userStreak.totalDaysActive}</span>
                  <span className="text-sm text-muted-foreground">Total Days Active</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">
                    Streak Goal: {userStreak.currentStreak}/{userStreak.streakGoal} days
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((userStreak.currentStreak / userStreak.streakGoal) * 100)}%
                  </span>
                </div>
                <Progress value={(userStreak.currentStreak / userStreak.streakGoal) * 100} className="h-2" />
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  size="lg"
                  disabled={checkedInToday}
                  onClick={handleCheckIn}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {checkedInToday ? "Checked In Today" : "Check In Today"}
                  </span>
                  {!checkedInToday && (
                    <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>Your learning activity for {getMonthName()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs font-medium py-1">
                    {day}
                  </div>
                ))}

                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-sm
                      ${day.status === "empty" ? "invisible" : ""}
                      ${day.status === "active" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : ""}
                      ${day.status === "missed" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : ""}
                      ${day.status === "today" ? "bg-primary/20 text-primary border border-primary/30" : ""}
                      ${day.status === "upcoming" ? "bg-muted/30 text-muted-foreground" : ""}
                    `}
                  >
                    {day.day}
                    {day.status === "active" && (
                      <span className="absolute w-2 h-2 bg-emerald-500 rounded-full -top-1 -right-1"></span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4 gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 mr-1"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-rose-500/10 mr-1"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary/20 mr-1"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-muted/30 mr-1"></div>
                  <span>Upcoming</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See how you compare to other users</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="streak">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="streak">Streak</TabsTrigger>
                  <TabsTrigger value="xp">XP</TabsTrigger>
                  <TabsTrigger value="savings">Savings Rate</TabsTrigger>
                </TabsList>

                <TabsContent value="streak" className="pt-4">
                  <div className="space-y-2">
                    {leaderboard
                      .sort((a, b) => b.streak - a.streak)
                      .map((user, index) => (
                        <div
                          key={user.id}
                          className={`
                            flex items-center p-3 rounded-lg
                            ${user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}
                          `}
                        >
                          <div className="w-8 text-center font-medium">#{index + 1}</div>
                          <div className="flex-1 font-medium">
                            {user.name}
                            {user.isCurrentUser && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Flame className="h-4 w-4 text-amber-500 mr-1" />
                            <span>{user.streak} days</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="xp" className="pt-4">
                  <div className="space-y-2">
                    {leaderboard
                      .sort((a, b) => b.xp - a.xp)
                      .map((user, index) => (
                        <div
                          key={user.id}
                          className={`
                            flex items-center p-3 rounded-lg
                            ${user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}
                          `}
                        >
                          <div className="w-8 text-center font-medium">#{index + 1}</div>
                          <div className="flex-1 font-medium">
                            {user.name}
                            {user.isCurrentUser && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 mr-1" />
                            <span>{user.xp.toLocaleString()} XP</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="savings" className="pt-4">
                  <div className="space-y-2">
                    {leaderboard
                      .sort((a, b) => b.savingsRate - a.savingsRate)
                      .map((user, index) => (
                        <div
                          key={user.id}
                          className={`
                            flex items-center p-3 rounded-lg
                            ${user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}
                          `}
                        >
                          <div className="w-8 text-center font-medium">#{index + 1}</div>
                          <div className="flex-1 font-medium">
                            {user.name}
                            {user.isCurrentUser && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                            <span>{user.savingsRate}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                View Full Leaderboard
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Level</CardTitle>
              <CardDescription>Keep learning to level up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-primary">{userStreak.level}</span>
                </div>
                <span className="text-sm text-muted-foreground">Financial Apprentice</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Next Level</span>
                  <span className="text-sm text-muted-foreground">
                    {userStreak.xp}/{userStreak.nextLevelXp} XP
                  </span>
                </div>
                <Progress value={(userStreak.xp / userStreak.nextLevelXp) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {userStreak.nextLevelXp - userStreak.xp} XP needed to reach level {userStreak.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Achievements you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`
                      flex flex-col items-center text-center p-3 rounded-lg
                      ${badge.earned ? "bg-primary/10" : "bg-muted/30"}
                    `}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                        ${badge.earned ? "text-primary" : "text-muted-foreground/50"}
                      `}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-sm font-medium">{badge.name}</span>
                    <span className="text-xs text-muted-foreground">{badge.description}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Award className="mr-2 h-4 w-4" />
                View All Badges
              </Button>
            </CardFooter>
          </Card>

          {/* Streak Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Streak Tips</CardTitle>
              <CardDescription>How to maintain your streak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Check in daily</h3>
                  <p className="text-xs text-muted-foreground">
                    Make it a habit to check in every day, even if you only have a few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Set reminders</h3>
                  <p className="text-xs text-muted-foreground">
                    Enable notifications to remind you to check in before the day ends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Complete daily challenges</h3>
                  <p className="text-xs text-muted-foreground">
                    Finish at least one learning activity each day to maintain your streak.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
