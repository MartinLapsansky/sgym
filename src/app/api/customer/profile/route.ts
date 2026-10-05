import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Meno je povinné").max(120),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const result = UpdateProfileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Neplatné údaje" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: result.data.name },
      select: { id: true, name: true },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (e) {
    console.error("Failed to update profile:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
