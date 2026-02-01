import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`;

    const subject = "Reset hesla - S-gym";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a">
        <h2>Obnovenie hesla</h2>
        <p>Požiadali ste o obnovu hesla pre účet: <strong>${email}</strong>.</p>
        <p>Kliknite na nasledujúci odkaz pre reset hesla. Odkaz vyprší o 1 hodinu:</p>
        <p><a href="${resetUrl}" style="background:#0ea5e9;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Resetovať heslo</a></p>
        <p>Ak ste o obnovu nepožiadali, môžete tento email ignorovať.</p>
      </div>
    `;

    const { error: sendError } = await resend.emails.send({
        from: "S-GYM <no-reply@s-gym.sk>",
      to: email,
      subject,
      html,
    });

    if (sendError) {
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Reset link sent." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}