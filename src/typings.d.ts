export interface Project {
  id: number;
  title: string;
  description: string;
  live_preview: string;
  source_code: string;
  priority_order: number;
  technologies: number[];
  categories: number[];
}
