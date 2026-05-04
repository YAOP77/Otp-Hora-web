export type ApiErrorCode = "network" | "http" | "parse" | "validation";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  /** Code métier backend (ex. `INVALID_PIN_FORMAT`) quand présent. */
  readonly backendCode?: string;
  readonly body?: unknown;

  constructor(
    message: string,
    options: {
      code: ApiErrorCode;
      status?: number;
      backendCode?: string;
      body?: unknown;
      cause?: unknown;
    },
  ) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
    this.backendCode = options.backendCode;
    this.body = options.body;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function extractBackendError(body: unknown): {
  message?: string;
  code?: string;
  status?: number;
} {
  if (!body || typeof body !== "object") return {};
  const root = body as Record<string, unknown>;
  const err = root.error;
  if (!err || typeof err !== "object") return {};
  const e = err as Record<string, unknown>;
  return {
    message: typeof e.message === "string" ? e.message : undefined,
    code: typeof e.code === "string" ? e.code : undefined,
    status: typeof e.status === "number" ? e.status : undefined,
  };
}
