"use client"

import type React from "react"
import { useState, useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ThreeDCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function ThreeDCard({ children, className, glowColor = "rgba(124, 58, 237, 0.5)" }: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [scale, setScale] = useState(1)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calculate rotation based on mouse position
    // Limit rotation to a reasonable range
    const rotateXValue = (mouseY / (rect.height / 2)) * -5
    const rotateYValue = (mouseX / (rect.width / 2)) * 5

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)

    // Update glow position
    const glowX = (mouseX / rect.width) * 100
    const glowY = (mouseY / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
  }

  const handleMouseEnter = () => {
    setScale(1.02)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setScale(1)
    setGlowPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 70%)`,
          opacity: Math.abs(rotateX) + Math.abs(rotateY) > 0 ? 0.7 : 0,
        }}
      />

      {/* Card content */}
      {children}
    </motion.div>
  )
}
