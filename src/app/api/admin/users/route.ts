import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES: Role[] = [Role.SUPERADMIN, Role.ADMIN, Role.COACH];

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  canCreateReservation: z.boolean(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canCreateReservation: true,
        createdAt: true,
        reservations: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
    });

    const usersWithLastReservation = users.map(({ reservations, ...user }) => ({
      ...user,
      lastReservationAt: reservations[0]?.createdAt ?? null,
    }));

    return NextResponse.json({ users: usersWithLastReservation }, { status: 200 });
  } catch (e) {
    console.error("Failed to load users:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const result = UpdateUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
  }

  const { userId, canCreateReservation } = result.data;

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!target) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (target.role !== Role.CUSTOMER) {
      return NextResponse.json(
        { message: "Only customer accounts can be updated" },
        { status: 403 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { canCreateReservation },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canCreateReservation: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (e) {
    console.error("Failed to update user:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
