import { isAxiosError } from "axios";

interface ErrorResponse {
  message?: string | string[];
}

export function errorMessage(error: unknown) {
  if (isAxiosError<ErrorResponse>(error)) {
    if (!error.response || ([502, 503, 504].includes(error.response.status) ||
      (error.response.status === 500 && !error.response.data))) {
      return "Веб-сервис недоступен. Попробуйте позже.";
    }
    const message = error.response.data?.message;
    if (Array.isArray(message)) return message.join(". ");
    if (typeof message === "string") return message;
  }
  return "Не удалось выполнить запрос.";
}
