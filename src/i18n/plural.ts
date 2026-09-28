export type PluralCategory = 'one' | 'few' | 'many' | 'other';

export function pluralCategory(
  count: number,
  language: string,
): PluralCategory {
  if (language === 'ru') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'one';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
    return 'many';
  }
  return count === 1 ? 'one' : 'other';
}
