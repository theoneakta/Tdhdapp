import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Task } from '../types/Task';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import {
  initNotifications,
  scheduleTaskReminders,
  resyncTaskReminders,
  cancelTaskReminders,
} from '../notifications/notifications';

const ACCENT = '#5B6CFF';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initNotifications();
    loadTasks().then((t) => {
      setTasks(t);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const addTask = useCallback(
    async (
      draft: Omit<Task, 'id' | 'createdAt' | 'completed' | 'scheduledNotificationIds'>
    ) => {
      const base: Task = {
        ...draft,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        completed: false,
        scheduledNotificationIds: [],
      };
      const scheduledNotificationIds = await scheduleTaskReminders(base);
      const task: Task = { ...base, scheduledNotificationIds };
      setTasks((prev) => [task, ...prev]);
    },
    []
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, completed: !t.completed };
        // completing a task cancels its pending reminders; un-completing
        // (e.g. undo) reschedules them
        resyncTaskReminders(updated).then((ids) => {
          setTasks((cur) =>
            cur.map((x) =>
              x.id === id ? { ...x, scheduledNotificationIds: ids } : x
            )
          );
        });
        return updated;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) cancelTaskReminders(target);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const { open, done } = useMemo(() => {
    const open = tasks.filter((t) => !t.completed);
    const done = tasks.filter((t) => t.completed);
    return { open, done };
  }, [tasks]);

  const sections = useMemo(() => [...open, ...done], [open, done]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {open.length} open · {done.length} done
          </Text>
        </View>
        <Pressable onPress={() => setModalVisible(true)} style={styles.addBtn} hitSlop={8}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No tasks yet — tap + to add one.</Text>
            </View>
          ) : null
        }
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F5FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8A8AA3',
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
    marginTop: -2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  empty: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0A0B2',
    fontSize: 14,
  },
});
