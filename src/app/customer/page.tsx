import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/LogoutButton";
import { CustomerActions } from "./CustomerActions";
import { ProfileButton } from "./ProfileButton";

export default async function CustomerHome() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fcustomer");
  }

  const canCreateReservation = session.user.canCreateReservation !== false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 mt-35">
      <div className="flex flex-row items-center justify-between w-full mb-5">
        <h1 className="flex text-2xl font-semibold mb-6">Ahoj, {user?.name ?? "Vitaj"}</h1>
        <div className="flex items-center gap-3">
          <ProfileButton initialName={user?.name ?? ""} />
          <LogoutButton callbackUrl="/auth/signin" />
        </div>
      </div>

      <CustomerActions canCreateReservation={canCreateReservation} />
    </div>
  );
}
