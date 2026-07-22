import type { AxiosRequestConfig } from "axios";
import type {
  AuthResponse,
  LoginPayload,
  Participant,
  RegisterPayload,
} from "@/types";
import { api } from "./client";

export const authApi = {
  register(payload: RegisterPayload) {
    return api
      .post<AuthResponse>("/auth/register", payload)
      .then((res) => res.data);
  },

  login(payload: LoginPayload) {
    return api
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => res.data);
  },

  // Requer Authorization (usado server-side com o token do cookie).
  me(config?: AxiosRequestConfig) {
    return api.get<Participant>("/auth/me", config).then((res) => res.data);
  },
};
