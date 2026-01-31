"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "loading" | "ready" | "error";

export default function Register() {
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("token");
  }, []);

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function validate() {
      if (!token) {
        setEmail("");
        setError("Chýba pozývací token.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      const res = await fetch(`/api/auth/register?token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (!res.ok || !data?.valid) {
        setEmail("");
        setError(data?.message ?? "Token je neplatný alebo expirovaný.");
        setStatus("error");
        return;
      }

      setEmail(data.email);
      setError("");
      setStatus("ready");
    }

    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Chýba pozývací token.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
        if (data?.message === "Password must be at least 8 characters long"){
            setError("Heslo musí mať aspoň 8 znakov.");
            setStatus("error");
            return;
        }
        else {
            setError(data?.message ?? "Chyba pri registrácii.");
            setStatus("error");
            return;
        }
    }
    ///if error is return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 }); write on fe the password must at least be 8 characters long



    router.push("/auth/signin");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Registrácia</h1>
          <p className="text-center text-sm text-gray-600">Načítavam pozvánku...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Registrácia</h1>

        <p className="text-center text-sm text-gray-600 mb-4 sm:mb-6">
          Registruješ sa cez pozvánku pre: <strong>{email || "..."}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Meno (voliteľné)
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tvoje meno"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Heslo
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zvoľ si heslo"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimálne 8 znakov.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status !== "ready" || !email}
            className="w-full py-2 px-4 bg-[var(--highlight)] text-black font-semibold rounded-md hover:bg-[#b8925f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Registrovať sa
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Už máš účet?{" "}
          <a href="/auth/signin" className="text-[var(--highlight)] hover:underline">
            Prihlás sa
          </a>
        </p>
      </div>
    </div>
  );
}