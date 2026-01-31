"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import photoJergi from "@/app/assets/Simon foto.png";
import photoErik from "@/app/assets/photo-erik.jpg";
import { useRouter } from "next/navigation";


type Trainer = {
  id: string;
  name: string;
  photo: string;
};

function pickPhotoByName(name: string) {
  const n = name.toLowerCase();
  if (n.includes("šimon")) return photoJergi;
  if (n.includes("erik")) return photoErik;
  return photoJergi;
}

// Balíčky – Veľké skupiny
const GROUP_PACKAGES = [
  {
    key: "BASIC",
    name: "BASIC",
    price: "70 € / mesiac",
    short: "Max 5 tréningov",
    description:
      "Platba jednotlivo: 5 × 11 € + 10 € = 65 €; Paušál BASIC: 70 €; Rozdiel +5 €. Určený na občasnú dochádzku.",
    details: [
      "Maximálne 5 tréningov",
      "Platba jednotlivo: 5 × 11 € + 10 € = 65 €",
      "Balík BASIC (paušál): 70 €",
      "Rozdiel: +5 €",
      "Určený na občasnú dochádzku",
    ],
  },
  {
    key: "STANDARD",
    name: "STANDARD",
    price: "100 € / mesiac",
    short: "Max 8 tréningov",
    description:
      "Platba jednotlivo: 8 × 11 € + 10 € = 98 €; Paušál STANDARD: 100 €; Rozdiel +2 €. 2× týždenne.",
    details: [
      "Maximálne 8 tréningov",
      "Platba jednotlivo: 8 × 11 € + 10 € = 98 €",
      "Balík STANDARD (paušál): 100 €",
      "Rozdiel: +2 €",
      "Určený na pravidelný tréning 2× týždenne",
    ],
  },
  {
    key: "FULL",
    name: "FULL",
    price: "132 € / mesiac",
    short: "10–14 tréningov (počítané ako 12)",
    description:
      "Jednotlivo: 12 × 11 € + 10 € = 142 €; Paušál FULL: 132 €; Rozdiel −10 €. Neobmedzené skupinové tréningy + 1× InBody/mes.",
    details: [
      "10–14 tréningov (počítané ako 12)",
      "Platba jednotlivo: 12 × 11 € + 10 € = 142 €",
      "Balík FULL (paušál): 132 €",
      "Rozdiel: −10 €",
      "Neobmedzený vstup na skupinové tréningy",
      "1× mesačné meranie telesnej kompozície na InBody (nepovinné)",
    ],
  },
];

// Balíčky – Mini skupiny
const MINI_PACKAGES = [
  {
    key: "BASIC",
    name: "BASIC",
    price: "85 € / mesiac",
    short: "Do 4 tréningov (Ut/Št)",
    description: "Tréningové dni: utorok / štvrtok. Do 4 tréningov mesačne.",
    details: ["Tréningové dni: utorok / štvrtok", "Počet tréningov: do 4", "Cena: 85 € / mesiac"],
  },
  {
    key: "STANDARD",
    name: "STANDARD",
    price: "120 € / mesiac",
    short: "Do 6 tréningov (Ut/Št)",
    description: "Tréningové dni: utorok / štvrtok. Do 6 tréningov mesačne.",
    details: ["Tréningové dni: utorok / štvrtok", "Počet tréningov: do 6", "Cena: 120 € / mesiac"],
  },
  {
    key: "FULL",
    name: "FULL",
    price: "155 € / mesiac",
    short: "Neobmedzene (Ut/Št)",
    description: "Tréningové dni: utorok / štvrtok. Neobmedzený vstup.",
    details: ["Tréningové dni: utorok / štvrtok", "Počet tréningov: neobmedzený vstup", "Cena: 155 € / mesiac"],
  },
  {
    key: "FULL_PLUS",
    name: "FULL PLUS",
    price: "195 € / mesiac",
    short: "Ut/Št neobmedzene + Pia 6:00 (max 12/m)",
    description: "Ut/Št – neobmedzene, piatok 6:00, max. 12 tréningov mesačne.",
    details: [
      "Tréningové dni: utorok / štvrtok – neobmedzene",
      "Piatok 6:00",
      "Max. 12 tréningov mesačne",
      "Cena: 195 € / mesiac",
    ],
  },
];

type Category = "GROUP" | "MINI";

export default function CustomerPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerId, setTrainerId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("GROUP");
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const router = useRouter();


    useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError("");
        const res = await fetch("/api/barbers", { cache: "no-store" });
        if (!res.ok) throw new Error("Nepodarilo sa načítať trénerov");
        const data = await res.json();
        console.log("treneri", data);
        const mapped: Trainer[] = (data?.coaches ?? []).map((t: Trainer) => ({
          id: t.id,
          name: t.name,
          photo: pickPhotoByName(t.name),
        }));
        if (active) {
          setTrainers(mapped);
          if (mapped.length && !trainerId) setTrainerId(mapped[0].id);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Chyba pri načítaní trénerov");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSelectedPackage("");
    setExpandedInfo(null);
  }, [category]);

  const createReservation = async () => {
    setError("");
    if (!trainerId) return setError("Vyber trénera");
    if (!fullName.trim()) return setError("Zadaj celé meno");
    if (!selectedPackage) return setError("Vyber balíček");

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: trainerId,
          fullName,
          package: {
            category,
            plan: selectedPackage, // "BASIC" | "STANDARD" | "FULL" | "FULL_PLUS"
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Objednávku sa nepodarilo vytvoriť");

      router.push("/customer/success-order");
      alert("Objednávka vytvorená. Dátum/čas: čas vytvorenia objednávky.");
      setFullName("");
      setSelectedPackage("");
      setExpandedInfo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba pri vytváraní objednávky");
    } finally {
      setSubmitting(false);
    }
  };

  const packages = category === "GROUP" ? GROUP_PACKAGES : MINI_PACKAGES;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8 mt-40">
      <h1 className="text-3xl font-bold text-center">Vytvoriť objednávku</h1>

      <section className="space-y-3">
        <p className="text-xl font-semibold">Vyber trénera</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trainers.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrainerId(t.id)}
              className={`border rounded p-6 text-left hover:shadow transition ${
                trainerId === t.id ? "ring-2 ring-[var(--highlight)]" : ""
              }`}
            >
              <div className="relative w-full h-50">
                <Image src={t.photo} alt={t.name} fill className="object-cover rounded w-5 h-auto" />
              </div>
              <div className="mt-2 font-medium">{t.name}</div>
            </button>
          ))}
          {!trainers.length && <div>Žiadni tréneri.</div>}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xl font-semibold">Meno</p>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Meno a priezvisko"
          className="border rounded px-3 py-2 w-full"
        />
      </section>

      <section className="space-y-2">
        <p className="text-xl font-semibold">Typ skupiny</p>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 border rounded ${category === "GROUP" ? "bg-[var(--highlight)] text-black" : ""}`}
            onClick={() => setCategory("GROUP")}
          >
            Veľké skupiny
          </button>
          <button
            className={`px-4 py-2 border rounded ${category === "MINI" ? "bg-[var(--highlight)]" : ""}`}
            onClick={() => setCategory("MINI")}
          >
            Mini skupiny
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xl font-semibold">Balíčky – {category === "GROUP" ? "Veľké skupiny" : "Mini skupiny"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((p) => {
            const isSelected = selectedPackage === p.key;
            const isOpen = expandedInfo === p.key;
            return (
              <div key={p.key} className={`border rounded p-4 ${isSelected ? "ring-2 ring-[var(--highlight)]" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.price}</div>
                    <div className="text-sm text-gray-700 mt-1">{p.short}</div>
                  </div>
                  <button
                    aria-label="Zobraziť detaily"
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                    onClick={() => setExpandedInfo(isOpen ? null : p.key)}
                    title="Info"
                  >
                    i
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <p>{p.description}</p>
                    <ul className="list-disc ml-5">
                      {p.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    className={`w-full py-2 rounded border ${isSelected ? "bg-[var(--highlight)] text-black" : "bg-white"}`}
                    onClick={() => setSelectedPackage(p.key)}
                  >
                    Vybrať
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {error && <div className="text-red-600">{error}</div>}

      <div className="flex justify-center">
        <button
          onClick={createReservation}
          disabled={submitting}
          className="w-80 px-4 py-2 bg-[var(--highlight)] text-black rounded font-semibold disabled:opacity-60"
        >
          {submitting ? "Vytváram..." : "Vytvoriť záväznú objednávku"}
        </button>
      </div>
    </div>
  );
}
