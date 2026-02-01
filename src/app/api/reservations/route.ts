import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// export async function GET() {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//         return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
//     }
//
//     try {
//         const reservations = await prisma.reservation.findMany({
//             orderBy: { createdAt: "desc" },
//             include: { user: { select: { name: true, email: true } } },
//         });
//         // ... existing code ...
//         // mapneme notes -> name, aby klient dostal name z notes
//         const mapped = reservations.map((r) => ({
//       ...r,
//       name: r.notes ?? null,
//     }));
//     return NextResponse.json({ reservations: mapped });
//   } catch (e: any) {
//     return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
//     }
// }

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

    const validCategories = [
      "GROUP",
      "MINI",
      "MINI_ONE_CLIENT",
      "INDIVIDUAL_DUO",
      "INDIVIDUAL_SINGLE",
    ] as const;
    const validPlans = ["BASIC", "STANDARD", "FULL", "FULL_PLUS"] as const;

    // FULL_PLUS povoľ len pre MINI (Ut/Št)
    const isValid =
      pkg &&
      typeof pkg.category === "string" &&
      typeof pkg.plan === "string" &&
      (validCategories as readonly string[]).includes(pkg.category) &&
      (validPlans as readonly string[]).includes(pkg.plan) &&
      (pkg.category !== "MINI" ? pkg.plan !== "FULL_PLUS" : true);

    if (!isValid) {
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
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") || "";
        const plan = searchParams.get("plan") || "";

        const target =
            category && plan
                ? `${category}:${plan}`
                : category
                    ? `${category}:`
                    : plan
                        ? `:${plan}`
                        : "";

        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: "desc" },
        });

        const normalize = (v: unknown) =>
            String(v || "")
                .replace(/[{}]/g, "") // odstráni { }
                .replace(/\s+/g, "")  // odstráni medzery
                .toUpperCase();       // pre istotu porovnávaj case-insensitive

        const filtered = target
            ? reservations.filter((r: any) => {
                const s = normalize(r.services);
                return s.includes(target.replace(/\s+/g, "").toUpperCase());
            })
            : reservations;

        return NextResponse.json({ reservations: filtered }, { status: 200 });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}