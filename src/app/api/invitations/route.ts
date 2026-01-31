import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
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
    data: { token, email, expiresAt, createdById: session.user.id },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Pozvánka na registráciu - S-gym",
    text: `Kliknite na tento link pre registráciu: ${process.env.NEXT_PUBLIC_SITE_URL}/auth/register?token=${token}`,
  });

  return NextResponse.json({ message: "Pozvánka odoslaná." });
}