import { FC, LegacyRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { kompetisi } from "@/data/kompetisi";
import { CompetitionCard } from "../cards/competitionCard";
import { CustomCSSProperties } from "@/types/customCSSProps";

interface CompetitionSwiperProps {
  swiperRef: LegacyRef<SwiperRef> | null;
  setActiveIndex: (index: number) => void;
}

export const CompetitionSwiper: FC<CompetitionSwiperProps> = ({swiperRef, setActiveIndex}) => {  
  const swiperStyleKompetisi: CustomCSSProperties = {
    "--swiper-pagination-color": "rgba(253, 208, 38, 1)",
    "--swiper-pagination-bullet-inactive-color": "rgba(253, 208, 38, 0.6)",
    "--swiper-pagination-bullet-size": "0.5rem",
    "--swiper-pagination-bottom": "-2rem",
    "--swiper-navigation-sides-offset": "-2rem",    
  };

  return (
    <>
      <Swiper
        ref={swiperRef}       
        effect={"cards"}
        grabCursor={true}
        pagination={{
          dynamicBullets: true,
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        modules={[EffectCards, Pagination]}
        className="mySwiper w-[80%] h-[25rem] lg:h-[28rem]"
        style={swiperStyleKompetisi}
      >
        {kompetisi.map((item) => (
          <SwiperSlide
            key={item.id}
            className={`border-2 border-primary-yellow/80 shadow-lg shadow-secondary-yellow/60`}
          >
            <CompetitionCard
              linkPendaftaran={item.linkPendaftaran}
              namaLomba={item.namaLomba}
              fotoDepan={item.fotoDepan}
              kepanjangan={item.kepanjangan}
              jadwalPendaftaran={item.jadwalPendaftaran}
              jadwalPelaksanaan={item.jadwalPelaksanaan}
              totalHadiah={item.totalHadiah}
              bukuPanduan={item.bukuPanduan}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
