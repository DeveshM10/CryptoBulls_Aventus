import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mic, Plus, Calculator } from "lucide-react";
import { Expense } from "@/services/ml/BudgetRecommender";
import VoiceEntryButton from "./VoiceEntryButton";

interface ManualEntryFormProps {
  onExpenseAdded: (expense: Expense) => void;
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Housing",
  "Healthcare",
  "Personal",
  "Education",
  "Travel",
  "Other"
];

export default function ManualEntryForm({ onExpenseAdded }: ManualEntryFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [entryMethod, setEntryMethod] = useState<"manual" | "voice">("manual");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || !category || !date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create expense object
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }
    
    const expense: Expense = {
      amount: numericAmount,
      category,
      date,
      isRecurring
    };
    
    // Call the callback function
    onExpenseAdded(expense);
    
    // Reset form
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    
    // Show success toast
    toast({
      title: "Expense added",
      description: `Added ${category} expense of ₹${numericAmount}`,
    });
  };

  const handleVoiceExpense = (parsedExpense: Partial<Expense>) => {
    if (parsedExpense.amount && parsedExpense.category) {
      // Set form values from voice input
      setAmount(parsedExpense.amount.toString());
      setCategory(parsedExpense.category);
      if (parsedExpense.date) {
        setDate(parsedExpense.date);
      }
      
      // Show success message
      toast({
        title: "Voice input processed",
        description: `Detected ${parsedExpense.category} expense of ₹${parsedExpense.amount}`,
      });
    }
  };

  // Quick amount buttons to speed up entry
  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Cash Expense</CardTitle>
        <CardDescription>
          Track your cash spending to get personalized budget recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={entryMethod} onValueChange={(v) => setEntryMethod(v as "manual" | "voice")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="voice">Voice Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ₹{quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => 
                    setIsRecurring(checked === true)
                  }
                />
                <Label htmlFor="recurring" className="text-sm font-normal">
                  This is a recurring expense
                </Label>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="voice" className="flex flex-col items-center justify-center py-8">
            <VoiceEntryButton onExpenseParsed={handleVoiceExpense} />
            <p className="text-sm text-muted-foreground mt-4 text-center max-w-xs">
              Try saying something like "Spent 500 rupees on groceries yesterday" or
              "Paid 200 for transportation today"
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setAmount("")}>
          Clear
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </CardFooter>
    </Card>
  );
}