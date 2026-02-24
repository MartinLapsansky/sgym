import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main(){
    const email = "matejkonak@gmail.com"
    const password = "Pina1234"

    if (!email || !password) {
        throw new Error("SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD environment variables must be set")
    }

    const existing = await prisma.user.findUnique({where: {email}});

    if (existing){
        return
    }
    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashed,
            role: Role.CUSTOMER,
            name: "Matej",
            resetToken: null,
            resetTokenExpires: null
        }
    })
}

main().finally(async () => {
  await prisma.$disconnect();
});