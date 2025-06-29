import { dm_serif_display } from "@/app/fonts/fonts";
import Image from "next/image";
import React from "react";

export const LoadingAnimation = ({ loadingText }: { loadingText: string }) => {
  return (
    <div className="w-screen h-screen bg-brand_02/60 backdrop-blur absolute inset-0 flex flex-col justify-center items-center z-50">
      <Image
        src="/assets/images/Infest 2025 1st Logo Outline.png"
        alt="Informatics Festival (Infest) HMIF USK Logo"
        width={500}
        height={500}
        className="object-cover h-24 w-24 filter drop-shadow-[0_0_40px_rgba(242,233,197,0.8)] mb-4"
      />
      <p
        className={`font-bold text-lg ${dm_serif_display.className} animate-blink text-neutral_01`}
      >
        {loadingText}...
      </p>
    </div>
  );
};
