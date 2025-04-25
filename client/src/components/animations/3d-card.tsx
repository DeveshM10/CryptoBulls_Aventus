import { useState, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ThreeDCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function ThreeDCard({ 
  children, 
  className = '', 
  glowColor = "rgba(124, 58, 237, 0.5)" 
}: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values (max 10 degrees)
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;
    const rotateXValue = -(mouseY / (rect.height / 2)) * 10;
    
    // Update glow position
    const glowX = (mouseX / rect.width) * 100 + 50;
    const glowY = (mouseY / rect.height) * 100 + 50;
    
    // Set state
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlowPosition({ x: glowX, y: glowY });
  };
  
  const handleMouseEnter = () => {
    setScale(1.02);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setGlowPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX,
        rotateY,
        scale,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <div 
        className="absolute w-full h-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor} 0%, transparent 50%)`,
          opacity: Math.abs(rotateX) / 20 + Math.abs(rotateY) / 20,
          mixBlendMode: 'soft-light',
        }}
      />
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}