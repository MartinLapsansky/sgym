// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (!token) return false;
            const role = token.role;
            return ["SUPERADMIN", "ADMIN", "COACH"].includes(role);
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
});

export const config = {
    matcher: ["/admin/:path*"],
};