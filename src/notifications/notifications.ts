import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TriggerType,
  TimestampTrigger,
  AndroidNotificationSetting,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { Task } from '../types/Task';
import { getTaskType, TASK_TYPES } from '../data/taskTypes';

/** Call once at app startup. Creates one Android channel per task type and
 * requests the permissions needed for exact, alarm-style reminders. */
export async function initNotifications() {
  await notifee.requestPermission();

  if (Platform.OS === 'android') {
    // Android 12+ requires this separate exact-alarm permission for
    // time-precise reminders (as opposed to inexact/batched ones).
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
      await notifee.openAlarmPermissionSettings();
    }

    for (const type of TASK_TYPES) {
      await notifee.createChannel({
        id: type.channelId,
        name: type.channelName,
        importance: AndroidImportance.HIGH,
        sound: type.soundFile, // matches android/app/src/main/res/raw/<soundFile>.mp3
        vibration: true,
      });
    }
  }
}

function nextOccurrence(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const candidate = new Date();
  candidate.setHours(h, m, 0, 0);
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

/** Cancels any previously scheduled notifications for a task. */
export async function cancelTaskReminders(task: Task) {
  await Promise.all(
    task.scheduledNotificationIds.map((id) => notifee.cancelNotification(id))
  );
}

/** Schedules one repeating notification per entry in task.reminderTimes.
 * Returns the notification ids so they can be stored on the task for later
 * cancellation/rescheduling. */
export async function scheduleTaskReminders(task: Task): Promise<string[]> {
  if (task.completed || task.reminderTimes.length === 0) return [];

  const type = getTaskType(task.taskTypeId);
  const ids: string[] = [];

  for (const time of task.reminderTimes) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextOccurrence(time).getTime(),
      repeatFrequency:
        task.recurrence === 'once' ? undefined : RepeatFrequency.DAILY,
      alarmManager: { allowWhileIdle: true }, // exact alarm even in doze
    };

    const id = await notifee.createTriggerNotification(
      {
        title: task.title,
        body: task.notes || 'Reminder',
        android: {
          channelId: type.channelId,
          smallIcon: 'ic_launcher',
          pressAction: { id: 'default' },
          sound: task.audioEnabled ? type.soundFile : undefined,
        },
      },
      trigger
    );
    ids.push(id);
  }

  return ids;
}

/** Cancel + reschedule — call after any edit to reminderTimes, recurrence,
 * taskTypeId, audioEnabled, or completed. */
export async function resyncTaskReminders(task: Task): Promise<string[]> {
  await cancelTaskReminders(task);
  return scheduleTaskReminders(task);
}
