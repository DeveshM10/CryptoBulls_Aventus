"use client"

import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BigMicButtonProps {
  onClick: () => void;
}

export function BigMicButton({ onClick }: BigMicButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 w-16 flex items-center justify-center fixed bottom-6 right-6 shadow-lg z-50"
      size="icon"
    >
      <Mic className="h-8 w-8" />
    </Button>
  );
}