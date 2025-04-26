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
import { AddAssetForm } from "../forms/add-asset-form"
import { Asset } from "@shared/schema"
import { useToast } from "@/hooks/use-toast"

interface VoiceAssetModalProps {
  onAddAsset: (asset: Asset) => void
}

export function VoiceAssetModal({ onAddAsset }: VoiceAssetModalProps) {
  const [open, setOpen] = useState(false)
  const [assetData, setAssetData] = useState<Partial<Asset> | null>(null)
  const { toast } = useToast()

  const handleDataExtracted = (data: Partial<Asset>) => {
    // Handle the extracted data from the voice processor
    setAssetData(data)
    
    toast({
      title: "Asset data extracted",
      description: "Please review and submit the form to add this asset.",
    })
  }

  const handleFormSubmit = (formData: Asset) => {
    // When the asset form is submitted
    onAddAsset(formData)
    setOpen(false)
    setAssetData(null)
    
    toast({
      title: "Asset added successfully",
      description: "Your asset has been added to your portfolio.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mic className="h-4 w-4" />
          Add Asset with Voice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Asset with Voice</DialogTitle>
          <DialogDescription>
            Use your voice to easily add a new asset to your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {!assetData ? (
            <VoiceProcessor type="asset" onDataExtracted={handleDataExtracted} />
          ) : (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-sm font-medium mb-2">We extracted the following information:</h3>
                <ul className="text-sm space-y-1">
                  {assetData.title && <li><strong>Title:</strong> {assetData.title}</li>}
                  {assetData.value && <li><strong>Value:</strong> {assetData.value}</li>}
                  {assetData.type && <li><strong>Type:</strong> {assetData.type}</li>}
                </ul>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Review and complete asset details</h3>
                <AddAssetForm 
                  initialData={assetData} 
                  onAddAsset={handleFormSubmit}
                  submitLabel="Add Asset"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            if (assetData) {
              setAssetData(null)
            } else {
              setOpen(false)
            }
          }}>
            {assetData ? "Back to Voice Input" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}