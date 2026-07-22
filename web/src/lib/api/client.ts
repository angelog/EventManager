import axios from "axios";
import type { ApiErrorBody } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";


export const api = axios.create({ baseURL });

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado.",
): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.message) return body.message;
  }
  return fallback;
}

export function authConfig(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export function getApiError(error: unknown): {
  status: number;
  message: string;
  body?: ApiErrorBody;
} {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status ?? 500,
      message: getApiErrorMessage(error),
      body: error.response?.data as ApiErrorBody | undefined,
    };
  }
  return { status: 500, message: "Ocorreu um erro inesperado." };
}
