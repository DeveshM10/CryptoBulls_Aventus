/**
 * Edge Direct Form
 * 
 * A form component for directly adding financial items to the Edge AI system.
 * Ensures proper summary updates when working offline.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useEdgeAI } from './EdgeAIProvider';
import { addAsset, addLiability, addExpense, addIncome } from '../../lib/edge-ai/data-store';
import { v4 as uuidv4 } from 'uuid';
import { addToSyncQueue } from '../../lib/edge-ai/sync-manager';
import { format } from 'date-fns';
import { Asset, Liability, Expense, Income } from '../../types/finance';

// Schema for different form types
const assetSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  value: z.string().min(1, 'Asset value is required'),
  type: z.string().min(1, 'Asset type is required'),
  change: z.string().optional(),
  trend: z.enum(['up', 'down']),
});

const liabilitySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  amount: z.string().min(1, 'Liability amount is required'),
  type: z.string().min(1, 'Liability type is required'),
  interest: z.string().min(1, 'Interest rate is required'),
  payment: z.string().min(1, 'Payment amount is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['current', 'warning', 'late']),
});

const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  budgeted: z.string().min(1, 'Budgeted amount is required'),
  spent: z.string().min(1, 'Spent amount is required'),
  status: z.enum(['normal', 'warning', 'danger']),
});

const incomeSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  amount: z.string().min(1, 'Income amount is required'),
  description: z.string().optional(),
});

interface EdgeDirectFormProps {
  type: 'asset' | 'liability' | 'expense' | 'income';
  onSuccess?: () => void;
}

export function EdgeDirectForm({ type, onSuccess }: EdgeDirectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isOffline } = useEdgeAI();
  
  // Initialize form based on type
  const getFormSchema = () => {
    switch (type) {
      case 'asset': return assetSchema;
      case 'liability': return liabilitySchema;
      case 'expense': return expenseSchema;
      case 'income': return incomeSchema;
      default: return assetSchema;
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getDefaultValues(),
  });

  // Get default values based on type
  function getDefaultValues() {
    switch (type) {
      case 'asset':
        return {
          title: '',
          value: '',
          type: '',
          change: '0%',
          trend: 'up' as const,
        };
      case 'liability':
        return {
          title: '',
          amount: '',
          type: '',
          interest: '',
          payment: '',
          dueDate: '',
          status: 'current' as const,
        };
      case 'expense':
        return {
          title: '',
          budgeted: '',
          spent: '',
          status: 'normal' as const,
        };
      case 'income':
        return {
          title: '',
          amount: '',
          description: '',
        };
      default:
        return {};
    }
  }

  // Submit handler
  async function onSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const id = uuidv4();
      let result: any;
      
      // Create appropriate object based on type
      switch (type) {
        case 'asset': {
          // Format currency values
          const value = values.value.includes('₹') 
            ? values.value 
            : `₹${parseFloat(values.value).toLocaleString('en-IN')}`;
          
          result = {
            id,
            title: values.title,
            value,
            type: values.type,
            date: format(now, 'yyyy-MM-dd'),
            change: values.change?.includes('%') ? values.change : `${values.change}%`,
            trend: values.trend,
          } as Asset;
          
          // Save to data store
          await addAsset(result);
          
          // If offline, update summary directly via event
          if (isOffline) {
            // Extract numeric value for summary update
            const assetValue = parseFloat(values.value.replace(/[^\d.-]/g, '')) || 0;
            
            // Dispatch custom event for asset addition
            document.dispatchEvent(new CustomEvent('edgeai-asset-added', { 
              detail: result,
              bubbles: true,
            }));
            
            // Dispatch summary update event
            document.dispatchEvent(new CustomEvent('edgeai-summary-update', {
              detail: { 
                type: 'asset',
                value: assetValue
              },
              bubbles: true
            }));
            
            // Add to sync queue
            addToSyncQueue('assets', result);
          }
          break;
        }
        
        case 'liability': {
          // Format currency values
          const amount = values.amount.includes('₹')
            ? values.amount
            : `₹${parseFloat(values.amount).toLocaleString('en-IN')}`;
          
          const payment = values.payment.includes('₹')
            ? values.payment
            : `₹${parseFloat(values.payment).toLocaleString('en-IN')}`;
          
          const interest = values.interest.includes('%')
            ? values.interest
            : `${values.interest}%`;
            
          result = {
            id,
            title: values.title,
            amount,
            type: values.type,
            interest,
            payment,
            dueDate: values.dueDate,
            status: values.status,
          } as Liability;
          
          // Save to data store
          await addLiability(result);
          
          // If offline, update summary directly via event
          if (isOffline) {
            // Extract numeric value for summary update
            const liabilityValue = parseFloat(values.amount.replace(/[^\d.-]/g, '')) || 0;
            
            // Dispatch custom event for liability addition
            document.dispatchEvent(new CustomEvent('edgeai-liability-added', { 
              detail: result,
              bubbles: true,
            }));
            
            // Dispatch summary update event
            document.dispatchEvent(new CustomEvent('edgeai-summary-update', {
              detail: { 
                type: 'liability',
                value: liabilityValue
              },
              bubbles: true
            }));
            
            // Add to sync queue
            addToSyncQueue('liabilities', result);
          }
          break;
        }
        
        case 'expense': {
          // Format currency values
          const budgeted = values.budgeted.includes('₹')
            ? values.budgeted
            : `₹${parseFloat(values.budgeted).toLocaleString('en-IN')}`;
          
          const spent = values.spent.includes('₹')
            ? values.spent
            : `₹${parseFloat(values.spent).toLocaleString('en-IN')}`;
          
          // Calculate percentage spent
          const budgetedAmount = parseFloat(values.budgeted.replace(/[^\d.-]/g, '')) || 0;
          const spentAmount = parseFloat(values.spent.replace(/[^\d.-]/g, '')) || 0;
          const percentage = budgetedAmount > 0 
            ? Math.min(Math.round((spentAmount / budgetedAmount) * 100), 100)
            : 0;
            
          result = {
            id,
            title: values.title,
            budgeted,
            spent,
            percentage,
            status: values.status,
          } as Expense;
          
          // Save to data store
          await addExpense(result);
          
          // If offline, update summary directly via event
          if (isOffline) {
            // Extract numeric value for summary update
            const expenseValue = spentAmount;
            
            // Dispatch custom event for expense addition
            document.dispatchEvent(new CustomEvent('edgeai-expense-added', { 
              detail: result,
              bubbles: true,
            }));
            
            // Dispatch summary update event
            document.dispatchEvent(new CustomEvent('edgeai-summary-update', {
              detail: { 
                type: 'expense',
                value: expenseValue
              },
              bubbles: true
            }));
            
            // Add to sync queue
            addToSyncQueue('expenses', result);
          }
          break;
        }
        
        case 'income': {
          // Format currency values
          const amount = values.amount.includes('₹')
            ? values.amount
            : `₹${parseFloat(values.amount).toLocaleString('en-IN')}`;
            
          result = {
            id,
            title: values.title,
            amount,
            description: values.description || '',
          } as Income;
          
          // Save to data store
          await addIncome(result);
          
          // If offline, update summary directly via event
          if (isOffline) {
            // Extract numeric value for summary update
            const incomeValue = parseFloat(values.amount.replace(/[^\d.-]/g, '')) || 0;
            
            // Dispatch custom event for income addition
            document.dispatchEvent(new CustomEvent('edgeai-income-added', { 
              detail: result,
              bubbles: true,
            }));
            
            // Dispatch summary update event
            document.dispatchEvent(new CustomEvent('edgeai-summary-update', {
              detail: { 
                type: 'income',
                value: incomeValue
              },
              bubbles: true
            }));
            
            // Add to sync queue
            addToSyncQueue('income', result);
          }
          break;
        }
      }
      
      // Trigger other refresh events to ensure UI updates
      window.dispatchEvent(new Event('storage'));
      document.dispatchEvent(new Event('edgeai-data-changed'));
      document.dispatchEvent(new Event('edgeai-refresh'));
      
      // Success feedback
      toast({
        title: 'Success',
        description: `Your ${type} has been added successfully.`,
      });
      
      // Close form and call success callback
      setIsOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast({
        title: 'Error',
        description: `Failed to add ${type}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Render the appropriate form fields based on type
  const renderFormFields = () => {
    switch (type) {
      case 'asset':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Title</FormLabel>
                  <FormControl>
                    <Input placeholder="House, Car, Stocks, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="₹100,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Current value of the asset
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Property">Property</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Retirement">Retirement</SelectItem>
                      <SelectItem value="Personal Property">Personal Property</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="change"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Percentage</FormLabel>
                  <FormControl>
                    <Input placeholder="0%" {...field} />
                  </FormControl>
                  <FormDescription>
                    Growth or decline since acquisition
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="trend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trend</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trend" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="up">Up</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Is the asset value trending up or down?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case 'liability':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liability Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Mortgage, Car Loan, Credit Card, etc." {...field} />
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="₹200,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total amount owed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liability Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select liability type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mortgage">Mortgage</SelectItem>
                      <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Student Loan">Student Loan</SelectItem>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="5.5%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Payment</FormLabel>
                  <FormControl>
                    <Input placeholder="₹10,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input placeholder="15th of every month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case 'expense':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Groceries, Utilities, Rent, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budgeted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budgeted Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="₹25,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total amount budgeted
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="spent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spent Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="₹15,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Amount already spent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="danger">Danger</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Status of expense budget
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case 'income':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Salary, Freelance, Dividend, etc." {...field} />
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="₹50,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Income amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Monthly salary, dividend payment, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Additional details about this income
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Get form title based on type
  const getFormTitle = () => {
    switch (type) {
      case 'asset': return 'Add New Asset';
      case 'liability': return 'Add New Liability';
      case 'expense': return 'Add New Expense';
      case 'income': return 'Add New Income';
      default: return 'Add New Item';
    }
  };
  
  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{getFormTitle()}</DialogTitle>
            <DialogDescription>
              {isOffline && (
                <span className="text-yellow-600 font-semibold">
                  You're currently offline. Your data will be saved locally and synced when you're back online.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormFields()}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}