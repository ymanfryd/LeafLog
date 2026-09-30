export class QuotaExceededError extends Error {
  readonly retryAfterSeconds: number | null;

  constructor(retryAfterSeconds: number | null) {
    super('Daily quota exceeded');
    this.name = 'QuotaExceededError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number | null;

  constructor(retryAfterSeconds: number | null) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type GeminiErrorShape = {
  error?: {
    code?: number;
    status?: string;
    details?: Array<{
      '@type'?: string;
      violations?: Array<{quotaId?: string}>;
      retryDelay?: string;
    }>;
  };
};

function extractJson(message: string): GeminiErrorShape | null {
  const start = message.indexOf('{');
  const end = message.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(message.slice(start, end + 1));
  } catch {
    return null;
  }
}

type ErrorDetails = NonNullable<NonNullable<GeminiErrorShape['error']>['details']>;

function parseRetryDelay(details: ErrorDetails | undefined): number | null {
  if (!Array.isArray(details)) return null;
  for (const d of details) {
    if (typeof d?.retryDelay === 'string') {
      const match = d.retryDelay.match(/^(\d+(?:\.\d+)?)s$/);
      if (match) return Math.ceil(parseFloat(match[1]!));
    }
  }
  return null;
}

export function classifyGeminiError(error: unknown): Error {
  if (!(error instanceof Error)) return new Error(String(error));
  const parsed = extractJson(error.message);
  const inner = parsed?.error;
  if (inner?.code !== 429 && inner?.status !== 'RESOURCE_EXHAUSTED') {
    return error;
  }
  const details = inner.details;
  const retryAfter = parseRetryDelay(details);
  const isDailyQuota = Array.isArray(details)
    ? details.some(d =>
        d?.violations?.some(v =>
          typeof v?.quotaId === 'string' && /PerDay|FreeTier/i.test(v.quotaId),
        ),
      )
    : false;
  return isDailyQuota
    ? new QuotaExceededError(retryAfter)
    : new RateLimitError(retryAfter);
}
