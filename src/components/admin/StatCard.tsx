import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: IconName;
  /** Accent color for the left border + icon chip. */
  color: string;
  /** Optional footnote line under the value. */
  note?: string;
}

/** AdminLTE-style "small-box" stat card: colored accent, big number, icon chip. */
export default function StatCard({ label, value, icon, color, note }: StatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: color }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {note ? (
          <Text style={[styles.note, { color: colors.textMuted }]} numberOfLines={1}>
            {note}
          </Text>
        ) : null}
      </View>
      <View style={[styles.iconChip, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#ffffff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 16,
    minHeight: 104,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  note: {
    fontSize: 12,
    marginTop: 4,
  },
  iconChip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    opacity: 0.9,
  },
});
