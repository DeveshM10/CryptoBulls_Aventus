"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Field {
  id: string
  label: string
  type: "text" | "number" | "select" | "textarea" | "date"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

interface DialogFormProps {
  title: string
  description: string
  triggerButton: ReactNode
  fields?: Field[]
  onSubmit?: (data: Record<string, any>) => void
  submitLabel?: string
  customContent?: ReactNode
}

interface DialogFormFieldsProps {
  fields: Field[]
  onSubmit: (data: Record<string, any>) => void
  submitLabel?: string
  onPreSubmit?: (data: Record<string, any>) => void
  preSubmitLabel?: string
}

function DialogFormFields({
  fields,
  onSubmit,
  submitLabel = "Submit",
  onPreSubmit,
  preSubmitLabel = "Preview",
}: DialogFormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePreSubmit = () => {
    if (onPreSubmit) {
      onPreSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </Label>

          {field.type === "select" ? (
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) => handleChange(field.id, value)}
              required={field.required}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "textarea" ? (
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
            />
          ) : (
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}

      <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        {onPreSubmit && (
          <Button type="button" variant="outline" onClick={handlePreSubmit} className="w-full sm:w-auto">
            {preSubmitLabel}
          </Button>
        )}
        <Button type="submit" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function DialogForm({
  title,
  description,
  triggerButton,
  fields,
  onSubmit,
  submitLabel = "Submit",
  customContent,
}: DialogFormProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {customContent ||
          (fields && onSubmit && (
            <DialogFormFields fields={fields} onSubmit={handleSubmit} submitLabel={submitLabel} />
          ))}
      </DialogContent>
    </Dialog>
  )
}

DialogForm.Fields = DialogFormFields
