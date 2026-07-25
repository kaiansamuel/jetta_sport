import { prisma } from "./prisma";
import { auth } from "@/auth";
import type { Prisma } from "@/generated/prisma/client";

export async function logAdminAction(
  action: "create" | "update" | "delete" | "status_change",
  entityType: string,
  entityId: string,
  metadata?: Prisma.InputJsonValue,
) {
  try {
    const session = await auth();
    const adminUser = session?.user?.email
      ? await prisma.adminUser.findUnique({ where: { email: session.user.email } })
      : null;

    if (!adminUser) return;

    await prisma.adminActionLog.create({
      data: { adminUserId: adminUser.id, action, entityType, entityId, metadata },
    });
  } catch (error) {
    // The audit log must never break the mutation it's observing.
    console.error("Failed to log admin action", error);
  }
}
