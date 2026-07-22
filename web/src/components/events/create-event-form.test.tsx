import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn(), replace: vi.fn() }),
}));
vi.mock("@/lib/api", () => ({
  internalApi: { post },
  getApiErrorMessage: (error: { message?: string }, fallback?: string) =>
    error?.message ?? fallback ?? "erro",
}));

import { CreateEventForm } from "./create-event-form";

describe("Cadastro de evento", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria o evento com data futura e redireciona para o detalhe", async () => {
    post.mockResolvedValue({ data: { id: 10 } });
    render(<CreateEventForm />);

    await userEvent.type(screen.getByLabelText("Nome"), "Tech Conf");
    fireEvent.change(screen.getByLabelText("Data e hora"), {
      target: { value: "2031-12-01T10:00" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Criar evento" }));

    await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
    const [url, payload] = post.mock.calls[0];
    expect(url).toBe("/api/events");
    expect(payload.name).toBe("Tech Conf");
    expect(payload.date).toBe(new Date("2031-12-01T10:00").toISOString());
    expect(push).toHaveBeenCalledWith("/events/10");
  });

  it("bloqueia o envio quando a data está no passado", async () => {
    render(<CreateEventForm />);

    await userEvent.type(screen.getByLabelText("Nome"), "Evento antigo");
    fireEvent.change(screen.getByLabelText("Data e hora"), {
      target: { value: "2000-01-01T10:00" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Criar evento" }));

    expect(
      await screen.findByText("A data deve ser futura"),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });
});
