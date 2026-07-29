import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Code2, Atom } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, testId: 'nav-home' },
  { to: '/projects', label: 'Projects', icon: Code2, testId: 'nav-projects' },
  { to: '/iiser', label: 'At IISER', icon: Atom, testId: 'nav-iiser' },
];

export default function Navbar() {
  const loc = useLocation();

  const activeIndex = navItems.findIndex((item) => {
    if (item.to === '/') return loc.pathname === '/';
    return loc.pathname.startsWith(item.to);
  });
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  // Dock SVG dimensions
  const itemWidth = 80;
  const totalWidth = navItems.length * itemWidth; // 320px
  const dockHeight = 52;
  const activeCenterX = safeActiveIndex * itemWidth + itemWidth / 2;

  // Curved notch SVG path with smooth Bezier cutout
  const notchPath = `
    M 18,0 
    L ${activeCenterX - 36},0 
    C ${activeCenterX - 22},0 ${activeCenterX - 20},22 ${activeCenterX},22 
    C ${activeCenterX + 20},22 ${activeCenterX + 22},0 ${activeCenterX + 36},0 
    L ${totalWidth - 18},0 
    Q ${totalWidth},0 ${totalWidth},18 
    L ${totalWidth},${dockHeight - 18} 
    Q ${totalWidth},${dockHeight} ${totalWidth - 18},${dockHeight} 
    L 18,${dockHeight} 
    Q 0,${dockHeight} 0,${dockHeight - 18} 
    L 0,18 
    Q 0,0 18,0 
    Z
  `;

  // Render function for the Notched Floating Navigation Dock
  const renderNotchedDock = () => (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: totalWidth, height: dockHeight }}
    >
      {/* SVG Background Container with Curved Notch Cutout */}
      <svg
        width={totalWidth}
        height={dockHeight}
        className="absolute inset-0 drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] pointer-events-none"
      >
        <path
          d={notchPath}
          fill="#080c16"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Active Floating Pop Circle Indicator sitting in the notch */}
      <motion.div
        animate={{ x: activeCenterX - 21 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className="absolute top-[-10px] left-0 w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-cyan-400 to-indigo-500 shadow-[0_0_22px_rgba(34,211,238,0.75)] flex items-center justify-center text-white border border-cyan-200/60 pointer-events-none z-20"
      >
        {React.createElement(navItems[safeActiveIndex].icon, {
          size: 19,
          strokeWidth: 2,
          className: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]',
        })}
      </motion.div>

      {/* Navigation Tab Items */}
      <div className="relative z-10 flex items-center w-full h-full">
        {navItems.map((item, idx) => {
          const isActive = idx === safeActiveIndex;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={item.testId}
              className="group relative flex flex-col items-center justify-center h-full transition-all duration-300"
              style={{ width: itemWidth }}
            >
              {/* Icon & Label for inactive state */}
              <div
                className={`transition-all duration-300 flex flex-col items-center ${
                  isActive
                    ? 'opacity-0 scale-75 translate-y-2 pointer-events-none'
                    : 'opacity-70 group-hover:opacity-100 group-hover:scale-110 text-zinc-300 group-hover:text-cyan-300'
                }`}
              >
                <Icon size={17} strokeWidth={1.6} />
                <span className="font-mono-tag text-[9px] tracking-widest uppercase mt-0.5">
                  {item.label}
                </span>
              </div>

              {/* Active Label centered under the notch */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-2 font-mono-tag text-[9px] tracking-widest uppercase text-cyan-300 font-semibold"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Top Header for Branding (Frameless - No Box, No Border) */}
      <header
        data-testid="site-header"
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 h-20 flex items-center justify-between relative z-10 pointer-events-auto">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            data-testid="brand-link"
            className="group flex items-center gap-3.5 backdrop-blur-md bg-[#04060a]/60 px-4 py-2 rounded-2xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-serif-display text-lg sm:text-xl tracking-tight font-light text-white group-hover:text-cyan-200 transition-colors">
                Notes From The Noise
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[9px] font-mono-tag tracking-wider uppercase text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                IISER Pune
              </span>
            </div>
          </Link>

          {/* Desktop Curved Notched Floating Dock (Top Right) */}
          <div className="hidden md:block">
            {renderNotchedDock()}
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Fixed Bottom Notched Dock */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-auto">
        {renderNotchedDock()}
      </div>
    </>
  );
}


