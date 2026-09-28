import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  useNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenLayout from '@/ui/ScreenLayout';
import {colors, radius, spacing} from '@/theme';
import {useTranslation} from 'react-i18next';
import {useLanguage} from '@/i18n/useLanguage';
import {SettingsStack} from '@/navigation/SettingsStack';

type SettingsStackParams = StaticParamList<typeof SettingsStack>;

function Settings() {
  const {t} = useTranslation();
  const {language, languages} = useLanguage();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParams>>();

  const currentLanguageLabel =
    languages.find(l => l.code === language)?.label ?? language;

  return (
    <ScreenLayout title={t('settings.title')}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => navigation.navigate('LanguagePicker')}>
          <Text style={styles.rowLabel}>{t('settings.language')}</Text>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{currentLanguageLabel}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 16,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: 15,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 20,
  },
});
