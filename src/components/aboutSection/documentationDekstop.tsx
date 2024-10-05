import Image from "next/image";
import React from "react";

export const DocumentationDesktop = () => {
  return (
    <>
      <div className="absolute hover:scale-110 duration-200 top-1/2 w-1/2 h-[80%]">
        <div className="bg-gradient-to-t from-primary/90 border-[2.6px] border-primary-yellow to-primary via-primary/40 absolute inset-0 rounded-2xl z-30"></div>
        <Image
          src="/assets/images/Opening-2 Infest USK.webp"
          fill
          sizes="40vw"
          alt="opening-dokumentasi-infest-usk"
          className="object-cover rounded-2xl shadow-lg shadow-black"
        />
        <div className="absolute z-50 top-[4%] left-4 h-7 w-32">
          <Image
            fill
            sizes="40vw"
            src={"/assets/images/Gabungan Logo.webp"}            
            alt="gabungan-logo-instansi-terkait-infest"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute hover:scale-110 duration-200 z-50 top-0 left-[35%] w-[30%] h-3/4">
        <div className="bg-gradient-to-t from-primary/90 border-[2.6px] border-primary-yellow to-primary via-primary/40 absolute inset-0 rounded-2xl z-40"></div>
        <Image
          src="/assets/images/E-Sports Infest USK.webp"
          fill
          sizes="40vw"
          alt="coins-dokumentasi-infest-usk"
          className="object-cover object-left rounded-2xl shadow-lg shadow-black z-30"
        />
        <div className="absolute z-[100] top-3 right-[3.4%] h-7 w-32">
          <Image
            fill
            sizes="40vw"
            src={"/assets/images/Gabungan Logo.webp"}
            alt="gabungan-logo-instansi-terkait-infest"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute hover:scale-110 duration-200 -bottom-[78%] right-[15%] -z-10 w-[40%] h-3/4">
        <div className="bg-gradient-to-t from-primary/90 border-[2.6px] border-primary-yellow to-primary via-primary/40 absolute inset-0 rounded-2xl z-30"></div>
        <Image
          src="/assets/images/Seminar Infest USK.webp"
          fill
          sizes="40vw"
          alt="dokumentasi-infest-usk"
          className="object-cover rounded-2xl shadow-lg shadow-black"
        />
        <div className="absolute z-[100] bottom-[86%] right-[3%] h-7 w-32">
          <Image
            fill
            sizes="40vw"
            src={"/assets/images/Gabungan Logo.webp"}
            alt="gabungan-logo-instansi-terkait-infest"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute hover:scale-110 duration-200 -bottom-[12%] right-[0%] -z-20 w-[38%] h-3/4">
        <div className="bg-gradient-to-t from-primary/90 border-[2.6px] border-primary-yellow to-primary via-primary/40 absolute inset-0 rounded-2xl z-30"></div>
        <Image
          src="/assets/images/Seminar-4 Infest USK.webp"
          fill
          sizes="40vw"
          alt="dokumentasi-infest-usk"
          className="object-cover rounded-2xl shadow-lg shadow-black"
        />
        <div className="absolute z-[100] top-[4.2%] right-4 h-7 w-32">
          <Image
            fill
            sizes="40vw"
            src={"/assets/images/Gabungan Logo.webp"}
            alt="gabungan-logo-instansi-terkait-infest"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
};
