"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  canCreateReservation: boolean;
  createdAt: string;
  lastReservationAt: string | null;
};

const INACTIVE_DAYS = 30;
const INACTIVE_MS = INACTIVE_DAYS * 24 * 60 * 60 * 1000;

function isInactive(user: UserRow): boolean {
  if (!user.lastReservationAt) return true;
  return Date.now() - new Date(user.lastReservationAt).getTime() > INACTIVE_MS;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Nepodarilo sa načítať používateľov");
        if (active) setUsers(data?.users ?? []);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Chyba pri načítaní používateľov");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggleUser = async (user: UserRow, next: boolean) => {
    setSavingId(user.id);
    setError("");

    // Optimistická aktualizácia
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, canCreateReservation: next } : u))
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, canCreateReservation: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Nepodarilo sa uložiť zmenu");

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...data.user } : u))
      );
    } catch (e) {
      // Rollback pri chybe
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, canCreateReservation: user.canCreateReservation } : u
        )
      );
      setError(e instanceof Error ? e.message : "Chyba pri ukladaní zmeny");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Načítavam…</div>;
  }

  if (error && !users.length) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!users.length) {
    return <div className="text-sm text-gray-600">Žiadni zákazníci.</div>;
  }

  const inactiveCount = users.filter(isInactive).length;
  const visibleUsers = showInactiveOnly ? users.filter(isInactive) : users;

  return (
    <div className="space-y-3">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowInactiveOnly((prev) => !prev)}
          aria-pressed={showInactiveOnly}
          className={
            "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors " +
            (showInactiveOnly
              ? "border-amber-500 bg-amber-100 text-amber-900"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
          }
        >
          {showInactiveOnly ? "Zobraziť všetkých" : "Bez rezervácie / neaktívni (30+ dní)"}
          <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs">
            {inactiveCount}
          </span>
        </button>

        {showInactiveOnly && (
          <span className="text-xs text-gray-500">
            Zákazníci bez rezervácie alebo s poslednou rezerváciou pred viac ako {INACTIVE_DAYS} dňami.
          </span>
        )}
      </div>

      {!visibleUsers.length ? (
        <div className="text-sm text-gray-600">
          Žiadni neaktívni zákazníci.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 bg-gray-50 px-3 py-2 text-sm font-semibold">
            <div>Meno</div>
            <div>Email</div>
            <div className="text-center">Môže vytvárať rezervácie</div>
          </div>

          <ul className="divide-y">
            {visibleUsers.map((u) => (
              <li
                key={u.id}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 px-3 py-3 text-sm items-center"
              >
                <div className="truncate">{u.name || "-"}</div>
                <div className="truncate">{u.email}</div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer"
                    checked={u.canCreateReservation}
                    disabled={savingId === u.id}
                    onChange={(e) => toggleUser(u, e.target.checked)}
                    aria-label={`Povoliť vytváranie rezervácií pre ${u.email}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
