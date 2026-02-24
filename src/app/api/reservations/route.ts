import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {Resend} from "resend";

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

      const userEmail = session.user.email as string | undefined;
      if (userEmail) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const from = "no-reply@s-gym.sk";

          const subject = "Potvrdenie prijatia rezervácie";
          const serviceLabel = `${pkg.category} - ${pkg.plan}`;
          const html = `
        <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111827">
          <h2 style="margin:0 0 12px">Ahoj ${fullName},</h2>
          <p>tvoju rezerváciu sme úspešne prijali.</p>
          <p><strong>Balík:</strong> ${serviceLabel}</p>
          <p>ID rezervácie: <code>${reservation.id}</code></p>
          <p>O ďalších krokoch ťa budeme čoskoro informovať.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="font-size:12px;color:#6b7280">Tento email má len informačný charakter, prosím neodpovedaj na neho.</p>
          <p>S pozdravom, tím S-gym :)</p>

        </div>
      `;

          try {
              await resend.emails.send({
                  from,
                  to: userEmail,
                  subject,
                  html,
              });
          } catch (mailErr) {
              // Log only; do not fail the request because of email issues
              console.error("Failed to send reservation confirmation email:", mailErr);
          }
      }

      return NextResponse.json({ reservation }, { status: 201 });

  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}




export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const scope = searchParams.get("scope");

        if (scope === "me") {
            if (!session?.user?.id) {
                return NextResponse.json({ message: "Neautorizované" }, { status: 401 });
            }
            const reservations = await prisma.reservation.findMany({
                where: { userId: session.user.id as string },
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json({ reservations }, { status: 200 });
        }

        const category = searchParams.get("category") || "";
        const plan = searchParams.get("plan") || "";
        const name = (searchParams.get("name") || "").trim();
        const from = searchParams.get("from"); // ISO date (YYYY-MM-DD)
        const month = searchParams.get("month"); // YYYY-MM

        const where: any = {};

        if (name) {
            where.notes = { contains: name, mode: "insensitive" };
        }

        // Date filters
        if (from) {
            const fromDate = new Date(from);
            if (!isNaN(fromDate.getTime())) {
                where.createdAt = { ...(where.createdAt ?? {}), gte: fromDate };
            }
        } else if (month) {
            // month in format YYYY-MM -> range [YYYY-MM-01, next month)
            const [y, m] = month.split("-").map((v) => parseInt(v, 10));
            if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
                const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
                const end = new Date(y, m, 1, 0, 0, 0, 0);
                where.createdAt = { gte: start, lt: end };
            }
        }
        const reservations = await prisma.reservation.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        const normalize = (v: unknown) =>
            String(v || "")
                .replace(/[{}]/g, "")
                .replace(/\s+/g, "")
                .toUpperCase();

        const target =
            category && plan
                ? `${category}:${plan}`
                : category
                    ? `${category}:`
                    : plan
                        ? `:${plan}`
                        : "";

        const filtered =
            target
                ? reservations.filter((r: any) => {
                    const s = normalize(r.services);
                    return s.includes(target);
                })
                : reservations;

        return NextResponse.json({ reservations: filtered }, { status: 200 });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Server error";
        return NextResponse.json({ message }, { status: 500 });
    }

}