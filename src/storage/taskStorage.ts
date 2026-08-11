import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const STORAGE_KEY = '@tdhd/tasks';

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch (e) {
    console.error('Failed to load tasks', e);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}
