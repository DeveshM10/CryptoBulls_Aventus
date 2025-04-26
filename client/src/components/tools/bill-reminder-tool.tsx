"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, differenceInDays, isPast, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, AlertTriangle, Plus, Check, Trash2, Bell, ArrowRight, Megaphone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Bill {
  id: string;
  title: string;
  amount: string;
  dueDate: Date;
  category: string;
  recurring: string;
  notes?: string;
  reminderDays: number;
  status: "upcoming" | "due" | "overdue" | "paid";
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Bill name must be at least 2 characters.",
  }),
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  recurring: z.string({
    required_error: "Please select if the bill is recurring.",
  }),
  notes: z.string().optional(),
  reminderDays: z.coerce.number().min(0).max(30),
});

const BILL_CATEGORIES = [
  { value: "utilities", label: "Utilities" },
  { value: "rent_mortgage", label: "Rent/Mortgage" },
  { value: "insurance", label: "Insurance" },
  { value: "credit_card", label: "Credit Card" },
  { value: "loan", label: "Loan Payment" },
  { value: "subscription", label: "Subscription" },
  { value: "phone_internet", label: "Phone/Internet" },
  { value: "tax", label: "Tax" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export function BillReminderTool() {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>(() => {
    // Try to load bills from localStorage
    const savedBills = localStorage.getItem("billReminders");
    return savedBills ? JSON.parse(savedBills) : [];
  });
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "upcoming" | "overdue">("all");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      recurring: "no",
      notes: "",
      reminderDays: 3,
    },
  });
  
  // Save bills to localStorage whenever bills change
  useEffect(() => {
    localStorage.setItem("billReminders", JSON.stringify(bills));
    
    // Update bill statuses
    const today = new Date();
    const updatedBills = bills.map(bill => {
      const daysDiff = differenceInDays(bill.dueDate, today);
      
      if (bill.status === "paid") {
        return bill;
      } else if (daysDiff < 0) {
        return { ...bill, status: "overdue" };
      } else if (daysDiff === 0) {
        return { ...bill, status: "due" };
      } else {
        return { ...bill, status: "upcoming" };
      }
    });
    
    setBills(updatedBills);
    
    // Filter upcoming bills that need reminders
    const billsNeedingReminders = updatedBills.filter(bill => {
      if (bill.status === "paid") return false;
      
      const daysToDue = differenceInDays(bill.dueDate, today);
      return daysToDue <= bill.reminderDays && daysToDue >= 0;
    });
    
    setUpcomingBills(billsNeedingReminders);
    
  }, [bills]);
  
  // Show notification for upcoming bills
  useEffect(() => {
    if (upcomingBills.length > 0) {
      const dueSoonCount = upcomingBills.filter(bill => 
        differenceInDays(bill.dueDate, new Date()) <= bill.reminderDays
      ).length;
      
      if (dueSoonCount > 0) {
        toast({
          title: `${dueSoonCount} bill${dueSoonCount > 1 ? 's' : ''} due soon!`,
          description: "Check your bill reminders for details",
          variant: "destructive",
        });
      }
    }
  }, [upcomingBills, toast]);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newBill: Bill = {
      id: crypto.randomUUID(),
      title: values.title,
      amount: values.amount,
      dueDate: values.dueDate,
      category: values.category,
      recurring: values.recurring,
      notes: values.notes,
      reminderDays: values.reminderDays,
      status: isPast(values.dueDate) ? "overdue" : differenceInDays(values.dueDate, new Date()) === 0 ? "due" : "upcoming",
    };
    
    setBills([...bills, newBill]);
    
    toast({
      title: "Bill reminder created",
      description: `${values.title} has been added to your reminders.`,
    });
    
    form.reset({
      title: "",
      amount: "",
      category: "",
      recurring: "no",
      notes: "",
      reminderDays: 3,
    });
  };
  
  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
    
    toast({
      title: "Bill deleted",
      description: "The bill reminder has been removed.",
    });
  };
  
  const handleMarkAsPaid = (id: string) => {
    setBills(
      bills.map(bill => 
        bill.id === id ? { ...bill, status: "paid" } : bill
      )
    );
    
    toast({
      title: "Bill marked as paid",
      description: "Great job keeping up with your payments!",
    });
  };
  
  const getFilteredBills = () => {
    switch (viewMode) {
      case "upcoming":
        return bills.filter(bill => bill.status === "upcoming" || bill.status === "due");
      case "overdue":
        return bills.filter(bill => bill.status === "overdue");
      default:
        return bills;
    }
  };
  
  const getCategoryLabel = (categoryValue: string) => {
    const category = BILL_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Upcoming</Badge>;
      case "due":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Due Today</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">Overdue</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Bills</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <BillsList 
                bills={getFilteredBills()} 
                onDelete={handleDeleteBill} 
                onMarkPaid={handleMarkAsPaid}
                getCategoryLabel={getCategoryLabel}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              <BillsList 
                bills={getFilteredBills()} 
                onDelete={handleDeleteBill} 
                onMarkPaid={handleMarkAsPaid}
                getCategoryLabel={getCategoryLabel}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="overdue" className="mt-4">
              <BillsList 
                bills={getFilteredBills()} 
                onDelete={handleDeleteBill} 
                onMarkPaid={handleMarkAsPaid}
                getCategoryLabel={getCategoryLabel}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Electricity Bill" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BILL_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurring</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Is this a recurring bill?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">Not Recurring</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reminderDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remind me</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Days before due date" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">On the due date</SelectItem>
                            <SelectItem value="1">1 day before</SelectItem>
                            <SelectItem value="2">2 days before</SelectItem>
                            <SelectItem value="3">3 days before</SelectItem>
                            <SelectItem value="5">5 days before</SelectItem>
                            <SelectItem value="7">1 week before</SelectItem>
                            <SelectItem value="14">2 weeks before</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Additional details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bill Reminder
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Upcoming Reminders Card */}
      {upcomingBills.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-amber-700">Upcoming Bills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBills.map((bill) => {
                const daysUntilDue = differenceInDays(bill.dueDate, new Date());
                return (
                  <div key={bill.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-amber-100 mr-3">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{bill.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Due {daysUntilDue === 0 ? "today" : `in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`} - ₹{Number(bill.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 border-emerald-300 text-emerald-700"
                      onClick={() => handleMarkAsPaid(bill.id)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Pay
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface BillsListProps {
  bills: Bill[];
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  getCategoryLabel: (category: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

function BillsList({ bills, onDelete, onMarkPaid, getCategoryLabel, getStatusBadge }: BillsListProps) {
  if (bills.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-3">
          <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No bills found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          {bills.length === 0 ? "Add your first bill reminder to stay on top of your finances." : "No bills match the current filter."}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your bill reminders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Bill Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map(bill => (
          <TableRow key={bill.id}>
            <TableCell className="font-medium">{bill.title}</TableCell>
            <TableCell>₹{Number(bill.amount).toLocaleString()}</TableCell>
            <TableCell>
              {format(new Date(bill.dueDate), "MMM d, yyyy")}
              {bill.recurring !== "no" && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({bill.recurring})
                </span>
              )}
            </TableCell>
            <TableCell>{getCategoryLabel(bill.category)}</TableCell>
            <TableCell>{getStatusBadge(bill.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                {bill.status !== "paid" && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    onClick={() => onMarkPaid(bill.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                  onClick={() => onDelete(bill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}