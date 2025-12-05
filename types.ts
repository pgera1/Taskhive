
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isAdmin?: boolean;
  password?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  dueDate?: string;
  createdAt: number;
  tags: Tag[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: number;
  color: string;
  members: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AIProjectSuggestion {
  name: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    priority: Priority;
  }[];
}
