import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, push: vi.fn(), replace: vi.fn() }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/lib/api", () => ({
  internalApi: { request },
  getApiErrorMessage: (error: { message?: string }, fallback?: string) =>
    error?.message ?? fallback ?? "erro",
}));

import { RegistrationButton } from "./registration-button";

describe("Inscrição em evento", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inscreve o participante autenticado no evento", async () => {
    request.mockResolvedValue({});
    render(
      <RegistrationButton eventId={1} isRegistered={false} isAuthenticated />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Inscrever-se" }));

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        url: "/api/events/1/registration",
        method: "POST",
      }),
    );
    expect(refresh).toHaveBeenCalled();
  });

  it("mostra o link de login quando não autenticado", () => {
    render(
      <RegistrationButton
        eventId={1}
        isRegistered={false}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("Entre para se inscrever")).toBeInTheDocument();
    expect(request).not.toHaveBeenCalled();
  });

  it("bloqueia inscrição duplicada exibindo o erro da API", async () => {
    request.mockRejectedValue({
      message: "Você já está inscrito neste evento",
    });
    render(
      <RegistrationButton eventId={1} isRegistered={false} isAuthenticated />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Inscrever-se" }));

    expect(
      await screen.findByText("Você já está inscrito neste evento"),
    ).toBeInTheDocument();
    expect(refresh).not.toHaveBeenCalled();
  });
});
