import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });
        // ... existing code ...
        // mapneme notes -> name, aby klient dostal name z notes
        const mapped = reservations.map((r) => ({
      ...r,
      name: r.notes ?? null,
    }));
    return NextResponse.json({ reservations: mapped });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { coachId, fullName, package: pkg } = body || {};

    if (!coachId) {
      return NextResponse.json({ message: "Chýba coachId" }, { status: 400 });
    }
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ message: "Chýba celé meno" }, { status: 400 });
    }
    const validCategories = ["GROUP", "MINI"];

    const validPlans = ["BASIC", "STANDARD", "FULL", "FULL_PLUS"];
    if (!pkg || !validCategories.includes(pkg.category) || !validPlans.includes(pkg.plan)) {
      return NextResponse.json({ message: "Neplatný balíček" }, { status: 400 });
    }

    const services: string[] = [`${pkg.category}:${pkg.plan}`];

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id as string,
        coachId,
        services,
        notes: fullName,
        status: "pending",
      },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
  }
}