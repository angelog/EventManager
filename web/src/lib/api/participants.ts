import type { AxiosRequestConfig } from "axios";
import type {
  ListQuery,
  Paginated,
  Participant,
  UpdateParticipantPayload,
} from "@/types";
import { api } from "./client";

export const participantsApi = {
  list(params: ListQuery = {}) {
    return api
      .get<Paginated<Participant>>("/participants", { params })
      .then((res) => res.data);
  },

  getById(id: number) {
    return api.get<Participant>(`/participants/${id}`).then((res) => res.data);
  },

  // Atualiza o próprio cadastro (Authorization obrigatório).
  update(
    id: number,
    payload: UpdateParticipantPayload,
    config?: AxiosRequestConfig,
  ) {
    return api
      .put<Participant>(`/participants/${id}`, payload, config)
      .then((res) => res.data);
  },

  remove(id: number, config?: AxiosRequestConfig) {
    return api
      .delete<void>(`/participants/${id}`, config)
      .then((res) => res.data);
  },
};
