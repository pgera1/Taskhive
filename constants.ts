
import { User, TaskStatus, Priority } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', avatar: 'https://picsum.photos/seed/alice/32/32' },
  { id: 'u2', name: 'Bob Smith', avatar: 'https://picsum.photos/seed/bob/32/32' },
  { id: 'u3', name: 'Charlie Kim', avatar: 'https://picsum.photos/seed/charlie/32/32' },
  { id: 'u4', name: 'Diana Prince', avatar: 'https://picsum.photos/seed/diana/32/32' },
];

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-slate-100 text-slate-700 border-slate-200',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border-blue-200',
  [TaskStatus.REVIEW]: 'bg-amber-50 text-amber-700 border-amber-200',
  [TaskStatus.DONE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'text-slate-500 bg-slate-100',
  [Priority.MEDIUM]: 'text-orange-500 bg-orange-100',
  [Priority.HIGH]: 'text-red-500 bg-red-100',
};

export const TAG_COLORS = [
  'bg-red-100 text-red-700',
  'bg-orange-100 text-orange-700',
  'bg-amber-100 text-amber-700',
  'bg-yellow-100 text-yellow-700',
  'bg-lime-100 text-lime-700',
  'bg-green-100 text-green-700',
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-sky-100 text-sky-700',
  'bg-blue-100 text-blue-700',
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-purple-100 text-purple-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-pink-100 text-pink-700',
  'bg-rose-100 text-rose-700',
];

export const PROJECT_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-teal-500',
];
