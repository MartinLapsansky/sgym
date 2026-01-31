import React from "react";
import Image from "next/image";
import barber1 from "@/app/assets/photo-erik.jpg"
import barber2 from "@/app/assets/photo-jergi.jpeg"

const Barbers = () => {
  return (
    <div className="p-4 bg-[#333333] pb-20">
      <h2 className="text-2xl font-bold mb-4 text-center text-[var(--highlight)]">Barberi</h2>
      <p className="mb-6 italic text-center text-3xl w-1/3 mx-auto pb-3 text-amber-50">
        “U nás ťa zaručene nebude strihať amatér ktorý práve dokončil víkendový kurz,
        dlhoročné skúsenosti chlapcov ktorých strihanie napĺňa a robia to s radosťou
        nájdeš práve v našom Barber shope”
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative w-100 h-120 mb-2"> {/* Adjust width/height as needed for unified size */}
            <Image
              src={barber1} // Actual path to barber 1 image
              alt="Barber 1"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center top" }} // Crop example: focuses on top part; adjust "top" or use "50% 20%" for custom crop
              className="rounded-4xl"
            />
          </div>
          <p className="text-center text-5xl pt-5 text-[var(--highlight)]">ERIK</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-100 h-120 mb-2"> {/* Same dimensions as above for unification */}
            <Image
              src={barber2} // Actual path to barber 2 image
              alt="Barber 2"
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }} // Just resizes; adjust position if needed
              className="rounded-4xl"
            />
          </div>
          <p className="text-center text-5xl pt-5 text-[var(--highlight)]">JERGI</p>
        </div>
      </div>
    </div>
  );
};

export default Barbers;