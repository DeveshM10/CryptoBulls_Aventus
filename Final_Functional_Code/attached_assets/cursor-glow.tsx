"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener("mousemove", updateMousePosition)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 w-[150px] h-[150px] rounded-full pointer-events-none z-50 mix-blend-screen"
      animate={{
        x: mousePosition.x - 75,
        y: mousePosition.y - 75,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
      style={{
        background: "radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 70%)",
        filter: "blur(10px)",
      }}
    />
  )
}
