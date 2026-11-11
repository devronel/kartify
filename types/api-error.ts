export type ValidationErrorResponse = {
  message: string;
  errors: Record<string, string>;
  timestamp: string;
  status: 422;
}

export type ApiError = {
  error?: string
  message: string,
}