import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: NextRequest) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== Role.COACH && session.user.role !== Role.SUPERADMIN && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { email } = (await req.json()) as { email?: string };
  if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.invitation.create({
    data: {
      token,
      email,
      expiresAt,
      createdById: session.user.id,
      role: Role.COACH,
    },
  });

    await resend.emails.send({
        from: "S-GYM <no-reply@s-gym.sk>",
        to: email,
        subject: "Pozvánka do S-GYM",
        html: `
      <h2>Ahoj, bol si pozvaný do S-GYM na vytvorenie objednávky.</h2>
          <p>Klikni na tento link pre dokončenie registrácie:</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/register-coach/?token=${token}">
        Prijať pozvánku
      </a>
    `,
    });

  return NextResponse.json({ message: "Pozvánka odoslaná.", success: "true"});
}