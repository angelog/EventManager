"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Modal } from "@/components/ui";
import { getApiErrorMessage, internalApi } from "@/lib/api";

interface DeleteEventButtonProps {
  eventId: number;
}

export function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setError(null);
    setLoading(true);
    try {
      await internalApi.delete(`/api/events/${eventId}`);
      router.push("/events");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível excluir o evento."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Excluir
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Excluir evento">
        {error && <Alert className="mb-3">{error}</Alert>}
        <p className="text-sm text-text-body">
          Tem certeza que deseja excluir este evento? Esta ação não pode ser
          desfeita.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Voltar
          </Button>
          <Button variant="danger" loading={loading} onClick={confirm}>
            Excluir
          </Button>
        </div>
      </Modal>
    </>
  );
}
