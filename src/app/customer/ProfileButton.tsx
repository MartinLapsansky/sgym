"use client";

import { useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ProfileButtonProps = {
  initialName: string;
};

export function ProfileButton({ initialName }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const openModal = () => {
    setName(savedName);
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsOpen(false);
  };

  const handleSave = async () => {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Zadaj meno");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Meno sa nepodarilo uložiť");

      setSavedName(trimmed);
      setName(trimmed);
      setIsOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba pri ukladaní mena");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        aria-label="Profil"
        title="Profil"
        className="flex items-center justify-center rounded-full border border-[var(--highlight)] p-2 text-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-white transition"
      >
        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="profile-title" className="text-lg font-semibold mb-4">
              Profil
            </h2>

            <label htmlFor="profile-name" className="block text-sm font-medium mb-1">
              Meno
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meno a priezvisko"
              className="border rounded px-3 py-2 w-full text-sm sm:text-base"
            />

            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-md border px-4 py-2 font-semibold text-gray-700 disabled:opacity-60"
              >
                Zrušiť
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-[var(--highlight)] px-4 py-2 font-semibold text-black disabled:opacity-60"
              >
                {saving ? "Ukladám..." : "Potvrdiť"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
