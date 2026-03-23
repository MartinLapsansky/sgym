"use client";

import { useEffect, useMemo, useState } from "react";

type Reservation = {
  id: string;
  coachId: string | null;
  services: string[] | string; // DB môže vracať rôzne tvary
  notes: string | null;
  status: string;
  createdAt: string;
};

function formatDate(d: Date) {
  return d.toLocaleString("sk-SK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [data, setData] = useState<Reservation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reservations?scope=me", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const json = await res.json();
        if (active) setData(json.reservations ?? []);
      } catch (e: any) {
        if (active) setErr(e?.message || "Chyba pri načítaní objednávok");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    return data.map((r) => {
      const created = new Date(r.createdAt);
      const msSince = Date.now() - created.getTime();
      const daysSince = Math.floor(msSince / (1000 * 60 * 60 * 24));
      const isExpired = daysSince >= 30; // platné < 30 dní, inak expirované

      const validUntil = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);

      const servicesLabel = Array.isArray(r.services)
        ? r.services.join(", ")
        : String(r.services ?? "");

      return {
        ...r,
        createdAtLabel: formatDate(created),
        validUntilLabel: formatDate(validUntil),
        isExpired,
        servicesLabel,
        daysSince,
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 mt-30">
        <h1 className="text-2xl font-semibold mb-6">Moje objednávky</h1>
        <p>Načítavam…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 mt-30">
        <h1 className="text-2xl font-semibold mb-6">Moje objednávky</h1>
        <p className="text-red-600">{err}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 mt-30">
        <h1 className="text-2xl font-semibold mb-6">Moje objednávky</h1>
        <p>Nemáš žiadne rezervácie.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 mt-30">
      <h1 className="text-2xl font-semibold mb-6">Moje objednávky</h1>
      <ul className="space-y-4">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-gray-200 p-4 flex flex-col gap-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm rounded px-2 py-0.5 border">
                {r.status}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <div>
                Vytvorené: <span className="font-medium">{r.createdAtLabel}</span>
              </div>
              <div>
                Platnosť 30 dní (do):{" "}
                <span className="font-medium">{r.validUntilLabel}</span>{" "}
                {r.isExpired ? (
                  <span className="ml-2 text-red-600">(expirované)</span>
                ) : (
                  <span className="ml-2 text-emerald-600">
                    (platné – {29 - r.daysSince + 1} dní zostáva)
                  </span>
                )}
              </div>
              <div>
                Balík/servis: <span className="font-medium">{r.servicesLabel}</span>
              </div>
              {r.notes && (
                <div>
                  Meno v objednávke: <span className="font-medium">{r.notes}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}