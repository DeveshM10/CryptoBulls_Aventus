import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  ArrowRight, 
  Trophy, 
  Star, 
  CheckCircle2, 
  Clock, 
  PenTool, 
  PlayCircle, 
  Medal, 
  XCircle, 
  ChevronRight,
  Heart,
  BarChart4,
  Sparkles,
  User,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// Custom animated confetti component
const Confetti = ({ isVisible }) => {
  const confettiPieces = Array.from({ length: 100 }).map((_, i) => {
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 2;
    const randomDuration = 1 + Math.random() * 3;
    const randomSize = 5 + Math.random() * 10;
    
    return (
      <span
        key={i}
        className="absolute bg-primary w-1 h-3 rounded-full opacity-0"
        style={{
          left: `${randomX}%`,
          top: "-10px",
          width: `${randomSize}px`,
          height: `${randomSize * 2}px`,
          backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
          transform: "scale(0)",
          animation: isVisible ? `confetti ${randomDuration}s ${randomDelay}s ease-out forwards` : "none"
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            transform: translateY(100px) rotate(180deg) scale(1);
          }
          100% {
            transform: translateY(1000px) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Course card component with hover effects
const CourseCard = ({ 
  title, 
  description, 
  image, 
  modules, 
  videos, 
  duration, 
  progress, 
  level, 
  badge, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group cursor-pointer" onClick={onClick}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div 
            className="aspect-video bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Badge displays conditional on whether badge prop exists */}
            {badge && (
              <div className="absolute top-2 right-2 z-20">
                <Badge className="bg-primary hover:bg-primary/90 text-white">
                  {badge}
                </Badge>
              </div>
            )}
            
            {/* Progress overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-2">
              <div className="flex items-center justify-between text-white mb-1">
                <span className="text-xs font-medium">Progress</span>
                <span className="text-xs">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-white/20" />
            </div>
          </div>
        </div>
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              {level}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{modules} modules</span>
            </div>
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-1" />
              <span>{videos} videos</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{duration}</span>
            </div>
            <Button 
              size="sm" 
              className="group-hover:bg-primary group-hover:text-white transition-colors"
              variant="ghost"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Video component with embedded YouTube player
const VideoLesson = ({ videoId, title, description }) => {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

// Quiz component with interactive questions
const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = [
    {
      question: "What is compound interest?",
      options: [
        "Interest calculated only on the initial principal",
        "Interest calculated on both the initial principal and accumulated interest",
        "A fixed interest rate that never changes",
        "Interest paid directly to you in cash"
      ],
      correctAnswer: "Interest calculated on both the initial principal and accumulated interest"
    },
    {
      question: "Which of the following is generally considered the safest investment?",
      options: [
        "Cryptocurrency",
        "Individual stocks",
        "Government bonds",
        "Commodities"
      ],
      correctAnswer: "Government bonds"
    },
    {
      question: "What is diversification in investing?",
      options: [
        "Investing all your money in a single promising stock",
        "Spreading investments across various asset classes to reduce risk",
        "Investing only in foreign markets",
        "Frequently trading stocks to maximize returns"
      ],
      correctAnswer: "Spreading investments across various asset classes to reduce risk"
    }
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    setResult({ isCorrect });
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption("");
    setResult(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption("");
    setResult(null);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="relative">
      <Confetti isVisible={showConfetti} />
      
      {!quizCompleted ? (
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Finance Quiz</CardTitle>
              <Badge>{currentQuestion + 1} of {questions.length}</Badge>
            </div>
            <Progress 
              value={(currentQuestion / questions.length) * 100} 
              className="h-1.5 mt-2" 
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <RadioGroup 
                  value={selectedOption} 
                  className="space-y-3"
                  disabled={result !== null}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`}
                        onClick={() => handleOptionSelect(option)}
                        className={
                          result && option === questions[currentQuestion].correctAnswer
                            ? "text-green-500 border-green-500"
                            : result && option === selectedOption && !result.isCorrect
                            ? "text-red-500 border-red-500"
                            : ""
                        }
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className={
                          result && option === questions[currentQuestion].correctAnswer
                            ? "text-green-500"
                            : result && option === selectedOption && !result.isCorrect
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-lg",
                    result.isCorrect ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  )}
                >
                  {result.isCorrect ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                      <span>Correct! Well done.</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 mr-2 text-red-500" />
                      <span>
                        Incorrect. The correct answer is: {questions[currentQuestion].correctAnswer}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-muted-foreground text-sm">
              Score: {score}/{questions.length}
            </div>
            {!result ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center pt-8">
            <CardContent className="space-y-6">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-primary" />
                {score === questions.length && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground">
                  You scored {score} out of {questions.length}
                </p>
              </div>
              
              <div className="w-full max-w-xs mx-auto">
                <div className="relative pt-4">
                  <Progress value={(score / questions.length) * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                {score === questions.length ? (
                  <div className="text-primary-600 font-medium flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Perfect score! Congratulations!</span>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </div>
                ) : score >= questions.length / 2 ? (
                  <p className="text-green-600">Good job! You're on the right track.</p>
                ) : (
                  <p className="text-amber-600">
                    Keep learning! You'll do better next time.
                  </p>
                )}
              </div>
              
              <div className="pt-2 space-x-3">
                <Button onClick={resetQuiz}>Try Again</Button>
                <Button variant="outline">Continue Learning</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

// Articles list component
const ArticlesList = ({ articles }) => {
  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="flex gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
            <div 
              className="h-24 w-24 flex-shrink-0 rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url(${article.image})` }}
            />
            <div className="flex-1">
              <h3 className="text-base font-medium group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {article.description}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{article.readTime} min read</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  <span>By {article.author}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-muted-foreground group-hover:text-primary transition-colors">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Achievement badge component
const AchievementBadge = ({ icon, title, description, earned, progress = 100 }) => {
  return (
    <div className={cn(
      "border rounded-lg p-4 text-center relative transition-all duration-200",
      earned 
        ? "bg-primary/5 border-primary/30" 
        : "bg-muted/30 border-border"
    )}>
      <div className="absolute -top-3 -right-3">
        {earned && <Medal className="h-6 w-6 text-yellow-500 drop-shadow-md" />}
      </div>
      
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
        earned 
          ? "bg-primary/10 text-primary" 
          : "bg-muted text-muted-foreground/60"
      )}>
        {icon}
      </div>
      
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      
      {!earned && progress > 0 && (
        <div className="mt-3">
          <Progress value={progress} className="h-1.5" />
          <div className="text-xs text-muted-foreground mt-1">{progress}% completed</div>
        </div>
      )}
    </div>
  );
};

// Learning path component
const LearningPath = ({ steps }) => {
  return (
    <div className="relative pb-4">
      <div className="absolute left-[1.625rem] top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
      
      {steps.map((step, index) => (
        <div key={index} className="relative z-10 flex gap-4 pb-8">
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5",
            step.completed 
              ? "bg-primary text-white" 
              : step.active 
                ? "bg-primary/20 text-primary border-2 border-primary" 
                : "bg-muted text-muted-foreground"
          )}>
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          
          <div className="space-y-1.5">
            <h3 className={cn(
              "font-medium",
              step.active && !step.completed ? "text-primary" : ""
            )}>
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            
            {(step.completed || step.active) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                {step.content}
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// User level and experience progress component
const UserLevelProgress = ({ level, xp, xpToNextLevel }) => {
  const progress = (xp / xpToNextLevel) * 100;
  
  return (
    <div className="rounded-lg border p-4 bg-gradient-to-br from-primary/5 to-background">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Your Level</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <span>Level {level}</span>
            <Badge className="ml-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              {xp} XP
            </Badge>
          </div>
        </div>
        
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center relative">
          <GraduationCap className="h-6 w-6 text-primary" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
          <div 
            className="absolute inset-0 rounded-full border-2 border-primary"
            style={{ 
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${100 - progress}%)` 
            }}
          />
        </div>
      </div>
      
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress to Level {level + 1}</span>
          <span className="font-medium">{xp}/{xpToNextLevel} XP</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded border p-2.5 text-center">
          <div className="text-sm text-muted-foreground">Courses Completed</div>
          <div className="text-xl font-medium mt-1">3/7</div>
        </div>
        <div className="rounded border p-2.5 text-center">
          <div className="text-sm text-muted-foreground">Quizzes Passed</div>
          <div className="text-xl font-medium mt-1">8/12</div>
        </div>
      </div>
    </div>
  );
};

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(420);
  const [xpToNextLevel, setXpToNextLevel] = useState(500);
  const [progressValues, setProgressValues] = useState({
    investment: 0,
    budgeting: 0,
    blockchain: 0,
    featured: 0
  });
  
  // Simulate progress loading animation on mount
  useEffect(() => {
    const progressTimers = [
      setTimeout(() => setProgressValues(prev => ({ ...prev, investment: 45 })), 300),
      setTimeout(() => setProgressValues(prev => ({ ...prev, budgeting: 70 })), 500),
      setTimeout(() => setProgressValues(prev => ({ ...prev, blockchain: 20 })), 700), 
      setTimeout(() => setProgressValues(prev => ({ ...prev, featured: 60 })), 900)
    ];
    
    return () => progressTimers.forEach(timer => clearTimeout(timer));
  }, []);
  
  // Sample article data
  const articles = [
    {
      title: "The Psychology of Investing: Understanding Risk Tolerance",
      description: "Learn how your psychology affects investment decisions and strategies for managing emotions in market volatility.",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=250&auto=format&fit=crop",
      readTime: 8,
      author: "Dr. Sarah Johnson"
    },
    {
      title: "Digital Assets: The Future of Investment?",
      description: "Explore the growing world of digital assets and their potential place in diversified portfolios for long-term growth.",
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=250&auto=format&fit=crop",
      readTime: 6,
      author: "Michael Chen"
    },
    {
      title: "Mastering Debt: Strategies for Financial Freedom",
      description: "Practical approaches to managing and eliminating debt efficiently while building your path to financial independence.",
      image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=250&auto=format&fit=crop",
      readTime: 5,
      author: "Priya Sharma"
    },
    {
      title: "Building a Resilient Portfolio in Uncertain Times",
      description: "How to create an investment strategy that can weather market volatility and economic downturns while protecting your assets.",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=250&auto=format&fit=crop",
      readTime: 10,
      author: "Robert Nelson"
    }
  ];
  
  // Learning path steps with content
  const investingPathSteps = [
    {
      title: "Introduction to Investment Concepts",
      description: "Learn the basic terminology and concepts in investing",
      completed: true,
      active: true,
      content: (
        <Button size="sm" variant="outline">
          <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
          Completed
        </Button>
      )
    },
    {
      title: "Understanding Risk and Return",
      description: "Explore the relationship between risk and potential returns",
      completed: true,
      active: true,
      content: (
        <Button size="sm" variant="outline">
          <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
          Completed
        </Button>
      )
    },
    {
      title: "Asset Classes and Allocation",
      description: "Discover different asset classes and portfolio allocation strategies",
      completed: false,
      active: true,
      content: (
        <div className="space-y-3">
          <VideoLesson 
            videoId="Vn9BUV3eSys" 
            title="Asset Allocation Explained" 
            description="Learn how to distribute your investments across different asset classes to balance risk and return." 
          />
          <Button size="sm">
            <PlayCircle className="h-4 w-4 mr-1.5" />
            Continue Learning
          </Button>
          <div className="flex items-center mt-2">
            <Progress value={75} className="h-1.5 flex-1" />
            <span className="ml-2 text-xs text-muted-foreground">75%</span>
          </div>
        </div>
      )
    },
    {
      title: "Creating Your Investment Plan",
      description: "Build a personalized investment strategy based on your goals",
      completed: false,
      active: false,
      content: null
    },
    {
      title: "Advanced Investment Strategies",
      description: "Learn sophisticated techniques for optimizing your portfolio",
      completed: false,
      active: false,
      content: null
    }
  ];

  // Sample course data
  const courses = [
    {
      title: "Investment Basics",
      description: "Learn the fundamentals of investing and build your first portfolio",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
      modules: 8,
      videos: 16,
      duration: "6 hours",
      progress: progressValues.investment,
      level: "Beginner",
      badge: null
    },
    {
      title: "Budgeting Strategies",
      description: "Master effective budgeting techniques to reach financial goals",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      modules: 6,
      videos: 12,
      duration: "4 hours",
      progress: progressValues.budgeting,
      level: "Intermediate",
      badge: null
    },
    {
      title: "Blockchain & Crypto",
      description: "Understanding cryptocurrency fundamentals and blockchain technology",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
      modules: 10,
      videos: 22,
      duration: "8 hours",
      progress: progressValues.blockchain,
      level: "Advanced",
      badge: "New"
    },
    {
      title: "Retirement Planning",
      description: "Prepare for financial security in your retirement years",
      image: "https://images.unsplash.com/photo-1610474496495-e6361fd31a17?q=80&w=800&auto=format&fit=crop",
      modules: 7,
      videos: 14,
      duration: "5 hours",
      progress: 0,
      level: "Beginner",
      badge: null
    },
    {
      title: "Tax Optimization",
      description: "Legal strategies to minimize your tax burden and maximize savings",
      image: "https://images.unsplash.com/photo-1586486855514-8c633ce5d605?q=80&w=800&auto=format&fit=crop",
      modules: 5,
      videos: 10,
      duration: "3.5 hours",
      progress: 0,
      level: "Intermediate",
      badge: null
    },
    {
      title: "Real Estate Investing",
      description: "Learn how to build wealth through property investments",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
      modules: 9,
      videos: 18,
      duration: "7 hours",
      progress: 0,
      level: "Intermediate",
      badge: "Popular"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
            <p className="text-muted-foreground">Build your financial knowledge through interactive courses, videos, and quizzes</p>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-primary/30 via-primary/10 to-background overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative px-6 py-8 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                      <div className="aspect-square w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-8 w-8 text-primary-foreground" />
                      </div>
                      
                      <div className="space-y-1.5 flex-1">
                        <h2 className="text-2xl font-bold">Master Your Finances</h2>
                        <p className="text-primary-foreground/80 max-w-2xl">
                          Continue your journey to financial literacy with our featured course.
                          Complete all modules to earn a certificate.
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1.5 text-primary-foreground/70" />
                            <span className="text-sm text-primary-foreground/70">12 Modules</span>
                          </div>
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-1.5 text-primary-foreground/70" />
                            <span className="text-sm text-primary-foreground/70">24 Videos</span>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1.5 text-primary-foreground/70" />
                            <span className="text-sm text-primary-foreground/70">Certificate</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                            Continue Learning
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-6">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-primary-foreground/70">Course progress</span>
                        <span className="text-primary-foreground font-medium">{progressValues.featured}%</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progressValues.featured}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    
                    {/* Background decorative elements */}
                    <div className="absolute right-0 -bottom-6 opacity-20">
                      <svg width="180" height="180" viewBox="0 0 184 184" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M182 2V182H2" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="absolute -top-6 -left-6 opacity-10">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="4"/>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:row-span-2">
              <UserLevelProgress 
                level={level}
                xp={xp}
                xpToNextLevel={xpToNextLevel}
              />
            </div>
            
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-4 h-auto">
                  <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Courses
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Video className="h-4 w-4 mr-2" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <PenTool className="h-4 w-4 mr-2" />
                    Quizzes
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="courses" className="m-0">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course, index) => (
                          <CourseCard key={index} {...course} />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="videos" className="m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Featured Videos</CardTitle>
                          <CardDescription>Learn from expert-created educational videos</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <VideoLesson 
                              videoId="PHe0bXAIuk0" 
                              title="How The Economic Machine Works" 
                              description="Ray Dalio explains how the economy works in a simple, mechanical way." 
                            />
                            <VideoLesson 
                              videoId="F3QpgXBtDeo" 
                              title="The Psychology of Money" 
                              description="Morgan Housel discusses the strange ways people think about money." 
                            />
                          </div>
                          
                          <div className="grid gap-6 md:grid-cols-2">
                            <VideoLesson 
                              videoId="XBWrMfOEhfY" 
                              title="Personal Finance Basics" 
                              description="Learn the foundational principles of personal finance management." 
                            />
                            <VideoLesson 
                              videoId="svZX5Ysxejc" 
                              title="All About Index Funds" 
                              description="Everything you need to know about index fund investing." 
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="quizzes" className="m-0">
                      <QuizComponent />
                    </TabsContent>
                    
                    <TabsContent value="achievements" className="m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Achievement Progress</CardTitle>
                          <CardDescription>Unlock badges by completing courses and activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-4">
                            <AchievementBadge 
                              icon={<BookOpen className="h-8 w-8" />}
                              title="Eager Learner" 
                              description="Complete your first course"
                              earned={true}
                            />
                            <AchievementBadge 
                              icon={<Star className="h-8 w-8" />}
                              title="Quiz Master" 
                              description="Score 100% on any quiz"
                              earned={true}
                            />
                            <AchievementBadge 
                              icon={<Video className="h-8 w-8" />}
                              title="Video Enthusiast" 
                              description="Watch 10 educational videos"
                              earned={false}
                              progress={70}
                            />
                            <AchievementBadge 
                              icon={<Heart className="h-8 w-8" />}
                              title="Consistent Learner" 
                              description="Learn for 7 days straight"
                              earned={false}
                              progress={40}
                            />
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-4 mt-4">
                            <AchievementBadge 
                              icon={<BarChart4 className="h-8 w-8" />}
                              title="Investment Pro" 
                              description="Complete Investment Basics course"
                              earned={false}
                              progress={45}
                            />
                            <AchievementBadge 
                              icon={<Lightbulb className="h-8 w-8" />}
                              title="Financial Guru" 
                              description="Master all core financial concepts"
                              earned={false}
                              progress={35}
                            />
                            <AchievementBadge 
                              icon={<GraduationCap className="h-8 w-8" />}
                              title="Graduate" 
                              description="Complete 5 courses"
                              earned={false}
                              progress={60}
                            />
                            <AchievementBadge 
                              icon={<Trophy className="h-8 w-8" />}
                              title="Knowledge Master" 
                              description="Earn all other achievements"
                              earned={false}
                              progress={25}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
            
            <div className="lg:col-span-3 grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Path: Investment Fundamentals</CardTitle>
                    <CardDescription>Follow this guided journey to investment mastery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LearningPath steps={investingPathSteps} />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                    <CardDescription>Expand your knowledge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ArticlesList articles={articles.slice(0, 2)} />
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        View All Articles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}