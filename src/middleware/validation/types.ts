export type sanitized = string | number | boolean;

export enum PartOfRequest {
  Headers = "headers",
  Body = "body",
  Params = "params",
  Query = "query",
}

export interface ValidationCheck {
  in: PartOfRequest;
  name: string;
  check: (value: string) => boolean;
  sanitize?: (value: string) => sanitized;
  message?: string;
  hint?: string;
}

export interface ValidationResult {
  value: sanitized;
  error: string | null;
}
