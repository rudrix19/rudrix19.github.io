import React, { useEffect, useRef } from 'react';

/**
 * Multi-layer canvas star field with smooth scroll & mouse cursor parallax.
 * Deep background stars move slowly, while foreground stars move faster, creating true 3D depth.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    interface Star {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      zDepth: number; // 0.1 (deep) to 1.5 (near)
      r: number;
      a: number;
      s: number;
      p: number;
      vy: number;
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

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let w = 0;
    let h = 0;

    // Mouse & Scroll Parallax State
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      const count = Math.floor((window.innerWidth * window.innerHeight) / 5500);
      stars = Array.from({ length: count }, () => {
        const zDepth = Math.random() * 1.3 + 0.2; // depth multiplier
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          zDepth,
          r: (Math.random() * 1.1 + 0.2) * zDepth * dpr,
          a: Math.min(1, (Math.random() * 0.6 + 0.3) * (zDepth * 0.8 + 0.2)),
          s: Math.random() * 0.5 + 0.1, // twinkle speed
          p: Math.random() * Math.PI * 2,
          vy: (Math.random() * 0.015 + 0.005) * zDepth * dpr,
          color: Math.random() > 0.88 ? '#e4e4e7' : Math.random() > 0.95 ? '#38bdf8' : '#a1a1aa'
        };
      });
    };

    const spawnShooting = () => {
      if (Math.random() < 0.003 && shootingStars.length < 2) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.3,
          vx: (4.5 + Math.random() * 3) * dpr,
          vy: (1.8 + Math.random() * 1.2) * dpr,
          life: 55,
          maxLife: 55
        });
      }
    };

    let t = 0;
    const tick = () => {
      t += 0.016;

      // Smooth interpolation for inertia (spring-like feel)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.08;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Render stars with depth parallax
      for (const s of stars) {
        // Natural upward drift
        s.baseY -= s.vy;
        if (s.baseY < -10) s.baseY = h + 10;

        // Apply mouse & scroll parallax based on zDepth
        const parallaxX = mouseX * s.zDepth * 12;
        const parallaxY = mouseY * s.zDepth * 12 - (scrollY * s.zDepth * 0.18);

        let renderX = (s.baseX + parallaxX) % w;
        if (renderX < 0) renderX += w;

        let renderY = (s.baseY + parallaxY) % h;
        if (renderY < 0) renderY += h;

        const alpha = s.a * (0.65 + 0.35 * Math.sin(t * s.s * 2.5 + s.p));
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(renderX, renderY, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting stars
      spawnShooting();
      shootingStars = shootingStars.filter((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 1;

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life / ss.maxLife})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.stroke();

        return ss.life > 0 && ss.x < w + 50;
      });

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="star-field-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
