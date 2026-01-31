import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import 'dotenv/config'

async function main(){
    const email = "ytbtelkac2@gmail.com"
    const password = "martin123"
    const coachName = "Šimon"

    const coachUser = await prisma.user.upsert({
        where: { email },
        update: { role: Role.COACH, name: coachName },
        create: {
            email,
            password: await bcrypt.hash(password, 10),
            role: Role.COACH,
            name: coachName,
        },
    });

    // 2) Ensure Barber row linked by userId
    // - najprv skús nájsť podľa userId (jednoznačné)
    let coach = await prisma.coach.findFirst({
        where: { userId: coachUser.id },
    });

    if (!coach) {
        // ak nie je, vytvor
        coach = await prisma.coach.create({
            data: {
                name: coachName,
                userId: coachUser.id, // musí byť UUID z user.id
            },
        });
    } else {
        // voliteľne zosynchronizuj meno
        if (coach.name !== coachName) {
            coach = await prisma.coach.update({
                where: { id: coach.id },
                data: { name: coachName },
            });
        }
    }

    console.log("Coach linked:", {
        userEmail: coachUser.email,
        userId: coachUser.id,
        coachId: coach.id,
        coachName: coach.name,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });