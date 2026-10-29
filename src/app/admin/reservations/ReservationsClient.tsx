"use client";

import {useState, type FormEvent, useCallback, useEffect} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CATEGORY_OPTIONS,
  PLAN_OPTIONS_BY_CATEGORY,
  type Filters,
  type Reservation,
} from "./constants";
import {useDebounce} from "@/hooks/useDebounce";


function parseCategoryPlan(services: Reservation["services"]): {
  category: string;
  plan: string;
} {
  const raw = Array.isArray(services) ? services[0] : services;
  const cleaned = String(raw || "").replace(/[{}]/g, "").trim();
  const [category = "", plan = ""] = cleaned.split(":");
  return { category, plan };
}

export default function ReservationsClient({
  reservations,
  allReservations,
  currentPage,
  totalPages,
  filters,
}: {
  reservations: Reservation[];
  allReservations: Reservation[];
  currentPage: number;
  totalPages: number;
  filters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [nameInput, setNameInput] = useState(filters.name);
  const debouncedName = useDebounce(nameInput, 300);


  const planOptions = PLAN_OPTIONS_BY_CATEGORY[filters.category] ?? PLAN_OPTIONS_BY_CATEGORY[""];

  const buildQuery = useCallback((next: Partial<Filters>, extra?: { page?: number }): string => {
    const merged: Filters = { ...filters, ...next };
    const params = new URLSearchParams();

    if (merged.category) params.set("category", merged.category);
    if (merged.plan) params.set("plan", merged.plan);
    if (merged.name) params.set("name", merged.name);
    if (merged.from) params.set("from", merged.from);
    if (merged.month) params.set("month", merged.month);

    const page = extra?.page ?? 1;
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  },[filters,pathname])

  function navigate(next: Partial<Filters>) {
    router.push(buildQuery(next));
  }

  function handleCategoryChange(value: string) {
    let nextPlan = filters.plan;
    const options =
      PLAN_OPTIONS_BY_CATEGORY[value] ?? PLAN_OPTIONS_BY_CATEGORY[""];

    if (!options.some((o) => o.value === nextPlan)) {
      nextPlan = "";
    }

    navigate({ category: value, plan: nextPlan });
  }

  function handleFromChange(value: string) {
    navigate(value ? { from: value, month: "" } : { from: "" });
  }

  function handleMonthChange(value: string) {
    navigate(value ? { month: value, from: "" } : { month: "" });
  }

  function handleReset() {
    setNameInput("");
    router.push(pathname);
  }

  //debounce effect search
  useEffect(() => {
    const trimmed = debouncedName.trim();
    if (trimmed === filters.name) return;

    router.push(buildQuery({ name: trimmed }));
  }, [debouncedName, filters.name, buildQuery, router]);

  async function handleSendEmail() {
    try {
      const payload: Record<string, string> = {};
      if (filters.category) payload.category = filters.category;
      if (filters.plan) payload.plan = filters.plan;
      if (filters.name) payload.name = filters.name;
      if (filters.from) payload.from = filters.from;
      if (filters.month) payload.month = filters.month;

      const res = await fetch("/api/reservations-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || "Nepodarilo sa odoslať e‑mail");
      }

      alert("Prehľad odoslaný na e‑mail.");
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Chyba pri odosielaní e‑mailu");
    }
  }

  function handleDownloadExcel() {
    const header = ["Meno", "Kategória", "Plán", "Vytvorené", "Stav"].join(",");

    const lines = allReservations.map((r) => {
      const raw = Array.isArray(r.services) ? r.services[0] : r.services;
      const cleaned = String(raw || "").replace(/[{}]/g, "").trim();
      const [cat = "", pl = ""] = cleaned.split(":");
      const created = new Date(r.createdAt).toLocaleString("sk-SK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

      return [
        esc(r.notes || "-"),
        esc(cat || "-"),
        esc(pl || "-"),
        esc(created),
        esc(r.status || "-"),
      ].join(",");
    });

    const csv = [header, ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.download = `rezervacie-${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 mt-40">
      <h1 className="text-2xl font-bold">Rezervácie</h1>

      <section className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className="text-sm font-medium">Kategória</label>
          <select
            className="border rounded px-3 py-2"
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-1">
          <label className="text-sm font-medium">Plán</label>
          <select
            className="border rounded px-3 py-2"
            value={filters.plan}
            onChange={(e) => navigate({ plan: e.target.value })}
          >
            {planOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="flex flex-col gap-2 md:col-span-2"
        >
          <label className="text-sm font-medium">Meno (vyhľadávanie)</label>
          <input
            type="text"
            value={nameInput}
            placeholder="Zadaj meno"
            onChange={(e) => setNameInput(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-1">
          <label className="text-sm font-medium">Od dátumu</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => handleFromChange(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-1">
          <label className="text-sm font-medium">Mesiac</label>
          <input
            type="month"
            value={filters.month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2 md:col-span-6">
          <button className="px-4 py-2 border rounded" onClick={handleReset}>
            Reset
          </button>
          <button
            className="px-4 py-2 bg-[var(--highlight)] text-black rounded"
            onClick={() => router.refresh()}
          >
            Obnoviť
          </button>
          <button
            className="px-4 py-2 text-black border rounded"
            onClick={handleSendEmail}
            title="Odošle aktuálny prehľad podľa filtrov na USER_EMAIL"
          >
            Odoslať prehľad e‑mailom
          </button>
          <button
            className="px-4 py-2 text-black border rounded"
            onClick={handleDownloadExcel}
            title="Stiahne aktuálny prehľad ako Excel (CSV)"
          >
            Stiahnuť Excel
          </button>
        </div>
      </section>

      <section className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-5 gap-2 bg-gray-50 px-3 py-2 text-sm font-semibold">
          <div>ID</div>
          <div>Meno</div>
          <div>Kategória</div>
          <div>Plán</div>
          <div>Vytvorené</div>
        </div>

        {reservations.length === 0 ? (
          <div className="px-3 py-4">Žiadne rezervácie.</div>
        ) : (
          <ul className="divide-y">
            {reservations.map((r) => {
              const { category, plan } = parseCategoryPlan(r.services);
              return (
                <li
                  key={r.id}
                  className="grid grid-cols-5 gap-2 px-3 py-3 text-sm"
                >
                  <div className="truncate">{r.id}</div>
                  <div className="truncate">{r.notes || "-"}</div>
                  <div className="truncate">{category || "-"}</div>
                  <div className="truncate">{plan || "-"}</div>
                  <div className="truncate">
                    {new Date(r.createdAt).toLocaleString("sk-SK", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex items-center gap-3">
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => router.push(buildQuery({}, { page: currentPage - 1 }))}
        >
          Predchádzajúca
        </button>
        <span className="text-sm">
          Strana {currentPage} z {totalPages}
        </span>
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => router.push(buildQuery({}, { page: currentPage + 1 }))}
        >
          Ďalšia
        </button>
      </div>
    </div>
  );
}