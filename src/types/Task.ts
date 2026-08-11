export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  dueAt?: number; // epoch ms, used later for reminders
}
