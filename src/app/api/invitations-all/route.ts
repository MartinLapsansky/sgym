import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: NextRequest) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (
        session.user.role !== Role.COACH &&
        session.user.role !== Role.SUPERADMIN &&
        session.user.role !== Role.ADMIN
    ) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;

    const { emails } = (await req.json()) as { emails?: string[] };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return NextResponse.json(
            { message: "Emails array is required" },
            { status: 400 }
        );
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const invitations = emails.map((email) => ({
            email,
            token: randomUUID(),
            expiresAt,
            createdById: userId,
            role: Role.CUSTOMER,
        }));

        await prisma.invitation.createMany({
            data: invitations,
        });




    // 2️⃣ odoslanie emailov
    await Promise.all(
        invitations.map((invite) =>
            resend.emails.send({
                from: "S-GYM <no-reply@s-gym.sk>",
                to: invite.email,
                subject: "Pozvánka do S-GYM",
                html: `
          <h2>Si pozvaný do S-GYM</h2>
          <p>Klikni na link pre dokončenie registrácie:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/register?token=${invite.token}">
            Prijať pozvánku
          </a>
        `,
            })
        )
    );

    return NextResponse.json({
        message: "Pozvánky boli úspešne odoslané.",
        count: invitations.length,
    });
}