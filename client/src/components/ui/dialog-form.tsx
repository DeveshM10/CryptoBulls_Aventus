import { useState, ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
}

function DialogFormFields({
  fields,
  onSubmit,
  submitLabel = "Submit",
}: DialogFormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div className="space-y-2" key={field.id}>
          <Label htmlFor={field.id}>
            {field.label}{field.required && <span className="text-red-500">*</span>}
          </Label>
          
          {field.type === "text" && (
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}
          
          {field.type === "number" && (
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}
          
          {field.type === "textarea" && (
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}
          
          {field.type === "date" && (
            <Input
              id={field.id}
              type="date"
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}
          
          {field.type === "select" && field.options && (
            <Select 
              value={formData[field.id] || ""} 
              onValueChange={(value) => handleChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {errors[field.id] && (
            <p className="text-sm text-red-500">{errors[field.id]}</p>
          )}
        </div>
      ))}
      
      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  );
}

export function DialogForm({
  title,
  description,
  triggerButton,
  fields = [],
  onSubmit,
  submitLabel = "Submit",
  customContent,
}: DialogFormProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {customContent ? (
          customContent
        ) : (
          <DialogFormFields
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}