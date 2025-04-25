"use client"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (file: File | undefined) => void;
  value?: File;
}

export function ImageUpload({ onChange, value, ...props }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Convert File to DataURL for preview
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(undefined);
      setPreview(null);
      return;
    }
    
    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG, PNG, or PDF files only",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Set file and create preview
    onChange(file);
    
    // Generate preview
    if (file.type === 'application/pdf') {
      setPreview('pdf');
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle remove file
  const handleRemove = () => {
    onChange(undefined);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        {...props}
      />
      
      {!preview ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            Drag and drop your PAN card image or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, PDF (Max size: 5MB)
          </p>
        </div>
      ) : (
        <div className="relative border rounded-md p-2 bg-muted/20">
          {preview === 'pdf' ? (
            <div className="flex flex-col items-center justify-center h-48 bg-muted/50 rounded-md">
              <FileText className="h-12 w-12 text-primary/60 mb-2" />
              <p className="text-sm font-medium">PDF Document</p>
              <p className="text-xs text-muted-foreground mt-1">
                {value?.name}
              </p>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-md"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {value?.name}
          </p>
        </div>
      )}
    </div>
  );
}
