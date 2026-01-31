// src/app/api/barbers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const coaches = await prisma.coach.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });
    return NextResponse.json({ coaches });
}