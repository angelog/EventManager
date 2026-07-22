// Tipos do domínio — espelham o contrato da API (../api/src/docs/openapi.yaml).

export interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventListItem extends Event {
  participantsCount: number;
}

export interface EventDetail extends Event {
  createdBy: Participant;
  participants: Participant[];
  participantsCount: number;
}

export interface Registration {
  id: number;
  eventId: number;
  participantId: number;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

// Resposta de erro padronizada da API: { error, message, details? }.
export interface ApiErrorBody {
  error: string;
  message: string;
  details?: { field: string; message: string }[];
}

export interface AuthResponse {
  participant: Participant;
  token: string;
}

// Payloads das requisições.
export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateParticipantPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
}
