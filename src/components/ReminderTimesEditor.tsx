import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  times: string[];
  onChange: (times: string[]) => void;
  accentColor: string;
}

function formatHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
}

function displayTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ReminderTimesEditor({ times, onChange, accentColor }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const addTime = (date: Date) => {
    const hhmm = formatHHMM(date);
    if (!times.includes(hhmm)) {
      onChange([...times, hhmm].sort());
    }
  };

  const removeTime = (hhmm: string) => {
    onChange(times.filter((t) => t !== hhmm));
  };

  return (
    <View>
      <View style={styles.chipRow}>
        {times.map((t) => (
          <Pressable
            key={t}
            onPress={() => removeTime(t)}
            style={[styles.chip, { borderColor: accentColor }]}
          >
            <Text style={[styles.chipText, { color: accentColor }]}>
              {displayTime(t)} ✕
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => setPickerOpen(true)}
          style={[styles.chip, styles.addChip, { borderColor: accentColor }]}
        >
          <Text style={[styles.chipText, { color: accentColor }]}>+ Add time</Text>
        </Pressable>
      </View>

      {pickerOpen && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setPickerOpen(false);
            if (event.type === 'set' && date) addTime(date);
          }}
        />
      )}

      {times.length === 0 && (
        <Text style={styles.hint}>No reminders set — task won't send any alerts.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  addChip: {
    borderStyle: 'dashed',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#A0A0B2',
    marginTop: 2,
  },
});
