"use client"

import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VoiceAssetModal } from "./voice-asset-modal"
import { VoiceLiabilityModal } from "./voice-liability-modal"
import { useState, useRef } from "react"
import { Asset, Liability } from "@shared/schema"

interface VoiceButtonProps {
  type: "asset" | "liability";
  onDataAdded: (data: any) => void;
}

export function VoiceButton({ type, onDataAdded }: VoiceButtonProps) {
  const assetModalRef = useRef<HTMLButtonElement>(null);
  const liabilityModalRef = useRef<HTMLButtonElement>(null);
  
  const handleClick = () => {
    if (type === "asset" && assetModalRef.current) {
      assetModalRef.current.click();
    } else if (type === "liability" && liabilityModalRef.current) {
      liabilityModalRef.current.click();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {type === "asset" && (
        <div className="hidden">
          <VoiceAssetModal 
            onAddAsset={onDataAdded} 
            ref={assetModalRef}
          />
        </div>
      )}
      
      {type === "liability" && (
        <div className="hidden">
          <VoiceLiabilityModal 
            onAddLiability={onDataAdded}
            ref={liabilityModalRef}
          />
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary/90"
        onClick={handleClick}
      >
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
}