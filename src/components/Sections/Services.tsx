import React from "react";
import Image from "next/image";
import spaces from "../../app/assets/sgym_facility.jpg"; // Import the background image from assets
import mini_groups from "../../app/assets/Mini skupiny.jpeg"
const Services = () => {

    return (
        <div className="relative min-h-[600px] py-16 overflow-hidden">
            <Image
                src={spaces}
                alt="Barber shop background"
                fill
                className="object-cover grayscale"
                priority
            />
            <div className="absolute inset-0 bg-black/60 z-0"/>
            <div className="relative z-10 container mx-auto px-4 text-white">
                <h2 className="text-center text-5xl font-bold mb-12">SLUŽBY</h2>
                <section className="max-w-4xl mx-auto px-4 py-10">
                    {/* Nadpis */}
                    <p className="text-center text-4xl font-extrabold tracking-wide">
                        MESAČNÉ BALÍKY – MINI SKUPINY
                    </p>
                    <p className="text-center text-lg font-semibold text-[var(--highlight)] mt-2">
                        UTOROK / ŠTVRTOK
                    </p>

                    {/* Tabuľka */}
                    <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-center">
                            <thead className="bg-black text-[var(--highlight)] text-sm uppercase">
                            <tr>
                                <th className="py-3 border-r text-white">Balík</th>
                                <th className="py-3 border-r text-white">Počet tréningov</th>
                                <th className="py-3 text-white">Cena</th>
                            </tr>
                            </thead>

                            <tbody className="text-sm md:text-base">
                            {/* BASIC */}
                            <tr className="border-t">
                                <td className="py-4 font-bold text-white bg-[#2d663d]">
                                    BASIC
                                </td>
                                <td className="py-4 border-r text-[var(--light)]">
                                    do 4 tréningov
                                </td>
                                <td className="py-4 font-bold text-[var(--light)]">
                                    85 € / mesiac
                                </td>
                            </tr>

                            {/* STANDARD */}
                            <tr className="border-t">
                                <td className="py-4 font-bold text-white bg-[#977c3d]">
                                    STANDARD
                                </td>
                                <td className="py-4 border-r text-[var(--light)]">
                                    do 6 tréningov
                                </td>
                                <td className="py-4 font-bold text-[var(--light)]">
                                    120 € / mesiac
                                </td>
                            </tr>

                            {/* FULL */}
                            <tr className="border-t">
                                <td className="py-4 font-bold text-white bg-red-700">
                                    FULL
                                </td>
                                <td className="py-4 border-r text-[var(--light)]">
                                    neobmedzený vstup<br />
                                    <span className="text-sm">(utorok / štvrtok)</span>
                                </td>
                                <td className="py-4 font-bold text-[var(--light)]">
                                    155 € / mesiac
                                </td>
                            </tr>

                            {/* FULL PLUS */}
                            <tr className="border-t">
                                <td className="py-4 font-bold text-white bg-red-900">
                                    FULL&nbsp;PLUS
                                </td>
                                <td className="py-4 border-r text-[var(--light)]">
                                    UT / ŠTV neobmedzene<br />
                                    PI 6:00<br />
                                    <span className="text-sm text-[var(--light)]">
                  (max. 12 tréningov mesačne)
                </span>
                                </td>
                                <td className="py-4 font-bold text-[var(--light)]">
                                    195 € / mesiac
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Popis pod tabuľkou */}
                    <div className="mt-6 space-y-2 text-sm text-center md:text-base">
                        <p>• Balíky sa platia mesačne vopred.</p>
                        <p>• Cena je rovnaká bez ohľadu na počet ľudí v skupine.</p>
                        <p>• Miesto v skupine máte vždy garantované.</p>
                        <p>
                            • Možnosť nahradiť si termín v piatok o 6:00 alebo meniť čas
                            utorok / štvrtok (6:00 alebo 7:00).
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
export default Services;