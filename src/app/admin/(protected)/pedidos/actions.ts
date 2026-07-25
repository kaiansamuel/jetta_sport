"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { logAdminAction } from "@/lib/db/adminLog";
import type { OrderStatus } from "@/generated/prisma/client";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await prisma.order.update({ where: { id }, data: { status } });
  await logAdminAction("status_change", "Order", id, { status });
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
  return { success: true };
}
