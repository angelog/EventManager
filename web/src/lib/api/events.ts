import type { AxiosRequestConfig } from "axios";
import type {
  CreateEventPayload,
  Event,
  EventDetail,
  EventListItem,
  ListQuery,
  Paginated,
  UpdateEventPayload,
} from "@/types";
import { api } from "./client";

export const eventsApi = {
  list(params: ListQuery = {}) {
    return api
      .get<Paginated<EventListItem>>("/events", { params })
      .then((res) => res.data);
  },

  getById(id: number) {
    return api.get<EventDetail>(`/events/${id}`).then((res) => res.data);
  },

  create(payload: CreateEventPayload, config?: AxiosRequestConfig) {
    return api.post<Event>("/events", payload, config).then((res) => res.data);
  },

  update(id: number, payload: UpdateEventPayload, config?: AxiosRequestConfig) {
    return api
      .put<Event>(`/events/${id}`, payload, config)
      .then((res) => res.data);
  },

  remove(id: number, config?: AxiosRequestConfig) {
    return api.delete<void>(`/events/${id}`, config).then((res) => res.data);
  },
};
