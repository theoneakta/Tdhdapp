import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Task } from '../types/Task';
import TaskItem from '../components/TaskItem';
import { loadTasks, saveTasks } from '../storage/taskStorage';

const ACCENT = '#5B6CFF';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTasks().then((t) => {
      setTasks(t);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  const addTask = useCallback(() => {
    const title = draft.trim();
    if (!title) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setDraft('');
  }, [draft]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const { open, done } = useMemo(() => {
    const open = tasks.filter((t) => !t.completed);
    const done = tasks.filter((t) => t.completed);
    return { open, done };
  }, [tasks]);

  const sections = useMemo(() => [...open, ...done], [open, done]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {open.length} open · {done.length} done
          </Text>
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
                <Text style={styles.emptyText}>No tasks yet — add one below.</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a task..."
            placeholderTextColor="#A0A0B2"
            style={styles.input}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <Pressable onPress={addTask} style={styles.addBtn} hitSlop={8}>
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F5FA' },
  flex: { flex: 1 },
  header: {
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECECF4',
  },
  input: {
    flex: 1,
    backgroundColor: '#F4F5FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A2E',
  },
  addBtn: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: -2,
  },
});
