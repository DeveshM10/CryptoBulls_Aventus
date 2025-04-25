"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ReactNode } from "react"

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
  submitLabel = "Save",
  onPreSubmit,
  preSubmitLabel,
}: DialogFormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          {field.type === "text" || field.type === "number" || field.type === "date" ? (
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          ) : field.type === "textarea" ? (
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          ) : field.type === "select" ? (
            <Select
              onValueChange={(value) => handleInputChange(field.id, value)}
              value={formData[field.id] || ""}
              required={field.required}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
      ))}
      <div className="flex justify-end space-x-2 pt-4">
        {onPreSubmit && preSubmitLabel && (
          <Button type="button" variant="outline" onClick={() => onPreSubmit(formData)}>
            {preSubmitLabel}
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

export function DialogForm({
  title,
  description,
  triggerButton,
  fields = [],
  onSubmit,
  submitLabel = "Save",
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
        <div className="py-4">
          {customContent || (
            <DialogFormFields
              fields={fields}
              onSubmit={handleSubmit}
              submitLabel={submitLabel}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}