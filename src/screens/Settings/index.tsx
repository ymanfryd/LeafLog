import {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import ScreenLayout from '@/ui/ScreenLayout';
import Button from '@/ui/Button';
import {askQuestion} from '@/ai/askQuestion';
import {colors, radius, spacing} from '@/theme';

function Settings() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAsk = async () => {
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
    <ScreenLayout title="Settings">
      <View style={styles.container}>
        <Text style={styles.label}>Ask AI about plants</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Why are my ficus leaves yellow?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Button
          text="Ask"
          onPress={onAsk}
          loading={loading}
          disabled={!question.trim() || loading}
        />
        {error && <Text style={styles.error}>Error: {error}</Text>}
        {answer && <Text style={styles.answer}>{answer}</Text>}
      </View>
    </ScreenLayout>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
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
  answer: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
