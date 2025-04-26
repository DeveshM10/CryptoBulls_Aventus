"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Trash2, BellRing, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface BillReminder {
  id: string;
  title: string;
  amount: string;
  dueDate: Date;
  category: string;
  reminderDays: number;
  recurring: boolean;
  recurrenceFrequency?: "monthly" | "quarterly" | "yearly";
  paid: boolean;
}

export function BillReminderTool() {
  const [reminders, setReminders] = useState<BillReminder[]>([]);
  const [newReminder, setNewReminder] = useState<Partial<BillReminder>>({
    dueDate: new Date(),
    reminderDays: 3,
    recurring: false,
    recurrenceFrequency: "monthly",
    paid: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<keyof BillReminder>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "upcoming" | "paid">("all");
  
  const { toast } = useToast();

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.amount || !newReminder.dueDate || !newReminder.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    const reminder: BillReminder = {
      id: uuidv4(),
      title: newReminder.title,
      amount: newReminder.amount,
      dueDate: newReminder.dueDate!,
      category: newReminder.category,
      reminderDays: newReminder.reminderDays || 3,
      recurring: newReminder.recurring || false,
      recurrenceFrequency: newReminder.recurring ? newReminder.recurrenceFrequency : undefined,
      paid: false,
    };

    setReminders([...reminders, reminder]);
    setNewReminder({
      dueDate: new Date(),
      reminderDays: 3,
      recurring: false,
      recurrenceFrequency: "monthly",
      paid: false,
    });
    setShowForm(false);

    toast({
      title: "Reminder Added",
      description: "Your bill reminder has been added successfully",
    });
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "Your bill reminder has been deleted",
    });
  };

  const handleTogglePaid = (id: string) => {
    setReminders(
      reminders.map(reminder => 
        reminder.id === id ? { ...reminder, paid: !reminder.paid } : reminder
      )
    );
  };

  const handleSortChange = (field: keyof BillReminder) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedReminders = () => {
    let filteredReminders = [...reminders];
    
    // Apply filter
    if (filter === "upcoming") {
      filteredReminders = filteredReminders.filter(r => !r.paid);
    } else if (filter === "paid") {
      filteredReminders = filteredReminders.filter(r => r.paid);
    }
    
    // Apply sort
    return filteredReminders.sort((a, b) => {
      if (sortField === "dueDate") {
        return sortDirection === "asc" 
          ? a.dueDate.getTime() - b.dueDate.getTime()
          : b.dueDate.getTime() - a.dueDate.getTime();
      } else if (sortField === "amount") {
        // Convert string amounts to numbers for sorting
        const aAmount = parseFloat(a.amount.replace(/[^0-9.]/g, ""));
        const bAmount = parseFloat(b.amount.replace(/[^0-9.]/g, ""));
        return sortDirection === "asc" ? aAmount - bAmount : bAmount - aAmount;
      } else {
        // For string fields like title or category
        const aValue = a[sortField] as string;
        const bValue = b[sortField] as string;
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });
  };

  const getDaysDifference = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (reminder: BillReminder) => {
    if (reminder.paid) {
      return <Badge className="bg-green-500">Paid</Badge>;
    }
    
    const daysDiff = getDaysDifference(reminder.dueDate);
    
    if (daysDiff < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysDiff <= reminder.reminderDays) {
      return <Badge variant="default" className="bg-amber-500">Due Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bill Reminders</h2>
        <p className="text-muted-foreground">
          Keep track of your bills and never miss a payment due date
        </p>
      </div>
      
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>Add New Reminder</Button>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Bill Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Electricity Bill"
                    value={newReminder.title || ""}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="₹0.00"
                    value={newReminder.amount || ""}
                    onChange={(e) => setNewReminder({ ...newReminder, amount: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newReminder.category}
                    onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="rent">Rent / Mortgage</SelectItem>
                      <SelectItem value="subscription">Subscriptions</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="loan">Loan Payment</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newReminder.dueDate ? (
                          format(newReminder.dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newReminder.dueDate}
                        onSelect={(date) => setNewReminder({ ...newReminder, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reminderDays">Remind me</Label>
                  <Select
                    value={newReminder.reminderDays?.toString()}
                    onValueChange={(value) => setNewReminder({ ...newReminder, reminderDays: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select days before" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="5">5 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                      <SelectItem value="14">2 weeks before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring">Recurring Bill</Label>
                    <Switch
                      id="recurring"
                      checked={newReminder.recurring}
                      onCheckedChange={(checked) => 
                        setNewReminder({ ...newReminder, recurring: checked })
                      }
                    />
                  </div>
                  
                  {newReminder.recurring && (
                    <Select
                      value={newReminder.recurrenceFrequency}
                      onValueChange={(value) => 
                        setNewReminder({ 
                          ...newReminder, 
                          recurrenceFrequency: value as "monthly" | "quarterly" | "yearly"
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReminder}>
                  Add Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Filtering and sorting controls */}
      {reminders.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as "all" | "upcoming" | "paid")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reminders</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSortChange("dueDate")}
              className="flex items-center gap-1"
            >
              Due Date
              {sortField === "dueDate" && (
                <ArrowUpDown 
                  className={cn(
                    "h-4 w-4", 
                    sortDirection === "asc" ? "rotate-0" : "rotate-180"
                  )} 
                />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSortChange("amount")}
              className="flex items-center gap-1"
            >
              Amount
              {sortField === "amount" && (
                <ArrowUpDown 
                  className={cn(
                    "h-4 w-4", 
                    sortDirection === "asc" ? "rotate-0" : "rotate-180"
                  )} 
                />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSortChange("category")}
              className="flex items-center gap-1"
            >
              Category
              {sortField === "category" && (
                <ArrowUpDown 
                  className={cn(
                    "h-4 w-4", 
                    sortDirection === "asc" ? "rotate-0" : "rotate-180"
                  )} 
                />
              )}
            </Button>
          </div>
        </div>
      )}
      
      {/* Reminders list */}
      {reminders.length > 0 ? (
        <div className="space-y-4">
          {getFilteredAndSortedReminders().map((reminder) => (
            <Card key={reminder.id} className={cn(
              reminder.paid ? "bg-muted/50" : "",
              !reminder.paid && getDaysDifference(reminder.dueDate) <= reminder.reminderDays ? "border-amber-500" : ""
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      reminder.paid ? "bg-green-100 text-green-700" : "bg-primary/10"
                    )}>
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{reminder.title}</h3>
                        {getStatusBadge(reminder)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Due {format(reminder.dueDate, "MMM d, yyyy")} • {reminder.amount}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={reminder.paid}
                      onCheckedChange={() => handleTogglePaid(reminder.id)}
                      aria-label="Toggle paid status"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{reminder.category}</Badge>
                  {reminder.recurring && (
                    <Badge variant="outline">
                      Recurring ({reminder.recurrenceFrequency})
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <BellRing className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No Reminders</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first bill reminder to keep track of payment due dates
          </p>
        </div>
      )}
    </div>
  );
}