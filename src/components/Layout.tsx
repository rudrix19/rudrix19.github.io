import React, { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarField from './StarField';
import AfterEffectsOverlay from './AfterEffectsOverlay';

export default function Layout() {
  const loc = useLocation();
  const currentOutlet = useOutlet();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' as any // Force instant scroll
    });
  }, [loc.pathname]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden pb-12"
      data-testid="app-layout"
    >
      {/* Dynamic Star Overlay Canvas */}
      <StarField />

      {/* After Effects Visual FX Layer (Spotlight, Light Leaks, Anamorphic Lens Flare, Click Shockwaves) */}
      <AfterEffectsOverlay />

      {/* Main Top Navigation Headless Bar */}
      <Navbar />

      {/* Primary Page Layout Sections with Cinematic Blur-Fade Transitions */}
      <main className="relative pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={loc.pathname}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Main Footer Block */}
      <Footer />
    </div>
  );
}

