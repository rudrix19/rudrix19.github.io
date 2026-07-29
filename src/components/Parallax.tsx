import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // positive = moves upward slower/faster, negative = moves opposite direction
  offset?: number; // max pixel displacement e.g. 40
  className?: string;
  key?: React.Key;
}

/**
 * Reusable scroll-driven Parallax wrapper powered by Framer Motion & spring physics.
 */
export default function Parallax({
  children,
  speed = 0.15,
  offset = 40,
  className = ''
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Transform scroll progress [0, 1] to y-axis displacement [-offset * speed, offset * speed]
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [offset * speed * 1.5, -offset * speed * 1.5]
  );

  // Smooth spring physics for inertia
  const y = useSpring(rawY, {
    stiffness: 120,
    damping: 24,
    mass: 0.2
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Interactive 3D Mouse Parallax Tilt Container
 */
export function MouseParallax({
  children,
  className = '',
  intensity = 15
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  key?: React.Key;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = React.useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (-y / (rect.height / 2)) * (intensity / 2);
    const rotY = (x / (rect.width / 2)) * (intensity / 2);

    setTransformStyle(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}
      className={`relative ${className}`}
    >
      {children}
    </div>
  );
}
