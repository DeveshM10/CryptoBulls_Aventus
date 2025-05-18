"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface ThreeDCardProps {
  children: ReactNode
  className?: string
}

export function ThreeDCard({ children, className = "" }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth out the mouse tracking with springs
  const springConfig = { damping: 20, stiffness: 300 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Transform mouse position into rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - centerX) / rect.width
    const normalizedY = (e.clientY - centerY) / rect.height

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        style={{
          rotateX: hovering ? rotateX : 0,
          rotateY: hovering ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
      >
        {children}
        {hovering && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(2px)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
