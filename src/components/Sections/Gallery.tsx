"use client"

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper";
import photo1 from "@/app/assets/photo1.jpg";
import photo2 from "@/app/assets/photo2.jpg";
import photo3 from "@/app/assets/photo3.jpg";
import photo4 from "@/app/assets/photo4.jpg";
import photo5 from "@/app/assets/photo5.jpg";
import photo6 from "@/app/assets/photo6.jpg";
import photo7 from "@/app/assets/photo7.jpg";
import photo8 from "@/app/assets/photo8.jpg";
import photo9 from "@/app/assets/photo9.jpg";
import photo10 from "@/app/assets/photo10.jpg";
import logoBarber from "@/app/assets/barber-removebg-preview.png";


// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/thumbs";
import "swiper/css/navigation";

// List of images (update paths if needed; assuming they are in public/assets for static serving)
const images = [
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
    photo7,
    photo8,
    photo9,
    photo10,
];

const Gallery = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);


    const openModal = (index: number) => {
        setActiveIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto py-8 w-full bg-[#bda589]">
            <h2 className="text-3xl font-bold text-center mb-6">Naša práca</h2>
            <div className="flex justify-center mb-8">
                <p className="text-center mb-8 text-3xl w-2/3 italic text-amber-50">Každý prechod, každá línia má svoj význam.
                    Nie je to len strih, ale rukopis remesla, ktoré spája štýl, presnosť a charakter.
                </p>
            </div>
            <div className="flex justify-center mb-8">
                <p className="flex text-center mb-8 text-3xl w-2/3 italic justify-center items-center text-[#85754e]">
                    <span className="font-bold text-[#85754e] text-4xl">Brothers Barber</span>
                    <Image src={logoBarber} alt="logo" width={50} height={30}/>
                    – tam, kde sa z detailu stáva podpis.
                </p>
            </div>

            <Swiper
              modules={[Autoplay, Thumbs, Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              thumbs={{ swiper: thumbsSwiper ?? undefined }}
              navigation
              watchOverflow
              className="mb-4 w-full max-w-3xl rounded-lg bg-[#bda589] shadow-lg mx-auto"
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <button
                    type="button"
                    className="relative block w-full overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openModal(index)}
                    aria-label={`Open full view of image ${index + 1}`}
                  >
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-black/10">
                      <Image
                        src={src}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>

                    <style jsx global>{`
                      @media (max-width: 640px) {
                        .swiper-button-prev,
                        .swiper-button-next {
                          display: none !important;
                        }
                      }
                    `}</style>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Full-Screen Modal Carousel */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        initialSlide={activeIndex}
                        loop
                        className="w-full max-w-4xl"
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    src={src}
                                    alt={`Full view image ${index + 1}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto max-h-screen object-contain"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>

    );
};

export default Gallery;