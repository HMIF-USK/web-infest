import Image from "next/image";
import React from "react";

export const BannerHero1 = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center relative bg-gradient-to-t from-primary from-5% to-secondary-yellow/5">
      <Image
        src={"/assets/images/Opening Infest USK.webp"}
        className="-z-10 object-cover opacity-60"
        priority
        fill
        sizes="100vw"
        alt="banner-hero-infest-usk"
      />
      <div className="flex flex-col text-primary-yellow items-center px-8 md:px-32 md:mt-16">
        <div className="relative w-52 h-12 ">
          <Image
            src={'/assets/images/Gabungan Logo.webp'}
            alt='gabungan-logo-instansi-terkait-infest-usk'
            fill
            sizes="40vw"
            className="px-4 py-1"
          />
        </div> 
        <p className="text-sm -mx-8 my-11">16 AGUSTUS 2024 - 26 Oktober 2024</p>
        <h1 className="text-7xl md:text-[10rem] lg:text-[13.6vw] text-center font-cattedrale tracking-wide">
          INFEST
        </h1>
        <h1 className="text-[7vw] font-cattedrale-outline relative text-center mt-4">
          Informatics Festival
        </h1>        
      </div>
    </div>
  );
};
