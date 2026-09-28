import {useTranslation} from 'react-i18next';
import {pluralCategory} from './plural';

export function usePlural() {
  const {t, i18n} = useTranslation();

  return (
    key: string,
    count: number,
    values?: Record<string, unknown>,
  ): string => {
    const category = pluralCategory(count, i18n.language);
    return t(`${key}_${category}`, {count, ...values});
  };
}
