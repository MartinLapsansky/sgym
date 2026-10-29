import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getReservations } from "@/lib/reservations";
import ReservationsClient from "./ReservationsClient";

const ITEMS_PER_PAGE = 15;

type SearchParamValue = string | string[] | undefined;

type AdminReservationsPageProps = {
  searchParams: Promise<{
    category?: SearchParamValue;
    plan?: SearchParamValue;
    name?: SearchParamValue;
    from?: SearchParamValue;
    month?: SearchParamValue;
    page?: SearchParamValue;
  }>;
};

function getString(v: SearchParamValue): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function AdminReservationsPage({
  searchParams,
}: AdminReservationsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fadmin%2Freservations");
  }

  const role = session.user.role;
  const allowed =
    role === Role.SUPERADMIN || role === Role.ADMIN || role === Role.COACH;

  if (!allowed) {
    redirect("/customer");
  }

  const sp = await searchParams;

  const filters = {
    category: getString(sp.category),
    plan: getString(sp.plan),
    name: getString(sp.name),
    from: getString(sp.from),
    month: getString(sp.month),
  };

  const pageRaw = Number.parseInt(getString(sp.page), 10);
  const requestedPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const all = await getReservations(filters);

  const totalPages = Math.max(1, Math.ceil(all.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = all.slice(start, start + ITEMS_PER_PAGE);

  const toClient = (r: (typeof all)[number]) => ({
    id: r.id,
    notes: r.notes,
    status: r.status,
    services: r.services,
    createdAt: r.createdAt.toISOString(),
  });

  return (
    <ReservationsClient
      reservations={pageItems.map(toClient)}
      allReservations={all.map(toClient)}
      currentPage={currentPage}
      totalPages={totalPages}
      filters={filters}
    />
  );
}