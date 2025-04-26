"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { VoiceProcessor } from "./voice-processor"
import { AddLiabilityForm } from "../forms/add-liability-form"
import { Liability } from "@shared/schema"
import { useToast } from "@/hooks/use-toast"

interface VoiceLiabilityModalProps {
  onAddLiability: (liability: Liability) => void
}

export function VoiceLiabilityModal({ onAddLiability }: VoiceLiabilityModalProps) {
  const [open, setOpen] = useState(false)
  const [liabilityData, setLiabilityData] = useState<Partial<Liability> | null>(null)
  const { toast } = useToast()

  const handleDataExtracted = (data: Partial<Liability>) => {
    // Handle the extracted data from the voice processor
    setLiabilityData(data)
    
    toast({
      title: "Liability data extracted",
      description: "Please review and submit the form to add this liability.",
    })
  }

  const handleFormSubmit = (formData: Liability) => {
    // When the liability form is submitted
    onAddLiability(formData)
    setOpen(false)
    setLiabilityData(null)
    
    toast({
      title: "Liability added successfully",
      description: "Your liability has been added to your account.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mic className="h-4 w-4" />
          Add Liability with Voice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Liability with Voice</DialogTitle>
          <DialogDescription>
            Use your voice to easily add a new liability to your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {!liabilityData ? (
            <VoiceProcessor type="liability" onDataExtracted={handleDataExtracted} />
          ) : (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-sm font-medium mb-2">We extracted the following information:</h3>
                <ul className="text-sm space-y-1">
                  {liabilityData.title && <li><strong>Title:</strong> {liabilityData.title}</li>}
                  {liabilityData.amount && <li><strong>Amount:</strong> {liabilityData.amount}</li>}
                  {liabilityData.type && <li><strong>Type:</strong> {liabilityData.type}</li>}
                  {liabilityData.interest && <li><strong>Interest Rate:</strong> {liabilityData.interest}</li>}
                  {liabilityData.payment && <li><strong>Payment:</strong> {liabilityData.payment}</li>}
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Review and complete liability details</h3>
                <AddLiabilityForm 
                  initialData={liabilityData} 
                  onAddLiability={handleFormSubmit}
                  submitLabel="Add Liability"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            if (liabilityData) {
              setLiabilityData(null)
            } else {
              setOpen(false)
            }
          }}>
            {liabilityData ? "Back to Voice Input" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}