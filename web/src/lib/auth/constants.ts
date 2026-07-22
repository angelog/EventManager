// Nome do cookie que guarda o JWT (lido pelo proxy.ts e pelos Route Handlers).
export const TOKEN_COOKIE = "token";

// Validade do cookie de sessão (7 dias, em segundos).
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
