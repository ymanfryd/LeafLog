import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Locale from 'react-native-localize';
import en from './locales/en.json';
import ru from './locales/ru.json';
import {storage} from '@/storage/mmkv';

let initialLanguage = storage.getString('locale');
if (!initialLanguage) {
  initialLanguage = Locale.getLocales()[0]?.languageCode || 'en';
  storage.set('locale', initialLanguage);
}

i18n.use(initReactI18next).init({
  resources: {en: {translation: en}, ru: {translation: ru}},
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  compatibilityJSON: 'v4',
});

export default i18n;
