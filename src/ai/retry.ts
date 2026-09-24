export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    baseDelayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {},
): Promise<T> {
  const {
    attempts = 3,
    baseDelayMs = 1000,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const isLastAttempt = attempt === attempts - 1;
      if (isLastAttempt || !shouldRetry(e)) throw e;

      onRetry?.(attempt + 1, e); // сообщаем что будет попытка attempt+1

      const delayMs = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

function defaultShouldRetry(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  // Retry on 5xx server errors and rate limits
  return (
    message.includes('503') ||
    message.includes('502') ||
    message.includes('504') ||
    message.includes('429') ||
    message.includes('unavailable') ||
    message.includes('timeout') ||
    message.includes('network')
  );
}
