"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SuccessOrderPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center mt-30">
      <div className="max-w-md w-full bg-white border rounded-lg p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold">Ďakujeme za objednávku</h1>
        <p className="text-gray-700">Vaša objednávka bola úspešne vytvorená.</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/customer")}
            className="w-full py-2 bg-[var(--highlight)] text-black font-semibold rounded"
          >
            Vytvoriť ďalšiu objednávku
          </button>

          <button
            onClick={handleSignOut}
            className="w-full py-2 border rounded font-semibold"
            title="Odhlásiť sa"
          >
            Odhlásiť sa
          </button>
        </div>
      </div>
    </div>
  );
}