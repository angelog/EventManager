import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/lib/api", () => ({
  internalApi: { post },
  getApiErrorMessage: (error: { message?: string }, fallback?: string) =>
    error?.message ?? fallback ?? "erro",
}));

import RegisterPage from "./page";

describe("Cadastro de participante", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cadastra com dados válidos e redireciona para /events", async () => {
    post.mockResolvedValue({ data: { participant: { id: 1, name: "Ana" } } });
    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText("Nome"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "ana@email.com");
    await userEvent.type(screen.getByLabelText("Telefone"), "41999990000");
    await userEvent.type(screen.getByLabelText("Senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith("/api/auth/register", {
        name: "Ana",
        email: "ana@email.com",
        phone: "41999990000",
        password: "senha123",
      }),
    );
    expect(push).toHaveBeenCalledWith("/events");
  });

  it("bloqueia o envio quando o email é inválido", async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText("Nome"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "email-invalido");
    await userEvent.type(screen.getByLabelText("Telefone"), "41999990000");
    await userEvent.type(screen.getByLabelText("Senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });
});
