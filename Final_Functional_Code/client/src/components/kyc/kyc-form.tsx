"use client"

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/kyc/image-upload";
import { useWeb3 } from "@/components/wallet/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle } from "lucide-react";

// Define schema for KYC form with validation
const kycFormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be in valid format (e.g., ABCDE1234F)"),
  dob: z.string({
    required_error: "Date of birth is required",
  }),
  address: z.string().min(10, "Address must be at least 10 characters"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  panImage: z.instanceof(File).optional(),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

export function KycForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const { account } = useWeb3();
  const { toast } = useToast();

  // Default values for the form
  const defaultValues: Partial<KycFormValues> = {
    fullName: "",
    pan: "",
    dob: "",
    address: "",
    walletAddress: account || "",
  };

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues,
  });

  // Update wallet address field when account changes
  useState(() => {
    if (account) {
      form.setValue("walletAddress", account);
    }
  });

  const onSubmit = async (data: KycFormValues) => {
    setIsSubmitting(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("userId", "1"); // For demo, assuming user ID 1
      formData.append("fullName", data.fullName);
      formData.append("pan", data.pan);
      formData.append("dob", data.dob);
      formData.append("address", data.address);
      formData.append("walletAddress", data.walletAddress);

      if (data.panImage) {
        formData.append("panImage", data.panImage);
      }

      // Send KYC data to API
      const response = await fetch("/api/kyc", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit KYC data");
      }

      // Handle success
      setSubmissionSuccess(true);
      toast({
        title: "KYC Submitted Successfully",
        description: "Your KYC information has been submitted for verification.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit KYC data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for using connected wallet address
  const useConnectedWallet = () => {
    if (account) {
      form.setValue("walletAddress", account);
    } else {
      toast({
        title: "No Wallet Connected",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Please complete your KYC verification to unlock all features of the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissionSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium">KYC Submission Successful</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your KYC information has been submitted and is pending verification. We'll notify you once the verification is complete.
            </p>
            <Button className="mt-6" onClick={() => setSubmissionSuccess(false)}>
              Edit Submission
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Name Field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PAN Field */}
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ABCDE1234F" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          maxLength={10} 
                        />
                      </FormControl>
                      <FormDescription>Format: ABCDE1234F</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* DOB Field */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wallet Address Field */}
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="0x..." 
                            {...field} 
                            className="font-mono text-sm"
                            readOnly={!!account}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={useConnectedWallet}
                        >
                          Use Connected
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your full residential address" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PAN Card Image Upload */}
              <FormField
                control={form.control}
                name="panImage"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>PAN Card Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onChange={(file) => onChange(file)}
                        value={value}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormDescription>
                      Supported formats: JPG, PNG, PDF (Max size: 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`relative transition-all duration-200 ${isSubmitting ? 'bg-primary/80' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">Submit KYC Details</span>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <span className="text-red-500">⚠️</span>
                      )}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}