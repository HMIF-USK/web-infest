import { montserrat } from "@/fonts/fonts";
import React from "react";
import { Arrow } from "../icons/arrow";
import Link from "next/link";
import Image from "next/image";

interface CompetitionCardProps {
    namaLomba: string;
    linkPendaftaran: string;
    fotoDepan: string;
    kepanjangan: string;
    jadwalPendaftaran: string;
    jadwalPelaksanaan: string;
    totalHadiah: string;
    bukuPanduan: string;
}

export const CompetitionCard = (props: CompetitionCardProps) => {
  return (
    <div className={`flex flex-col group h-full w-full px-6 py-8 justify-between bg-gradient-to-b to-black relative rounded-xl text-white ${props.namaLomba === 'UI/UX' ? 'from-primary-yellow/60 via-black/80' : 'from-primary-yellow/40 via-black/65'}`}>
      <div className="absolute w-full h-full inset-0 -z-10">
        <Image
          src={props.fotoDepan}
          alt="foto-depan-lomba-infest-usk"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="rounded-lg object-cover"
          />
      </div>
      <div className="flex flex-col gap-2 items-center lg:group-hover:scale-[1.16] duration-300">      
        <h3 className={`font-cattedrale text-white text-center lg:text-7xl ${props.namaLomba === "Speed Typing" ? 'text-[2.86rem]' : 'text-6xl'}`}>{props.namaLomba}</h3>
        <p className="text-xs md:text-[1rem] font-bold">{props.kepanjangan}</p>
      </div>
      <div className="flex flex-col gap-1 md:gap-3 lg:group-hover:scale-105 duration-300 lg:group-hover:px-2">
        <p className="font-bold text-xs md:text-[1.06rem]">Pendaftaran</p>
        <p className={`text-xs md:text-[0.9rem] w-full font-normal text-left`}>{props.jadwalPendaftaran}</p>
      </div>
      <div className="flex flex-col gap-1 md:gap-3 lg:group-hover:scale-105 duration-300 lg:group-hover:px-2">
        <p className="font-bold text-xs md:text-[1.06rem]">Pelaksanaan</p>
        <p className={`text-xs md:text-[0.9rem] w-full font-normal text-left`}>{props.jadwalPelaksanaan}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <Link href={props.bukuPanduan} target="_blank" className={`shadow-balance-yellow-primary rounded-2xl duration-200 bg-black/60 border-2 hover:scale-[1.03] hover:border-secondary-yellow/30 border-secondary-yellow flex justify-between items-center text-xs w-full px-4 py-2 gap-4 ${montserrat.className}`}>
          <p className="font-bold py-1 md:text-sm">Buku Panduan</p>
          <Arrow />
        </Link>
        <Link href={props.linkPendaftaran} target="_blank" className={`shadow-balance-yellow-primary rounded-2xl duration-200 bg-secondary-yellow/30 border-2 hover:scale-[1.03] hover:border-secondary-yellow/30 border-secondary-yellow flex justify-between items-center text-xs w-full px-4 py-2 gap-4 ${montserrat.className}`}>
          <p className="font-bold py-1 md:text-sm ">Daftar Sekarang</p>
          <Arrow />
        </Link>
      </div>
    </div>
  );
};
