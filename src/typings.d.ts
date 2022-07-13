export interface Project {
  id: number;
  title: string;
  description: string;
  live_preview: string;
  source_code: string;
  priority_order: number;
  technologies: number[];
  categories: number[];
  screenshots: number[];
}

export interface Technology {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  title: string;
  name: string;
  priority_order: number;
}

export interface Screenshot {
  id: number;
  image: string | File;
  priority_order?: number;
  project?: number;
}

export interface UserLogin {
  username: string;
  password: string;
}
