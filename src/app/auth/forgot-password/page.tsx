"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // simple email check
    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    if (!emailOk) {
      setError("Zadaj platný email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message ?? "Nepodarilo sa odoslať požiadavku.");
      } else {
        setMessage("Ak účet existuje, poslali sme ti email s inštrukciami.");
        setEmail("");
      }
    } catch {
      setError("Nastala chyba. Skús to znova neskôr.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Zabudnuté heslo</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Zadaj email a pošleme ti odkaz na obnovu hesla.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              placeholder="tvoj@email.sk"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 px-4 bg-[var(--highlight)] text-black font-semibold rounded-md hover:bg-[#b8925f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Odosielam..." : "Poslať odkaz"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Späť na{" "}
          <a href="/auth/signin" className="text-[var(--highlight)] hover:underline">
            prihlásenie
          </a>
        </p>
      </div>
    </div>
  );
}