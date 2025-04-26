"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AddLiabilityForm } from "./add-liability-form"
import { VoiceLiabilityModal } from "../voice-input/voice-liability-modal"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { Liability } from "@shared/schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export function LiabilityManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // Fetch liabilities
  const { data: liabilities = [] } = useQuery({
    queryKey: ["/api/liabilities"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/liabilities");
      return await res.json();
    }
  });

  const handleAddLiability = async (liability: Liability) => {
    try {
      // The add form already handles the API call, so we just need to invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["/api/liabilities"] })
      
      // Close the form
      setShowAddForm(false)
      
      toast({
        title: "Liability added",
        description: "Your liability has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding liability:", error)
      toast({
        title: "Error adding liability",
        description: "There was a problem adding your liability.",
        variant: "destructive",
      })
    }
  }

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="all">All Liabilities</TabsTrigger>
          <TabsTrigger value="mortgage">Mortgages</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="credit-cards">Credit Cards</TabsTrigger>
        </TabsList>
        
        <div className="flex space-x-2">
          <VoiceLiabilityModal onAddLiability={handleAddLiability} />
          
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : 
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Liability
            </>}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Liability</CardTitle>
            <CardDescription>
              Enter the details of your liability below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddLiabilityForm onAddLiability={handleAddLiability} />
          </CardContent>
        </Card>
      )}

      <TabsContent value="all" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liabilities.length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No liabilities found</h3>
                <p className="text-muted-foreground">
                  Add a liability to track your debts and loans.
                </p>
              </div>
            </div>
          ) : (
            liabilities.map((liability: Liability) => (
              <Card key={liability.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{liability.title}</CardTitle>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(liability.status)}`}>
                      {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>{liability.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{liability.amount}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Interest:</span> {liability.interest}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment:</span> {liability.payment}
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Due:</span> {liability.dueDate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="mortgage" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liabilities.filter((liability: Liability) => liability.type === 'mortgage').length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No mortgages found</h3>
                <p className="text-muted-foreground">
                  Add a mortgage to track your home loans.
                </p>
              </div>
            </div>
          ) : (
            liabilities
              .filter((liability: Liability) => liability.type === 'mortgage')
              .map((liability: Liability) => (
                <Card key={liability.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{liability.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(liability.status)}`}>
                        {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>{liability.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{liability.amount}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Interest:</span> {liability.interest}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span> {liability.payment}
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Due:</span> {liability.dueDate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="loans" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liabilities.filter((liability: Liability) => 
            ['loan', 'auto-loan', 'student-loan'].includes(liability.type)
          ).length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No loans found</h3>
                <p className="text-muted-foreground">
                  Add a personal, auto, or student loan to track your debt.
                </p>
              </div>
            </div>
          ) : (
            liabilities
              .filter((liability: Liability) => 
                ['loan', 'auto-loan', 'student-loan'].includes(liability.type)
              )
              .map((liability: Liability) => (
                <Card key={liability.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{liability.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(liability.status)}`}>
                        {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>{liability.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{liability.amount}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Interest:</span> {liability.interest}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span> {liability.payment}
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Due:</span> {liability.dueDate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="credit-cards" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liabilities.filter((liability: Liability) => liability.type === 'credit-card').length === 0 ? (
            <div className="col-span-full flex justify-center p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">No credit cards found</h3>
                <p className="text-muted-foreground">
                  Add a credit card to track your card balances.
                </p>
              </div>
            </div>
          ) : (
            liabilities
              .filter((liability: Liability) => liability.type === 'credit-card')
              .map((liability: Liability) => (
                <Card key={liability.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{liability.title}</CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(liability.status)}`}>
                        {liability.status.charAt(0).toUpperCase() + liability.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>{liability.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{liability.amount}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Interest:</span> {liability.interest}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span> {liability.payment}
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Due:</span> {liability.dueDate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}