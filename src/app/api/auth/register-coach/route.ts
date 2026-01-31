import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ message: "Missing token" }, { status: 400 });

    const invitation = await prisma.invitation.findUnique({ where: { token } });

    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
        return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, email: invitation.email });
}

export async function POST(req: NextRequest) {
    const body = (await req.json()) as { token?: string; password?: string; name?: string };

    if (!body.token || !body.password) {
        return NextResponse.json({ message: "Missing token or password" }, { status: 400 });
    }

    if (body.password.length < 8){
        return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { token: body.token } });
    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(body.password, 12);

    await prisma.$transaction([
        prisma.user.create({
            data: {
                email: invitation.email,
                password: hashed,
                name: body.name,
                role: Role.COACH,
            },
        }),
        prisma.invitation.update({
            where: { token: body.token },
            data: { used: true },
        }),
    ]);

    return NextResponse.json({ message: "Registered" });
}