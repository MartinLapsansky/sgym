"use client"

import React, {useEffect, useState} from "react"
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Image from "next/image";
import logo from "../../app/assets/S gym.png"
import {useRouter, usePathname} from "next/navigation";

// const sections = []

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();  // For navigation
    const pathname = usePathname();  // Current page path
    const [isScrolled, setIsScrolled] = useState(false);

    const scrollTo = (id: string) => {
        if (pathname === '/') {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
        } else {
            router.push(`/#${id}`);
        }
        setIsMenuOpen(false);
    }

    useEffect(() => {
        const thresholdPx = 40;

        const onScroll = () => {
            setIsScrolled(window.scrollY > thresholdPx);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
    <header className="fixed inset-x-0 top-0 z-50">
       {/*background layer with transparency */}
        <div
            className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300 ${
                isScrolled ? "opacity-90" : "opacity-0"
            }`}
            style={{ backgroundImage: "url('/background-header.png')" }}
            aria-hidden="true"
        />

        {/* content layer */}
      <div className="relative flex justify-between w-full shadow-md">
        <div className="flex justify-between w-full container mx-auto px-4 py-4">
          <div className="flex items-center md justify-between w-full:flex w-full">
            <div className="flex text-2xl font-bold">
              <a
                href="#"
                className="relative inline-block group rounded-full overflow-hidden"
                aria-label="Domov"
              >
                <Image
                  src={logo}
                  alt="Logo"
                  width={150}
                  height={150}
                  className="block rounded-full object-cover"
                  onClick={() => router.push("/")}
                />
                <span
                  className="pointer-events-none absolute inset-0 rounded-full
                             before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:border-2 before:border-[var(--highlight)]
                             before:opacity-0 before:scale-95
                             before:transition-[opacity,transform] before:duration-500
                             group-hover:before:opacity-100 group-hover:before:scale-100"
                />
              </a>
            </div>

            {/*<nav className="hidden md:flex justify-center space-x-6 gap-6 w-full">*/}
            {/*  {sections.map((section) => (*/}
            {/*    <button*/}
            {/*      key={section}*/}
            {/*      onClick={() => scrollTo(section.toLowerCase())}*/}
            {/*      className="text-gray-300 text-4xl hover:text-[var(--highlight)] transition-colors cursor-pointer"*/}
            {/*    >*/}
            {/*      {section}*/}
            {/*    </button>*/}
            {/*  ))}*/}
            {/*</nav>*/}

            <button
              className="flex md:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
            >
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer", fontSize: "3rem", color: "white" }} />
              ) : (
                <FontAwesomeIcon icon={faBars} style={{ cursor: "pointer", fontSize: "3rem", color: "white" }} />
              )}
            </button>
          </div>

          {/* Mobile overlay panel */}
          <div
            className={`md:hidden fixed inset-y-0 right-0 z-40 w-1/2 max-w-[480px] bg-white shadow-2xl
                        transform transition-transform duration-300 ease-out
                        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-end px-4 py-4 border-b">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl"
                  aria-label="Zavrieť menu"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              {/*<nav className="flex-1 overflow-y-auto py-4">*/}
              {/*  {sections.map((section) => (*/}
              {/*    <button*/}
              {/*      key={section}*/}
              {/*      onClick={() => scrollTo(section.toLowerCase())}*/}
              {/*      className="block w-full text-center py-4 px-6 text-3xl text-gray-700 hover:bg-gray-200 transition-colors"*/}
              {/*    >*/}
              {/*      {section}*/}
              {/*    </button>*/}
              {/*  ))}*/}
              {/*</nav>*/}
            </div>
          </div>

          {/* Backdrop */}
          <button
            className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Zavrieť menu"
          />
        </div>
      </div>
    </header>
  )
}