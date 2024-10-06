import Image from "next/image";
import React from "react";
import { ArrowCornerDown } from "../icons/arrowCornerDown";
import { scrollIntoSection } from "@/utils/helpers/scrollIntoSection";

export const BannerHero2 = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center relative bg-gradient-to-t from-primary to-primary-yellow/5">
      <Image
        src={"/assets/images/Seminar-3 Infest USK.webp"}
        className="-z-10 object-cover opacity-80"
        priority
        fill
        sizes="100vw"
        alt="seminar-infest-usk"
      />
      <div className="flex flex-col text-primary-yellow items-center px-8 md:px-32 gap-10">
        <div className="relative w-52 h-12 ">
          <Image
            src={'/assets/images/Gabungan Logo.webp'}
            alt='gabungan-logo-instansi-terkait-infest-usk'
            fill
            sizes="40vw"
            className="px-4 py-1"
          />
        </div>        
        <h5 className="uppercase text-sm -my-3">
          Informatics Festival
        </h5>
        <p className="font-normal text-sm text-center">Temukan, Pelajari, dan Berkembang dengan menjadi bagian pada Informatics Festival Seminar.</p>
        <h1 className="text-7xl md:text-[10rem] lg:text-[13.6vw] text-center font-cattedrale tracking-wide">
          SEMINAR
        </h1>
        <button onClick={() => scrollIntoSection("seminar")} className="rounded-full mt-2 bg-primary-yellow/30 border-[0.4px] border-primary-yellow shadow-lg shadow-black/40 hover:opacity-80 duration-200 text-white px-4 py-2 font-medium text-sm flex gap-2 items-center">
          <p>Lebih lanjut</p>
          <ArrowCornerDown className="opacity-80"/>
        </button>        
      </div>
    </div>
  );
};
