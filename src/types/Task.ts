export type Recurrence = 'once' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  dueAt?: number; // epoch ms — anchor date for the task/recurrence

  taskTypeId: string; // references a TaskType preset (see taskTypes.ts)
  recurrence: Recurrence;
  reminderTimes: string[]; // "HH:mm" 24h, one entry per reminder/day
  audioEnabled: boolean;

  // ids of currently-scheduled notifee trigger notifications for this task,
  // so we can cancel/reschedule them on edit or delete
  scheduledNotificationIds: string[];
}
