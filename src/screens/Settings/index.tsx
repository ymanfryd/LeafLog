import {useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ScreenLayout from '@/ui/ScreenLayout';
import Button from '@/ui/Button';
import {askQuestion} from '@/ai/askQuestion';
import {colors, radius, spacing} from '@/theme';
import {useTranslation} from 'react-i18next';

function Settings() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();

  const onAsk = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setAnswer('');
    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title={t('settings.title')}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <Text style={styles.label}>{t('settings.askLabel')}</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder={t('settings.askPlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Button
          text={t('settings.askButton')}
          onPress={onAsk}
          loading={loading}
          disabled={!question.trim() || loading}
        />
        {error && (
          <Text style={styles.error}>
            {t('common.error')}: {error}
          </Text>
        )}
        {answer && (
          <View style={styles.answerBox}>
            <Text style={styles.answer}>{answer}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  answerBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  answer: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
