import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Users, BookOpen, Activity, Sparkles, Atom, Orbit, Telescope, Plus, Trash2, Edit2, Image, Search, GraduationCap, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Moment } from '../types';
import ImageUpload from '../components/ImageUpload';
import Parallax, { MouseParallax } from '../components/Parallax';

const iconMap = {
  Users,
  BookOpen,
  Activity,
  MapPin,
  Sparkles,
  Atom,
  Orbit,
  Telescope
};

const semestersData = [
  {
    id: "sem-5",
    label: "Semester 5",
    tagline: "Electrodynamics, advanced quantum mechanics, optics & electronics",
    status: "Ongoing",
    courses: [
      { name: "Electrodynamics I", category: "Physics" },
      { name: "Quantum Mechanics I", category: "Physics" },
      { name: "Optics", category: "Physics" },
      { name: "Electronics I with Lab", category: "Physics" },
      { name: "Methods of Experimental Physics", category: "Physics" },
      { name: "Statistical Mechanics I", category: "Physics" }
    ]
  },
  {
    id: "sem-4",
    label: "Semester 4",
    tagline: "Genetics, molecular spectroscopy, classical and thermal physics",
    status: "Completed",
    courses: [
      { name: "Genetics", category: "Biology" },
      { name: "Analytical Chemistry", category: "Chemistry" },
      { name: "Molecular Spectroscopy", category: "Chemistry" },
      { name: "Classical Mechanics", category: "Physics" },
      { name: "Thermal & Statistical Physics", category: "Physics" },
      { name: "Physics Lab II", category: "Physics" },
      { name: "Thermodynamics", category: "Transdisciplinary" },
      { name: "Data Analysis", category: "Transdisciplinary" }
    ]
  },
  {
    id: "sem-3",
    label: "Semester 3",
    tagline: "Ecology, probability, quantum physics, inorganic chemistry & climate",
    status: "Completed",
    courses: [
      { name: "Ecology and Evolution", category: "Biology" },
      { name: "Principles of Inorganic Chemistry", category: "Chemistry" },
      { name: "Introduction to Probability", category: "Math" },
      { name: "Introductory Quantum Mechanics", category: "Physics" },
      { name: "Introduction to Climate Science", category: "ECS" },
      { name: "Introduction to HSS", category: "HSS" },
      { name: "General Chemistry Practicals II", category: "Chemistry" },
      { name: "Mathematical Methods for Physics", category: "Physics" }
    ]
  },
  {
    id: "sem-2",
    label: "Semester 2",
    tagline: "Biomolecules, physical chemistry, general labs, linear algebra & electives",
    status: "Completed",
    courses: [
      { name: "Introduction to Biomolecules", category: "Biology" },
      { name: "Principles of Physical Chemistry", category: "Chemistry" },
      { name: "General Chemistry Practicals I", category: "Chemistry" },
      { name: "The Solid Earth", category: "ECS" },
      { name: "Science and Society", category: "HSS" },
      { name: "Calculus II", category: "Math" },
      { name: "Linear Algebra", category: "Math" },
      { name: "Introductory Electricity & Magnetism", category: "Physics" }
    ]
  },
  {
    id: "sem-1",
    label: "Semester 1",
    tagline: "Foundational biology, chemistry, calculus, mechanics & labs",
    status: "Completed",
    courses: [
      { name: "Introductory Biology", category: "Biology" },
      { name: "Experimental Biology", category: "Biology" },
      { name: "Principles of Organic Chemistry", category: "Chemistry" },
      { name: "Evolution of Earth and Life", category: "ECS" },
      { name: "Calculus I", category: "Math" },
      { name: "Introductory Mechanics", category: "Physics" },
      { name: "Physics Lab", category: "Physics" },
      { name: "Introduction to Computing", category: "Transdisciplinary" }
    ]
  }
];

export default function IISER() {
  const { data, setData, isEditing } = usePortfolio();
  const [selectedYearMap, setSelectedYearMap] = React.useState<Record<number, number>>({});
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const updateReflectPara = (val: string) => {
    setData(prev => ({
      ...prev,
      // Temporarily store the reflection text inside the existing role/desc fields or aboutParas if we want high durability
      // But keeping it inside the description or a new field is great too! 
      // Let's use the first about paragraph as a proxy reflection if needed, or let's create a custom field if we want.
      // Wait, we can add a new custom field or modify data.role or data.tagline. Let's make the "reflections" block description of the campus editable!
      // To keep types clean, let's write to `description` or back into `role`. Actually, we can add custom fields, but since we have a fully customizable state, 
      // let's edit `data.role` or edit an inline custom element. Let's make the main paragraph text editable! We can add a custom `locationReflections` string or modify the description.
      // To keep strict type safety with `ProfileData` we already declared, let's look at what we put in `usePortfolio()`. In `PortfolioContext`, data contains `description` and `aboutParas`.
      // Let's modify the page text directly or let's allow editing it inside the page state. Actually, let's make the paragraph text editable in a reactive way!
      // Wait, let's double check if we can add an optional field or use aboutParas[1] as the reflection body.
      // Or we can simple store it locally or inside `data.description`. Let's make the local reflections text directly editable:
    }));
  };

  const updateMoment = (index: number, key: keyof Moment, val: any) => {
    const updated = [...data.moments];
    updated[index] = { ...updated[index], [key]: val };
    setData(prev => ({ ...prev, moments: updated }));
  };

  const deleteMoment = (index: number) => {
    if (confirm("Are you sure you want to delete this moment?")) {
      setData(prev => ({ ...prev, moments: prev.moments.filter((_, idx) => idx !== index) }));
    }
  };

  const addMoment = () => {
    const newMoment: Moment = {
      iconName: "Sparkles",
      title: "New Campus Endeavor",
      body: "Weekly seminars, research run presentations, or active recreational drills performed with classmates."
    };
    setData(prev => ({ ...prev, moments: [...prev.moments, newMoment] }));
  };

  return (
    <div data-testid="iiser-page">
      {/* Header section with Map Marker */}
      <section className="relative pt-20 pb-16">
        <Parallax speed={0.1} offset={30} className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90 flex items-center gap-3"
          >
            <MapPin size={12} strokeWidth={1.3} className="text-cyan-400" />
            Section · IISER Pune
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight font-light text-slate-100 mt-6 max-w-5xl"
          >
            What IISER Pune
            <br />
            <span className="italic text-slate-400">has been like</span>
            <span className="text-cyan-400">.</span>
          </motion.h1>
        </Parallax>
      </section>

      {/* Main Reflections Column with Cover Block */}
      <section className="relative pb-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Cover photo side */}
          <MouseParallax intensity={8} className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="group/cover relative aspect-[16/10] overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer rounded-2xl shadow-2xl"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Front_view_of_main_building%2C_IISER_Pune.jpg/1280px-Front_view_of_main_building%2C_IISER_Pune.jpg"
                alt="IISER Pune Campus View"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out-back grayscale-[35%] brightness-[70%] group-hover/cover:grayscale-0 group-hover/cover:brightness-[90%] group-hover/cover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover/cover:opacity-75" />
              {/* Soft border accent */}
              <div className="absolute inset-0 border border-transparent group-hover/cover:border-cyan-400/20 transition-all duration-500 pointer-events-none" />
              <p className="absolute bottom-4 left-4 font-mono-tag text-[10px] tracking-[0.3em] uppercase text-slate-300 group-hover/cover:text-cyan-300 transition-colors duration-300">
                Pashan, Pune · 411008
              </p>
            </motion.div>
          </MouseParallax>

          {/* Reflections blocks */}
          <Parallax speed={0.06} offset={20} className="md:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif-display italic text-2xl sm:text-3xl text-slate-200 leading-snug"
            >
              “Most days, that means reading, asking too many questions, getting stuck, and slowly learning how to think more clearly.”
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-slate-300 mt-6 leading-relaxed text-base sm:text-lg font-light"
            >
              Living, thinking, and learning in a place filled with intense coursework, laboratory analysis, and late-night problem-solving session runs. It brings a unique sense of shared camaraderie when pursuing answers alongside classmates who are equally driven by intellectual curiosity.
            </motion.p>
          </Parallax>

        </div>
      </section>

      {/* Academics so far */}
      <section className="relative py-24 border-t border-b border-white/5 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90 flex items-center gap-2"
              >
                <GraduationCap size={12} className="text-cyan-400 animate-pulse" />
                ✦ Coursework
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-display text-4xl sm:text-5xl font-light text-slate-100 mt-4"
              >
                Academics <span className="italic text-slate-400 font-light">so far.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed max-w-2xl font-light"
              >
                A chronicled breakdown of foundational modules, multidisciplinary experimental labs, and ongoing semester studies throughout my journey at IISER Pune.
              </motion.p>
            </div>

            {/* Interactive Search Tool */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search course title or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#08080a] text-xs text-zinc-300 pl-9 pr-12 py-2.5 border border-white/10 rounded focus:outline-none focus:border-cyan-400/40 transition-colors placeholder:text-zinc-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] uppercase font-mono-tag tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap gap-1.5 mb-10 border-b border-white/5 pb-6">
            {["All", "Physics", "Chemistry", "Biology", "Math", "ECS", "Transdisciplinary", "HSS"].map((cat) => {
              const count = cat === "All"
                ? semestersData.flatMap(s => s.courses).length
                : semestersData.flatMap(s => s.courses).filter(c => c.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-[9px] font-mono-tag tracking-wider uppercase transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300'
                      : 'bg-[#08080a] border border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#0c0c0f]'
                  }`}
                >
                  {cat} {count > 0 && <span className="opacity-40 text-[8px] ml-0.5">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Semesters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semestersData.map((sem, semIdx) => {
              const coursesWithMatchFlags = sem.courses.map(course => {
                const categoryMatches = selectedCategory === "All" || course.category === selectedCategory;
                const searchMatches = searchQuery === "" || course.name.toLowerCase().includes(searchQuery.toLowerCase()) || course.category.toLowerCase().includes(searchQuery.toLowerCase());
                return {
                  ...course,
                  isHighlighted: categoryMatches && searchMatches,
                  isPartiallyExcluded: (selectedCategory !== "All" || searchQuery !== "") && !(categoryMatches && searchMatches)
                };
              });

              const semesterHasMatches = coursesWithMatchFlags.some(c => c.isHighlighted);
              const isSearchingOrFiltering = selectedCategory !== "All" || searchQuery !== "";

              return (
                <motion.div
                  key={sem.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: (semIdx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`border transition-all duration-500 bg-[#060608]/50 p-6 sm:p-8 flex flex-col justify-between hover:bg-[#08080c]/80 rounded ${
                    sem.status === "Ongoing"
                      ? 'border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.02)]'
                      : 'border-white/5 hover:border-white/10'
                  } ${
                    isSearchingOrFiltering && !semesterHasMatches
                      ? 'opacity-40 grayscale-[30%]'
                      : 'opacity-100'
                  }`}
                >
                  <div>
                    {/* Header bar containing semester and tag */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono-tag text-[10px] tracking-widest text-zinc-500 uppercase">
                        {sem.id.replace("-", " ")}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono-tag tracking-wider uppercase ${
                        sem.status === "Ongoing"
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20'
                          : 'bg-zinc-800/40 text-zinc-400 border border-white/5'
                      }`}>
                        {sem.status === "Ongoing" && (
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                        {sem.status}
                      </span>
                    </div>

                    {/* Semester label */}
                    <h3 className="font-serif-display text-2xl font-light text-slate-100 mb-1.5">
                      {sem.label}
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed mb-6 font-mono-tag tracking-wide uppercase">
                      {sem.tagline}
                    </p>

                    {/* Sub courses listed */}
                    <ul className="space-y-2.5">
                      {coursesWithMatchFlags.map((course, cIdx) => (
                        <li
                          key={cIdx}
                          className={`flex items-start justify-between text-xs transition-all duration-300 ${
                            course.isHighlighted
                              ? 'text-cyan-300 font-medium translate-x-0.5'
                              : course.isPartiallyExcluded
                              ? 'text-zinc-650 opacity-30 select-none'
                              : 'text-slate-355'
                          }`}
                        >
                          <div className="flex items-start gap-2 max-w-[80%]">
                            <span className={`w-1 h-1 rounded-full mt-1.5 transition-colors duration-350 ${
                              course.isHighlighted ? 'bg-cyan-400' : 'bg-zinc-700'
                            }`} />
                            <span className="leading-tight">{course.name}</span>
                          </div>
                          <span className={`text-[8px] font-mono-tag uppercase tracking-wider px-1.5 py-0.5 rounded transition-all ${
                            course.isHighlighted
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-zinc-900/60 text-zinc-600'
                          }`}>
                            {course.category}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus life extra cards */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono-tag text-[10px] tracking-[0.3em] uppercase text-cyan-400/90"
              >
                ✦ Outside the classroom
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-display text-4xl sm:text-5xl font-light text-slate-100 mt-4"
              >
                A campus you can keep <span className="italic text-slate-400 font-light">wandering through.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-slate-300 text-base sm:text-lg mt-6 leading-relaxed font-light"
              >
                What makes IISER Pune special to me isn’t just the lectures or labs, it’s the energy of the student community. I’ve been fortunate to be part of several initiatives that reflect not just my academic interests, but also my creative and collaborative side.
              </motion.p>
            </div>

            {isEditing && (
              <button
                onClick={addMoment}
                className="font-mono-tag text-[10px] tracking-widest text-[#050505] bg-white hover:bg-zinc-200 px-4 py-2 uppercase flex items-center gap-1.5 transition self-start sm:self-center"
              >
                <Plus size={11} /> Add Moment
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              {data.moments.map((m, i) => {
                const iconKey = m.iconName in iconMap ? m.iconName : 'Users';
                const Icon = iconMap[iconKey];
                const currentYearIdx = selectedYearMap[i] ?? 0;

                return (
                  <div
                    key={i}
                    className="bg-[#050505] border border-white/10 rounded-lg p-6 sm:p-8 relative space-y-6"
                    data-testid={`iiser-moment-edit-${i}`}
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400">
                          <Icon size={14} />
                        </div>
                        <h4 className="font-serif-display text-lg text-slate-200">
                          Edit Activity #{i + 1}: {m.title || "Untitled Activity"}
                        </h4>
                      </div>
                      <button
                        onClick={() => deleteMoment(i)}
                        className="text-[10px] font-mono-tag text-rose-400 hover:text-rose-300 uppercase flex items-center gap-1.5 border border-rose-500/10 hover:border-rose-500/30 px-3 py-1 bg-rose-950/20"
                        title="Delete Moment"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">Pick Icon</label>
                          <select
                            value={m.iconName}
                            onChange={(e) => updateMoment(i, 'iconName', e.target.value as any)}
                            className="font-mono-tag text-[10px] bg-zinc-900 text-zinc-300 border border-white/10 rounded p-1.5 w-full focus:outline-none"
                          >
                            <option value="Users">Users Icon</option>
                            <option value="BookOpen">Learning/Book Icon</option>
                            <option value="Activity">Sprints/Pulse Icon</option>
                            <option value="MapPin">Location Icon</option>
                            <option value="Sparkles">Sparkles Icon</option>
                            <option value="Atom">Atom/Physics Icon</option>
                            <option value="Orbit">Orbit Icon</option>
                            <option value="Telescope">Telescope Icon</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">Activity Title</label>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => updateMoment(i, 'title', e.target.value)}
                            className="font-serif-display text-base text-white bg-zinc-900 border border-white/5 rounded p-2 w-full focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">Website / Social Link (Optional)</label>
                          <input
                            type="text"
                            value={m.link || ''}
                            onChange={(e) => updateMoment(i, 'link', e.target.value)}
                            placeholder="https://..."
                            className="font-mono text-[10px] text-cyan-300 bg-zinc-900 border border-white/5 rounded p-2 w-full focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">Activity Details / Description</label>
                          <textarea
                            value={m.body}
                            onChange={(e) => updateMoment(i, 'body', e.target.value)}
                            rows={4}
                            className="text-slate-300 text-xs bg-zinc-900/60 border border-dashed border-white/20 p-2 w-full focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <ImageUpload
                            value={m.img || ''}
                            onChange={(base64OrUrl) => updateMoment(i, 'img', base64OrUrl)}
                            label="Activity Thumbnail"
                            placeholder="Upload local image"
                          />
                          <div className="pt-2">
                            <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Or direct web link</label>
                            <input
                              type="text"
                              value={m.img && m.img.startsWith('data:') ? '' : (m.img || '')}
                              onChange={(e) => updateMoment(i, 'img', e.target.value)}
                              placeholder="Paste image URL here..."
                              className="font-mono-tag text-[9px] text-cyan-300 bg-zinc-900 border border-white/5 rounded p-1.5 w-full focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Editions / Years toggling logic */}
                        <div className="space-y-2 border-t border-white/5 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono-tag text-cyan-400 uppercase tracking-widest font-semibold">Editions / Years list</span>
                            {!m.years && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...data.moments];
                                  updated[i] = {
                                    ...updated[i],
                                    years: [
                                      { year: "Edition '25", body: m.body },
                                      { year: "Edition '24", body: "Description of '24 edition..." }
                                    ]
                                  };
                                  setData(prev => ({ ...prev, moments: updated }));
                                }}
                                className="text-[8px] font-mono-tag bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 uppercase transition rounded"
                              >
                                + Convert to Multi-Edition Event
                              </button>
                            )}
                          </div>

                          {m.years && (
                            <div className="space-y-3">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...data.moments];
                                    const years = updated[i].years ? [...(updated[i].years || [])] : [];
                                    years.push({ year: "New Edition", body: "Description of this year's activity..." });
                                    updated[i] = { ...updated[i], years };
                                    setData(prev => ({ ...prev, moments: updated }));
                                  }}
                                  className="text-[8px] font-mono-tag bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 uppercase transition"
                                >
                                  + Add Year/Edition
                                </button>
                              </div>
                              {m.years.map((y, yIdx) => (
                                <div key={yIdx} className="p-3 bg-zinc-950/80 border border-white/5 rounded space-y-2 text-left animate-fade-in">
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      value={y.year}
                                      onChange={(e) => {
                                        const updated = [...data.moments];
                                        const years = [...(updated[i].years || [])];
                                        years[yIdx] = { ...years[yIdx], year: e.target.value };
                                        updated[i] = { ...updated[i], years };
                                        setData(prev => ({ ...prev, moments: updated }));
                                      }}
                                      placeholder="Year (eg. '25)"
                                      className="font-mono-tag text-[9px] bg-zinc-900 text-white px-2 py-1 rounded border border-white/10 w-28 focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...data.moments];
                                        const years = (updated[i].years || []).filter((_, idx) => idx !== yIdx);
                                        updated[i] = { ...updated[i], years: years.length > 0 ? years : undefined };
                                        setData(prev => ({ ...prev, moments: updated }));
                                      }}
                                      className="text-[8px] font-mono-tag text-rose-400 hover:text-rose-300 uppercase font-semibold"
                                    >
                                      Remove Year
                                    </button>
                                  </div>
                                  <textarea
                                    value={y.body}
                                    onChange={(e) => {
                                      const updated = [...data.moments];
                                      const years = [...(updated[i].years || [])];
                                      years[yIdx] = { ...years[yIdx], body: e.target.value };
                                      updated[i] = { ...updated[i], years };
                                      setData(prev => ({ ...prev, moments: updated }));
                                    }}
                                    rows={2}
                                    placeholder="Description for this specific edition..."
                                    className="text-[11px] bg-zinc-900 text-slate-300 p-1.5 rounded border border-white/10 w-full focus:outline-none"
                                  />
                                  <div className="space-y-1">
                                    <ImageUpload
                                      value={y.img || ''}
                                      onChange={(base64OrUrl) => {
                                        const updated = [...data.moments];
                                        const years = [...(updated[i].years || [])];
                                        years[yIdx] = { ...years[yIdx], img: base64OrUrl };
                                        updated[i] = { ...updated[i], years };
                                        setData(prev => ({ ...prev, moments: updated }));
                                      }}
                                      placeholder="Upload edition image"
                                    />
                                    <input
                                      type="text"
                                      value={y.img && y.img.startsWith('data:') ? '' : (y.img || '')}
                                      onChange={(e) => {
                                        const updated = [...data.moments];
                                        const years = [...(updated[i].years || [])];
                                        years[yIdx] = { ...years[yIdx], img: e.target.value };
                                        updated[i] = { ...updated[i], years };
                                        setData(prev => ({ ...prev, moments: updated }));
                                      }}
                                      placeholder="Or Edition specific web URL"
                                      className="text-[8px] bg-zinc-900 text-slate-400 p-1 rounded border border-white/10 w-full focus:outline-none font-mono"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16">
              {data.moments.map((m, i) => {
                const iconKey = m.iconName in iconMap ? m.iconName : 'Users';
                const Icon = iconMap[iconKey];
                const currentYearIdx = selectedYearMap[i] ?? 0;
                const currentYearObj = m.years?.[currentYearIdx];
                const displayImg = currentYearObj?.img || m.img;

                return (
                  <MouseParallax key={i} intensity={8}>
                    <motion.div
                      initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      data-testid={`iiser-moment-${m.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="bg-[#050505] hover:bg-[#0c0c0e]/90 border border-white/5 hover:border-cyan-400/25 transition-all duration-500 rounded-lg overflow-hidden flex flex-col shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] group h-full relative"
                    >
                    {/* Top glowing bar on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0 group-hover:h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300 z-10" />

                    {/* Image Header */}
                    {displayImg ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
                        <img
                          src={displayImg}
                          alt={`${m.title}`}
                          className={`w-full h-full object-cover transition-all duration-[1000ms] grayscale-[30%] group-hover:grayscale-0 brightness-[75%] group-hover:brightness-[90%] scale-100 group-hover:scale-[1.03] ${
                            (m.title.toLowerCase().includes('ikl') || m.title.toLowerCase().includes('kho') || (displayImg && displayImg.toLowerCase().includes('ikl'))) ? 'object-[center_15%]' : 'object-center'
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/10 to-transparent opacity-90 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="relative aspect-[16/10] bg-zinc-900/30 border-b border-white/5 flex flex-col items-center justify-center p-4 text-center group-hover:bg-zinc-800/20 transition-colors duration-500">
                        <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center text-zinc-650 group-hover:border-cyan-400/20 group-hover:text-cyan-400/80 transition-all duration-300">
                          <Image size={16} strokeWidth={1.3} />
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                      <div className="flex flex-col justify-between h-full">
                        {/* Interactive Pill Tabs for years/editions if present */}
                        {m.years && m.years.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-5 border-b border-white/5 pb-4">
                            {m.years.map((y, yIdx) => (
                              <button
                                key={yIdx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedYearMap(prev => ({ ...prev, [i]: yIdx }));
                                }}
                                className={`px-2.5 py-0.5 rounded text-[8px] font-mono-tag tracking-wider uppercase transition-all duration-300 ${
                                  currentYearIdx === yIdx
                                    ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-medium'
                                    : 'bg-zinc-900/60 border border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                                }`}
                              >
                                {y.year}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col justify-between h-full flex-grow">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={12} className="text-cyan-400/80" />
                              <span className="font-mono-tag text-[8px] text-cyan-400/80 tracking-[0.2em] uppercase">
                                ✦ {m.years ? currentYearObj?.year || 'EDITION' : 'CAMPUS ACTIVITY'}
                              </span>
                            </div>
                            <h3 className="font-serif-display text-xl sm:text-2xl font-light text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 mb-3 tracking-tight leading-snug">
                              {m.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-light">
                              {m.years ? currentYearObj?.body : m.body}
                            </p>
                          </div>

                          {m.link && (
                            <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
                              <a
                                href={m.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-mono-tag text-cyan-400 hover:text-cyan-300 uppercase tracking-wider group/link transition-colors duration-300"
                              >
                                Explore Initiative
                                <ExternalLink size={10} className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300 text-cyan-400" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </MouseParallax>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
