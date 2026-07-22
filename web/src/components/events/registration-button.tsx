"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button } from "@/components/ui";
import { getApiErrorMessage, internalApi } from "@/lib/api";

interface RegistrationButtonProps {
  eventId: number;
  isRegistered: boolean;
  isAuthenticated: boolean;
}

export function RegistrationButton({
  eventId,
  isRegistered,
  isAuthenticated,
}: RegistrationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <Link href={`/login?from=/events/${eventId}`}>
        <Button className="w-full">Entre para se inscrever</Button>
      </Link>
    );
  }

  async function toggle() {
    setError(null);
    setLoading(true);
    try {
      await internalApi.request({
        url: `/api/events/${eventId}/registration`,
        method: isRegistered ? "DELETE" : "POST",
      });
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível concluir a ação."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <Alert>{error}</Alert>}
      <Button
        variant={isRegistered ? "secondary" : "primary"}
        loading={loading}
        onClick={toggle}
        className="w-full"
      >
        {isRegistered ? "Cancelar inscrição" : "Inscrever-se"}
      </Button>
    </div>
  );
}
