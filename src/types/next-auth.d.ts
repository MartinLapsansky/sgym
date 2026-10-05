import "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string;
            role?: Role;
            canCreateReservation?: boolean;
            name?: string | null;
            email?: string | null;
        };
    }

    interface User {
        id: string,
        role: Role,
        canCreateReservation: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        role: Role,
        canCreateReservation: boolean
    }
}
