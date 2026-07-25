"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_OPTIONS } from "@/lib/constants/orderStatus";
import type { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "@/app/admin/(protected)/pedidos/actions";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: OrderStatus) => {
    setValue(next);
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      router.refresh();
    });
  };

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="h-10 rounded-lg border border-jetta-metal/30 bg-jetta-graphite px-3 text-sm text-jetta-ice"
    >
      {ORDER_STATUS_OPTIONS.map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
