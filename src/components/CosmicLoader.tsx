import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const cosmicSteps = [
  "Unveiling dark sky canopy...",
  "Plotting stellar coordinate matrices...",
  "Calibrating optical telescope focus...",
  "Weaving constellation nodes...",
  "Filtering atmospheric noise...",
  "Resolving high-altitude telemetry...",
  "Starlit canopy fully synchronized."
];

interface CosmicLoaderProps {
  onComplete: () => void;
  key?: string;
}

interface Star {
  x: number;
  y: number;
  baseX: number; // For return-to-base spring physics
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  a: number; // Base alpha
  s: number; // Twinkle speed
  p: number; // Twinkle phase
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function CosmicLoader({ onComplete }: CosmicLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store mouse state
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    radius: 130
  });

  // Cycle poetic steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < cosmicSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(stepInterval);
  }, []);

  // Smooth progress bar calculation
  useEffect(() => {
    const totalDuration = 3300; // ms
    const intervalTime = 25; // ms
    const increment = (100 / (totalDuration / intervalTime));

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  // Night Sky & Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Adapt to window resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Interactive pointer events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);

    // Prepare starry canopy
    const starCount = Math.floor((width * height) / 3800) + 120;
    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];

    for (let i = 0; i < starCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      stars.push({
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        vx: 0,
        vy: Math.random() * 0.04 + 0.01, // Subtle upward drift matching the website
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.7 + 0.3,
        s: Math.random() * 0.4 + 0.1, // twinkle speed
        p: Math.random() * Math.PI * 2, // twinkle phase
        // Color matching: Cyan accent or clean bright zinc/white
        color: Math.random() > 0.88 ? 'rgb(34, 211, 238)' : 'rgb(228, 228, 231)'
      });
    }

    const spawnShootingStar = () => {
      if (Math.random() < 0.003 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.7,
          y: Math.random() * height * 0.4,
          vx: 5 + Math.random() * 4,
          vy: 2 + Math.random() * 2,
          life: 50,
          maxLife: 50
        });
      }
    };

    let t = 0;

    // Canvas Tick Loop
    const tick = () => {
      t += 0.016;

      // Solid space-black background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Create a super fine ambient vignetted glow from the bottom and center
      const radialGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.7);
      radialGrad.addColorStop(0, 'rgba(6, 182, 212, 0.04)'); // soft cyan
      radialGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.02)'); // soft purple
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Render stars & Interactive displacement physics
      const mouse = mouseRef.current;
      for (const s of stars) {
        // Star Twinkle
        const alpha = s.a * (0.55 + 0.45 * Math.sin(t * s.s * 2 + s.p));

        // Physics: return-to-base spring force
        const dx = s.baseX - s.x;
        const dy = s.baseY - s.y;
        s.vx += dx * 0.012;
        s.vy += dy * 0.012;

        // Interactive mouse force (pushing stars slightly away like a gentle breeze)
        if (mouse.active) {
          const mdx = s.x - mouse.x;
          const mdy = s.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Push away
            s.vx += (mdx / (dist + 1)) * force * 1.5;
            s.vy += (mdy / (dist + 1)) * force * 1.5;
          }
        }

        // Apply friction and move
        s.vx *= 0.88;
        s.vy *= 0.88;
        s.x += s.vx;
        s.y += s.vy;

        // Natural astronomical drifting (upward)
        s.baseY -= 0.04;
        if (s.baseY < -10) {
          s.baseY = height + 10;
          s.y = s.baseY;
          s.baseX = Math.random() * width;
          s.x = s.baseX;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      // --- Draw Dynamic Constellation Lines ---
      // We connect stars that are close to each other, creating elegant geometric starmaps
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i += 6) { // step by 6 to keep performance smooth
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j += 15) {
          const s2 = stars[j];
          const dist = Math.sqrt((s1.x - s2.x) ** 2 + (s1.y - s2.y) ** 2);
          if (dist < 72) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // --- Shooting Stars ---
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 1;

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 6, ss.y - ss.vy * 6);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life / ss.maxLife})`);
        grad.addColorStop(0.3, 'rgba(34, 211, 238, 0.4)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 6, ss.y - ss.vy * 6);
        ctx.stroke();

        if (ss.life <= 0 || ss.x > width + 50) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="cosmic-loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#050505] text-white select-none overflow-hidden py-12"
        >
          {/* Subtle starfield background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-auto cursor-crosshair"
          />

          {/* Top aesthetic reference */}
          <div className="z-10 text-center pointer-events-none opacity-80 flex flex-col items-center gap-1.5 mt-2">
            <div className="flex items-center gap-2 px-3.5 py-1 bg-[#111318]/40 border border-white/5 rounded-full backdrop-blur-sm">
              <Sparkles size={11} className="text-cyan-400 animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-300">
                ASTRONOMICAL OBSERVATORY
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
              Gently guide cursor to drift the canopy constellations
            </p>
          </div>

          {/* Centerpiece: Elegant Rotating Solar System Loading Animation */}
          <div className="relative flex items-center justify-center w-[300px] h-[300px] pointer-events-none z-10">
            
            {/* 1. SUN (The central star, pulsating with celestial energy and cyan/gold corona glow) */}
            <motion.div
              animate={{
                scale: [0.93, 1.07, 0.93],
                boxShadow: [
                  "0 0 22px rgba(34, 211, 238, 0.45), 0 0 45px rgba(34, 211, 238, 0.2)",
                  "0 0 38px rgba(34, 211, 238, 0.75), 0 0 65px rgba(147, 51, 234, 0.45)",
                  "0 0 22px rgba(34, 211, 238, 0.45), 0 0 45px rgba(34, 211, 238, 0.2)"
                ]
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-300 via-white to-amber-100 z-20 flex items-center justify-center"
            >
              {/* Sun's magnetic axis lines */}
              <div className="absolute w-[1px] h-10 bg-cyan-400/30 animate-pulse" />
              <div className="absolute w-10 h-[1px] bg-cyan-400/30 animate-pulse" />
            </motion.div>

            {/* 2. ORBIT 1: MERCURY */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
              className="absolute w-18 h-18 border border-cyan-400/10 rounded-full flex items-center justify-center"
            >
              {/* Planet Mercury (Tiny, dark slate) */}
              <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-zinc-400 shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
            </motion.div>

            {/* 3. ORBIT 2: VENUS */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute w-26 h-26 border border-dashed border-amber-400/10 rounded-full"
            >
              {/* Planet Venus (Slightly larger, golden/cream) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
            </motion.div>

            {/* 4. ORBIT 3: EARTH + MOON */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute w-38 h-38 border border-cyan-400/15 rounded-full"
            >
              {/* Planet Earth container (to rotate Moon around it) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                {/* Earth sphere (Deep beautiful blue-green) */}
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_8px_rgba(6,182,212,0.6)] z-10" />
                
                {/* Moon Orbit */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-6 h-6 rounded-full"
                >
                  {/* Moon (Micro white dot) */}
                  <div className="absolute top-0 w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_2px_white]" />
                </motion.div>
              </div>
            </motion.div>

            {/* 5. ORBIT 4: MARS */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute w-50 h-50 border border-dashed border-red-400/10 rounded-full"
            >
              {/* Planet Mars (Rusty orange) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.4)]" />
            </motion.div>

            {/* 6. ORBIT 5: JUPITER */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              className="absolute w-66 h-66 border border-cyan-400/5 rounded-full"
            >
              {/* Planet Jupiter (Large, tan with orange banding) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-4.5 h-4.5 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300/25 shadow-[0_0_8px_rgba(253,230,138,0.3)]">
                {/* Jupiter stripes */}
                <div className="w-2.5 h-[2px] bg-orange-300/40 rounded-full absolute" />
              </div>
            </motion.div>

            {/* 7. ORBIT 6: SATURN */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-82 h-82 border border-dashed border-purple-400/5 rounded-full"
            >
              {/* Planet Saturn with prominent Rings */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[4px] w-5 h-5 flex items-center justify-center">
                {/* Saturn Body */}
                <div className="w-3.5 h-3.5 rounded-full bg-amber-50 shadow-[0_0_6px_rgba(253,230,138,0.3)] z-10" />
                {/* Saturn Ring (Faint tilted oval) */}
                <div className="absolute w-6 h-1.5 border border-amber-200/40 rounded-full rotate-[15deg] bg-amber-300/5 scale-x-110 z-0" />
              </div>
            </motion.div>

            {/* Extra: Orbit Ring subdivisions for vintage Astrolabe theme */}
            <div className="absolute w-[306px] h-[306px] border border-white/5 rounded-full" />
          </div>

          {/* Minimalist night-sky progress panel */}
          <div className="z-10 flex flex-col items-center px-6 max-w-xs w-full bg-[#0c0d10]/80 backdrop-blur-md border border-white/5 p-5 rounded-xl pointer-events-none shadow-2xl">
            
            {/* Steps tracker */}
            <div className="h-6 overflow-hidden flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stepIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.28 }}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-medium text-center block"
                >
                  {cosmicSteps[stepIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Seamless aesthetic bar */}
            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mt-4 relative">
              <motion.div
                className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Secondary metrics */}
            <div className="w-full flex justify-between items-center mt-2.5">
              <span className="font-mono text-[8px] text-zinc-500 tracking-widest uppercase">
                RESOLVING CANOPY
              </span>
              <motion.span
                key={Math.floor(progress)}
                className="font-mono text-[9px] text-zinc-400 tracking-wider font-semibold"
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
