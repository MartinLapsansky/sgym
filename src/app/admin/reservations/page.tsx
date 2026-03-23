"use client";

import { useEffect, useMemo, useState } from "react";

type Reservation = {
  id: string;
  userId: string;
  coachId?: string | null;
  services: string[]; // ["CATEGORY:PLAN"]
  notes?: string | null; // celé meno z customer stránky
  status: string;
  createdAt: string;
};

type Option = { value: string; label: string };

const CATEGORY_OPTIONS: Option[] = [
  { value: "", label: "Všetky kategórie" },
  { value: "GROUP", label: "MAXI SKUPINA" },
  { value: "MINI", label: "MINI (Ut/Št)" },
  { value: "MINI_ONE_CLIENT", label: "MINI Po/Str/Pia" },
  { value: "INDIVIDUAL_DUO", label: "INDIVIDUAL DUO" },
  { value: "INDIVIDUAL_SINGLE", label: "INDIVIDUAL SINGLE" },
];

const PLAN_OPTIONS_BY_CATEGORY: Record<string, Option[]> = {
  "": [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL" },
    { value: "FULL_PLUS", label: "FULL_PLUS" },
  ],
  GROUP: [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL" },
  ],
  MINI: [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL" },
    { value: "FULL_PLUS", label: "FULL_PLUS" },
  ],
  MINI_ONE_CLIENT: [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL / Neobmedzený" },
  ],
  INDIVIDUAL_DUO: [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL" },
  ],
  INDIVIDUAL_SINGLE: [
    { value: "", label: "Všetky plány" },
    { value: "BASIC", label: "BASIC" },
    { value: "STANDARD", label: "STANDARD" },
    { value: "FULL", label: "FULL" },
  ],
};

function parseCategoryPlan(services: any): { category: string; plan: string } {
    // DB má tvar "{CATEGORY:PLAN}"
    const raw = Array.isArray(services) ? services[0] : services;
    const cleaned = String(raw || "").replace(/[{}]/g, "").trim();
    const [category = "", plan = ""] = cleaned.split(":");
    return { category, plan };
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [name, setName] = useState<string>("");        
  const [from, setFrom] = useState<string>("");        
  const [month, setMonth] = useState<string>("");

  const planOptions = useMemo<Option[]>(() => {
    return PLAN_OPTIONS_BY_CATEGORY[category ?? ""] ?? PLAN_OPTIONS_BY_CATEGORY[""];
  }, [category]);

  useEffect(() => {
    // ak zmeníme kategóriu a aktuálny plán nie je v možnostiach, resetneme plán
    if (!planOptions.some((o) => o.value === plan)) {
      setPlan("");
    }
  }, [planOptions, plan]);

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (plan) params.set("plan", plan);

      if (name.trim()) params.set("name", name.trim());
      if (from) {
            params.set("from", from); 
            params.delete("month");   
      } else if (month) {
            params.set("month", month); 
      }

      const qs = params.toString();
      const url = qs ? `/api/reservations?${qs}` : `/api/reservations`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Nepodarilo sa načítať rezervácie");
      setReservations(data?.reservations ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba pri načítaní rezervácií");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [category, plan, name, from, month]);

    const resetFilters = () => {
        setCategory("");
        setPlan("");
        setName("");
        setFrom("");
        setMonth("");
    };

    const sendEmailReport = async () => {
        try {
            const payload: any = { category, plan, name, from, month };
            // len platné hodnoty
            if (!category) delete payload.category;
            if (!plan) delete payload.plan;
            if (!name.trim()) delete payload.name;
            if (!from) delete payload.from;
            if (!month) delete payload.month;

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
        } catch (e:any) {
            alert(e?.message || "Chyba pri odosielaní e‑mailu");
        }
    };

    const downloadExcel = () => {
        // vygenerujeme jednoduchý CSV, ktorý Excel otvorí
        const header = ["ID", "Meno", "Kategória", "Plán", "Vytvorené", "Stav"].join(",");
        const lines = reservations.map((r) => {
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
            // CSV escaping
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
    };


    return (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 mt-40">
            <h1 className="text-2xl font-bold">Rezervácie</h1>

            <section className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="text-sm font-medium">Kategória</label>
                    <select
                        className="border rounded px-3 py-2"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                    <select className="border rounded px-3 py-2" value={plan} onChange={(e) => setPlan(e.target.value)}>
                        {planOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium">Meno (vyhľadávanie)</label>
                    <input
                        type="text"
                        value={name}
                        placeholder="Zadaj meno"
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="text-sm font-medium">Od dátumu</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            if (e.target.value) setMonth("");
                        }}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="text-sm font-medium">Mesiac</label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            if (e.target.value) setFrom("");
                        }}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex gap-2 md:col-span-6">
                    <button
                        className="px-4 py-2 border rounded"
                        onClick={resetFilters}
                    >
                        Reset
                    </button>
                    <button className="px-4 py-2 bg-[var(--highlight)] text-black rounded" onClick={fetchReservations}>
                        Obnoviť
                    </button>
                    <button
                        className="px-4 py-2 text-black border rounded"
                        onClick={sendEmailReport}
                        title="Odošle aktuálny prehľad podľa filtrov na USER_EMAIL"
                    >
                        Odoslať prehľad e‑mailom
                    </button>
                    <button
                        className="px-4 py-2 text-black border rounded"
                        onClick={downloadExcel}
                        title="Stiahne aktuálny prehľad ako Excel (CSV)"
                    >
                        Stiahnuť Excel
                    </button>
                </div>
            </section>

            {error && <div className="text-red-600">{error}</div>}
            {loading && <div>Načítavam…</div>}

            <section className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-5 gap-2 bg-gray-50 px-3 py-2 text-sm font-semibold">
                    <div>ID</div>
                    <div>Meno</div>
                    <div>Kategória</div>
                    <div>Plán</div>
                    <div>Vytvorené</div>
                </div>

                {reservations.length === 0 && !loading ? (
                    <div className="px-3 py-4">Žiadne rezervácie.</div>
                ) : (
                    <ul className="divide-y">
                        {reservations.map((r) => {
                            const { category: cat, plan: pl } = parseCategoryPlan(r.services || []);
                            return (
                                <li key={r.id} className="grid grid-cols-5 gap-2 px-3 py-3 text-sm">
                                    <div className="truncate">{r.id}</div>
                                    <div className="truncate">{r.notes || "-"}</div>
                                    <div className="truncate">{cat || "-"}</div>
                                    <div className="truncate">{pl || "-"}</div>
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
        </div>
    );
}