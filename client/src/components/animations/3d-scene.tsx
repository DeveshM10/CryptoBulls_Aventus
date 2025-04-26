import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function ThreeDScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {/* 3D floating objects */}
      <div className="absolute w-full h-full">
        <FloatingObject 
          className="bg-gradient-to-br from-primary/20 to-indigo-500/30"
          size={100}
          position={{ x: '20%', y: '30%' }}
          duration={20}
          delay={0}
        />
        <FloatingObject 
          className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20"
          size={80}
          position={{ x: '65%', y: '15%' }}
          duration={15}
          delay={2}
        />
        <FloatingObject 
          className="bg-gradient-to-bl from-primary/15 to-emerald-500/20"
          size={150}
          position={{ x: '75%', y: '70%' }}
          duration={25}
          delay={5}
        />
        <FloatingObject 
          className="bg-gradient-to-tr from-amber-400/15 to-primary/20"
          size={60}
          position={{ x: '10%', y: '60%' }}
          duration={18}
          delay={7}
        />
        <FloatingObject 
          className="bg-gradient-to-l from-sky-400/15 to-indigo-600/20"
          size={120}
          position={{ x: '40%', y: '80%' }}
          duration={22}
          delay={3}
        />
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />
      </div>
    </div>
  );
}

interface FloatingObjectProps {
  size: number;
  position: { x: string; y: string };
  className?: string;
  duration: number;
  delay: number;
}

function FloatingObject({ size, position, className, duration, delay }: FloatingObjectProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-xl ${className}`}
      style={{
        width: size,
        height: size,
        left: position.x,
        top: position.y,
        transformStyle: 'preserve-3d',
      }}
      initial={{ 
        scale: 0.8, 
        opacity: 0.5 
      }}
      animate={{ 
        y: [0, -30, 0, 30, 0],
        x: [0, 15, 0, -15, 0],
        scale: [0.8, 1, 0.9, 1.1, 0.8],
        opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
        rotateX: [0, 40, 0, -40, 0],
        rotateY: [0, 30, 0, -30, 0]
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity,
        repeatType: "loop",
        delay: delay
      }}
    />
  );
}