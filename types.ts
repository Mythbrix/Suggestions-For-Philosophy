export interface Subject {
  id: string;
  code: string;
  name: string;
}

export type TabType = 'ka' | 'kha' | 'ga';

export interface TabConfig {
  id: TabType;
  label: string;
  fullLabel: string;
}

export interface Question {
  id: string;
  text: string;
  answer?: string; // For Ka-Bibhag
  probability?: number; // For Kha and Ga Bibhag (e.g., 99, 95)
}

export interface SubjectData {
  ka: Question[];
  kha: Question[];
  ga: Question[];
}