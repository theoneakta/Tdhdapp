# tdhd

Task/reminder app scaffold (React Native + Expo). This first pass covers the
task list screen: add, complete, delete, with local persistence via
AsyncStorage. Reminders/notifications come next.

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your Android phone, or press `a` to launch
an Android emulator (requires Android Studio installed).

## Structure

```
App.tsx                       - entry point
src/types/Task.ts             - Task shape (includes dueAt for later)
src/storage/taskStorage.ts    - AsyncStorage load/save
src/components/TaskItem.tsx   - single row (checkbox, title, delete)
src/screens/TaskListScreen.tsx - list, add bar, header counts
```

## Next up

- Data model refinements for due dates
- Local notification scheduling (expo-notifications or notifee) for reminders
- Edit-task flow (currently add/complete/delete only)
