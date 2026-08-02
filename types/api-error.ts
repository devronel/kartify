export type ValidationErrorResponse = {
  message: string;
  errors: Record<string, string>;
  timestamp: string;
  status: 422;
}