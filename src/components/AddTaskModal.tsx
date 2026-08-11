import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Task, Recurrence } from '../types/Task';
import { TASK_TYPES, getTaskType } from '../data/taskTypes';
import ReminderTimesEditor from './ReminderTimesEditor';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (draft: Omit<Task, 'id' | 'createdAt' | 'completed' | 'scheduledNotificationIds'>) => void;
}

const RECURRENCE_OPTIONS: { id: Recurrence; label: string }[] = [
  { id: 'once', label: 'Just once' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekly', label: 'Every week' },
];

export default function AddTaskModal({ visible, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [taskTypeId, setTaskTypeId] = useState(TASK_TYPES[0].id);
  const [recurrence, setRecurrence] = useState<Recurrence>('daily');
  const [reminderTimes, setReminderTimes] = useState<string[]>(
    TASK_TYPES[0].defaultReminderTimes
  );
  const [audioEnabled, setAudioEnabled] = useState(true);

  // When task type changes, refresh reminder times to that type's defaults
  useEffect(() => {
    setReminderTimes(getTaskType(taskTypeId).defaultReminderTimes);
  }, [taskTypeId]);

  const reset = () => {
    setTitle('');
    setNotes('');
    setTaskTypeId(TASK_TYPES[0].id);
    setRecurrence('daily');
    setReminderTimes(TASK_TYPES[0].defaultReminderTimes);
    setAudioEnabled(true);
  };

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({
      title: trimmed,
      notes: notes.trim() || undefined,
      taskTypeId,
      recurrence,
      reminderTimes,
      audioEnabled,
    });
    reset();
    onClose();
  };

  const activeType = getTaskType(taskTypeId);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>New task</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              placeholderTextColor="#A0A0B2"
              style={styles.input}
            />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes (optional)"
              placeholderTextColor="#A0A0B2"
              style={styles.input}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.pillRow}>
              {TASK_TYPES.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => setTaskTypeId(t.id)}
                  style={[
                    styles.pill,
                    { borderColor: t.color },
                    taskTypeId === t.id && { backgroundColor: t.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: taskTypeId === t.id ? '#FFF' : t.color },
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Repeats</Text>
            <View style={styles.pillRow}>
              {RECURRENCE_OPTIONS.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => setRecurrence(r.id)}
                  style={[
                    styles.pill,
                    { borderColor: activeType.color },
                    recurrence === r.id && { backgroundColor: activeType.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: recurrence === r.id ? '#FFF' : activeType.color },
                    ]}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>
              Reminders ({reminderTimes.length}/day)
            </Text>
            <ReminderTimesEditor
              times={reminderTimes}
              onChange={setReminderTimes}
              accentColor={activeType.color}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Audio reminders</Text>
              <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
            </View>

            <View style={styles.actionsRow}>
              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: activeType.color }]}
              >
                <Text style={styles.saveText}>Save task</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F4F5FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8AA3',
    marginTop: 12,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#F4F5FA',
  },
  cancelText: {
    color: '#8A8AA3',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
