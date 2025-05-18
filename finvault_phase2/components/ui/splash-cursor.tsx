"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function SplashCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 300)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <motion.div
        className="absolute h-4 w-4 rounded-full bg-primary"
        style={{
          top: position.y - 8,
          left: position.x - 8,
        }}
        animate={{
          scale: clicked ? 4 : 1,
          opacity: clicked ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      />
      <motion.div
        className="absolute h-8 w-8 rounded-full border border-primary"
        style={{
          top: position.y - 16,
          left: position.x - 16,
        }}
        animate={{
          scale: clicked ? 1.5 : 1,
          opacity: clicked ? 0 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.05,
        }}
      />
    </div>
  )
}
