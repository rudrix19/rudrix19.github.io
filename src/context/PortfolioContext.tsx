import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileData, Project, Moment, Chapter } from '../types';

const defaultProfileData: ProfileData = {
  name: "Rudra Sahu",
  tagline: "“Science, stories, and the self, in superposition.”",
  role: "Student of Physics & Astrophysics",
  description: "Hey there! I'm a BS-MS Junior at IISER Pune. This space is where I reflect, showcase, and share what I've been learning and doing — projects, ideas, collaborations, and questions that continue to excite me.",
  aboutParas: [
    "I'm currently pursuing a BS-MS at IISER Pune, trying to make sense of things that are often far bigger than me, say, quantum mechanics, gravitation, astronomy, and astrophysics, being a few of them. Most days, that means reading, asking too many questions, getting stuck, and slowly learning how to think more clearly.",
    "Most of my time goes into coursework, labs, reading things slightly above my comfort level, and figuring things out with other curious people. Outside the classroom, I spend a lot of time around campus activities and student spaces. I'm involved with clubs like the Science Club and Mimamsa. I also spend time playing Kho-Kho, because apparently running in circles is a lifestyle now.",
    "I like people and conversations that are curious, thoughtful, and open-ended. A lot of what interests me lies less in having answers and more in understanding how people think through difficult questions, in physics or otherwise.",
    "Still learning, still exploring."
  ],
  interests: ["Quantum Mechanics", "Gravitation", "Astrophysics", "Astronomy"],
  projects: [
    {
      id: "01",
      title: "Investigating Interferometric Techniques for Gravitational-Wave Detection",
      subtitle: "Supervisor: Dr. Deepak Pandey, IUCAA, Pune, India",
      summary: "• Investigating the optical cavities and interferometry used in gravitational-wave observatories such as LIGO, with a focus on understanding the physics behind precision measurements.\n• Working through the design and behaviour of resonant optical systems, exploring how different cavity configurations affect beam properties and system performance.\n• Building simulations using Finesse 3 to study cavity dynamics, model interferometric systems, and develop intuition for the techniques used in modern gravitational-wave detection experiments",
      tags: ["Gravitational Waves", "Interferometry", "Physics", "Finesse 3"],
      year: "May 2026 - Present",
      img: "/interferometry.png",
      githubUrl: "https://github.com/rudrix19/Interferometry.git"
    },
    {
      id: "02",
      title: "Intro2Astro 2025",
      subtitle: "University of Hawai’i, UC Berkeley, and ZS Associates",
      summary: "• Gained hands-on experience with Python and key scientific libraries (NumPy, Pandas, Matplotlib, Astropy, SciPy), LaTeX typesetting, basic web development for scientific outreach, and academic CV creation.\n• Engaged in extensive tutorials on exoplanet detection methods, exoplanetary atmospheric science, use of the NASA Exoplanet Archive, and TESS mission data",
      tags: ["Astrophysics", "Python", "Exoplanets", "TESS"],
      year: "July 2025 - August 2025",
      img: "/intro2astro.png",
      githubUrl: "https://github.com/rudrix19/Intro2Astro_2025.git"
    },
    {
      id: "03",
      title: "Winter School in Astronomical Calculations using Python Programming",
      subtitle: "Wilson College and Indian Association Of Physics Teachers (IAPT)",
      summary: "• Received hands-on training in computational astronomy, covering heliophysics, stellar and galactic astrophysics, exoplanet detection, cosmology, and multi-messenger astronomy through data-driven projects in Python.\n• Worked with astronomical datasets using Astropy, Pandas, and SunPy to analyse phenomena including stellar clusters, Cepheid variables, X-ray binaries, black-hole jets, solar observations, and Hubble-law measurements, developing practical experience in astronomical data analysis and modelling",
      tags: ["Computational Astronomy", "Python", "Astropy", "Data Analysis"],
      year: "December 2024 - January 2025",
      img: "/astrocalc.png",
      githubUrl: "https://github.com/rudrix19/Astronomical_Calculations.git"
    }
  ],
  moments: [
    {
      iconName: "Sparkles",
      title: "HELICASE",
      body: "Spent the 2025–26 session coordinating HELICASE at The Science Club, IISER Pune, which mostly meant juggling ideas, deadlines, layouts, contributors, and occasional chaos until two full editions finally came together. Do check them out!",
      img: "/helicase.png",
      link: "https://sites.google.com/view/scienceclubiiserp/helicase",
      years: [
        {
          year: "Spring '26",
          body: "Spent the 2025–26 session coordinating HELICASE at The Science Club, IISER Pune, which mostly meant juggling ideas, deadlines, layouts, contributors, and occasional chaos until two full editions finally came together. The role gave me a chance to work closely with people who genuinely enjoyed creating things, and somewhere in between edits and last-minute fixes, the process itself became the most rewarding part."
        },
        {
          year: "Fall '25",
          body: "Spent the 2025–26 session coordinating HELICASE at The Science Club, IISER Pune, which mostly meant juggling ideas, deadlines, layouts, contributors, and occasional chaos until two full editions finally came together. The role gave me a chance to work closely with people who genuinely enjoyed creating things, and somewhere in between edits and last-minute fixes, the process itself became the most rewarding part."
        }
      ]
    },
    {
      iconName: "BookOpen",
      title: "Mimamsa",
      body: "One of the most intellectually fulfilling experiences has been working with the Mimamsa team, helping shape the theme, visual feel, and execution of India's flagship science challenge.",
      img: "/mimamsa.png",
      link: "https://www.mimamsa.info/",
      years: [
        {
          year: "MIMamsa '26",
          body: "Worked on the design and decoration side of Mimamsa, helping shape the theme and visual feel of the event. Most of it involved brainstorming absurd ideas with the team, making last-minute decisions, and somehow managing to decorate the entire LHC overnight before the event actually began. Stressful in the moment, fun in retrospect."
        },
        {
          year: "MIMamsa '25",
          body: "One of the most intellectually fulfilling experiences has been working with the Mimamsa team. I’ve contributed extensively to logistics, publicity, question checking, and proctoring during the prelims and mains."
        }
      ]
    },
    {
      iconName: "Telescope",
      title: "IISER Pune Kho-Kho League",
      body: "I helped coordinate the IISER Pune Kho-Kho League (IKL) across seasons, organizing matches, handling team management, and bringing the campus community together around a shared love for high-energy sports.",
      img: "/ikl.png",
      years: [
        {
          year: "IKL '26",
          body: "Coordinated the IKL '26 edition, managing the overall schedule, teams, refereeing panels, and orchestrating a competitive tournament that engaged over 100 student athletes."
        },
        {
          year: "IKL '25",
          body: "I coordinated the IKL '25 tournament, organizing matches, handling team management, and bringing the community together around a shared love for sports."
        }
      ]
    },
    {
      iconName: "Users",
      title: "Bijoya",
      body: "Being part of the Bengali community at IISER Pune, I’ve helped organize and perform in Bijoya celebrations during Durga Puja.",
      img: "/bijoya.png",
      years: [
        {
          year: "Bijoya '25",
          body: "Being part of the Bengali community at IISER Pune, I’ve helped organize and perform in Bijoya celebrations during Durga Puja. It’s a slice of home, a cultural anchor, and a time to celebrate traditions through music, dance, and shared stories."
        },
        {
          year: "Bijoya '24",
          body: "Being part of the Bengali community at IISER Pune, I’ve helped organize and perform in Bijoya celebrations during Durga Puja. It’s a slice of home, a cultural anchor, and a time to celebrate traditions through music, dance, and shared stories."
        }
      ]
    },
    {
      iconName: "Activity",
      title: "Navarasa",
      body: "Sometimes, movement says what words can’t. With Navarasa, I’ve had the joy of performing in various cultural events on campus.",
      img: "/navarasa.png",
      years: [
        {
          year: "NAVARASA '25",
          body: "Sometimes, movement says what words can’t. With Navarasa, I’ve had the joy of performing in various cultural events on campus. It’s been an unexpectedly beautiful way to stay connected with rhythm, expression, and community, even while immersed in academic life."
        },
        {
          year: "NAVARASA '24",
          body: "Sometimes, movement says what words can’t. With Navarasa, I’ve had the joy of performing in various cultural events on campus. It’s been an unexpectedly beautiful way to stay connected with rhythm, expression, and community, even while immersed in academic life."
        }
      ]
    },
    {
      iconName: "MapPin",
      title: "Inter-IISER Sports Meet (IISM)",
      body: "Represented IISER Pune in Kho-Kho, bagging 3rd place overall in back-to-back years of intense team competition, camaraderie, and team spirit.",
      img: "/iism.png",
      link: "https://www.instagram.com/khokho_iiserp/",
      years: [
        {
          year: "IISM '25",
          body: "The journey continues. Represented IISER Pune in Kho-Kho, and we again bagged 3rd place overall."
        },
        {
          year: "IISM '24",
          body: "Represented IISER Pune in Kho-Kho, and we bagged 3rd place overall. The adrenaline, camaraderie, and team spirit made it one of the most memorable chapters of my first year."
        }
      ]
    },
    {
      iconName: "Atom",
      title: "SCIENCE CLUB '25",
      body: "Coordinated the Science Club in 2025, facilitating dynamic scientific outreach, student research presentations, evening seminars, and interactive experiments that brought foundational science to life.",
      img: "/scienceclub.png",
      link: "https://sites.google.com/view/scienceclubiiserp/home"
    },
    {
      iconName: "Sparkles",
      title: "Art Club",
      body: "While not a regular member, I’ve occasionally participated in Art Club activities. Sketching, painting, or just being around other creative people has helped me find pockets of calm and expression amidst packed academic weeks.",
      img: "/artclub.png"
    },
    {
      iconName: "Orbit",
      title: "Maths club",
      body: "I also volunteered during the Pi Week celebrations organized by the Maths Club, helping with event coordination and problem-setting. It was fun to engage with mathematics in a more playful, community-driven context.",
      img: "/mathclub.png",
      link: "https://sites.google.com/sac.iiserpune.ac.in/mathsclubiiserpune/home"
    }
  ],
  chapters: [
    {
      year: "Then",
      title: "First questions",
      body: "First encounters with math problems and physical phenomena — simple curiosities that transformed school physics from a classroom subject into a core lens for interpreting the physical world."
    },
    {
      year: "Mid",
      title: "Long evenings, longer problems",
      body: "Late-night school group chats, contest preparations, science quizzes, and lively secondary-school arguments with friends exploring cosmic scales and optics phenomena."
    },
    {
      year: "Now",
      title: "Carrying it forward",
      body: "Applying early perseverance to state-space laboratory research. Taking that early fundamental curiosity and refining it under academic rigor at the university level."
    }
  ],
  email: "placeholder@iiserpune.ac.in",
  contactTwitter: "@rudrix_notes",
  coordinates: "18.5471° N · 73.8056° E",
  locationName: "IISER Pune\nDr. Homi Bhabha Road\nPashan, Pune 411008",
  githubUrl: "#",
  linkedinUrl: "#",
  scholarUrl: "#",
  twitterUrl: "#",
  cvUrl: "/CV_RudraSahu.pdf",
  profileImg: "/wmremove-transformed.png"
};

interface PortfolioContextType {
  data: ProfileData;
  setData: React.Dispatch<React.SetStateAction<ProfileData>>;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  resetToDefault: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically migrate description from old default to new default
        if (parsed.description && (parsed.description.startsWith("Welcome to my portfolio.") || parsed.description.includes("aggregate my academic research"))) {
          parsed.description = defaultProfileData.description;
        }
        // Force upgrade moments if they are the old small set or missing the new years-based grouped moments
        if (!parsed.moments || parsed.moments.length <= 4 || !parsed.moments.some((m: any) => m.years !== undefined)) {
          parsed.moments = defaultProfileData.moments;
        }
        // Force upgrade moments if they still have the old IKL title
        if (parsed.moments && parsed.moments.some((m: any) => m.title === "IKL '25")) {
          parsed.moments = defaultProfileData.moments;
        }
        // Force upgrade moments to use the newly uploaded local PNG files
        if (parsed.moments && parsed.moments.length > 0 && !parsed.moments.some((m: any) => m.img && m.img.endsWith('.png'))) {
          parsed.moments = defaultProfileData.moments;
        }
        // Force upgrade moments if they are not in the new-to-old order (where index 2 is IISER Pune Kho-Kho League)
        if (parsed.moments && parsed.moments.length > 2 && parsed.moments[2].title !== "IISER Pune Kho-Kho League") {
          parsed.moments = defaultProfileData.moments;
        }
        if (parsed.moments && parsed.moments.length > 0) {
          // Merge links and ensure correct image paths for default moments
          parsed.moments = parsed.moments.map((m: any) => {
            const defaultM = defaultProfileData.moments.find((dm: any) => dm.title.toLowerCase() === m.title.toLowerCase());
            if (defaultM) {
              return {
                ...m,
                link: defaultM.link || m.link,
                img: defaultM.img || m.img,
                // also match up years sub-images if they are defaults
                years: m.years?.map((y: any, idx: number) => ({
                  ...y,
                  img: defaultM.years?.[idx]?.img || y.img
                })) || m.years
              };
            }
            return m;
          });
        }
        // Force upgrade projects if they don't have exactly the 3 requested projects or still use unsplash links for projects
        if (!parsed.projects || parsed.projects.length !== 3 || !parsed.projects.some((p: any) => p.title.includes("Intro2Astro")) || !parsed.projects.some((p: any) => p.title.includes("Winter School")) || parsed.projects.some((p: any) => p.img.includes("unsplash.com"))) {
          parsed.projects = defaultProfileData.projects;
        }

        // Always sort projects from newest to oldest (e.g. 2026, then 2025, then 2024)
        if (parsed.projects && parsed.projects.length > 0) {
          parsed.projects.sort((a: any, b: any) => {
            const getYear = (yearStr: string) => {
              const match = yearStr.match(/\b(202\d)\b/);
              return match ? parseInt(match[1]) : 0;
            };
            return getYear(b.year) - getYear(a.year);
          });
          
          // Re-assign correct sequential IDs after sorting (01, 02, 03)
          parsed.projects = parsed.projects.map((p: any, idx: number) => ({
            ...p,
            id: String(idx + 1).padStart(2, '0')
          }));
        }
        // Force upgrade CV link
        if (!parsed.cvUrl || parsed.cvUrl.includes("#") || parsed.cvUrl.includes("drive.google.com")) {
          parsed.cvUrl = defaultProfileData.cvUrl;
        }
        // Force upgrade profileImg to use wmremove-transformed.png
        if (!parsed.profileImg || parsed.profileImg === "/me.png") {
          parsed.profileImg = defaultProfileData.profileImg;
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved portfolio_data", e);
      }
    }
    return defaultProfileData;
  });

  const isEditing = false;
  const setIsEditing = () => {};
  const resetToDefault = () => {};

  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  }, [data]);

  return (
    <PortfolioContext.Provider value={{ data, setData, isEditing, setIsEditing, resetToDefault }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
