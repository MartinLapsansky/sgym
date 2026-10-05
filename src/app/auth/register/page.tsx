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
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zvoľ si heslo"
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
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