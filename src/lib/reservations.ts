import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ReservationFilters = {
  category?: string;
  plan?: string;
  name?: string;
  from?: string;
  month?: string;
};

export type ReservationResult = {
  id: string;
  userId: string;
  coachId: string | null;
  services: string[];
  notes: string | null;
  status: string;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
};

function servicesToString(services: unknown): string {
  if (Array.isArray(services)) return services.join(",");
  return String(services ?? "");
}

function normalizeServices(services: unknown): string {
  return servicesToString(services)
    .replace(/[{}]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function buildReservationWhere(
  filters: ReservationFilters
): Prisma.ReservationWhereInput {
  const { name, from, month } = filters;
  const where: Prisma.ReservationWhereInput = {};
  const dateFilter: Prisma.DateTimeFilter = {};

  const trimmedName = name?.trim();
  if (trimmedName) {
    where.notes = { contains: trimmedName, mode: "insensitive" };
  }

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) {
      dateFilter.gte = fromDate;
    }
  } else if (month) {
    const [y, m] = month.split("-").map((v) => Number.parseInt(v, 10));
    if (!Number.isNaN(y) && !Number.isNaN(m) && m >= 1 && m <= 12) {
      dateFilter.gte = new Date(y, m - 1, 1, 0, 0, 0, 0);
      dateFilter.lt = new Date(y, m, 1, 0, 0, 0, 0);
    }
  }

  if (Object.keys(dateFilter).length > 0) {
    where.createdAt = dateFilter;
  }

  return where;
}

export function filterReservationByService<T extends { services: string[] }>(
  rows: T[],
  filters: ReservationFilters
): T[] {
  const category = String(filters.category ?? "").toUpperCase();
  const plan = String(filters.plan ?? "").toUpperCase();

  const target =
    category && plan
      ? `${category}:${plan}`
      : category
        ? `${category}:`
        : plan
          ? `:${plan}`
          : "";

  if (!target) return rows;

  return rows.filter((r) => normalizeServices(r.services).includes(target));
}

export async function getReservations(
  filters: ReservationFilters
): Promise<ReservationResult[]> {
  const where = buildReservationWhere(filters);

  const rows = (await prisma.reservation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, name: true } } },
  })) as ReservationResult[];

  return filterReservationByService(rows, filters);
}