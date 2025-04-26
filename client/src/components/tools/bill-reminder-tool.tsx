import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { CalendarIcon, Bell, CheckCircle2, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reminder {
  id: string;
  title: string;
  amount: string;
  dueDate: Date;
  completed: boolean;
}

export function BillReminderTool() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Electricity Bill",
      amount: "₹2,500",
      dueDate: addDays(new Date(), 5),
      completed: false,
    },
    {
      id: "2",
      title: "House Rent",
      amount: "₹15,000",
      dueDate: addDays(new Date(), 10),
      completed: false,
    },
  ]);
  
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(addDays(new Date(), 7));
  
  const handleAddReminder = () => {
    if (!newTitle || !newAmount || !newDueDate) return;
    
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle,
      amount: newAmount,
      dueDate: newDueDate,
      completed: false,
    };
    
    setReminders([...reminders, newReminder]);
    
    // Reset form
    setNewTitle("");
    setNewAmount("");
    setNewDueDate(addDays(new Date(), 7));
    setIsAddingReminder(false);
  };
  
  const toggleReminderStatus = (id: string) => {
    setReminders(
      reminders.map((reminder) => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed } 
          : reminder
      )
    );
  };
  
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Bill Reminders</CardTitle>
            <CardDescription>Never miss a payment again</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddingReminder(!isAddingReminder)}>
            {isAddingReminder ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {isAddingReminder ? "Cancel" : "Add"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingReminder && (
          <div className="p-4 rounded-lg border bg-background/50 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Electricity Bill" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="e.g., ₹1,000" 
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full"
                    id="dueDate"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDueDate ? format(newDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newDueDate}
                    onSelect={setNewDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button 
              className="w-full" 
              onClick={handleAddReminder}
              disabled={!newTitle || !newAmount || !newDueDate}
            >
              Add Reminder
            </Button>
          </div>
        )}
        
        <div className="space-y-3">
          {reminders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No bill reminders yet.</p>
              <p className="text-sm">Add your first reminder to get started!</p>
            </div>
          )}
          
          {reminders.map((reminder) => {
            const daysUntilDue = Math.ceil((reminder.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={reminder.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  reminder.completed 
                    ? "bg-muted opacity-60" 
                    : daysUntilDue <= 3 
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50" 
                      : "bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${
                      reminder.completed 
                        ? "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20" 
                        : "text-muted-foreground"
                    }`}
                    onClick={() => toggleReminderStatus(reminder.id)}
                  >
                    {reminder.completed 
                      ? <CheckCircle2 className="h-5 w-5" /> 
                      : <div className="h-5 w-5 rounded-full border-2 border-current" />
                    }
                  </Button>
                  <div>
                    <div className={`font-medium ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                      {reminder.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Due: {format(reminder.dueDate, "d MMM yyyy")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!reminder.completed && daysUntilDue <= 3 && (
                    <Badge variant="destructive" className="mr-2">Due soon</Badge>
                  )}
                  <div className={`font-medium ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                    {reminder.amount}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}