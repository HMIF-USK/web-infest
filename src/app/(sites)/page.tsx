"use client";

import { Header } from "@/components/header";
import { HeroSwiper } from "@/components/heroSection/heroSwiper";
import { DocumentationDesktop } from "@/components/aboutSection/documentationDekstop";
import { DocumentationMobile } from "@/components/aboutSection/documentationMobile";
import Image from "next/image";
import { CompetitionSwiper } from "@/components/competitionSection/competitionSwiper";
import { useScreenSize } from "@/libs/hooks/screenSizeValidation";
import Marquee from "react-fast-marquee";
import { PartnerCard } from "@/components/cards/partnerCard";
import { infestDescription } from "@/data/tentangInfestSection";
import { partners } from "@/data/partner";
import FooterDekstop from "@/components/footer/footerDekstop";
import FooterMobile from "@/components/footer/footerMobile";
import { SeminarSwiperImages } from "@/components/seminarSection/seminarSwiperImages";
import Link from "next/link";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { SwiperRef } from "swiper/react";
import { ThreeDMarquee } from "@/components/3dMarquee";

// const Home = () => {
//   const { isMobile, isTablet, isDesktop } = useScreenSize();
//   const swiperRef: LegacyRef<SwiperRef> | null = useRef(null);
//   const [activeKompetisiIndex, setActiveKompetisiIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const slideTo = (index: number) => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.slideTo(index);
//       setActiveKompetisiIndex(index);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className=" h-full w-full flex flex-col overflow-x-hidden">
//       <div>
//         <Header/>
//       </div>
//       <div id="hero">
//         <HeroSwiper />
//       </div>
//       <div id="tentang-infest" className="flex flex-col w-full pt-14 px-8 md:px-12 lg:px-16 gap-12 relative bg-gradient-to-b from-primary via-transparent  to-primary">
//         <Image
//           src={"/assets/images/Pattern Infest USK.webp"}
//           fill
//           sizes="100vw"
//           alt="Dokumentasi Tentang Infest USK"
//           className="absolute inset-0 -z-10 object-cover opacity-30"
//         />
//         <h2 className={`text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue -mb-12`}>
//           TENTANG INFEST
//         </h2>
//         <p className={`text-white text-[0.9rem] md:text-base text-center`}>
//           {infestDescription}
//         </p>
//         {isDesktop && (
//           <div className="w-full h-[50vh] relative flex z-20">
//             <DocumentationDesktop />
//           </div>
//         )}
//         {(isMobile || isTablet) && (
//           <div className="flex -mx-2">
//             <DocumentationMobile />
//           </div>
//         )}
//         <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] lg:mt-[42vh]"></div>
//       </div>
//       <div id="seminar" className="flex flex-col w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 relative bg-gradient-to-t from-primary to-transparent">
//         <Image
//           src={"/assets/images/Asset Pattern Infest USK-1.webp"}
//           width={700}
//           height={700}
//           alt="asset-pattern-infest-1"
//           className="absolute right-0 top-0 md:-top-52 -z-10 object-cover opacity-30"
//         />
//         <Image
//           src={"/assets/images/Asset Pattern Infest USK-2.webp"}
//           width={800}
//           height={800}
//           alt="asset-pattern-infest-2"
//           className="absolute left-0 bottom-32 md:-top-20 -z-10 object-cover opacity-30"
//         />
//         <Image
//           src={"/assets/images/Asset Pattern Infest USK-1.webp"}
//           width={700}
//           height={700}
//           alt="asset-pattern-infest-1"
//           className="absolute rotate-180 left-0 top-48 -z-10 object-cover opacity-50"
//         />
//         <div className="flex flex-col lg:flex-row lg:justify-between gap-14 w-full">
//           <div className="flex flex-col w-full lg:w-1/2 text-white gap-10">
//             <h2 className="text-[26vw] lg:text-[10rem] text-primary-yellow font-imbue lg:-mt-14 text-center lg:text-start">
//               SEMINAR
//             </h2>
//             <p className="lg:text-justify -mt-8 lg:-mt-14 text-center">
//             Seminar Nasional adalah acara yang memfasilitasi diskusi para ahli, praktisi, peneliti untuk berbagi pengetahuan, pengalaman, dan pemikiran terkini. Seminar nasional ini memiliki tema “Dream Big: Strategies for Achieving Greatness”, yang memberi pesan menginspirasi kepada peserta peserta untuk bermimpi besar dan memberikan strategi untuk mencapai prestasi yang luar biasa.
//             </p>
//             <div className="bg-primary-yellow/40 w-full h-[0.6px]"></div>
//             <ul className="flex w-full divide-x-[0.6px] divide-primary-yellow/40">
//               <li className="flex flex-col gap-3 items-center w-1/3 pr-2">
//                 <p className="font-bold">Waktu</p>
//                 <p className="lg:text-sm text-xs text-center text-wrap w-4/5">Sabtu, 26 Oktober 2024, 09.00 - 12.00 WIB</p>
//               </li>
//               <li className="flex flex-col gap-3 items-center w-1/3 px-2">
//                 <p className="font-bold">Tempat</p>
//                 <p className="lg:text-sm text-xs text-center">Auditorium Multipurpose FMIPA USK</p>
//               </li>
//               <li className="pl-4 flex h-full items-end justify-end w-1/3">
//                 <Link href={"https://bit.ly/Semnas-InfestX"} target="_blank" className="box text-xs font-bold flex flex-col w-full h-full items-center justify-center gap-2 p-3  hover:scale-105 duration-200 hover:bg-black">
//                   <Image
//                     src={"/assets/images/arrow.webp"}
//                     alt="arrow-daftar-seminar"
//                     width={40}
//                     height={40}
//                   />
//                   <p className="text-wrap text-center text-[0.58rem] md:text-[0.66rem]">DAFTAR SEKARANG</p>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <SeminarSwiperImages/>
//         </div>
//         <Image
//           src={"/assets/images/Seminar Infest USK 2024.webp"}
//           width={800}
//           height={800}
//           alt="Seminar Infest USK 2024"
//           className="w-full h-fullobject-cover rounded-xl shadow-balance-yellow-primary border-[1.6px] border-primary-yellow"
//         />
//         <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-12"></div>
//       </div>
//       <div id="kompetisi" className="flex flex-col relative w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 bg-gradient-to-b from-primary via-transparent to-primary">
//         <Image
//           src={"/assets/images/goldconfet Infest USK.webp"}
//           fill
//           sizes="100vw"
//           alt="confetti-infest-usk"
//           className="absolute inset-0 -z-10 object-left object-cover opacity-50"
//         />
//         <div className="flex flex-col lg:flex-row gap-14">
//           {(isDesktop) && (
//             <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
//               {isLoading ? (
//                 <p className="font-semibold animate-blink text-primary-yellow">MEMUAT...</p>
//               ) : (
//                 <CompetitionSwiper swiperRef={swiperRef} setActiveIndex={setActiveKompetisiIndex}/>
//               )}
//             </div>
//           )}
//           <div className="flex flex-col lg:w-1/2 w-full gap-10">
//             <h2 className="text-[26vw] lg:text-[10rem] text-center lg:text-start text-primary-yellow font-imbue lg:-mt-14">
//               KOMPETISI
//             </h2>
//             <p className="text-white text-center lg:text-justify -mt-8 lg:-mt-14">
//             Informatics Festival 2024 menyelenggarakan empat cabang lomba bergengsi. Uji keterampilan desain dan kreativitas Anda di Kompetisi UI/UX, tantang kemampuan teknis dan analitis di Kompetisi COINS, tunjukkan strategi dan kerjasama tim terbaik di Kompetisi E-sports, dan buktikan kecepatan serta ketepatan mengetik Anda di Kompetisi Speed Typing. Bergabunglah dan buktikan keahlian Anda di ajang prestisius ini, serta dapatkan pengalaman berharga dan peluang emas untuk bersinar di dunia digital!
//             </p>
//             <div className="bg-primary-yellow/40 w-full h-[0.6px] lg:mt-4"></div>
//             {(isDesktop || isTablet) && (
//               <div className="w-full flex justify-between gap-2.5">
//                 <button onClick={() => slideTo(0)} className={`${activeKompetisiIndex == 0 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>UI/UX</button>
//                 <button onClick={() => slideTo(1)} className={`${activeKompetisiIndex == 1 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>COINS</button>
//                 <button onClick={() => slideTo(2)} className={`${activeKompetisiIndex == 2 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>E-SPORTS</button>
//                 <button onClick={() => slideTo(3)} className={`${activeKompetisiIndex == 3 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}>Speed Typing</button>
//               </div>
//             )}
//             {isMobile && (
//                <div className="w-full grid grid-cols-2 justify-between gap-2.5">
//                 <button onClick={() => slideTo(0)} className={`${activeKompetisiIndex == 0 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>UI/UX</button>
//                 <button onClick={() => slideTo(1)} className={`${activeKompetisiIndex == 1 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>COINS</button>
//                 <button onClick={() => slideTo(2)} className={`${activeKompetisiIndex == 2 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}>E-SPORTS</button>
//                 <button onClick={() => slideTo(3)} className={`${activeKompetisiIndex == 3 && 'bg-primary-yellow/60'} shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}>Speed Typing</button>
//               </div>
//             )}
//           </div>
//           {(isMobile || isTablet) && (
//             <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
//             {isLoading ? (
//               <p className="font-semibold animate-blink text-primary-yellow">MEMUAT...</p>
//             ) : (
//               <CompetitionSwiper swiperRef={swiperRef} setActiveIndex={setActiveKompetisiIndex}/>
//             )}
//           </div>
//           )}
//         </div>
//         <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-11"></div>
//       </div>
//       <div id="kerja-sama" className="flex flex-col relative w-full py-14 bg-gradient-to-b from-transparent to-secondary from-[35%]">
//         <h2 className="text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue">
//           KERJA SAMA
//         </h2>
//         {isLoading ? (
//           <div className="flex justify-center items-center w-full lg:h-32 h-24 my-8">
//             <p className="font-semibold text-primary-yellow animate-blink">MEMUAT...</p>
//           </div>
//         ) : (
//           <>
//             <Marquee direction="left" autoFill={true}>
//               {partners
//                 .sort((a, b) => a.id - b.id)
//                 .map((partner) => (
//                 <PartnerCard key={partner.nama} logoSrc={partner.src} width={partner.width} height={partner.height} logoClassName={partner.className}/>
//               ))}
//             </Marquee>
//             <Marquee direction="right" autoFill={true} className="-mt-7">
//                 {partners
//                 .sort((a, b) => b.id - a.id)
//                 .map((partner) => (
//                   <PartnerCard key={partner.nama} logoSrc={partner.src} width={partner.width} height={partner.height} logoClassName={partner.className}/>
//                 ))}
//             </Marquee>
//           </>
//         )}
//       </div>
//       <div id="kontak" className="footer">
//         {(isDesktop || isTablet) && (
//           <FooterDekstop/>
//         )}
//         {isMobile && (
//           <FooterMobile/>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

const Home = () => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const swiperRef: LegacyRef<SwiperRef> | null = useRef(null);
  const [activeKompetisiIndex, setActiveKompetisiIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarqueeLoading, setIsMarqueeLoading] = useState(true);
  const images = [
    "/assets/images/infest-1.jpg",
    "/assets/images/infest-2.JPG",
    "/assets/images/infest-3.JPG",
    "/assets/images/infest-4.JPG",
    "/assets/images/infest-25.JPG",
    "/assets/images/infest-5.JPG",
    "/assets/images/infest-6.JPG",
    "/assets/images/infest-22.JPG",
    "/assets/images/infest-7.JPG",
    "/assets/images/infest-26.JPG",
    "/assets/images/infest-8.JPG",
    "/assets/images/infest-4.JPG",
    "/assets/images/infest-9.JPG",
    "/assets/images/infest-10.JPG",
    "/assets/images/infest-24.JPG",
    "/assets/images/infest-12.JPG",
    "/assets/images/infest-1.jpg",
    "/assets/images/infest-13.JPG",
    "/assets/images/infest-11.JPG",
    "/assets/images/infest-7.JPG",
    "/assets/images/infest-15.JPG",
    "/assets/images/infest-4.JPG",
    "/assets/images/infest-16.JPG",
    "/assets/images/infest-6.JPG",
    "/assets/images/infest-24.JPG",
    "/assets/images/infest-4.JPG",
    "/assets/images/infest-19.JPG",
    "/assets/images/infest-18.JPG",
    "/assets/images/infest-7.JPG",
    "/assets/images/infest-20.JPG",
    "/assets/images/infest-21.JPG",
    "/assets/images/infest-22.JPG",
    "/assets/images/infest-1.jpg",
    "/assets/images/infest-23.JPG",
    "/assets/images/infest-24.JPG",
    "/assets/images/infest-25.JPG",
    "/assets/images/infest-26.JPG",
    "/assets/images/infest-27.JPG",
  ];

  const slideTo = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
      setActiveKompetisiIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsMarqueeLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full h-full flex flex-col">
      <section className="w-full h-screen flex">
        <div className="bg-neutral_01 rounded-2xl shadow-lg m-auto w-4/5 h-[70%] translate-y-10 relative">
          <Image
            src="/assets/images/tongkat.png"
            alt="Informatics Festival (Infest) HMIF USK"
            width={800}
            height={800}
            className="object-cover absolute w-2/3 md:w-1/3 bottom-0"
          />
        </div>
      </section>
      <div className="w-full h-24 bg-neutral_01 shadow-2xl shadow-neutral_01"></div>
      <section className="px-20 w-full h-screen relative flex">
        <Image
          src="/assets/images/shine.png"
          alt="Informatics Festival (Infest) HMIF USK"
          width={800}
          height={800}
          className="object-cover w-full h-full z-0 absolute inset-0 opacity-50"
        />
        <div className="w-full h-screen absolute inset-0 z-10 bg-gradient-to-t from-brand_01 via-transparent to-transparent"></div>
        <div className="flex justify-center gap-20 items-center w-full h-full z-20">
          <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
          <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
          <div className="w-1/3 h-1/2 bg-white/10 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/30"></div>
        </div>
      </section>
      <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-neutral_01 to-transparent"></div>

      {/* LAST INFEST */}
      <section className="w-full h-screen flex flex-col gap-12 mt-12 px-20">
        <div className="flex flex-col gap-2 justify-center text-center">
          <h2 className="font-bold text-7xl text-neutral_01">
            Rollback the Glory.
          </h2>
          <p className="text-neutral_01">Informatics Festival 2024</p>
        </div>
        <div className="m-auto w-full h-[80vh] rounded-3xl bg-white/10 backdrop-blur-md p-2 flex ring-1 ring-neutral-700/10 dark:bg-neutral_01 relative shadow-[0_0_40px_rgba(242,233,197,0.8)] floating-element">
          {!isMarqueeLoading ? (
            <ThreeDMarquee images={images} />
          ) : (
            <div className="m-auto flex flex-col animate-blink">
              <Image
                src="/assets/images/logo-2025.png"
                alt="Loading"
                width={100}
                height={100}
                className="m-auto mb-2"
              />
              <p className="font-bold text-brand_01">Loading...</p>
            </div>
          )}
          <div className="w-full h-full bg-black/20 absolute inset-0 rounded-3xl flex justify-center items-center">
            {/* <h3 className="text-neutral_01 text-8xl font-bold">2024</h3> */}
          </div>
        </div>
      </section>
      <section className="w-full h-screen flex">
        <div className="bg-neutral_01 rounded-2xl shadow-lg m-auto w-4/5 h-[70%] translate-y-10 relative">
          <Image
            src="/assets/images/tongkat.png"
            alt="Informatics Festival (Infest) HMIF USK"
            width={800}
            height={800}
            className="object-cover absolute w-2/3 md:w-1/3 bottom-0"
          />
        </div>
      </section>
      {/* <div className="bg-primary h-full w-full flex flex-col overflow-x-hidden">
        <div>
          <Header />
        </div>
        <div id="hero">
          <HeroSwiper />
        </div>
        <div
          id="tentang-infest"
          className="flex flex-col w-full pt-14 px-8 md:px-12 lg:px-16 gap-12 relative bg-gradient-to-b from-primary via-transparent  to-primary"
        >
          <Image
            src={"/assets/images/Pattern Infest USK.webp"}
            fill
            sizes="100vw"
            alt="Dokumentasi Tentang Infest USK"
            className="absolute inset-0 -z-10 object-cover opacity-30"
          />
          <h2
            className={`text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue -mb-12`}
          >
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
          <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] lg:mt-[42vh]"></div>
        </div>
        <div
          id="seminar"
          className="flex flex-col w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 relative bg-gradient-to-t from-primary to-transparent"
        >
          <Image
            src={"/assets/images/Asset Pattern Infest USK-1.webp"}
            width={700}
            height={700}
            alt="asset-pattern-infest-1"
            className="absolute right-0 top-0 md:-top-52 -z-10 object-cover opacity-30"
          />
          <Image
            src={"/assets/images/Asset Pattern Infest USK-2.webp"}
            width={800}
            height={800}
            alt="asset-pattern-infest-2"
            className="absolute left-0 bottom-32 md:-top-20 -z-10 object-cover opacity-30"
          />
          <Image
            src={"/assets/images/Asset Pattern Infest USK-1.webp"}
            width={700}
            height={700}
            alt="asset-pattern-infest-1"
            className="absolute rotate-180 left-0 top-48 -z-10 object-cover opacity-50"
          />
          <div className="flex flex-col lg:flex-row lg:justify-between gap-14 w-full">
            <div className="flex flex-col w-full lg:w-1/2 text-white gap-10">
              <h2 className="text-[26vw] lg:text-[10rem] text-primary-yellow font-imbue lg:-mt-14 text-center lg:text-start">
                SEMINAR
              </h2>
              <p className="lg:text-justify -mt-8 lg:-mt-14 text-center">
                Seminar Nasional adalah acara yang memfasilitasi diskusi para
                ahli, praktisi, peneliti untuk berbagi pengetahuan, pengalaman,
                dan pemikiran terkini. Seminar nasional ini memiliki tema “Dream
                Big: Strategies for Achieving Greatness”, yang memberi pesan
                menginspirasi kepada peserta peserta untuk bermimpi besar dan
                memberikan strategi untuk mencapai prestasi yang luar biasa.
              </p>
              <div className="bg-primary-yellow/40 w-full h-[0.6px]"></div>
              <ul className="flex w-full divide-x-[0.6px] divide-primary-yellow/40">
                <li className="flex flex-col gap-3 items-center w-1/3 pr-2">
                  <p className="font-bold">Waktu</p>
                  <p className="lg:text-sm text-xs text-center text-wrap w-4/5">
                    Sabtu, 26 Oktober 2024, 09.00 - 12.00 WIB
                  </p>
                </li>
                <li className="flex flex-col gap-3 items-center w-1/3 px-2">
                  <p className="font-bold">Tempat</p>
                  <p className="lg:text-sm text-xs text-center">
                    Auditorium Multipurpose FMIPA USK
                  </p>
                </li>
                <li className="pl-4 flex h-full items-end justify-end w-1/3">
                  <Link
                    href={"https://bit.ly/Semnas-InfestX"}
                    target="_blank"
                    className="box text-xs font-bold flex flex-col w-full h-full items-center justify-center gap-2 p-3  hover:scale-105 duration-200 hover:bg-black"
                  >
                    <Image
                      src={"/assets/images/arrow.webp"}
                      alt="arrow-daftar-seminar"
                      width={40}
                      height={40}
                    />
                    <p className="text-wrap text-center text-[0.58rem] md:text-[0.66rem]">
                      DAFTAR SEKARANG
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
            <SeminarSwiperImages />
          </div>
          <Image
            src={"/assets/images/Seminar Infest USK 2024.webp"}
            width={800}
            height={800}
            alt="Seminar Infest USK 2024"
            className="w-full h-fullobject-cover rounded-xl shadow-balance-yellow-primary border-[1.6px] border-primary-yellow"
          />
          <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-12"></div>
        </div>
        <div
          id="kompetisi"
          className="flex flex-col relative w-full pt-14 lg:pt-32 px-8 md:px-16 gap-12 bg-gradient-to-b from-primary via-transparent to-primary"
        >
          <Image
            src={"/assets/images/goldconfet Infest USK.webp"}
            fill
            sizes="100vw"
            alt="confetti-infest-usk"
            className="absolute inset-0 -z-10 object-left object-cover opacity-50"
          />
          <div className="flex flex-col lg:flex-row gap-14">
            {isDesktop && (
              <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
                {isLoading ? (
                  <p className="font-semibold animate-blink text-primary-yellow">
                    MEMUAT...
                  </p>
                ) : (
                  <CompetitionSwiper
                    swiperRef={swiperRef}
                    setActiveIndex={setActiveKompetisiIndex}
                  />
                )}
              </div>
            )}
            <div className="flex flex-col lg:w-1/2 w-full gap-10">
              <h2 className="text-[26vw] lg:text-[10rem] text-center lg:text-start text-primary-yellow font-imbue lg:-mt-14">
                KOMPETISI
              </h2>
              <p className="text-white text-center lg:text-justify -mt-8 lg:-mt-14">
                Informatics Festival 2024 menyelenggarakan empat cabang lomba
                bergengsi. Uji keterampilan desain dan kreativitas Anda di
                Kompetisi UI/UX, tantang kemampuan teknis dan analitis di
                Kompetisi COINS, tunjukkan strategi dan kerjasama tim terbaik di
                Kompetisi E-sports, dan buktikan kecepatan serta ketepatan
                mengetik Anda di Kompetisi Speed Typing. Bergabunglah dan
                buktikan keahlian Anda di ajang prestisius ini, serta dapatkan
                pengalaman berharga dan peluang emas untuk bersinar di dunia
                digital!
              </p>
              <div className="bg-primary-yellow/40 w-full h-[0.6px] lg:mt-4"></div>
              {(isDesktop || isTablet) && (
                <div className="w-full flex justify-between gap-2.5">
                  <button
                    onClick={() => slideTo(0)}
                    className={`${
                      activeKompetisiIndex == 0 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    UI/UX
                  </button>
                  <button
                    onClick={() => slideTo(1)}
                    className={`${
                      activeKompetisiIndex == 1 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    COINS
                  </button>
                  <button
                    onClick={() => slideTo(2)}
                    className={`${
                      activeKompetisiIndex == 2 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    E-SPORTS
                  </button>
                  <button
                    onClick={() => slideTo(3)}
                    className={`${
                      activeKompetisiIndex == 3 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}
                  >
                    Speed Typing
                  </button>
                </div>
              )}
              {isMobile && (
                <div className="w-full grid grid-cols-2 justify-between gap-2.5">
                  <button
                    onClick={() => slideTo(0)}
                    className={`${
                      activeKompetisiIndex == 0 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    UI/UX
                  </button>
                  <button
                    onClick={() => slideTo(1)}
                    className={`${
                      activeKompetisiIndex == 1 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    COINS
                  </button>
                  <button
                    onClick={() => slideTo(2)}
                    className={`${
                      activeKompetisiIndex == 2 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200`}
                  >
                    E-SPORTS
                  </button>
                  <button
                    onClick={() => slideTo(3)}
                    className={`${
                      activeKompetisiIndex == 3 && "bg-primary-yellow/60"
                    } shadow-lg shadow-black border border-primary-yellow/40 rounded-xl font-bold px-4 py-3 w-full text-white text-[0.76rem] lg:text-sm lg:hover:scale-105 duration-200 uppercase`}
                  >
                    Speed Typing
                  </button>
                </div>
              )}
            </div>
            {(isMobile || isTablet) && (
              <div className="overflow-hidden pb-10 lg:w-1/2 -mx-8 lg:-mx-0 flex justify-center items-center">
                {isLoading ? (
                  <p className="font-semibold animate-blink text-primary-yellow">
                    MEMUAT...
                  </p>
                ) : (
                  <CompetitionSwiper
                    swiperRef={swiperRef}
                    setActiveIndex={setActiveKompetisiIndex}
                  />
                )}
              </div>
            )}
          </div>
          <div className="bg-gradient-to-r from-transparent to-transparent via-primary-yellow from-10% to-90% w-full h-[0.1rem] mt-8 lg:mt-11"></div>
          
        </div>
        <div
          id="kerja-sama"
          className="flex flex-col relative w-full py-14 bg-gradient-to-b from-transparent to-secondary from-[35%]"
        >
          <h2 className="text-[26vw] lg:text-[10rem] text-center text-primary-yellow font-imbue">
            KERJA SAMA
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center w-full lg:h-32 h-24 my-8">
              <p className="font-semibold text-primary-yellow animate-blink">
                MEMUAT...
              </p>
            </div>
          ) : (
            <>
              <Marquee direction="left" autoFill={true}>
                {partners
                  .sort((a, b) => a.id - b.id)
                  .map((partner) => (
                    <PartnerCard
                      key={partner.nama}
                      logoSrc={partner.src}
                      width={partner.width}
                      height={partner.height}
                      logoClassName={partner.className}
                    />
                  ))}
              </Marquee>
              <Marquee direction="right" autoFill={true} className="-mt-7">
                {partners
                  .sort((a, b) => b.id - a.id)
                  .map((partner) => (
                    <PartnerCard
                      key={partner.nama}
                      logoSrc={partner.src}
                      width={partner.width}
                      height={partner.height}
                      logoClassName={partner.className}
                    />
                  ))}
              </Marquee>
            </>
          )}
        </div>
        <div id="kontak" className="footer">
          {(isDesktop || isTablet) && <FooterDekstop />}
          {isMobile && <FooterMobile />}
        </div>
      </div> */}
    </div>
  );
};

export default Home;
