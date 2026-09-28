import {FlatList, Pressable, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '@/ui/ScreenLayout';
import CloseButton from '@/ui/CloseButton';
import {useLanguage, type Language} from '@/i18n/useLanguage';
import {colors, radius, spacing} from '@/theme';

function LanguagePicker() {
  const {t} = useTranslation();
  const {language, languages, setLanguage} = useLanguage();
  const navigation = useNavigation();

  const onSelect = (code: string) => {
    setLanguage(code);
    navigation.goBack();
  };

  const renderItem = ({item}: {item: (typeof languages)[number]}) => {
    const isActive = item.code === language;
    return (
      <Pressable
        style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
        onPress={() => onSelect(item.code)}>
        <Text style={styles.label}>{item.label}</Text>
        {isActive && <Text style={styles.check}>✓</Text>}
      </Pressable>
    );
  };

  return (
    <ScreenLayout
      title={t('settings.language')}
      rightSlot={<CloseButton onPress={navigation.goBack} />}>
      <FlatList
        data={languages as readonly Language[]}
        keyExtractor={item => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ScreenLayout>
  );
}

export default LanguagePicker;

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
  check: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
