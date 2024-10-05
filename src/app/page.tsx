"use client";

import { Header } from "../components/header/header";
import { HeroSwiper } from "../components/heroSection/heroSwiper";
import { DocumentationDesktop } from "../components/aboutSection/documentationDekstop";
import { DocumentationMobile } from "../components/aboutSection/documentationMobile";
import Image from "next/image";
import { CompetitionSwiper } from '../components/competitionSection/competitionSwiper';
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";
import Marquee from "react-fast-marquee";
import { PartnerCard } from '../components/cards/partnerCard';
import { infestDescription } from '../data/tentangInfestSection';
import { partners } from '../data/partner';
import FooterDekstop from "@/components/footer/footerDekstop";
import FooterMobile from "@/components/footer/footerMobile";
import { SeminarSwiperImages } from "@/components/seminarSection/seminarSwiperImages";
import Link from "next/link";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { SwiperRef } from "swiper/react";

const Home = () => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const swiperRef: LegacyRef<SwiperRef> | null = useRef(null);
  const [activeKompetisiIndex, setActiveKompetisiIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const slideTo = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
      setActiveKompetisiIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className=" h-full w-full flex flex-col overflow-x-hidden">
      <div>
        <Header/>
      </div>
      <div id="hero">
        <HeroSwiper />
      </div>
      <div id="tentang-infest" className="flex flex-col w-full pt-14 px-8 md:px-12 lg:px-16 gap-12 relative bg-gradient-to-b from-primary via-transparent  to-primary">
        <Image
          src={"/assets/images/Pattern Infest USK.webp"}
          fill
          sizes="100vw"
          alt="Dokumentasi Tentang Infest USK"
          className="absolute inset-0 -z-10 object-cover opacity-30"
        />
        <h2 className={`text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue -mb-12`}>
          TENTANG INFEST
        </h2>
        <p className={`text-white text-[0.9rem] md:text-base text-center`}>
          {infestDescription}
        </p>
        {isDesktop && (
          <div className="w-full h-[50vh] relative flex z-20">
            <DocumentationDesktop />
          </div>
        )}
        {(isMobile || isTablet) && (
          <div className="flex -mx-2">
            <DocumentationMobile />
          </div>
        )}
        <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] lg:mt-[42vh]"></div>{/* line separator*/}
      </div>
      <div id="seminar" className="flex flex-col w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 relative bg-gradient-to-t from-primary to-transparent">
        <Image
          src={"https://jbymoblt3fzt0jez.public.blob.vercel-storage.com/asset-pattern-infest-1.webp"}
          width={700}
          height={700}
          alt="asset-pattern-infest-1"
          className="absolute right-0 top-0 md:-top-52 -z-10 object-cover opacity-50"
        />    
        <Image
          src={"https://jbymoblt3fzt0jez.public.blob.vercel-storage.com/asset-pattern-infest-2.webp"}
          width={800}
          height={800}
          alt="asset-pattern-infest-2"
          className="absolute left-0 bottom-32 md:-top-20 -z-10 object-cover opacity-50"
        />    
        <Image
          src={"https://jbymoblt3fzt0jez.public.blob.vercel-storage.com/asset-pattern-infest-1.webp"}
          width={700}
          height={700}
          alt="asset-pattern-infest-1"
          className="absolute rotate-180 left-0 top-48 -z-10 object-cover opacity-70"
        />    
        <div className="flex flex-col lg:flex-row lg:justify-between gap-14 w-full">        
          <div className="flex flex-col w-full lg:w-1/2 text-white gap-10">        
            <h2 className="text-[26vw] lg:text-[10rem] text-primary-yellow font-imbue lg:-mt-14 text-center lg:text-start">
              SEMINAR
            </h2>
            <p className="lg:text-justify -mt-8 lg:-mt-14 text-center">
            Seminar Nasional adalah acara yang memfasilitasi diskusi para ahli, praktisi, peneliti untuk berbagi pengetahuan, pengalaman, dan pemikiran terkini. Seminar nasional ini memiliki tema “Dream Big: Strategies for Achieving Greatness”, yang memberi pesan menginspirasi kepada peserta peserta untuk bermimpi besar dan memberikan strategi untuk mencapai prestasi yang luar biasa.
            </p>
            <div className="bg-primary-yellow/40 w-full h-[0.6px]"></div>
            <ul className="flex w-full divide-x-[0.6px] divide-primary-yellow/40">
              <li className="flex flex-col gap-3 items-center w-1/3 pr-2">
                <p className="font-bold">Waktu</p>
                <p className="lg:text-sm text-xs text-center text-wrap">09.00 WIB, 28 September 2024</p>
              </li>
              <li className="flex flex-col gap-3 items-center w-1/3 px-2">
                <p className="font-bold">Tempat</p>
                <p className="lg:text-sm text-xs text-center">Auditorium Multipurpose FMIPA USK</p>
              </li>
              <li className="pl-4 flex h-full items-end justify-end w-1/3">
                <Link href={"/seminar"} className="box text-xs font-bold flex flex-col w-full h-full items-center justify-center gap-2 p-3 shadow-balance-yellow-primary hover:scale-105 duration-200 hover:bg-black">
                  <Image
                    src={"https://jbymoblt3fzt0jez.public.blob.vercel-storage.com/arrow.webp"}
                    alt="arrow-daftar-seminar"
                    width={40}
                    height={40}
                  />
                  <p className="text-wrap text-center text-[0.58rem] md:text-[0.66rem]">DAFTAR SEKARANG</p>
                </Link>
              </li>
            </ul>
          </div>
          <SeminarSwiperImages/>
        </div>    
        <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-12"></div>{/* line separator*/}
      </div>
      <div id="kompetisi" className="flex flex-col relative w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 bg-gradient-to-b from-primary via-transparent to-primary">
        <Image
          src={"/assets/images/goldconfet Infest USK.webp"}
          fill
          sizes="100vw"
          alt="confetti-infest-usk"
          className="absolute inset-0 -z-10 object-left object-cover opacity-50"
        />
        <div className="flex flex-col lg:flex-row gap-14">    
          {(isDesktop) && (
            <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
              {isLoading ? (
                <p className="font-semibold animate-blink text-primary-yellow">MEMUAT...</p>
              ) : (
                <CompetitionSwiper swiperRef={swiperRef} setActiveIndex={setActiveKompetisiIndex}/>
              )}
            </div>
          )}
          <div className="flex flex-col lg:w-1/2 w-full gap-10">
            <h2 className="text-[26vw] lg:text-[10rem] text-center lg:text-start text-primary-yellow font-imbue lg:-mt-14">
              KOMPETISI
            </h2>
            <p className="text-white text-center lg:text-justify -mt-8 lg:-mt-14">
            Informatics Festival 2024 menyelenggarakan empat cabang lomba bergengsi. Uji keterampilan desain dan kreativitas Anda di Kompetisi UI/UX, tantang kemampuan teknis dan analitis di Kompetisi COINS, tunjukkan strategi dan kerjasama tim terbaik di Kompetisi E-sports, dan buktikan kecepatan serta ketepatan mengetik Anda di Kompetisi Speed Typing. Bergabunglah dan buktikan keahlian Anda di ajang prestisius ini, serta dapatkan pengalaman berharga dan peluang emas untuk bersinar di dunia digital!                                                                                        
            </p>
            <div className="bg-primary-yellow/40 w-full h-[0.6px] lg:mt-4"></div>
            {(isDesktop || isTablet) && (
              <div className="w-full flex justify-between gap-2.5">
                <button onClick={() => slideTo(0)} className={`${activeKompetisiIndex == 0 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>UI/UX</button>
                <button onClick={() => slideTo(1)} className={`${activeKompetisiIndex == 1 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>COINS</button>
                <button onClick={() => slideTo(2)} className={`${activeKompetisiIndex == 2 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>E-SPORTS</button>
                <button onClick={() => slideTo(3)} className={`${activeKompetisiIndex == 3 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}>Speed Typing</button>
              </div>
            )}
            {isMobile && (
               <div className="w-full grid grid-cols-2 justify-between gap-2.5">
                <button onClick={() => slideTo(0)} className={`${activeKompetisiIndex == 0 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>UI/UX</button>
                <button onClick={() => slideTo(1)} className={`${activeKompetisiIndex == 1 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>COINS</button>
                <button onClick={() => slideTo(2)} className={`${activeKompetisiIndex == 2 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>E-SPORTS</button>
                <button onClick={() => slideTo(3)} className={`${activeKompetisiIndex == 3 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}>Speed Typing</button>
              </div>
            )}
          </div>   
          {(isMobile || isTablet) && (
            <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
            {isLoading ? (
              <p className="font-semibold animate-blink text-primary-yellow">MEMUAT...</p>
            ) : (
              <CompetitionSwiper swiperRef={swiperRef} setActiveIndex={setActiveKompetisiIndex}/>
            )}
          </div>
          )} 
        </div>
        <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-11"></div>{/* line separator*/}
      </div>
      <div id="kerja-sama" className="flex flex-col relative w-full py-14 bg-gradient-to-b from-transparent to-secondary from-[35%]">
        <h2 className="text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue">
          KERJA SAMA
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center w-full lg:h-32 h-24 my-8">
            <p className="font-semibold text-primary-yellow animate-blink">MEMUAT...</p>
          </div>
        ) : (
          <Marquee direction="left" autoFill={true}>
            {partners.map((partner) => (
              <PartnerCard key={partner.nama} logoSrc={partner.src} width={partner.width} height={partner.height} logoClassName={partner.className}/>
            ))}
          </Marquee>
        )}
      </div>
      <div id="kontak" className="footer">
        {(isDesktop || isTablet) && (
          <FooterDekstop/>
        )}
        {isMobile && (
          <FooterMobile/>
        )}
      </div>
    </div>
  );
};

export default Home;
