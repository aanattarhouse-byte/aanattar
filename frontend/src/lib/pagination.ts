const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPaginationOptions(searchParams: URLSearchParams, defaults: { defaultLimit?: number; maxLimit?: number } = {}) {
  const defaultLimit = defaults.defaultLimit || DEFAULT_LIMIT;
  const maxLimit = defaults.maxLimit || MAX_LIMIT;
  const page = toPositiveInt(searchParams.get('page'), 1);
  const requestedLimit = toPositiveInt(searchParams.get('limit'), defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

export function getPaginationMeta(total: number, pagination: { page: number; limit: number }) {
  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    pages: Math.ceil(total / pagination.limit)
  };
}
