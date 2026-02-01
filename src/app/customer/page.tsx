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

// NOVÉ: Mini skupina (1 klient) – Po/Str/Pia
const MINI_ONE_CLIENT_PACKAGES = [
  {
    key: "BASIC",
    name: "BASIC",
    price: "105 € / mesiac",
    short: "Do 5 tréningov (Po/Str/Pia)",
    description: "Tréningové dni: pondelok / streda / piatok. Do 5 tréningov mesačne.",
    details: ["Tréningové dni: Po/Str/Pia", "Počet tréningov: do 5", "Cena: 105 € / mesiac"],
  },
  {
    key: "STANDARD",
    name: "STANDARD",
    price: "155 € / mesiac",
    short: "Do 8 tréningov (Po/Str/Pia)",
    description: "Tréningové dni: pondelok / streda / piatok. Do 8 tréningov mesačne.",
    details: ["Tréningové dni: Po/Str/Pia", "Počet tréningov: do 8", "Cena: 155 € / mesiac"],
  },
  {
    key: "FULL",
    name: "NEOBMEDZENÝ",
    price: "210 € / mesiac",
    short: "Neobmedzený počet tréningov (Po/Str/Pia)",
    description: "Tréningové dni: pondelok / streda / piatok. Neobmedzený vstup.",
    details: ["Tréningové dni: Po/Str/Pia", "Počet tréningov: neobmedzený", "Cena: 210 € / mesiac"],
  },
];

// NOVÉ: Individual – Duo
const INDIVIDUAL_DUO_PACKAGES = [
  {
    key: "BASIC",
    name: "BASIC",
    price: "115 € / mesiac",
    short: "Do 5 tréningov (DUO)",
    description: "Individuálny tréning vo dvojici. Do 5 tréningov mesačne.",
    details: ["Forma: duo", "Počet tréningov: do 5", "Cena: 115 € / mesiac"],
  },
  {
    key: "STANDARD",
    name: "STANDARD",
    price: "175 € / mesiac",
    short: "Do 8 tréningov (DUO)",
    description: "Individuálny tréning vo dvojici. Do 8 tréningov mesačne.",
    details: ["Forma: duo", "Počet tréningov: do 8", "Cena: 175 € / mesiac"],
  },
  {
    key: "FULL",
    name: "FULL",
    price: "240 € / mesiac",
    short: "Neobmedzene (DUO)",
    description: "Individuálny tréning vo dvojici. Neobmedzený vstup.",
    details: ["Forma: duo", "Počet tréningov: neobmedzený", "Cena: 240 € / mesiac"],
  },
];

// NOVÉ: Individual – Single
const INDIVIDUAL_SINGLE_PACKAGES = [
  {
    key: "BASIC",
    name: "BASIC",
    price: "130 € / mesiac",
    short: "Do 5 tréningov (SINGLE)",
    description: "Individuálny tréning 1:1. Do 5 tréningov mesačne.",
    details: ["Forma: single", "Počet tréningov: do 5", "Cena: 130 € / mesiac"],
  },
  {
    key: "STANDARD",
    name: "STANDARD",
    price: "205 € / mesiac",
    short: "Do 8 tréningov (SINGLE)",
    description: "Individuálny tréning 1:1. Do 8 tréningov mesačne.",
    details: ["Forma: single", "Počet tréningov: do 8", "Cena: 205 € / mesiac"],
  },
  {
    key: "FULL",
    name: "FULL",
    price: "280 € / mesiac",
    short: "Neobmedzene (SINGLE)",
    description: "Individuálny tréning 1:1. Neobmedzený vstup.",
    details: ["Forma: single", "Počet tréningov: neobmedzený", "Cena: 280 € / mesiac"],
  },
];

type Category =
  | "GROUP"
  | "MINI"
  | "MINI_ONE_CLIENT" // Po/Str/Pia
  | "INDIVIDUAL_DUO"
  | "INDIVIDUAL_SINGLE";

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

// ... existing code ...
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
// ... existing code ...

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

  const packages =
    category === "GROUP"
      ? GROUP_PACKAGES
      : category === "MINI"
      ? MINI_PACKAGES
      : category === "MINI_ONE_CLIENT"
      ? MINI_ONE_CLIENT_PACKAGES
      : category === "INDIVIDUAL_DUO"
      ? INDIVIDUAL_DUO_PACKAGES
      : INDIVIDUAL_SINGLE_PACKAGES;

  return (
    <div
      className="
        mx-auto py-6 mt-32 space-y-6
        px-3
        max-w-[680px]
        sm:px-4 sm:max-w-3xl
        lg:py-8 lg:mt-40 lg:space-y-8 lg:max-w-5xl
      "
    >
      <h1 className="text-2xl font-bold text-center sm:text-3xl">Vytvoriť objednávku</h1>

      <section className="space-y-3">
        <p className="text-lg font-semibold sm:text-xl">Tréner</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {trainers.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrainerId(t.id)}
              className={`border rounded-lg p-3 sm:p-4 text-left hover:shadow transition ${
                trainerId === t.id ? "ring-2 ring-[var(--highlight)]" : ""
              }`}
            >
              <div className="relative w-full h-40 sm:h-48">
                <Image src={t.photo} alt={t.name} fill className="object-cover rounded-md" />
              </div>
              <div className="mt-2 font-medium text-sm sm:text-base">{t.name}</div>
            </button>
          ))}
          {!trainers.length && <div>Žiadni tréneri.</div>}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-lg font-semibold sm:text-xl">Meno</p>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Meno a priezvisko"
          className="border rounded px-3 py-2 w-full text-sm sm:text-base"
        />
      </section>

      <section className="space-y-2">
        <p className="text-lg font-semibold sm:text-xl">Typ skupiny</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className={`px-3 py-2 border rounded text-sm sm:text-base ${
              category === "GROUP" ? "bg-[var(--highlight)] text-black" : ""
            }`}
            onClick={() => setCategory("GROUP")}
          >
            MAXI SKUPINA
          </button>
          <button
            className={`px-3 py-2 border rounded text-sm sm:text-base ${
              category === "MINI" ? "bg-[var(--highlight)] text-black" : ""
            }`}
            onClick={() => setCategory("MINI")}
          >
            MINI SKUPINY (Ut/Št)
          </button>
          <button
            className={`px-3 py-2 border rounded text-sm sm:text-base ${
              category === "MINI_ONE_CLIENT" ? "bg-[var(--highlight)] text-black" : ""
            }`}
            onClick={() => setCategory("MINI_ONE_CLIENT")}
          >
            MINI (1 klient) Po/Str/Pia
          </button>
          <button
            className={`px-3 py-2 border rounded text-sm sm:text-base ${
              category === "INDIVIDUAL_DUO" ? "bg-[var(--highlight)] text-black" : ""
            }`}
            onClick={() => setCategory("INDIVIDUAL_DUO")}
          >
            INDIVIDUAL DUO
          </button>
          <button
            className={`px-3 py-2 border rounded text-sm sm:text-base ${
              category === "INDIVIDUAL_SINGLE" ? "bg-[var(--highlight)] text-black" : ""
            }`}
            onClick={() => setCategory("INDIVIDUAL_SINGLE")}
          >
            INDIVIDUAL SINGLE
          </button>
        </div>
      </section>

      <section className="space-y-3 sm:space-y-4">
        <p className="text-lg font-semibold sm:text-xl">
          {category === "GROUP"
            ? "Balíčky – Veľké skupiny"
            : category === "MINI"
            ? "Balíčky – Mini skupiny (Ut/Št)"
            : category === "MINI_ONE_CLIENT"
            ? "Balíčky – Mini (1 klient) Po/Str/Pia"
            : category === "INDIVIDUAL_DUO"
            ? "Balíčky – Individual DUO"
            : "Balíčky – Individual SINGLE"}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {packages.map((p) => {
            const isSelected = selectedPackage === p.key;
            const isOpen = expandedInfo === p.key;
            return (
              <div
                key={p.key}
                className={`border rounded-lg p-3 sm:p-4 ${isSelected ? "ring-2 ring-[var(--highlight)]" : ""}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-base sm:text-lg font-semibold">{p.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{p.price}</div>
                    <div className="text-xs sm:text-sm text-gray-700 mt-1">{p.short}</div>
                  </div>
                  <button
                    aria-label="Zobraziť detaily"
                    className="min-w-7 w-7 h-7 rounded-full border flex items-center justify-center text-xs"
                    onClick={() => setExpandedInfo(isOpen ? null : p.key)}
                    title="Info"
                  >
                    i
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-gray-700 space-y-1">
                    <p>{p.description}</p>
                    <ul className="list-disc ml-5">
                      {p.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 sm:mt-4">
                  <button
                    className={`w-full py-2 rounded border text-sm sm:text-base ${
                      isSelected ? "bg-[var(--highlight)] text-black" : "bg-white"
                    }`}
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

      {error && <div className="text-red-600 text-sm:text-base">{error}</div>}

      <div className="flex justify-center">
        <button
          onClick={createReservation}
          disabled={submitting}
          className="
            w-full max-w-[260px]
            px-4 py-2 bg-[var(--highlight)] text-black rounded font-semibold
            disabled:opacity-60 text-sm sm:text-base
          "
        >
          {submitting ? "Vytváram..." : "Vytvoriť záväznú objednávku"}
        </button>
      </div>
    </div>
  );
}
