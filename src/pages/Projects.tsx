import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Github, FileText, ArrowUpRight, Plus, Trash2, Tag, Calendar, Image, X, Maximize2, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import ImageUpload from '../components/ImageUpload';
import Parallax, { MouseParallax } from '../components/Parallax';

export default function Projects() {
  const { data, setData, isEditing } = usePortfolio();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [newTagVal, setNewTagVal] = useState<{ [projId: string]: string }>({});

  // Keyboard shortcut to close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateProjectProp = (index: number, key: keyof Project, val: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [key]: val };
    setData(prev => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    const nextId = String(data.projects.length + 1).padStart(2, '0');
    const newProj: Project = {
      id: nextId,
      title: "New Research Topic or Theory",
      subtitle: "Coursework / Laboratory Paper",
      summary: "An abstract detailing your exploration, archival research run, simulation framework details, and physical models verified during academic investigations.",
      tags: ["Astrophysics", "Theory", "MATLAB"],
      year: "2026",
      img: "https://images.unsplash.com/photo-1771419544432-a9a0bae77588?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMHRlbGVzY29wZSUyMG9ic2VydmF0b3J5JTIwbmlnaHR8ZW58MHx8fHwxNzgxODg2Nzg5fDA&ixlib=rb-4.1.0&q=85"
    };

    const newIndex = data.projects.length;
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
    setSelectedProjectIndex(newIndex);
  };

  const deleteProject = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const filtered = data.projects.filter((_, idx) => idx !== index);
      const reindexed = filtered.map((p, i) => ({
        ...p,
        id: String(i + 1).padStart(2, '0')
      }));
      setData(prev => ({ ...prev, projects: reindexed }));
      setSelectedProjectIndex(null);
    }
  };

  const removeProjectTag = (projectIndex: number, tagIndex: number) => {
    const updatedProj = { ...data.projects[projectIndex] };
    updatedProj.tags = updatedProj.tags.filter((_, idx) => idx !== tagIndex);
    
    const updatedList = [...data.projects];
    updatedList[projectIndex] = updatedProj;
    setData(prev => ({ ...prev, projects: updatedList }));
  };

  const addProjectTag = (projectIndex: number, tagVal: string) => {
    if (!tagVal.trim()) return;
    const updatedProj = { ...data.projects[projectIndex] };
    if (!updatedProj.tags.includes(tagVal.trim())) {
      updatedProj.tags = [...updatedProj.tags, tagVal.trim()];
    }
    
    const updatedList = [...data.projects];
    updatedList[projectIndex] = updatedProj;
    setData(prev => ({ ...prev, projects: updatedList }));
    
    setNewTagVal(prev => ({ ...prev, [updatedProj.id]: '' }));
  };

  const selectedProject = selectedProjectIndex !== null ? data.projects[selectedProjectIndex] : null;

  return (
    <div data-testid="projects-page" className="min-h-screen pb-24">
      {/* Header section */}
      <section className="relative pt-20 pb-12">
        <Parallax speed={0.1} offset={30} className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90"
              >
                ✦ Section · Projects
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight font-light text-slate-100 mt-6"
              >
                Projects
                <br />
                <span className="italic text-slate-400">I’ve enjoyed</span>
                <span className="text-cyan-400">.</span>
              </motion.h1>
            </div>

            {isEditing && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                onClick={addProject}
                className="font-mono-tag text-[10px] tracking-widest text-[#050505] bg-white hover:bg-zinc-200 px-4 py-2 uppercase flex items-center gap-2 transition h-fit self-start sm:self-end rounded-lg shadow-md"
              >
                <Plus size={12} />
                Add New Project
              </motion.button>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-slate-400 mt-8 max-w-2xl text-lg leading-relaxed font-serif-display italic"
          >
            A small, honest archive of things I’ve worked on, often slowly, sometimes with friends, mostly out of curiosity.
          </motion.p>
        </Parallax>
      </section>

      {/* Main Grid View Section (Normally placed project cards) */}
      <section className="relative py-8 max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.projects.map((p, i) => (
            <MouseParallax key={p.id} intensity={8}>
              <motion.article
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedProjectIndex(i)}
                data-testid={`project-card-${p.id}`}
                className="bg-slate-900/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)] transition-all duration-500 cursor-pointer group relative overflow-hidden h-full"
              >
              {/* Left cyan accent bar on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[3px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300 z-10" />

              <div>
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 mb-5 group/img">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] grayscale-[20%] group-hover:grayscale-0 brightness-[80%] group-hover:brightness-[100%] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[9px] font-mono-tag text-zinc-300 font-semibold tracking-wider">
                    {p.year}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/15 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono-tag text-cyan-400 font-bold shadow-md">
                    {p.id}
                  </div>

                  {/* Expand Icon Overlay hint */}
                  <div className="absolute inset-0 bg-cyan-950/30 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-black/80 text-cyan-300 border border-cyan-400/40 font-mono-tag text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 size={12} /> Click to Open
                    </span>
                  </div>
                </div>

                {/* Subtitle & Title */}
                <span className="font-mono-tag text-[10px] tracking-[0.2em] uppercase text-cyan-400/90 font-medium block mb-1.5">
                  {p.subtitle}
                </span>
                <h3 className="font-serif-display text-2xl text-slate-100 font-light tracking-tight group-hover:text-cyan-300 transition-colors duration-300 leading-snug">
                  {p.title}
                </h3>

                {/* Short summary snippet */}
                <p className="text-slate-300 text-base mt-3 leading-relaxed font-light line-clamp-3 group-hover:text-white transition-colors duration-300">
                  {p.summary}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="font-mono-tag text-[10px] tracking-wider uppercase text-slate-200 bg-white/5 border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-200 transition-all duration-300 px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono-tag tracking-widest uppercase text-zinc-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  View Full Window <ArrowUpRight size={13} />
                </span>

                <div className="flex items-center gap-2">
                  {p.githubUrl && <Github size={14} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />}
                  {p.paperUrl && <FileText size={14} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />}
                  {p.viewUrl && <ExternalLink size={14} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />}
                </div>
              </div>
            </motion.article>
          </MouseParallax>
          ))}
        </div>
      </section>

      {/* Mini Window Modal (Details & Editing popup - Nearly Full Screen via Portal) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && selectedProjectIndex !== null && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
              {/* Opaque Solid Dark Backdrop Overlay to completely mask underlying page/footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProjectIndex(null)}
                className="absolute inset-0 bg-[#020408]/98 backdrop-blur-2xl"
              />

              {/* Mini Window Card with Opaque Dark Background & Spring Window Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 25, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.92, y: 15, filter: "blur(8px)" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="relative bg-[#060912] border border-white/15 hover:border-cyan-500/30 rounded-3xl p-6 sm:p-8 md:p-10 w-[96vw] max-w-7xl h-[92vh] max-h-[92vh] flex flex-col shadow-[0_0_30px_rgba(34,211,238,0.08),0_25px_70px_rgba(0,0,0,0.95)] z-10 text-slate-200 overflow-hidden transition-colors duration-300"
              >
                {/* Top Soft Accent Line for Window */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-purple-400/40 to-transparent shadow-[0_0_6px_rgba(34,211,238,0.3)] pointer-events-none" />

                {/* Subtle Soft Ambient Spotlight inside Window */}
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/4 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/4 blur-3xl pointer-events-none" />

                {/* OS Window Style Top Bar / Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 flex-shrink-0 relative z-10">
                  <div className="flex items-center gap-3">
                    {/* Window Control Dots */}
                    <div className="flex items-center gap-2 mr-2">
                      <button
                        onClick={() => setSelectedProjectIndex(null)}
                        className="w-3.5 h-3.5 rounded-full bg-rose-500/90 hover:bg-rose-500 transition-colors shadow-sm flex items-center justify-center group"
                        title="Close Window"
                      >
                        <X size={9} className="opacity-0 group-hover:opacity-100 text-black transition-opacity font-bold" />
                      </button>
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/70" />
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/70" />
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono-tag text-[10px] tracking-[0.2em] uppercase text-cyan-300 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-3 py-0.5 rounded-full">
                        ✦ System Window :: Project_{selectedProject.id}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="font-mono-tag text-[10px] tracking-wider text-zinc-300">
                        Class of {selectedProject.year}
                      </span>
                    </div>
                  </div>

                  {/* Close & Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing && (
                      <button
                        onClick={() => deleteProject(selectedProjectIndex)}
                        className="text-rose-400 hover:text-rose-300 bg-rose-950/80 border border-rose-500/30 px-3 py-1.5 rounded-xl font-mono-tag text-[10px] uppercase flex items-center gap-1 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedProjectIndex(null)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Title & Subtitle Banner */}
                <div className="mb-6 flex-shrink-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={selectedProject.title}
                        onChange={(e) => updateProjectProp(selectedProjectIndex, 'title', e.target.value)}
                        className="font-serif-display text-2xl sm:text-3xl text-white bg-zinc-900 border border-dashed border-white/30 p-2 w-full rounded focus:outline-none"
                      />
                      <input
                        type="text"
                        value={selectedProject.subtitle}
                        onChange={(e) => updateProjectProp(selectedProjectIndex, 'subtitle', e.target.value)}
                        className="font-mono-tag text-xs text-cyan-400 bg-zinc-900 border border-dashed border-white/30 p-1.5 w-full rounded focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-slate-100 font-light tracking-tight">
                        {selectedProject.title}
                      </h2>
                      <p className="font-mono-tag text-xs sm:text-sm tracking-wider uppercase text-cyan-300 mt-1.5">
                        {selectedProject.subtitle}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Body - Scrollable content with wide two-column grid on desktop */}
                <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
                  {/* Left Column: Image Illustration & Resources */}
                  <div className="lg:col-span-6 flex flex-col space-y-6">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 shadow-xl flex-shrink-0">
                      <img
                        src={selectedProject.img}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {isEditing && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm p-4 overflow-y-auto flex flex-col justify-center space-y-2">
                          <span className="text-[10px] font-mono-tag text-cyan-400 uppercase font-semibold">Change Illustration</span>
                          <ImageUpload
                            value={selectedProject.img}
                            onChange={(val) => updateProjectProp(selectedProjectIndex, 'img', val)}
                            placeholder="Upload project image"
                          />
                          <input
                            type="text"
                            value={selectedProject.img.startsWith('data:') ? '' : selectedProject.img}
                            onChange={(e) => updateProjectProp(selectedProjectIndex, 'img', e.target.value)}
                            placeholder="Or paste direct image URL..."
                            className="bg-zinc-900 text-xs text-white border border-white/20 p-2 rounded focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* External Links / Resources */}
                    <div className="pt-2">
                      <span className="block font-mono-tag text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-3 font-medium">
                        Resources & Links
                      </span>

                      <div className="flex flex-wrap items-center gap-3">
                        {selectedProject.githubUrl ? (
                          <a
                            href={selectedProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-all duration-300 shadow-md hover:border-cyan-400"
                          >
                            <Github size={15} /> Source Code <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span className="bg-zinc-900/40 text-zinc-600 border border-white/5 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-not-allowed">
                            <Github size={15} /> Code Unavailable
                          </span>
                        )}

                        {selectedProject.paperUrl ? (
                          <a
                            href={selectedProject.paperUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-all duration-300 shadow-md hover:border-cyan-400"
                          >
                            <FileText size={15} /> Paper / Notes <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span className="bg-zinc-900/40 text-zinc-600 border border-white/5 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-not-allowed">
                            <FileText size={15} /> Notes Unavailable
                          </span>
                        )}

                        {selectedProject.viewUrl ? (
                          <a
                            href={selectedProject.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-cyan-500 text-black font-semibold hover:bg-cyan-400 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-all duration-300 shadow-lg"
                          >
                            <ExternalLink size={15} /> Live Demo <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          <span className="bg-zinc-900/40 text-zinc-600 border border-white/5 px-4 py-2.5 rounded-xl font-mono-tag text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-not-allowed">
                            <ExternalLink size={15} /> Demo Unavailable
                          </span>
                        )}
                      </div>

                      {isEditing && (
                        <div className="mt-4 p-4 bg-zinc-900/80 border border-white/10 rounded-2xl space-y-2 text-xs">
                          <span className="font-mono-tag text-cyan-400 uppercase font-semibold block">Edit Resource Links</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="text-[9px] font-mono-tag text-zinc-400 uppercase block mb-1">GitHub URL</label>
                              <input
                                type="text"
                                value={selectedProject.githubUrl || ''}
                                onChange={(e) => updateProjectProp(selectedProjectIndex, 'githubUrl', e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full bg-zinc-950 border border-white/20 p-2 rounded text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono-tag text-zinc-400 uppercase block mb-1">Paper URL</label>
                              <input
                                type="text"
                                value={selectedProject.paperUrl || ''}
                                onChange={(e) => updateProjectProp(selectedProjectIndex, 'paperUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-zinc-950 border border-white/20 p-2 rounded text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono-tag text-zinc-400 uppercase block mb-1">Demo URL</label>
                              <input
                                type="text"
                                value={selectedProject.viewUrl || ''}
                                onChange={(e) => updateProjectProp(selectedProjectIndex, 'viewUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-zinc-950 border border-white/20 p-2 rounded text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Abstract & Topic Tags */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                    {/* Summary / Abstract */}
                    <div className="bg-[#0f1422] border border-white/15 rounded-2xl p-6 sm:p-8">
                      <span className="block font-mono-tag text-[10px] tracking-[0.2em] uppercase text-cyan-400 mb-3 font-semibold">
                        Abstract & Details
                      </span>
                      {isEditing ? (
                        <textarea
                          value={selectedProject.summary}
                          onChange={(e) => updateProjectProp(selectedProjectIndex, 'summary', e.target.value)}
                          rows={8}
                          className="w-full bg-zinc-900 border border-dashed border-white/30 text-slate-200 text-sm leading-relaxed p-3 rounded-xl focus:outline-none"
                        />
                      ) : (
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans font-light whitespace-pre-line">
                          {selectedProject.summary}
                        </p>
                      )}
                    </div>

                    {/* Tags Section */}
                    <div className="bg-[#0f1422] border border-white/15 rounded-2xl p-6">
                      <span className="block font-mono-tag text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-3 font-medium">
                        Technologies & Topics
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((t, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="font-mono-tag text-[11px] tracking-wider uppercase text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5"
                          >
                            {t}
                            {isEditing && (
                              <button
                                onClick={() => removeProjectTag(selectedProjectIndex, tagIdx)}
                                className="text-rose-400 hover:text-white transition font-bold"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}

                        {isEditing && (
                          <div className="inline-flex gap-1.5">
                            <input
                              type="text"
                              placeholder="Add tag"
                              value={newTagVal[selectedProject.id] || ''}
                              onChange={(e) => setNewTagVal(prev => ({ ...prev, [selectedProject.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && addProjectTag(selectedProjectIndex, newTagVal[selectedProject.id] || '')}
                              className="font-mono-tag text-xs uppercase bg-zinc-900 border border-white/20 px-2 py-1 text-white rounded focus:outline-none w-20"
                            />
                            <button
                              onClick={() => addProjectTag(selectedProjectIndex, newTagVal[selectedProject.id] || '')}
                              className="bg-white text-black px-2 py-1 rounded font-mono-tag text-xs hover:bg-zinc-200 transition"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
