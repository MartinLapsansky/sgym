"use client";

import { signOut } from "next-auth/react";

export function LogoutButton({ callbackUrl = "/auth/signin", className = "" }: { callbackUrl?: string; className?: string }) {
  const handleClick = async () => {
    await signOut({ callbackUrl });
  };

  return (
    <button
      onClick={handleClick}
      className={className || "px-4 py-2 border rounded font-semibold"}
      title="Odhlásiť sa"
    >
      Odhlásiť sa
    </button>
  );
}