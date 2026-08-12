import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme';

interface AdminCardProps {
  title?: string;
  /** Right-aligned actions in the card header (buttons, counts, etc.). */
  actions?: ReactNode;
  children: ReactNode;
}

/** AdminLTE-style "box": white card with a slim header and body. */
export default function AdminCard({ title, actions, children }: AdminCardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {title ? (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  body: {
    padding: 16,
  },
});
