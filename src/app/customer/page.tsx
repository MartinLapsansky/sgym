"use client";

import { useRouter } from "next/navigation";
import {LogoutButton} from "@/components/LogoutButton";

export default function CustomerHome() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 mt-35">
        <div className="flex flex-row items-center justify-between w-full mb-5">
            <h1 className="flex text-2xl font-semibold mb-6">Zákaznícka zóna</h1>
            <LogoutButton callbackUrl="/auth/signin"/>
        </div>


        <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => router.push("/customer/orders")}
          className="w-full rounded-md bg-[var(--highlight)] text-white px-4 py-3 hover:bg-[#b8925f] transition"
        >
          Moje objednávky
        </button>
        <button
          onClick={() => router.push("/customer/create-order")}
          className="w-full rounded-md bg-[var(--highlight)] text-white px-4 py-3 hover:bg-[#b8925f] transition"
        >
          Vytvoriť objednávku
        </button>
      </div>

    </div>
  );
}