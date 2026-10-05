"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CustomerActionsProps = {
  canCreateReservation: boolean;
};

export function CustomerActions({ canCreateReservation }: CustomerActionsProps) {
  const router = useRouter();
  const [showNoPermissionModal, setShowNoPermissionModal] = useState(false);

  const handleCreateOrder = () => {
    if (canCreateReservation) {
      router.push("/customer/create-order");
      return;
    }
    setShowNoPermissionModal(true);
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => router.push("/customer/orders")}
          className="w-full rounded-md bg-[var(--highlight)] text-white px-4 py-3 hover:bg-[#b8925f] transition"
        >
          Moje objednávky
        </button>
        <button
          onClick={handleCreateOrder}
          className="w-full rounded-md bg-[var(--highlight)] text-white px-4 py-3 hover:bg-[#b8925f] transition"
        >
          Vytvoriť objednávku
        </button>
      </div>

      {showNoPermissionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-permission-title"
        >
          <div className="flex flex-col items-center w-full max-w-md rounded-lg bg-white p-6 shadow-xl text-center">
            <h3 id="no-permission-title" className="text-lg text-red-600 font-semibold mb-3">
              Vytvorenie objednávky nie je povolené
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Nemáte povolenie vytvoriť objednávku. Pre umožnenie tohto prístupu
              prosím kontaktujte trénera na e-maili:{" "}
              <a
                href="mailto:simonspisak@icloud.com"
                className="font-semibold underline"
              >
                simonspisak@icloud.com
              </a>
              .
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNoPermissionModal(false)}
                className="rounded-md bg-(--highlight) px-4 py-2 font-semibold text-black"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
