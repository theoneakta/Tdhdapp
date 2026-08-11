export interface TaskType {
  id: string;
  label: string;
  color: string;
  // sensible default reminder times for a new task of this type — user can
  // still add/remove individual reminders per task
  defaultReminderTimes: string[];
  // Android notification channel id — each task type gets its own channel
  // so sound/importance can be tuned per category in system settings too
  channelId: string;
  channelName: string;
  // filename (without extension) expected under android res/raw after
  // `expo prebuild`, e.g. raw/chime_soft.mp3 -> 'chime_soft'
  soundFile: string;
}

export const TASK_TYPES: TaskType[] = [
  {
    id: 'general',
    label: 'General',
    color: '#5B6CFF',
    defaultReminderTimes: ['09:00'],
    channelId: 'reminders-general',
    channelName: 'General reminders',
    soundFile: 'chime_soft',
  },
  {
    id: 'housing',
    label: 'Housing / Chores',
    color: '#3FB27F',
    defaultReminderTimes: ['09:00', '13:00', '18:00'],
    channelId: 'reminders-housing',
    channelName: 'Housing reminders',
    soundFile: 'chime_bright',
  },
  {
    id: 'health',
    label: 'Health',
    color: '#E0587B',
    defaultReminderTimes: ['08:00', '12:00', '16:00', '20:00'],
    channelId: 'reminders-health',
    channelName: 'Health reminders',
    soundFile: 'alarm_gentle',
  },
  {
    id: 'work',
    label: 'Work',
    color: '#E0A83F',
    defaultReminderTimes: ['09:30'],
    channelId: 'reminders-work',
    channelName: 'Work reminders',
    soundFile: 'chime_soft',
  },
];

export function getTaskType(id: string): TaskType {
  return TASK_TYPES.find((t) => t.id === id) ?? TASK_TYPES[0];
}
