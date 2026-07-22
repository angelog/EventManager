"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui";

interface EventsPaginationProps {
  page: number;
  totalPages: number;
}

export function EventsPagination({ page, totalPages }: EventsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onPageChange(next: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(next));
    router.push(`/events?${params}`);
  }

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
