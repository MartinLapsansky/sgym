"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReservationItem = {
  id: string;
  notes: string | null;
  email: string | null;
  services: string[];
  createdAt: string;
};

export default function ReservationsList() {
  const router = useRouter();
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch("/api/reservations?all=1", { cache: "no-store" });
        const data: { reservations: Array<{
          id: string;
          notes?: string | null;
          services?: string[];
          createdAt: string;
          user?: { email?: string | null } | null;
        }> } = await res.json();
        if (!res.ok) throw new Error((data as any)?.message || "Nepodarilo sa načítať rezervácie");
        const rows: ReservationItem[] = (data?.reservations ?? []).map((r) => ({
          id: r.id,
          notes: r.notes ?? null,
          email: r.user?.email ?? null,
          services: r.services ?? [],
          createdAt: r.createdAt,
        }));
        if (active) setItems(rows);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Chyba pri načítaní");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-30">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Vytvorené rezervácie</h3>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="px-3 py-2 border rounded font-semibold"
        >
          Späť na dashboard
        </button>
      </div>

      {loading && <div>Načítavam...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border">Meno</th>
                <th className="text-left p-2 border">Email</th>
                <th className="text-left p-2 border">Služba / Balík</th>
                <th className="text-left p-2 border">Vytvorené</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{it.notes ?? "-"}</td>
                  <td className="p-2 border">{it.email ?? "-"}</td>
                  <td className="p-2 border">{it.services.join(", ") || "-"}</td>
                  <td className="p-2 border">
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className="p-3 border text-center" colSpan={4}>
                    Zatiaľ žiadne rezervácie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}