import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const token = body?.token;
        const newPassword = (body?.newPassword ?? body?.password) as string | undefined;

        if (!token) {
            return NextResponse.json({ message: "Missing token" }, { status: 400 });
        }
        if (!newPassword) {
            return NextResponse.json({ message: "Missing password" }, { status: 400 });
        }
        if (newPassword.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return NextResponse.json({ ok: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("reset-password POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}