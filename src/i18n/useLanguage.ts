import {useTranslation} from 'react-i18next';
import {storage} from '@/storage/mmkv';

export type Language = {code: string; label: string};

const languages: readonly Language[] = [
  {code: 'en', label: 'English'},
  {code: 'ru', label: 'Русский'},
] as const;

export function useLanguage() {
  const {i18n} = useTranslation();

  const setLanguage = (code: string) => {
    if (!languages.some(l => l.code === code)) {
      throw new Error(`Locale <${code}> is not supported`);
    }
    i18n.changeLanguage(code);
    storage.set('locale', code);
  };

  return {
    language: i18n.language,
    languages,
    setLanguage,
  };
}
