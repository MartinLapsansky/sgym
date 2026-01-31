import Link from "next/link";
import {redirect} from "next/navigation";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";


export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fadmin%2Fdashboard");
  }

  const role = session.user.role;
  const allowed = role === Role.SUPERADMIN || role === Role.ADMIN || role === Role.COACH;

  if (!allowed) {
    redirect("/customer");
  }

  return (
    <div className="flex flex-col justify-center p-6 w-full mt-50 space-y-4">
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold text-center pb-4">Admin dashboard</h1>

            <div className="rounded border p-6 mb-6 bg-white">
                <p className="text-sm text-gray-600">Prihlásený ako:</p>
                <p>
                    <strong>Email:</strong> {session.user.email}
                </p>
                <p>
                    <strong>Rola:</strong> {String(session.user.role)}
                </p>
                <p>
                    <strong>User ID:</strong> {session.user.id}
                </p>
            </div>

            <div className="flex gap-3 justify-center">
                <Link
                    href="/admin/invitations"
                    className="px-4 py-2 rounded bg-[var(--highlight)] text-black font-semibold"
                >
                    Pozvať zákazníka
                </Link>

                <Link
                    href="/admin/invitations-coach"
                    className="px-4 py-2 rounded bg-[var(--highlight)] text-black font-semibold"
                >
                    Pozvať trénera
                </Link>



                <div className="space-y-4">
                    <Link
                        href="/admin/reservations"
                        className="inline-block px-4 py-2 border rounded font-semibold hover:bg-gray-50"
                    >
                        Zobraziť rezervácie
                    </Link>
                </div>

                <LogoutButton callbackUrl="/auth/signin" />


            </div>


        </div>

    </div>
  );
}