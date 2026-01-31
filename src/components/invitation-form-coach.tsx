"use client";

import React, { useState } from "react";

export function InviteFormCoach() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const res = await fetch("/api/invitations-coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data?.message ?? "Nepodarilo sa odoslať pozvánku.");
            return;
        }

        setMessage("Pozvánka odoslaná.");
        setEmail("");
    };

    return (
        <form onSubmit={handleInvite} className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email trénera</label>
                <input
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}

            <button
                type="submit"
                className="w-full py-2 px-4 bg-[var(--highlight)] text-black font-semibold rounded-md"
            >
                Odoslať pozvánku
            </button>
        </form>
    );
}