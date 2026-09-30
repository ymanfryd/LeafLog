import type {TFunction} from 'i18next';
import {QuotaExceededError, RateLimitError} from './errors';

export function analyzeErrorMessage(t: TFunction, error: unknown): string {
  if (error instanceof QuotaExceededError) {
    return t('analysis.errors.quotaExceeded');
  }
  if (error instanceof RateLimitError) {
    return error.retryAfterSeconds !== null
      ? t('analysis.errors.rateLimited', {seconds: error.retryAfterSeconds})
      : t('analysis.errors.rateLimitedShort');
  }
  return t('analysis.errors.generic');
}
