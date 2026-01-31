"use client"

import Image from "next/image"
import landing from "@/app/assets/s-gym-landing.png"

import Link from "next/link"


export default function Home() {



    return (
    <section id="home" className="relative w-full min-h-screen">
            <Image
                src={landing}
                alt={`sgym landing`}
                fill
                quality={100}
                className={`object-cover absolute`}
                sizes="100vw"
            />
      {/* gradient/texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

      {/* obsah */}
      <div className="absolute z-10 flex items-center justify-center flex-col w-full h-full px-4 mt-10">
      {/*  <h1*/}
      {/*      className="*/}
      {/*      flex flex-rows*/}
      {/*              hero-title hero-stroke*/}
      {/*              text-[var(--highlight)]*/}
      {/*              text-center*/}
      {/*              text-5xl sm:text-6xl md:text-7xl lg:text-8xl*/}
      {/*              tracking-wide font-[var(--hero-font,serif)]*/}
      {/*              -translate-y-2 sm:-translate-y-25*/}
      {/*              bg-[#e8dac8]*/}
      {/*              px-6 sm:px-10 md:px-14*/}
      {/*              py-4 sm:py-6*/}
      {/*              rounded-full*/}
      {/*              shadow-lg/50*/}
      {/*            "*/}
      {/*  >*/}
      {/*      <span*/}
      {/*          aria-hidden*/}
      {/*          className="pointer-events-none absolute inset-0 rounded-full"*/}
      {/*          style={{*/}
      {/*              padding: '3px',*/}
      {/*              background: 'linear-gradient(90deg,#0A7D43,#770e12,#FFFFFF)',*/}
      {/*              WebkitMask:*/}
      {/*                  'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',*/}
      {/*              WebkitMaskComposite: 'xor',*/}
      {/*              maskComposite: 'exclude',*/}
      {/*          } as React.CSSProperties}*/}
      {/*      />*/}
      {/*    S - Gym fitness*/}
      {/*  </h1>*/}
          <Link href="/auth/signin"
              className="inline-flex items-center justify-center rounded-full px-8 py-4
                       text-5xl sm:text-6xl font-semibold
                       text-black bg-[var(--highlight)] hover:bg-[#b8925f]
                       transition-colors shadow-[0_10px_25px_rgba(0,0,0,0.35)]
                       focus:outline-none focus:ring-4 focus:ring-[var(--highlight)]/40
                       transform-gpu duration-200
                       hover:scale-105 hover:-translate-y-0.5 active:scale-95"
          >
              Vytvor objednávku
          </Link>
      </div>
    </section>
  )
}
// ... existing code ...