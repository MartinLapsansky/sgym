import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import { UsersTable } from "./UsersTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fadmin%2Fusers");
  }

  const role = session.user.role;
  const allowed = role === Role.SUPERADMIN || role === Role.ADMIN || role === Role.COACH;

  if (!allowed) {
    redirect("/customer");
  }

  return (
    <div className="mx-auto max-w-4xl p-6 mt-50 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Používatelia</h1>
        <LogoutButton callbackUrl="/auth/signin" />
      </div>

      <p className="text-sm text-gray-600">
        Prihlásený: <strong>{session.user.email}</strong> ({String(session.user.role)})
      </p>

      <p className="text-sm text-gray-600">
        Zaškrtnutím povolíš zákazníkovi vytvárať rezervácie. Odznačením mu túto
        možnosť odoberieš.
      </p>

      <UsersTable />

      <Link className="underline text-sm" href="/admin/dashboard">
        Späť na dashboard
      </Link>
    </div>
  );
}
