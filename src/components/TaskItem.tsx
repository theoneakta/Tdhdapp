import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Task } from '../types/Task';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onToggle(task.id)}
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        hitSlop={8}
      >
        {task.completed && <View style={styles.checkboxDot} />}
      </Pressable>

      <View style={styles.textWrap}>
        <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        {!!task.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {task.notes}
          </Text>
        )}
      </View>

      <Pressable onPress={() => onDelete(task.id)} hitSlop={10} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const ACCENT = '#5B6CFF';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: ACCENT,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  titleDone: {
    color: '#A0A0B2',
    textDecorationLine: 'line-through',
  },
  notes: {
    fontSize: 13,
    color: '#8A8AA3',
    marginTop: 2,
  },
  deleteBtn: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 16,
    color: '#C9C9D9',
  },
});
