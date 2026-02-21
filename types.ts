export type TabType = 'ka' | 'kha' | 'ga';
export interface Question { id: string; text: string; answer?: string; probability?: number; }
export interface Subject { id: string; code: string; name: string; }
export interface SubjectData { ka: Question[]; kha: Question[]; ga: Question[]; }
export interface TabConfig { id: TabType; label: string; fullLabel: string; }
