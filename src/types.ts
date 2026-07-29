export interface Project {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  year: string;
  img: string;
  githubUrl?: string;
  paperUrl?: string;
  viewUrl?: string;
}

export interface Moment {
  title: string;
  body: string;
  iconName: 'Users' | 'BookOpen' | 'Activity' | 'MapPin' | 'Sparkles' | 'Atom' | 'Orbit' | 'Telescope';
  img?: string;
  years?: Array<{ year: string; body: string; img?: string }>;
  link?: string;
}

export interface Chapter {
  year: string;
  title: string;
  body: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  description: string;
  role: string;
  aboutParas: string[];
  interests: string[];
  projects: Project[];
  moments: Moment[];
  chapters: Chapter[];
  email: string;
  contactTwitter: string;
  coordinates: string;
  locationName: string;
  githubUrl: string;
  linkedinUrl: string;
  scholarUrl: string;
  twitterUrl: string;
  cvUrl?: string;
  profileImg?: string;
}
