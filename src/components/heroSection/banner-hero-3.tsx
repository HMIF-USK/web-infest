import Image from "next/image";
import React from "react";
import { ArrowCornerDown } from "../icons/arrowCornerDown";
import { scrollIntoSection } from "@/libs/helpers/scrollIntoSection";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";

export const BannerHero3 = () => {
  const {isMobile, isDesktop, isTablet} = useScreenSize();
  return (
    <div className="h-screen w-full flex justify-center items-center relative bg-gradient-to-t from-primary from-5% to-primary-yellow/5">
      <Image
        src={"/assets/images/Speed Typing Infest USK.webp"}
        className="-z-10 object-cover opacity-80"
        priority
        fill
        sizes="100vw"
        alt="kompetisi-infest-usk"
      />
      <div className="flex flex-col text-primary-yellow items-center px-8 md:px-32 gap-10 mt-[4.2rem]">
        <div className="relative w-52 h-12">
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
        <p className="font-normal text-sm text-center">Berwawasan dan Bersaing pada Kompetisi Informatics Festival. Jadilah Bintang di Ajang UI/UX, COINS, E-sports - Mobile Legends, dan Speed Typing!</p>
        <h1 className="text-7xl md:text-[10rem] lg:text-[13.6vw] text-center font-cattedrale tracking-wide">
          KOMPETISI
        </h1>
        {(isDesktop || isTablet) && (
          <div className="flex w-full justify-center px-2 gap-2 md:gap-6">
            <p className="border border-primary-yellow w-24 md:w-full lg:text-[1vw] text-xs flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">COINS</p>
            <p className="border border-primary-yellow w-24 md:w-full lg:text-[1vw] text-xs flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">UI/UX</p>
            <p className="border border-primary-yellow w-24 md:w-full lg:text-[1vw] text-[0.74rem] flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">E-SPORTS</p>
            <p className="border border-primary-yellow md:w-full lg:text-[1vw] text-[0.74rem] flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white text-center">SPEED TYPING</p>
          </div>
        )}
        {isMobile && (
          <div className="grid grid-cols-2 gap-4 justify-center">
            <p className="border border-primary-yellow md:w-full lg:text-[1vw] text-xs flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">COINS</p>
            <p className="border border-primary-yellow md:w-full lg:text-[1vw] text-xs flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">UI/UX</p>
            <p className="border border-primary-yellow md:w-full lg:text-[1vw] text-[0.74rem] flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white">E-SPORTS</p>
            <p className="border border-primary-yellow md:w-full lg:text-[1vw] text-[0.74rem] flex items-center justify-center bg-primary-yellow/30 rounded-full px-4 py-2.5 shadow-lg shadow-black/60 text-white text-center">SPEED TYPING</p>
          </div>
        )}
        <button onClick={() => scrollIntoSection("kompetisi")} className="rounded-full -mt-[0.6vh] bg-primary-yellow/30 border-[0.4px] border-primary-yellow shadow-lg shadow-black/60 hover:opacity-80 duration-200 text-white px-4 py-2 font-medium text-sm lg:text-[1vw] flex gap-2 items-center">
          <p>Lebih lanjut</p>
          <ArrowCornerDown className="opacity-80"/>
        </button>        
      </div>
    </div>
  );
};
