import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

const socials = [
  {
    Icon: Github,
    href: 'https://github.com/rudrix19',
    label: 'GitHub',
    testId: 'social-github'
  },
  {
    Icon: Linkedin,
    href: 'https://www.linkedin.com/in/rudrix-19-iiserp/',
    label: 'LinkedIn',
    testId: 'social-linkedin'
  },
  {
    Icon: Instagram,
    href: 'https://www.instagram.com/cosmic_cognoscente/',
    label: 'Instagram',
    testId: 'social-instagram'
  },
  {
    Icon: Mail,
    href: 'mailto:rudra.sahu@students.iiserpune.ac.in',
    label: 'Email',
    testId: 'social-email'
  }
];

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative z-10 border-t border-white/10 mt-24 overflow-hidden bg-[#04060b]/60 backdrop-blur-md"
    >
      {/* Top Anamorphic Lens Flare Beam */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 via-purple-400/40 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)] pointer-events-none" />

      {/* Subtle Background Light Leak Glows */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        <div className="md:col-span-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono-tag text-[9px] tracking-[0.25em] uppercase mb-2 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            Currently in superposition
          </div>
          <h3 className="font-serif-display text-3xl sm:text-4xl mt-3 text-white font-light italic">
            Still learning, still exploring.
          </h3>
          <p className="text-zinc-400 mt-4 text-sm sm:text-base max-w-md leading-relaxed font-light">
            A quiet corner of the internet for thoughts, projects and small wonderings between coursework and the cosmos.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90 font-medium mb-4">
            Elsewhere
          </p>
          <div className="flex flex-col gap-3">
            {socials.map(({ Icon, href, label, testId }) => (
              <a
                key={label}
                href={href}
                data-testid={testId}
                className="group inline-flex items-center gap-3 text-zinc-400 hover:text-cyan-300 transition-all duration-300 transform hover:translate-x-1"
              >
                <div className="p-1 rounded-md bg-white/5 border border-white/10 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-all">
                  <Icon size={14} strokeWidth={1.5} className="group-hover:text-cyan-300 transition-colors" />
                </div>
                <span className="text-sm font-light">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90 font-medium mb-4">
            Coordinates
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed font-light">
            IISER Pune
            <br />
            Dr. Homi Bhabha Road
            <br />
            Pashan, Pune 411008
          </p>
          <p className="font-mono-tag text-[10px] tracking-[0.2em] uppercase text-zinc-500 mt-6 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            18.5471° N · 73.8056° E
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono-tag text-[10px] tracking-[0.2em] uppercase text-zinc-500">
            © {new Date().getFullYear()} Rudra Sahu · Built with curiosity
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400/80 animate-ping" />
            <p className="font-mono-tag text-[10px] tracking-[0.2em] uppercase text-cyan-400/80">
              v1.0 — Notes_from_the_Noise.exe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
