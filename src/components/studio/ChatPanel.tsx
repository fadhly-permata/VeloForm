import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../../theme';
import { useI18n } from '../../i18n';
import { useStudioStore } from '../../store/studioStore';

/** R-017: multi-turn chat loop — each assistant turn carries an updated schema
 *  snapshot that replaces the live preview. */
export default function ChatPanel() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const history = useStudioStore((s) => s.history);
  const chat = useStudioStore((s) => s.chat);
  const setChat = useStudioStore((s) => s.setChat);
  const refine = useStudioStore((s) => s.refine);
  const refining = useStudioStore((s) => s.refining);
  const hasSchema = useStudioStore((s) => s.schema !== null);

  const send = () => {
    if (!chat.trim() || refining) return;
    void refine();
  };

  return (
    <View>
      {!hasSchema ? (
        <Text style={[styles.hint, { color: colors.textMuted }]}>{t('studio.chatNoSchema')}</Text>
      ) : (
        <>
          <ScrollView style={[styles.history, { borderColor: colors.border }]}>
            {history.length === 0 ? (
              <Text style={[styles.hint, { color: colors.textMuted }]}>{t('studio.chatNoSchema')}</Text>
            ) : (
              history.map((entry) => (
                <View
                  key={entry.id}
                  style={[
                    styles.bubbleWrap,
                    entry.role === 'user' ? styles.bubbleRight : styles.bubbleLeft,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor:
                          entry.role === 'user' ? colors.primary : colors.surfaceAlt,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {entry.role === 'user' ? (
                      <Text style={[styles.bubbleText, { color: colors.onPrimary }]}>{entry.content}</Text>
                    ) : (
                      <View style={styles.assistantRow}>
                        <Ionicons name="sparkles" size={13} color={colors.primary} />
                        <Text style={[styles.assistantText, { color: colors.text }]}>
                          {entry.schema ? t('studio.schemaUpdated') : t('studio.schemaGenerated')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <TextInput
            mode="outlined"
            value={chat}
            onChangeText={setChat}
            placeholder={t('studio.chatPlaceholder')}
            multiline
            style={styles.input}
          />
          <View style={styles.actions}>
            <View style={{ flex: 1 }} />
            <Button
              mode="contained"
              onPress={send}
              disabled={!chat.trim() || refining}
              loading={refining}
              compact
            >
              {refining ? t('studio.refining') : t('studio.send')}
            </Button>
          </View>
          {refining ? <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} /> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 14,
    lineHeight: 19,
  },
  history: {
    maxHeight: 220,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  bubbleWrap: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  assistantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assistantText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginTop: 8,
  },
});
