export interface Project {
  _id: string;
  title: string;
  description: string;
  livePreview: string;
  sourceCode: string;
  priorityOrder: number;
  technologies: string[];
  categories: string[];
  screenshots: string[];
}

export interface Technology {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  title: string;
  name: string;
  priorityOrder: number;
}

export interface Screenshot {
  _id: string;
  image: string;
  priorityOrder?: number;
  project: string;
}

export interface UserLogin {
  username: string;
  password: string;
}
