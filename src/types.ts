export interface Tool {
  id: number;
  name: string;
  short: string;
  color: string;
  tagline: string;
}

export interface JourneyYear {
  id: number;
  year: number;
  title: string;
  details: string;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  accent: string;
  story: string;
  featured: boolean;
}
