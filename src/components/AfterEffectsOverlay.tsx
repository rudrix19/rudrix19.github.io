import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

/**
 * AfterEffectsOverlay - Cinematic Visual FX Engine
 * Adds anamorphic lens flare beams, interactive mouse spotlight aura,
 * cosmic light leaks, film grain texture, and click impact shockwaves.
 */
export default function AfterEffectsOverlay() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [smoothPos, setSmoothPos] = useState({ x: -1000, y: -1000 });
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const nextRippleId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      const id = ++nextRippleId.current;
      setRipples((prev) => [...prev.slice(-6), { id, x: e.clientX, y: e.clientY }]);

      // Auto clear old ripples
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1200);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Smooth position interpolation for inertia spotlight
  useEffect(() => {
    let animationFrame: number;

    const lerpPos = () => {
      setSmoothPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return prev;
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1,
        };
      });
      animationFrame = requestAnimationFrame(lerpPos);
    };

    animationFrame = requestAnimationFrame(lerpPos);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* 1. Interactive Mouse Spotlight Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${smoothPos.x}px ${smoothPos.y}px, rgba(34, 211, 238, 0.07), rgba(139, 92, 246, 0.03) 40%, transparent 80%)`,
        }}
      />

      {/* 2. Top-Left Cosmic Cyan Ambient Light Leak Nebula */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[150px] bg-gradient-to-br from-cyan-500/12 via-blue-600/8 to-transparent pointer-events-none animate-[float-pulse_12s_infinite_ease-in-out]"
      />

      {/* 3. Bottom-Right Deep Violet Light Leak Nebula */}
      <div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full blur-[170px] bg-gradient-to-tl from-purple-600/10 via-indigo-600/8 to-transparent pointer-events-none animate-[float-pulse_16s_infinite_ease-in-out_2s]"
      />

      {/* 4. Anamorphic Horizontal Lens Flare Beam */}
      <div className="absolute top-28 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent blur-[0.5px] opacity-40 animate-[flare-scan_10s_infinite_ease-in-out]" />

      {/* 5. Click Gravitational Shockwaves / Lens Impact Rings */}
      <AnimatePresence>
        {ripples.map((r) => (
          <React.Fragment key={r.id}>
            {/* Primary Ring */}
            <motion.div
              initial={{ opacity: 0.8, scale: 0 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: r.x,
                top: r.y,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-28 h-28 rounded-full border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)] pointer-events-none"
            />
            {/* Secondary Inner Pulse Ring */}
            <motion.div
              initial={{ opacity: 0.6, scale: 0 }}
              animate={{ opacity: 0, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: r.x,
                top: r.y,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-16 h-16 rounded-full border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] pointer-events-none"
            />
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* 6. Subtle Film Grain SVG Texture Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay pointer-events-none">
        <filter id="ae-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ae-noise)" />
      </svg>
    </div>
  );
}
