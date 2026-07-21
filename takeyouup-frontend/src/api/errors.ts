/**
 * Turns an axios error into something worth showing a user.
 *
 * The API answers validation failures with a generic
 * `{ message: "Validation failed", fieldErrors: { password: "..." } }`, so
 * reading `message` alone loses the only useful part. Prefer the field errors.
 */

export interface FieldErrors {
  [field: string]: string;
}

/** Per-field messages from a 400, for rendering under the inputs. */
export function fieldErrorsOf(error: any): FieldErrors {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};

  if (data.fieldErrors && typeof data.fieldErrors === "object") {
    return data.fieldErrors as FieldErrors;
  }

  // Older endpoints answer with a bare { field: message } object.
  const envelope = ["timestamp", "status", "error", "message", "path"];
  const entries = Object.entries(data).filter(
    ([k, v]) => !envelope.includes(k) && typeof v === "string"
  );
  return Object.fromEntries(entries) as FieldErrors;
}

/** One human-readable sentence, whatever shape the failure arrived in. */
export function apiErrorMessage(error: any, fallback = "Something went wrong"): string {
  const fields = Object.values(fieldErrorsOf(error));
  if (fields.length) {
    return fields.join(" ");
  }

  const message = error?.response?.data?.message;
  if (typeof message === "string" && message && message !== "Validation failed") {
    return message;
  }

  if (typeof error?.message === "string" && error.message && error.message !== "Network Error") {
    return error.message;
  }
  return fallback;
}
