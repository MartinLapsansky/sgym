"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Chýba alebo je neplatný token.");
      return;
    }
    if (password.length < 8) {
      setError("Heslo musí mať aspoň 8 znakov.");
      return;
    }
    if (password !== confirm) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

        const text = await res.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch {}

        if (!res.ok) {
            // Map specific backend validation message to FE-friendly wording
            if (data?.message === "Password must be at least 8 characters long") {
                setError("Password must at least be 8 characters long");
            } else {
                setError(data?.message ?? "Nepodarilo sa zmeniť heslo.");
            }
            return;
        }

        setMessage("Heslo bolo úspešne zmenené. Presmerovávam na prihlásenie...");
        setTimeout(() => router.push("/auth/signin"), 1400);
    } catch {
        setError("Nastala chyba. Skús to znova neskôr.");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Obnova hesla</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nové heslo
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimálne 8 znakov.</p>
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Potvrdenie hesla
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              placeholder="••••••••"
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
            {submitting ? "Ukladám..." : "Zmeniť heslo"}
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