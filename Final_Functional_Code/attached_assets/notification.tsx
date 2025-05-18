"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

const notificationVariants = cva("fixed z-50 flex w-full max-w-sm items-center rounded-lg border p-4 shadow-lg", {
  variants: {
    position: {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
    },
    variant: {
      default: "bg-background text-foreground",
      success:
        "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-50 border-emerald-200 dark:border-emerald-900",
      info: "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50 border-blue-200 dark:border-blue-900",
      warning: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-50 border-amber-200 dark:border-amber-900",
      error: "bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-50 border-rose-200 dark:border-rose-900",
    },
  },
  defaultVariants: {
    position: "top-right",
    variant: "default",
  },
})

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string
  description?: string
  icon?: React.ReactNode
  onClose?: () => void
  duration?: number
  open?: boolean
}

export function Notification({
  className,
  title,
  description,
  icon,
  position,
  variant,
  onClose,
  duration = 5000,
  open = true,
  ...props
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(open)

  React.useEffect(() => {
    setIsVisible(open)
  }, [open])

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position?.includes("top") ? -20 : 20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, x: position?.includes("right") ? 100 : -100 }}
          transition={{ duration: 0.2 }}
          className={cn(notificationVariants({ position, variant }), className)}
          {...props}
        >
          {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
          <div className="flex-1">
            {title && <h3 className="font-medium">{title}</h3>}
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="ml-3 flex-shrink-0 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const useNotification = () => {
  const [notifications, setNotifications] = React.useState<(NotificationProps & { id: string })[]>([])

  const show = (props: NotificationProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...props, id }])
    return id
  }

  const close = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const closeAll = () => {
    setNotifications([])
  }

  const NotificationsContainer = () => (
    <>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} onClose={() => close(notification.id)} />
      ))}
    </>
  )

  return {
    show,
    close,
    closeAll,
    NotificationsContainer,
  }
}
