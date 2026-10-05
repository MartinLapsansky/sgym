import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateOrderClient from "./CreateOrderClient";

export default async function CreateOrderPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fcustomer%2Fcreate-order");
  }

  if (session.user.canCreateReservation === false) {
    redirect("/customer");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return <CreateOrderClient defaultFullName={user?.name ?? ""} />;
}
