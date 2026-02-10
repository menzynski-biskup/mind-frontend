export interface NavItem {
  label: string;
  path: string;
  future?: boolean;
  children?: NavItem[];
}

export interface Hero {
  title: string;
  description: string;
  meta?: string[];
  actions?: HeroAction[];
}

export interface Feature {
  title: string;
  description: string;
  tag?: string;
}

export interface HeroAction {
  label: string;
  path: string;
  variant?: 'primary' | 'secondary';
}

export interface TableData {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface DefinitionItem {
  term: string;
  detail: string;
}

export interface Section {
  id: string;
  title: string;
  body?: string;
  meta?: string[];
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  table?: TableData;
  callout?: string;
  features?: Feature[];
  definitions?: DefinitionItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Person {
  name: string;
  role: string;
  summary?: string;
}

export interface ContactChannel {
  label: string;
  detail: string;
  notes?: string;
}

export interface Contact {
  channels: ContactChannel[];
  escalation?: string;
  responseTime?: string;
}

export interface PageContent {
  hero: Hero;
  sections: Section[];
}

export interface SiteContent {
  nav: NavItem[];
  footer: {
    projectName: string;
    mission: string;
  };
  pages: {
    home: PageContent;
    about: PageContent;
    contact: PageContent;
    [key: string]: PageContent;
  };
}
