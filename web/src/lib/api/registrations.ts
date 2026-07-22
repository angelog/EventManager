import type { AxiosRequestConfig } from "axios";
import type { Participant, Registration } from "@/types";
import { api } from "./client";

export const registrationsApi = {
  register(eventId: number, config?: AxiosRequestConfig) {
    return api
      .post<Registration>(`/events/${eventId}/participants`, undefined, config)
      .then((res) => res.data);
  },

  listParticipants(eventId: number) {
    return api
      .get<Participant[]>(`/events/${eventId}/participants`)
      .then((res) => res.data);
  },

  cancel(eventId: number, participantId: number, config?: AxiosRequestConfig) {
    return api
      .delete<void>(`/events/${eventId}/participants/${participantId}`, config)
      .then((res) => res.data);
  },
};
