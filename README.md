# tdhd

Task/reminder app (React Native + Expo). Supports recurring tasks, per-task
categories with default reminder cadences, multiple reminders per day, and
custom audio reminders.

## Why a dev build instead of Expo Go

Custom notification sounds and reliable recurring/exact alarms need
`@notifee/react-native`, which has native code Expo Go can't load. So this
project now runs as a **custom dev client** instead.

## Setup

```bash
npm install
npx expo prebuild        # generates the android/ folder
```

Add your reminder sound files (mp3) here, matching the `soundFile` names in
`src/data/taskTypes.ts`:

```
android/app/src/main/res/raw/chime_soft.mp3
android/app/src/main/res/raw/chime_bright.mp3
android/app/src/main/res/raw/alarm_gentle.mp3
```

Then build and run on a connected device/emulator:

```bash
npx expo run:android
```

For subsequent JS-only changes, once the dev client is installed on the
device you can just run:

```bash
npx expo start --dev-client
```

## Structure

```
app.json                            - Expo config: android permissions, notifee plugin
App.tsx                             - entry point
src/types/Task.ts                   - Task shape: recurrence, type, reminderTimes, audio
src/data/taskTypes.ts               - task type presets (default reminder cadence, channel, sound)
src/storage/taskStorage.ts          - AsyncStorage load/save
src/notifications/notifications.ts  - notifee channel setup + schedule/cancel/resync reminders
src/components/TaskItem.tsx         - row: checkbox, title, type badge, reminder count
src/components/ReminderTimesEditor.tsx - add/remove reminder times (chips + time picker)
src/components/AddTaskModal.tsx     - create task: title, type, recurrence, reminders, audio toggle
src/screens/TaskListScreen.tsx      - list + header + wires up notification scheduling
```

## How reminders work

- Each **task type** (General, Housing/Chores, Health, Work) has a default
  reminder cadence and its own Android notification channel + sound, so e.g.
  Housing tasks default to 3 reminders/day and Health to 4.
- Per task, you can add/remove individual reminder times freely — the
  defaults are just a starting point.
- `recurrence: 'daily'` reschedules each reminder every day automatically
  (via notifee's `RepeatFrequency.DAILY`); `'once'` fires a single time.
- Completing a task cancels its pending reminders for that day; toggling it
  back to open reschedules them.
- Turning off "Audio reminders" on a task keeps the notification but drops
  the custom sound.

## Next up

- Edit-task flow (currently add/complete/delete only)
- Weekly recurrence day-of-week picker (currently daily-only in the scheduler)
- Snooze / "remind again in 10 min" action on the notification itself
